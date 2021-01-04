// task.interface

import { IBaseModel } from '../generic/generic.interface';

export enum TaskType {
  BuildForce = 'BuildForce',
  OperativeForce = 'OperativeForce',
}

export interface IGroup {
  id: string; // Group id (in Kartoffel format) attached to task
  name: string; // Group name
}

export interface ITask extends IBaseModel {
  parent: string | null; // Parent task id or null (if it the root parent)
  type: TaskType; // The type of the task
  name: string; // Name of the task
  description: string; // Description of the task
  groups: IGroup[]; // Groups attached to task
  ancestors: string[]; // Ancestors of the tasks (the parent tasks above this task level)
  sum: number; // Sum of the task groups (When the task is past task - The field in current task collection is considered not sync)
}

export const collectionName = 'Task';
