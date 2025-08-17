import { Model, Document } from 'mongoose';

export abstract class QueryService<T extends Document> {
  protected constructor(protected readonly model: Model<T>) {}

  async PaginationPattern(page: number = 1, limit: number = 10, populateKey?: string, filter: any = {}): Promise<T[]> {
    const skip = (page - 1) * limit;
    return this.model
      .find(filter)
      .populate(populateKey as string)
      .skip(skip)
      .limit(limit)
      .exec();
  }
}