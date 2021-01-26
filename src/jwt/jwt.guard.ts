import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from './jwt.service';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const accessToken = request.get('Authorization').replace('Bearer ', '');

      request.user = await this.jwtService.verifyToken(accessToken);

      return this.jwtService.verifyToken(accessToken);
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
  }
}
