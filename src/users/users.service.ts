import { Injectable } from '@nestjs/common';

export type Rol = 'admin' | 'supervisor' | 'asesor';

export interface UsuarioAutenticado{
    username: string;
    rol: Rol;
}

@Injectable()
export class UsersService {
    private readonly usuarios:
    UsuarioAutenticado[]=[
        {username: 'Sr. Admin', rol: 'admin'},
        {username: 'Super. Mario', rol: 'supervisor'},
        {username: 'Alex P.', rol: 'asesor'},
        {username: 'R. Castro', rol: 'asesor'},
    ];

    findByUsername(username:string): UsuarioAutenticado|undefined{
        return this.usuarios.find(
            (usuario) => usuario.username === username,
        );
    }
}
