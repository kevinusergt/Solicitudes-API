import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { Rol } from "../../users/users.service.js";
import { ROLES_KEY } from "../decorators/roles.decorator.js";



@Injectable()
export class RolesGuard implements CanActivate{
    constructor(private readonly reflector: Reflector){}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const roles = this.reflector.getAllAndOverride<Rol[]>(
            ROLES_KEY,[
                context.getHandler(),
                context.getClass(),
            ],
        );

        if(!roles?.length){
            return true;
        }

        const request = context
        .switchToHttp()
        .getRequest();

        if(!roles.includes(request.user?.rol)){
            throw new ForbiddenException('No tiene permisos para acceder a este recurso',);
        }

        return true;
    }
}