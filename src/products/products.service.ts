import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}
  findAll(): Promise<Product[]> {
    return this.prisma.product.findMany();
  }

  create(data: CreateProductDto): Promise<Product> {
    return this.prisma.product.create({ data });
  }

  async remove(id: number) {
    const existing = await this.prisma.product.findUnique({ where: { id } });

    if (!existing) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return this.prisma.product.delete({ where: { id } });
  }
}
