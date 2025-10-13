import { CreateDishDto, DishIngredientDto } from './create-dish.dto';
import { PartialType } from '@nestjs/swagger';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export class UpdateDishDto extends PartialType(CreateDishDto) {
  ingredients?: DishIngredientDto[];
}
