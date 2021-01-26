import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { FindConditions } from 'typeorm/find-options/FindConditions';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '../jwt/jwt.service';
import { LoginData, AuthResult } from './users.types';

const PASSWORD_HASH_SALT = 13;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private authService: JwtService,
  ) {}

  getUserById(where: FindConditions<User>): Promise<User> {
    return this.usersRepository.findOne(where);
  }

  async getAuthResult(user: User): Promise<AuthResult> {
    const { password: toOmit, ...userWithoutPassword } = user;

    const { accessToken } = await this.authService.createToken(
      userWithoutPassword,
    );

    return { accessToken, user: userWithoutPassword };
  }

  async createUser(user: Partial<User>): Promise<AuthResult> {
    const password = await this.hashPassword(user.password);

    const userRecord = this.usersRepository.create({ ...user, password });

    const createdUser = await this.usersRepository.save(userRecord);

    return this.getAuthResult(createdUser);
  }

  async login(loginData: LoginData): Promise<AuthResult> {
    const loginError = new UnauthorizedException('Wrong email or password');
    const user = await this.usersRepository.findOne({
      email: loginData.email,
    });

    if (!user) throw loginError;

    const isCorrectLogin = await this.checkPassword(
      loginData.password,
      user.password,
    );

    if (!isCorrectLogin) throw loginError;

    return this.getAuthResult(user);
  }

  hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, PASSWORD_HASH_SALT);
  }

  checkPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
