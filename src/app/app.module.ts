import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { environment } from '../env/env';
import { JoiValidationSchema } from '../env/joi.config';
import { ProductsModule } from './modules/product/product.module';

@Module({
  providers: [],
  exports: [],
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      load: [environment],
      validationSchema: JoiValidationSchema,
    }),
    ProductsModule,
  ],
})
export class AppModule {}
