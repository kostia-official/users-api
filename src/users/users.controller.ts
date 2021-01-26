import {
  Controller,
  Param,
  Get,
  UseInterceptors,
  Post,
  Body,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { HidePasswordInterceptor } from '../common/hide-password.interceptor';
import { User } from './users.entity';
import { LoginData } from './users.types';
import { JwtGuard } from '../jwt/jwt.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @UseInterceptors(HidePasswordInterceptor)
  async createUser(@Body() user: Partial<User>) {
    return this.usersService.createUser(user);
  }

  @HttpCode(200)
  @Post('/login')
  async login(@Body() loginData: LoginData) {
    return this.usersService.login(loginData);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  @UseInterceptors(HidePasswordInterceptor)
  async getUserById(@Param('id') id: string) {
    return this.usersService.getUserById({ id });
  }
}
