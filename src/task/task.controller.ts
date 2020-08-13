// task.controller

import { TaskRepository } from './task.repository';
import { ITask } from './task.interface';
import { InvalidParentTask } from './task.error';

export class TaskController {
  private static readonly taskRepository = new TaskRepository();

  /**
   * Create a task
   * @param taskProperties - Task properties
   */
  static async createTask(taskProperties: ITask) {

    // If it sub task
    if (taskProperties.parent) {

      // Find the parent task
      const parentTask = await this.taskRepository.getById(taskProperties.parent) as ITask;

      if (parentTask) {
        // Attach the ancestors from the parent task to the ancestors of the sub task
        taskProperties.ancestors = [parentTask._id, ...parentTask.ancestors];

        // Create the task
        return await this.taskRepository.create(taskProperties);
      }

    }

    // If the task parent value is invalid, throw an error
    throw new InvalidParentTask();

  }

  /**
   * Get task by ObjectID
   * @param taskId - ObjectID of the task requested.
   */
  static async getTaskById(taskId: string) {
    return await this.taskRepository.getById(taskId);
  }

  /**
   * Get tasks by their parent id.
   * @param parentId - Parent Task id
   */
  static async getTasksByParentId(parentId: string) {
    return await this.taskRepository.getByParentId(parentId);
  }

  /**
   * Delete task by ObjectID
   * @param taskId - ObjectID of the task requested.
   */
  static async deleteTaskById(taskId: string) {
    return await this.taskRepository.deleteById(taskId);
  }
}
