import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class DishIngredientDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  quantity: number;

  @IsString()
  unit: string;
}

export class CreateDishDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  servings?: number;

  @IsNumber()
  authorId: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DishIngredientDto)
  ingredients: DishIngredientDto[];
}
