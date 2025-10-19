import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
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
import { type AuthUser, GetUser } from 'src/auth/get-user.decorator';
import { ApiResponse } from '@nestjs/swagger';
import { DishResponseDto } from './dto/dish-response.dto';

@Controller('dishes')
export class DishesController {
  constructor(private readonly dishesService: DishesService) {}

  @ApiResponse({ type: DishResponseDto })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.dishesService.findOne(id);
  }

  @ApiResponse({ type: [DishResponseDto] })
  @Get()
  findAll(@GetUser() user: AuthUser) {
    return this.dishesService.findAll(user.userId);
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

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: AuthUser,
  ) {
    const dish = await this.dishesService.findOne(id);

    if (dish.authorId !== user.userId) {
      throw new ForbiddenException('You can only delete your own dishes');
    }

    await this.dishesService.remove(id);
  }
}
