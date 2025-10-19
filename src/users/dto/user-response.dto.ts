import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { Role } from '@prisma/client';
import { DishResponseDto } from 'src/dishes/dto/dish-response.dto';

export class UserResponseDto extends CreateUserDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  role: Role;

  @ApiProperty({ type: () => [DishResponseDto], isArray: true })
  dishes: DishResponseDto[];
}
