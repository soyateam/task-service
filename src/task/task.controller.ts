// task.controller

import { TaskRepository } from './task.repository';
import { ITask, TaskType } from './task.interface';
import { InvalidParentTask } from './task.error';

export class TaskController {
  /**
   * Create a task
   * @param taskProperties - Task properties
   */
  static async createTask(taskProperties: ITask) {
    // If it sub task
    if (taskProperties.parent) {
      // Find the parent task
      const parentTask = (await TaskRepository.getById(taskProperties.parent)) as ITask;

      if (parentTask) {
        // Attach the ancestors from the parent task to the ancestors of the sub task
        taskProperties.ancestors = [parentTask._id, ...parentTask.ancestors];

        // Force type of the task to be as the parent's type
        taskProperties.type = parentTask.type;

        // Create the task
        return await TaskRepository.create(taskProperties);
      }

      // If the task parent value is invalid, throw an error
      throw new InvalidParentTask();
    }

    // Root task case
    return await TaskRepository.create(taskProperties);
  }

  /**
   * Update a task by given properites.
   * @param taskProperties - Task properites to update
   */
  static async updateTask(taskProperties: Partial<ITask>) {
    return await TaskRepository.update(taskProperties);
  }

  /**
   * Get root parent tasks by task type
   * @param type - Task type.
   */
  static async getRootTasksByType(type: TaskType) {
    return await TaskRepository.getRootsByType(type);
  }

  /**
   * Get task by ObjectID
   * @param taskId - ObjectID of the task requested.
   */
  static async getTaskById(taskId: string) {
    return await TaskRepository.getById(taskId);
  }

  /**
   * Get tasks by their parent id.
   * @param parentId - Parent Task id
   */
  static async getTasksByParentId(parentId: string) {
    return await TaskRepository.getByParentId(parentId);
  }

  /**
   * Get task direct and indirect children
   * @param taskId - Parent Task id
   */
  static async getTaskChildren(taskId: string) {
    return await TaskRepository.getChildren(taskId);
  }

  /**
   * Delete task by ObjectID
   * @param taskId - ObjectID of the task requested.
   */
  static async deleteTaskById(taskId: string) {
    return await TaskRepository.deleteById(taskId);
  }
}
