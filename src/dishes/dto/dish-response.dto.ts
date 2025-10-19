import { ApiProperty } from '@nestjs/swagger';
import { CreateDishDto } from './create-dish.dto';

export class DishResponseDto extends CreateDishDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;
}
