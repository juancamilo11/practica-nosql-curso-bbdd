import { MongoDBConfig } from './../../../../config/database/mongo.connection';
import { Injectable } from '@nestjs/common';
import { Product } from '../../domain/model/product.entity';
import { ProductsRepositoryGateway } from '../../domain/service/gateway/database/products-repository.gateway';
import { Model } from 'mongoose';
import productSchema, { ProductData } from './model/product-db.model';

export interface PageRequest {
  skip: number;
  limit: number;
}

@Injectable()
export class ProductsRepositoryAdapter implements ProductsRepositoryGateway {
  private _productsModel: Model<ProductData>;

  public constructor(private mongoDBConfig: MongoDBConfig) {
    this.createCollection();
  }
  private createCollection() {
    this._productsModel = this.mongoDBConfig.client.model<ProductData>(
      'product',
      productSchema,
    );
  }

  public countByCriteria(filter: { [key: string]: any }): Promise<number> {
    return this._productsModel.count(filter);
  }

  public async findAllByCriteria(
    filter: { [key: string]: any },
    pagination?: PageRequest | undefined,
  ): Promise<Product[]> {
    if (!pagination) {
      const records = await this._productsModel.find({ ...filter }).exec();
      return records;
    }
    const { skip, limit } = pagination;
    return this._productsModel
      .find({ ...filter })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  public async save(product: Product): Promise<Product> {
    console.log({ product });
    const productToSave = new this._productsModel({
      ...product,
    });
    const saved = await productToSave.save();

    product.id = saved._id.toString();
    product.createdAt = saved.createdAt;
    product.updatedAt = saved.updatedAt;

    return product;
  }

  public async update(product: Product): Promise<Product | null> {
    const productToUpdate = new this._productsModel({
      _id: product.id,
      ...product,
    });
    const updated = await this._productsModel
      .findByIdAndUpdate(product.id, productToUpdate, { new: true })
      .lean();
    if (!updated) {
      return null;
    }
    updated.id = updated._id.toString();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...rest } = updated;
    return rest;
  }

  public async findById(id: string): Promise<Product | null> {
    const result = await this._productsModel.findById(id).lean();
    if (!result) {
      return null;
    }
    result.id = result._id.toString();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...rest } = result;
    return rest;
  }

  public findAll(pagination?: PageRequest): Promise<Product[]> {
    if (!pagination) {
      return this._productsModel.find();
    }
    return this._productsModel
      .find()
      .skip(pagination.skip)
      .limit(pagination.limit)
      .lean();
  }

  public async deleteById(id: string): Promise<Product | null> {
    const result = await this._productsModel.findByIdAndDelete(id).lean();

    if (!result) {
      return null;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...rest } = result;
    return rest;
  }
}
