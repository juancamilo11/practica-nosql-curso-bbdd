import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidV4 } from 'uuid';
import { Product } from '../model/product.entity';
import { ProductsCacheGateway } from './gateway/cache/products-cache.gateway';
import { ProductsRepositoryGateway } from './gateway/database/products-repository.gateway';
import products from './products.service.data';

@Injectable()
export class ProductsService {
  private readonly logger: Logger = new Logger(ProductsService.name);

  public constructor(
    @Inject(ProductsCacheGateway)
    private productsCacheGateway: ProductsCacheGateway,
    @Inject(ProductsRepositoryGateway)
    private productsRepositoryGateway: ProductsRepositoryGateway,
  ) {}

  public saveProduct(product: Product): Promise<Product> {
    return this.productsRepositoryGateway
      .save(product)
      .then((productDB) => {
        console.log({ productDB });
        return this.productsCacheGateway.set(
          `product_${productDB.id}`,
          productDB,
        );
      })
      .then((savedProduct) => {
        if (!savedProduct) {
          throw new InternalServerErrorException(`Product couldn't be saved`);
        }
        return savedProduct;
      });
  }

  public seedCache(
    value: number,
  ): Promise<{ start: Date; end: Date; duration: number }> {
    const repeatedArray = Array.from(
      { length: Math.ceil(value / products.length) },
      () => [...products.map((product) => ({ ...product, id: uuidV4() }))],
    )
      .flat()
      .slice(0, value);
    const start = new Date();
    return Promise.all(
      repeatedArray.map((product) => {
        const uuid = uuidV4();
        return this.productsCacheGateway.set(`product_${uuid}`, {
          ...product,
          id: uuid,
        })!;
      }),
    ).then(() => {
      return {
        start,
        end: new Date(),
        duration: new Date().getTime() - start.getTime(),
      };
    });
  }

  public seed(
    value: number,
  ): Promise<{ start: Date; end: Date; duration: number }> {
    const repeatedArray = Array.from(
      { length: Math.ceil(value / products.length) },
      () => [...products],
    )
      .flat()
      .slice(0, value);
    const start = new Date();
    return Promise.all(
      repeatedArray.map((product) => this.saveProduct(product)),
    ).then(() => {
      return {
        start,
        end: new Date(),
        duration: new Date().getTime() - start.getTime(),
      };
    });
  }

  public getAllProducts(): Promise<{ duration: number; products: Product[] }> {
    const start = new Date();
    return this.productsCacheGateway
      .getMany(`product_*`)
      .then((productsCache: Product[]) => {
        const end = new Date();
        if (productsCache && productsCache.length > 0) {
          this.logger.log(`Found ${productsCache.length} products in cache.`);
          return {
            duration: end.getTime() - start.getTime(),
            products: productsCache,
          };
        }
        this.logger.log('Found 0 products in cache.');
        return {
          duration: end.getTime() - start.getTime(),
          products: [],
        };
      });
  }

  public getProductById(id: string): Promise<Product | null> {
    return this.productsCacheGateway
      .getOne(`product_${id}`)
      .then((productCache) => {
        if (!productCache) {
          return this.updateProductInCache(id);
        }
        return productCache;
      });
  }

  public deleteProductById(productId: string): Promise<void> {
    return this.getProductById(productId)
      .then((productCache) => {
        if (!productCache) {
          throw new NotFoundException(
            `Product with id ${productId} not exists`,
          );
        }
        return this.productsRepositoryGateway.deleteById(productId);
      })
      .then((productDB) => {
        if (!productDB) {
          throw new InternalServerErrorException(
            `Product with id ${productId} couldn't be deleted.`,
          );
        }
        return this.productsCacheGateway.delete(`product_${productDB.id}`);
      })
      .then((deletedProduct) => {
        if (!deletedProduct) {
          throw new InternalServerErrorException(`Product couldn't be deleted`);
        }
      });
  }

  private updateProductsInCache() {
    return this.productsRepositoryGateway.findAll().then((productsDB) => {
      this.logger.log(`Found ${productsDB.length} products in db.`);
      return this.setProducts(productsDB);
    });
  }

  private updateProductInCache(id: string) {
    return this.productsRepositoryGateway.findById(id).then((productDB) => {
      if (!productDB) {
        return null;
      }
      this.logger.log(`Found missing product in db.`);
      return this.setProduct(productDB);
    });
  }

  private setProducts(productsDB: Product[]) {
    return Promise.all(
      productsDB.map((productDB) =>
        this.productsCacheGateway.set(`product_${productDB.id}`, productDB),
      ),
    ).then((productsCache) => {
      const filteredSavedProducts: Product[] = productsCache.filter(
        (product) => {
          if (product === null) return false;
          return true;
        },
      ) as Product[];

      this.logger.log(`Saved ${productsCache.length} products in cache.`);
      return filteredSavedProducts;
    });
  }

  private setProduct(productDB: Product) {
    return this.productsCacheGateway
      .set(`product_${productDB.id}`, productDB)
      .then((productCache) => {
        if (!productCache) return null;
        this.logger.log(`Saved product in cache.`);
        return productCache;
      });
  }
}
