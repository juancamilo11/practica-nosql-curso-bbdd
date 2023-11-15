import { MongoDBConfig } from './../../config/database/mongo.connection';
import { ProductsRedisConfig } from './../../config/cache/products.connection';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ProductsCacheGateway } from './domain/service/gateway/cache/products-cache.gateway';
import { ProductsRepositoryGateway } from './domain/service/gateway/database/products-repository.gateway';
import { ProductsService } from './domain/service/products.service';
import { ProductsCacheAdapter } from './infrastructure/cache/products-cache.adapter';
import { ProductsRepositoryAdapter } from './infrastructure/database/product-repository.adapter';
import { ProductsController } from './infrastructure/web/v1/controller/products.controller';

@Module({
  controllers: [ProductsController],
  providers: [
    ProductsService,
    ProductsRedisConfig,
    MongoDBConfig,
    {
      provide: ProductsCacheGateway,
      useClass: ProductsCacheAdapter,
    },

    {
      provide: ProductsRepositoryGateway,
      useClass: ProductsRepositoryAdapter,
    },
  ],
  imports: [ConfigModule],
})
export class ProductsModule {}
