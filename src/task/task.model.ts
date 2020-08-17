// task.model

import { Schema, model } from 'mongoose';
import { ITask, collectionName, TaskType } from './task.interface';
import { TaskValidator } from './task.validator';

const taskSchema = new Schema({
  parent: {
    type: String,
    default: null,
    validate: {
      isAsync: true,
      validator: TaskValidator.isParentValid,
      message: 'Parent {VALUE} does not exist',
    },
  },
  type: {
    type: String,
    required: true,
    enum: Object.keys(TaskType),
  },
  name: {
    type: String,
    required: true,
    unique: true,
    validate: [TaskValidator.isNameValid, 'Invalid task name given.'],
  },
  description: {
    type: String,
    validate: [TaskValidator.isDescriptionValid, 'Invalid task description given.'],
  },
  orgIds: {
    type: [String],
    required: true,
    default: [],
  },
  ancestors: {
    type: [String],
    default: [],
    validate: {
      isAsync: true,
      validator: TaskValidator.isAncestorsValid,
      message: 'Ancestors has incorrect reference',
    },
  },
});

taskSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

const taskModel = model<ITask>(collectionName, taskSchema);

export default taskModel;
