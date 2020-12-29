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
      `/${config.TASK_DATES_ENDPOINT}`,
      Wrapper.wrapAsync(TaskRouter.getDateFilters)
    );

    TaskRouter.router.get(
      `/${config.TASK_PARENT_ENDPOINT}/:parentId`,
      Wrapper.wrapAsync(TaskRouter.getTasksByParentId),
    );

    TaskRouter.router.get(
      `/${config.TASK_TYPE_ENDPOINT}/:type`,
      Wrapper.wrapAsync(TaskRouter.getRootTasksByType),
    );

    TaskRouter.router.get(
      `/:taskId/${config.TASK_CHILDREN_ENDPOINT}/depth/:depthLevel`,
      Wrapper.wrapAsync(TaskRouter.getTasksChildrenByDepthLevel),
    );

    TaskRouter.router.get(
      `/:taskId/${config.TASK_CHILDREN_ENDPOINT}`,
      Wrapper.wrapAsync(TaskRouter.getTaskChildren),
    );

    TaskRouter.router.get('/:taskId', Wrapper.wrapAsync(TaskRouter.getTaskById));

    TaskRouter.router.put('/', Wrapper.wrapAsync(TaskRouter.updateTask));

    TaskRouter.router.post('/', Wrapper.wrapAsync(TaskRouter.createTask));

    TaskRouter.router.delete('/:taskId', Wrapper.wrapAsync(TaskRouter.deleteTaskById));

    return TaskRouter.router;
  }

  /**
   * Get date filters for the whole tasks available.
   * @param req - Express Request Object.
   * @param res - Express Response Object.
   */
  private static async getDateFilters(req: Request, res: Response) {
    return res.status(200).send(await TaskController.getDateFilters());
  }

  /**
   * Get a task by id.
   * @param req - Express Request Object.
   * @param res - Express Response Object.
   */
  private static async getTaskById(req: Request, res: Response) {
    const taskId = req.params.taskId;
    const dateFilter = req.query.date as string;

    // If the request contains the id of the task
    if (taskId) {
      const task = await TaskController.getTaskById(taskId, dateFilter);
      return res.status(200).send(task);
    }

    throw new InvalidParameter(TaskRouter.errorMessages.MISSING_TASK_ID);
  }

  /**
   * Get root parent tasks of a type.
   * @param req - Express Request Object.
   * @param res - Express Response Object.
   */
  private static async getRootTasksByType(req: Request, res: Response) {
    const type = req.params.type as string;
    const dateFilter = req.query.date as string;

    // If the type given is valid
    if (type && TaskValidator.isTypeValid(type)) {
      const tasks = await TaskController.getRootTasksByType(type as TaskType, dateFilter);
      return res.status(200).send(tasks);
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
    const dateFilter = req.query.date as string;

    // If the request contains the parent id of the tasks
    if (parentId) {
      const tasks = await TaskController.getTasksByParentId(parentId, dateFilter);
      return res.status(200).send({ tasks });
    }

    throw new InvalidParameter(TaskRouter.errorMessages.MISSING_PARENT_ID);
  }

  /**
   * Get direct and indirect children of a given task.
   * @param req - Express Request Object.
   * @param res - Express Response Object.
   */
  private static async getTaskChildren(req: Request, res: Response) {
    const taskId = req.params.taskId;
    const dateFilter = req.query.date as string;

    // If the request contains the task id
    if (taskId) {
      const childrenTasks = await TaskController.getTaskChildren(taskId, undefined, dateFilter);
      return res.status(200).send(childrenTasks);
    }

    // Task id is not given
    throw new InvalidParameter(TaskRouter.errorMessages.MISSING_TASK_ID);
  }

  /**
   * Get direct and indirect children of a given task, by depth level given.
   * @param req - Express Request Object.
   * @param res - Express Response Object.
   */
  private static async getTasksChildrenByDepthLevel(req: Request, res: Response) {
    const taskId = req.params.taskId;
    const depthLevel = parseInt(req.params.depthLevel, 10);
    const dateFilter = req.query.date as string;

    // If the request contains the task id
    if (taskId) {

      // If depth level passed, return children by depth level given.
      // Otherwise, return all task children.
      const childrenTasks = await TaskController.getTaskChildren(
        taskId,
        depthLevel !== NaN || depthLevel <= 0 ? depthLevel : undefined,
        dateFilter,
      );

      return res.status(200).send(childrenTasks);
    }

    // Task id is not given
    throw new InvalidParameter(TaskRouter.errorMessages.MISSING_TASK_ID);
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
      return res.status(200).send(createdTask);
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
      return res.status(200).send(updatedTask);
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
      return res.status(200).send(task);
    }

    throw new InvalidParameter(TaskRouter.errorMessages.MISSING_TASK_ID);
  }
}
const taskRouter = Router();

export default taskRouter;
