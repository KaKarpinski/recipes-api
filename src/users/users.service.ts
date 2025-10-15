import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create({ email, password, name }: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        email,
        password,
        name,
      },
    });
  }

  findAll() {
    return this.prisma.user.findMany({
      include: {
        dishes: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { dishes: true },
    });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id: number, data: UpdateUserDto) {
    const updateData = { ...data };

    if (data.password) {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      updateData.password = hashedPassword;
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData,
    });
  }

  remove(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
