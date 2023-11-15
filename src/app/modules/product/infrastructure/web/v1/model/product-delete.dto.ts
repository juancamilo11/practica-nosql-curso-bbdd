import * as Validate from 'class-validator';
import { Product } from '../../../../domain/model/product.entity';

export default class ProductDeleteDto {
  @Validate.IsUUID()
  @Validate.IsNotEmpty()
  id: string;

  public static toEntity(dto: ProductDeleteDto): Partial<Product> {
    return {
      id: dto.id,
    };
  }
}
