import { ApiProperty } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

export class ProductResponseDto extends CreateProductDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;
}
