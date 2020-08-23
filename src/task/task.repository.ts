// task.repository.ts

import { GenericRepository } from '../generic/generic.repository';
import { TaskType, ITask } from './task.interface';
import taskModel from './task.model';

export class TaskRepository extends GenericRepository<typeof taskModel> {

  constructor() {
    super(taskModel);
  }

  /**
   * Get tasks by parent task id.
   * @param parentId - ObjectID of the parent task.
   */
  public getByParentId(parentId: string) {
    return this.model.find({ parent: parentId === 'null' ? null : parentId }).populate('subTasksCount').exec();
  }

  /**
   * Update task by given properites.
   * @param taskProperties - Task properites to update
   */
  public update(taskProperties: Partial<ITask>) {

    // For now only updates the groups/name/description values
    const sanitizedProperties = {
      ...(taskProperties.groups ? { groups: taskProperties.groups } : {}),
      ...(taskProperties.name ? { name: taskProperties.name } : {}),
      ...(taskProperties.description ? { description: taskProperties.description } : {}),
    };

    return this.model.findOneAndUpdate(
      { _id: taskProperties._id },
      { $set: sanitizedProperties },
      { new: true },
    ).populate('subTasksCount').exec();
  }

  /**
   * Get root parents by task type
   * @param type - Task type.
   */
  public getParentsByType(type: TaskType) {
    return this.model.find({ type, parent: null }).populate('subTasksCount').exec();
  }

  /**
   * Get all children for a given task by id (direct and indirect children)
   * @param taskId - The id of the task parent.
   */
  public getChildren(taskId: string) {
    return this.model.find({ ancestors: taskId }).populate('subTasksCount').exec();
  }
}
