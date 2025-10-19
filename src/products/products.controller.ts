import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from 'generated/prisma';
import { CreateProductDto } from './dto/create-product.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/roles.decorator';
import { type AuthUser, GetUser } from 'src/auth/get-user.decorator';
import { ProductResponseDto } from './dto/product-response.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiResponse({ type: [ProductResponseDto] })
  @Get()
  findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  create(
    @Body()
    createProductDto: CreateProductDto,
    @GetUser() _: AuthUser,
  ): Promise<Product> {
    return this.productsService.create(createProductDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @GetUser() _: AuthUser) {
    return this.productsService.remove(id);
  }
}
