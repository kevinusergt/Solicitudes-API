import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../../users/users.service.js';
import { Observable } from 'rxjs';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const username = request.headers['x-user'];

    if (typeof username !== 'string') {
      throw new UnauthorizedException('Debe enviar el encabezado x-user');
    }

    const usuario = this.usersService.findByUsername(username);

    if (!usuario) {
      throw new UnauthorizedException('Usuario de prueba desconocido');
    }

    request.user = usuario;
    return true;
  }
}
