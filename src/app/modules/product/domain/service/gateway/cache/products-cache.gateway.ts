import { Product } from '../../../model/product.entity';

export interface ProductsCacheGateway {
  setElements(setName: string): Promise<string[]>;
  deleteOne(key: string): Promise<number>;
  count(pattern: string): Promise<number>;
  deleteMany(pattern: string): Promise<number>;
  removeItemFromSet(setName: string, value: string): Promise<number>;
  countItemsInSet(setName: string): Promise<number>;
  addItemToSet(setName: string, value: string): Promise<number>;
  delete(key: string): Promise<boolean>;
  getMany(pattern: string): Promise<Product[]>;
  getOne(key: string): Promise<Product | null>;
  set(key: string, productDB: Product, ex?: number): Promise<Product | null>;
}

export const ProductsCacheGateway = Symbol('ProductsCacheGateway');
