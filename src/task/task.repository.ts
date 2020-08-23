// task.repository.ts

import { TaskType, ITask } from './task.interface';
import taskModel from './task.model';

export class TaskRepository {

  private static populationFields = 'subTasksCount';

  /**
   * Get task by id.
   * @param taskId - The id of the task
   */
  public static getById(taskId: string) {
    return taskModel.findById(taskId).populate(TaskRepository.populationFields).exec();
  }

  /**
   * Get all tasks.
   */
  public static getAll(): any {
    return taskModel.find().populate(TaskRepository.populationFields).exec();
  }

  /**
   * Create a document model by his properties.
   * @param modelProperties - Properties of the model.
   */
  public static create(modelProperties: any) {
    return taskModel.create(modelProperties);
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
  public static getByParentId(parentId: string) {
    return taskModel.find({ parent: parentId === 'null' ? null : parentId }).populate('subTasksCount').exec();
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
      { _id: taskProperties._id },
      { $set: sanitizedProperties },
      { new: true },
    ).populate(TaskRepository.populationFields).exec();
  }

  /**
   * Get root parents by task type
   * @param type - Task type.
   */
  public static getRootsByType(type: TaskType) {
    return taskModel.find({ type, parent: null }).populate(TaskRepository.populationFields).exec();
  }

  /**
   * Get all children for a given task by id (direct and indirect children)
   * @param taskId - The id of the task parent.
   */
  public static getChildren(taskId: string) {
    return taskModel.find({ ancestors: taskId }).populate(TaskRepository.populationFields).exec();
  }
}
