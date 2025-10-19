import { CreateDishDto, DishIngredientDto } from './create-dish.dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class UpdateDishDto extends PartialType(CreateDishDto) {
  @ApiProperty({ required: false })
  ingredients?: DishIngredientDto[];
}
