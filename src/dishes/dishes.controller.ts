import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { DishesService } from './dishes.service';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { type Request as RequestType } from 'express';

@Controller('dishes')
export class DishesController {
  constructor(private readonly dishesService: DishesService) {}

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.dishesService.findOne(id);
  }

  @Get()
  findAll() {
    return this.dishesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createDishDto: CreateDishDto, req: RequestType) {
    const user = req.user;

    if (!user) {
      throw new UnauthorizedException('User not found in request');
    }

    return this.dishesService.create({
      ...createDishDto,
      authorId: user.userId,
    });
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDishDto: UpdateDishDto,
  ) {
    return this.dishesService.update(id, updateDishDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.dishesService.remove(id);
  }
}
