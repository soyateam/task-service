// task.repository.ts

import { Types } from 'mongoose';

import { TaskType, ITask } from './task.interface';
import TaskUtils from './task.utils';
import taskModel from './task.model';
import config from '../config';

export class TaskRepository {

  private static populationFields = 'subTasksCount';

  /**
   * Get task by id.
   * @param taskId - The id of the task
   */
  public static getById(taskId: string, dateFilter: string = config.CURRENT_DATE_VALUE) {
    return taskModel.findOne({ _id: taskId, date: dateFilter })
                    .populate({
                      path: TaskRepository.populationFields,
                      match: { date: dateFilter },
                    })
                    .exec();
  }

  /**
   * Get all tasks.
   */
  public static getAll(dateFilter: string = config.CURRENT_DATE_VALUE): any {
    return taskModel.find({ date: dateFilter })
                    .populate({
                      path: TaskRepository.populationFields,
                      match: { date: dateFilter },
                    })
                    .exec();
  }

  /**
   * Create a document model by his properties.
   * @param modelProperties - Properties of the model.
   */
  public static create(modelProperties: any) {
    const dateFilter = config.CURRENT_DATE_VALUE;
    return taskModel.create({ ...modelProperties, date: dateFilter });
  }

  /**
   * Delete task by id.
   * @param taskId - The id of the task
   */
  public static deleteById(taskId: string): any {
    return taskModel.findByIdAndDelete({ _id: taskId });
  }

  /** Task Repository Self Implemented Methods **/

  /**
   * Get tasks by parent task id.
   * @param parentId - ObjectID of the parent task.
   */
  public static getByParentId(parentId: string, dateFilter: string = config.CURRENT_DATE_VALUE) {
    return taskModel.find({ parent: parentId === 'null' ? null : parentId, date: dateFilter })
                    .populate({
                      path: 'subTasksCount',
                      match: { date: dateFilter },
                    })
                    .exec();
  }

  /**
   * Update task by given properites.
   * @param taskProperties - Task properites to update
   */
  public static update(taskProperties: Partial<ITask>) {

    // For now only updates the groups/name/description values
    const sanitizedProperties = {
      ...(taskProperties.groups ? { groups: taskProperties.groups } : {}),
      ...(taskProperties.name ? { name: taskProperties.name } : {}),
      ...(taskProperties.description ? { description: taskProperties.description } : {}),
    };

    return taskModel.findOneAndUpdate(
      { _id: taskProperties._id, date: config.CURRENT_DATE_VALUE },
      { $set: sanitizedProperties },
      { new: true },
    ).populate({
      path: TaskRepository.populationFields,
      match: { date: config.CURRENT_DATE_VALUE },
    }).exec();
  }

  /**
   * Get root parents by task type
   * @param type - Task type.
   */
  public static getRootsByType(type: TaskType, dateFilter: string = config.CURRENT_DATE_VALUE) {
    return taskModel.find({ type, parent: null, date: dateFilter })
                    .populate({
                      path: TaskRepository.populationFields,
                      match: { date: dateFilter },
                    }).exec();
  }

  /**
   * Get all children for a given task by id (direct and indirect children)
   * @param taskId - The id of the task parent.
   */
  public static async getChildren(
    taskId: string, depthLevel?: number, dateFilter: string = config.CURRENT_DATE_VALUE,
  ) {

    if (depthLevel) {
      const taskWithChildren = await taskModel.aggregate([
        {
          $match: {
            _id: new Types.ObjectId(taskId),
            date: dateFilter,
          },
        },
        {
          $graphLookup: {
            from: 'tasks',
            startWith: '$_id',
            connectFromField: '_id',
            connectToField: 'parent',
            as: 'children',
            maxDepth: depthLevel - 1,
            depthField: 'depth',
          },
        },
      ]);

      return TaskUtils.createTree(taskWithChildren[0]);
    }

    return (
      await taskModel.find({ ancestors: taskId, date: dateFilter })
                     .populate({
                       path: TaskRepository.populationFields,
                       match: { date: dateFilter },
                     }).exec()
    );
  }
}
