import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() { email, password, name }: CreateUserDto) {
    return this.authService.register(email, password, name);
  }

  @Post('login')
  async login(@Body() { email, password }: LoginDto) {
    return this.authService.login(email, password);
  }
}
