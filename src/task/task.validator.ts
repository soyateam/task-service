// task.validator

import { ITask } from './task.interface';
import { InvalidTaskName, InvalidTaskDescription } from './task.error';
import taskModel from './task.model';

export class TaskValidator {

  static isValid(task: ITask) {
    return (
      task &&
      task.name &&
      task.description &&
      task.parent
    );
  }

  static isNameValid(name: string): boolean {
    if (typeof name === 'string') {
      return true;
    }

    throw new InvalidTaskName();
  }

  static isDescriptionValid(description: string): boolean {
    if (typeof description === 'string') {
      return true;
    }

    throw new InvalidTaskDescription();
  }

  static async isParentValid(parent: string) {
    const parentFromDB = await taskModel.findOne({ _id: parent }).lean();

    return !!parentFromDB;
  }

  static async isAncestorsValid(ancestors: [string]) {
    const ancestorsFromDB = await taskModel.find({ _id: { $in: ancestors } }).lean();

    return ancestorsFromDB.length === ancestors.length;
  }
}
