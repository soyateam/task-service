// task.repository.ts

import { GenericRepository } from '../generic/generic.repository';
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
    return this.model.find({ parent: parentId });
  }

}
