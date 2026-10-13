import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from '@nestjs/config'


@Injectable()
export class ApiKeyGuard implements CanActivate{
    constructor(private readonly config:
        ConfigService
    ){}

    canActivate(context: ExecutionContext): boolean{
        const request = context
        .switchToHttp()
        .getRequest();

        const apiKey = request.headers['x-api-key']

        const validKey = (this.config.get<string>('API_KEYS') ?? '')
        .split(',')
        .map((key)=>key.trim())
        .filter(Boolean);
        console.log('--- DEPURACIÓN DE API KEY ---');
        console.log('API Key recibida de Swagger:', apiKey);
        console.log('Llave válida leída del .env:', validKey);

        if(typeof apiKey !== 'string' || !validKey.includes(apiKey)){
            throw new UnauthorizedException('API Key faltante o invalida')
        }
        return true;
    }
}