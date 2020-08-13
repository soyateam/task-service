// task.interface

import { IBaseModel } from '../generic/generic.interface';

export enum TaskType {
  BuildForce = 'BuildForce',
  OperativeForce = 'OperativeForce',
}

export interface ITask extends IBaseModel {
  parent: string | null; // Parent task id or null (if it the root parent)
  type: TaskType; // The type of the task
  name: string; // Name of the task
  description: string; // Description of the task
  orgIds: string[]; // Organization ids (in Kartoffel format) attached to task
  ancestors: string[]; // Ancestors of the tasks (the parent tasks above this task level)

  // TODO: Add ancestors
}

export const collectionName = 'Task';
