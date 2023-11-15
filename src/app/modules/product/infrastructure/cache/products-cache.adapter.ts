import { Injectable } from '@nestjs/common';
import { ProductsRedisConfig } from '../../../../config/cache';
import { ProductsCacheGateway } from '../../domain/service/gateway/cache/products-cache.gateway';
import { ProductCache } from './model/product-cache.model';

@Injectable()
export class ProductsCacheAdapter implements ProductsCacheGateway {
  public constructor(private productsRedisConfig: ProductsRedisConfig) {}

  public setElements(setName: string): Promise<string[]> {
    return this.productsRedisConfig.client.sMembers(setName);
  }

  public countItemsInSet(setName: string): Promise<number> {
    return this.productsRedisConfig.client
      .sMembers(setName)
      .then((members) => members.length);
  }

  public deleteOne(key: string): Promise<number> {
    return this.productsRedisConfig.client.del(key);
  }

  public count(pattern: string): Promise<number> {
    return this.productsRedisConfig.client
      .keys(pattern)
      .then((keys) => keys.length);
  }

  public deleteMany(pattern: string): Promise<number> {
    return this.productsRedisConfig.client
      .keys(pattern)
      .then((keys) =>
        Promise.all(
          keys.map((key) => this.productsRedisConfig.client.del(key)),
        ),
      )
      .then((results) => results.length);
  }

  private keys(pattern: string): Promise<string[]> {
    return this.productsRedisConfig.client.keys(pattern);
  }

  public getMany(pattern: string): Promise<ProductCache[]> {
    return this.keys(pattern).then((keys) =>
      Promise.all(keys.map((key) => this.getOne(key))).then((products) => {
        const filtered = products.filter(
          (product) => product !== null,
        ) as ProductCache[];
        return filtered;
      }),
    );
  }

  public getOne(key: string): Promise<ProductCache | null> {
    return this.productsRedisConfig.client.get(key).then((value) => {
      if (!value) return null;
      return JSON.parse(value) as ProductCache;
    });
  }

  public set(
    key: string,
    value: ProductCache,
    ex?: number,
  ): Promise<ProductCache | null> {
    return this.productsRedisConfig.client
      .set(key, JSON.stringify(value), { EX: ex })
      .then((result) => {
        if (result) return value;
        return null;
      });
  }

  public delete(key: string): Promise<boolean> {
    return this.productsRedisConfig.client
      .del(key) // Returns the number of deleted record
      .then((result) => result !== 0);
  }

  public addItemToSet(setName: string, value: string): Promise<number> {
    return this.productsRedisConfig.client.sAdd(setName, value);
  }

  public removeItemFromSet(setName: string, value: string): Promise<number> {
    return this.productsRedisConfig.client.sRem(setName, value);
  }
}
