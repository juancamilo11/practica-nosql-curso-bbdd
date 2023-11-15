import * as Http from '@nestjs/common';

import { Product } from '../../../../domain/model/product.entity';
import { ProductsService } from '../../../../domain/service/products.service';
import ProductDeleteDto from '../model/product-delete.dto';

const path = 'products';

@Http.Controller(path)
export class ProductsController {
  public constructor(private readonly productsService: ProductsService) {}

  @Http.Get()
  @Http.HttpCode(Http.HttpStatus.OK)
  public getAllProducts(): Promise<{ duration: number; products: Product[] }> {
    return this.productsService.getAllProducts();
  }

  @Http.Post('seed')
  @Http.HttpCode(Http.HttpStatus.OK)
  public seedProducts(@Http.Query('value') value: number) {
    return this.productsService.seed(value);
  }

  @Http.Post('seed-cache')
  @Http.HttpCode(Http.HttpStatus.OK)
  public seedCacheProducts(@Http.Query('value') value: number) {
    return this.productsService.seedCache(value);
  }

  @Http.Get(':id')
  @Http.HttpCode(Http.HttpStatus.OK)
  public getProductById(@Http.Param('id') id: string): Promise<Product | null> {
    return this.productsService.getProductById(id);
  }

  @Http.Delete(':id')
  @Http.HttpCode(Http.HttpStatus.NO_CONTENT)
  public deleteProduct(
    @Http.Param() productDeleteDto: ProductDeleteDto,
  ): Promise<void> {
    return this.productsService.deleteProductById(productDeleteDto.id);
  }
}
