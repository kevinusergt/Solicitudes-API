import { SetMetadata } from "@nestjs/common";
import { Rol } from "../../users/users.service.js";


export const ROLES_KEY = 'roles';

export const Roles = (...roles: Rol[]) =>
    SetMetadata(ROLES_KEY, roles)