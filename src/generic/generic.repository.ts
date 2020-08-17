// generic.repository

import { Model } from 'mongoose';
import { IBaseModel } from './generic.interface';

export abstract class GenericRepository<T extends Model<IBaseModel>> {

  protected readonly model: T;
  protected static defaultIdFieldName = '_id';

  constructor(model: T) {
    this.model = model;
  }

  /**
   * Get document model by id.
   * @param id - Id of the model object requested.
   * @param idFieldName - Name of the id field, defaults to '_id'.
   */
  public getById(id: string,
                 idFieldName: string = GenericRepository.defaultIdFieldName) {
    return this.model.findOne({ [idFieldName]: id });
  }

  /**
   * Get all documents model.
   */
  public getAll() {
    return this.model.find();
  }

  /**
   * Create a document model by his properties.
   * @param modelProperties - Properties of the model.
   */
  public create(modelProperties: any) {
    return this.model.create(modelProperties);
  }

  /**
   * Delete document model by id.
   * @param id - Id of the model object requested.
   * @param idFieldName - Name of the id field, defaults to '_id'.
   */
  public deleteById(id: string,
                    idFieldName: string = GenericRepository.defaultIdFieldName) {
    return this.model.deleteOne({ [idFieldName]: id });
  }

}
