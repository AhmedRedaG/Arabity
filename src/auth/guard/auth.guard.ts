import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthUtilsService } from 'src/auth-utils/auth-utils.service';
import { JwtTypes } from 'src/auth-utils/types/jwt.types';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authUtilsService: AuthUtilsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('provide a bearer token');
    }

    request['user'] = await this.authUtilsService.verifyToken(
      token,
      JwtTypes.ACC,
    );

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
