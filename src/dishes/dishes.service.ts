import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';

@Injectable()
export class DishesService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: number) {
    const dish = await this.prisma.dish.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
        ingredients: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!dish) throw new NotFoundException(`Dish with ID ${id} not found`);

    return DishesService;
  }

  async findAll() {
    return this.prisma.dish.findMany({
      include: {
        author: { select: { id: true, name: true, email: true } },
        ingredients: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: CreateDishDto) {
    return this.prisma.dish.create({
      data: {
        title: data.title,
        description: data.description,
        servings: data.servings,
        authorId: data.authorId,
        imageUrl: data.imageUrl,
        ingredients: {
          create: data.ingredients.map((i) => ({
            quantity: i.quantity,
            unit: i.unit,
            product: {
              connect: { id: i.productId },
            },
          })),
        },
      },
      include: {
        ingredients: {
          include: { product: true },
        },
        author: true,
      },
    });
  }

  async update(id: number, data: UpdateDishDto) {
    const existing = await this.prisma.dish.findUnique({
      where: { id },
      include: { ingredients: true },
    });

    if (!existing) {
      throw new NotFoundException(`Dish with ID ${id} not found`);
    }

    const updateOperations: any[] = [];

    updateOperations.push(
      this.prisma.dish.update({
        where: { id },
        data: {
          title: data.title,
          description: data.description,
          servings: data.servings,
          imageUrl: data.imageUrl,
        },
      }),
    );

    if (data.ingredients && data.ingredients.length > 0) {
      const existingIngredients = existing.ingredients;

      const existingProductIds = existingIngredients.map((i) => i.productId);

      const toCreate = data.ingredients.filter(
        (i) => !existingProductIds.includes(i.productId),
      );

      const toUpdate = data.ingredients.filter((i) =>
        existingProductIds.includes(i.productId),
      );

      if (toCreate.length > 0) {
        updateOperations.push(
          this.prisma.dishIngredient.createMany({
            data: toCreate.map((ing) => ({
              dishId: id,
              productId: ing.productId,
              quantity: ing.quantity,
              unit: ing.unit,
            })),
          }),
        );
      }

      for (const ing of toUpdate) {
        updateOperations.push(
          this.prisma.dishIngredient.update({
            where: {
              dishId_productId: {
                dishId: id,
                productId: ing.productId,
              },
            },
            data: {
              quantity: ing.quantity,
              unit: ing.unit,
            },
          }),
        );
      }
    }

    await this.prisma.$transaction(updateOperations);

    return this.prisma.dish.findUnique({
      where: { id },
      include: {
        ingredients: {
          include: { product: true },
        },
      },
    });
  }

  async remove(id: number) {
    const existing = await this.prisma.dish.findUnique({ where: { id } });

    if (!existing) {
      throw new NotFoundException(`Dish with ID ${id} not found`);
    }

    await this.prisma.dish.delete({
      where: { id },
    });
  }
}
