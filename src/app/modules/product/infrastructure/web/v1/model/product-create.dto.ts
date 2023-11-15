import * as Validate from 'class-validator';
import { Product } from '../../../../domain/model/product.entity';

export default class ProductCreateDto {
  @Validate.IsString()
  @Validate.IsNotEmpty()
  name: string;

  @Validate.IsString()
  @Validate.IsNotEmpty()
  description: string;

  @Validate.IsNumber()
  @Validate.Min(0)
  @Validate.IsPositive()
  price: number;

  @Validate.IsString()
  @Validate.IsNotEmpty()
  category: string;

  tags: string[];

  public static toEntity(dto: ProductCreateDto): Product {
    return {
      name: dto.name,
      description: dto.description,
      price: dto.price,
      category: dto.category,
      tags: dto.tags,
    };
  }
}
