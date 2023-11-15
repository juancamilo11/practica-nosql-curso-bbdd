import { Product } from '../../../model/product.entity';

export interface PageRequest {
  skip: number;
  limit: number;
}

export interface ProductsRepositoryGateway {
  countByCriteria(filter: { [key: string]: any }): Promise<number>;
  findAllByCriteria(
    filter: {
      [key: string]: any;
    },
    pagination?: PageRequest,
  ): Promise<Product[]>;
  deleteById(id: string): Promise<Product | null>;
  findById(id: string): Promise<Product | null>;
  save(product: Product): Promise<Product>;
  findAll(pagination?: PageRequest): Promise<Product[]>;
  update(product: Product): Promise<Product | null>;
}

export const ProductsRepositoryGateway = Symbol('ProductsRepositoryGateway');
