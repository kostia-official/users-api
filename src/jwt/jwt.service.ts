import * as jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { TokenResponse } from './jwt.types';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtService {
  constructor(private configService: ConfigService) {}

  async createToken(payload: any): Promise<TokenResponse> {
    const accessToken = await jwt.sign(
      payload,
      this.configService.get<string>('jwt.secret'),
    );

    return { accessToken };
  }

  async verifyToken(accessToken: string): Promise<any> {
    return jwt.verify(
      accessToken,
      this.configService.get<string>('jwt.secret'),
    );
  }
}
