// task.routes

import { Router, Request, Response } from 'express';
import { InvalidParameter, NotFound } from '../utils/error';
import { Wrapper } from '../utils/wrapper';
import { TaskController } from './task.controller';
import config from '../config';
import { TaskValidator } from './task.validator';
import { TaskType } from './task.interface';

export class TaskRouter {

  private static router = Router();
  private static errorMessages = {
    MISSING_TASK_ID: 'Task id is missing.',
    MISSING_PARENT_ID: 'Parent id of the tasks is missing',
    TASK_NOT_FOUND: 'Task not found',
    TASKS_NOT_FOUND: 'Tasks not found',
    INVALID_TASK_TYPE: 'Invalid task type given (missing or incorrect)',
    INVALID_TASK_PROPERTIES: 'Invalid task properties given',
  };

  public static getRouter() {

    TaskRouter.router.get(
      `/${config.TASK_PARENT_ENDPOINT}/:parentId`,
      Wrapper.wrapAsync(TaskRouter.getTasksByParentId),
    );

    TaskRouter.router.get(
      '/:taskId',
      Wrapper.wrapAsync(TaskRouter.getTaskById),
    );

    TaskRouter.router.get(
      '/',
      Wrapper.wrapAsync(TaskRouter.getParentTasksByType),
    );

    TaskRouter.router.put(
      '/',
      Wrapper.wrapAsync(TaskRouter.updateTask),
    );

    TaskRouter.router.post(
      '/',
      Wrapper.wrapAsync(TaskRouter.createTask),
    );

    TaskRouter.router.delete(
      '/:taskId',
      Wrapper.wrapAsync(TaskRouter.deleteTaskById),
    );

    return TaskRouter.router;
  }

  /**
   * Get a task by id.
   * @param req - Express Request Object.
   * @param res - Express Response Object.
   */
  private static async getTaskById(req: Request, res: Response) {
    const taskId = req.params.taskId;

    // If the request contains the id of the task
    if (taskId) {
      const task = await TaskController.getTaskById(taskId);

      // If task found, return it
      if (task) {
        return res.status(200).send(task);
      }

      throw new NotFound(TaskRouter.errorMessages.TASK_NOT_FOUND);
    }

    throw new InvalidParameter(TaskRouter.errorMessages.MISSING_TASK_ID);
  }

  /**
   * Get root parent tasks of a type.
   * @param req - Express Request Object.
   * @param res - Express Response Object.
   */
  private static async getParentTasksByType(req: Request, res: Response) {
    const type = req.query.type as string;

    // If the type given is valid
    if (type && TaskValidator.isTypeValid(type)) {

      const tasks = await TaskController.getParentTasksByType(type as TaskType);

      // If tasks found
      if (tasks && tasks.length > 0) {
        return res.status(200).send(tasks);
      }

      // Tasks not found error
      throw new NotFound(TaskRouter.errorMessages.TASKS_NOT_FOUND);
    }

    // Invalid task type given, throw error
    throw new InvalidParameter(TaskRouter.errorMessages.INVALID_TASK_TYPE);
  }

  /**
   * Get tasks by parernt task id.
   * @param req - Express Request Object.
   * @param res - Express Response Object.
   */
  private static async getTasksByParentId(req: Request, res: Response) {
    const parentId = req.params.parentId;

    // If the request contains the parent id of the tasks
    if (parentId) {
      const tasks = await TaskController.getTasksByParentId(parentId);

      // If tasks found, return them
      if (tasks && tasks.length > 0) {
        return res.status(200).send({ tasks });
      }

      throw new NotFound(TaskRouter.errorMessages.TASKS_NOT_FOUND);
    }

    throw new InvalidParameter(TaskRouter.errorMessages.MISSING_PARENT_ID);
  }

  /**
   * Create a task.
   * @param req - Express Request Object.
   * @param res - Express Response Object.
   */
  private static async createTask(req: Request, res: Response) {
    const taskProperties = req.body.task;

    // If the request contains the task properties
    if (TaskValidator.isValid(taskProperties)) {

      // Create the task
      const createdTask = await TaskController.createTask(taskProperties);

      // If task created successfully
      if (createdTask) {
        return res.status(200).send(createdTask);
      }

    }

    throw new InvalidParameter(TaskRouter.errorMessages.INVALID_TASK_PROPERTIES);
  }

  /**
   * Update a task.
   * @param req - Express Request Object.
   * @param res - Express Response Object.
   */
  private static async updateTask(req: Request, res: Response) {
    const taskProperties = req.body.task;

    // If task properties to update is given
    if (taskProperties) {

      // Update the task with the given properites
      const updatedTask = await TaskController.updateTask(taskProperties);

      // If task is exists and updated
      if (updatedTask) {
        return res.status(200).send(updatedTask);
      }

      // Task for update was not found
      throw new NotFound(TaskRouter.errorMessages.TASK_NOT_FOUND);
    }

    // Bad task properites given
    throw new InvalidParameter(TaskRouter.errorMessages.INVALID_TASK_PROPERTIES);
  }

  /**
   * Delete a task.
   * @param req - Express Request Object.
   * @param res - Express Response Object.
   */
  private static async deleteTaskById(req: Request, res: Response) {
    const taskId = req.params.taskId;

    // If the request contains the id of the task
    if (taskId) {
      const task = await TaskController.deleteTaskById(taskId);

      // If task deleted successfully
      if (task) {
        return res.status(200).send(task);
      }

      throw new NotFound(TaskRouter.errorMessages.TASK_NOT_FOUND);
    }

    throw new InvalidParameter(TaskRouter.errorMessages.MISSING_TASK_ID);
  }

}
const taskRouter = Router();

export default taskRouter;
