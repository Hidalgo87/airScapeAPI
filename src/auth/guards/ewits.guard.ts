import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../jwt-payload';
import { AuthService } from '../auth.service';

@Injectable()
export class EwitsGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService, private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['token'];
    if (!token) {
      throw new UnauthorizedException();
    }
    let payload: JwtPayload;
    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: process.env.JWT_SECRET,
      });
      request['user'] = payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid Token');
    }
    const user = await this.authService.findById(payload.id);
    if (!user){
      throw new UnauthorizedException('User not exists');
    }
    request['user'] = user;
    return Promise.resolve(true);
  }
}
