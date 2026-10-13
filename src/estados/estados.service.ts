import { Injectable, OnModuleInit } from "@nestjs/common";
import { EstadosDao } from "./dao/estados.dao.js";
import { ESTADOS_VALIDOS } from "./constantes/estado.constants.js";
import { Estado } from "./entities/estado.entity.js";


@Injectable()
export class EstadosService implements OnModuleInit {
    constructor(
        private estadosDao: EstadosDao 
    ){}

    async onModuleInit(): Promise<void> {
        for (const nombre of ESTADOS_VALIDOS){
            this.estadosDao.createIfNotExist(nombre);
        }
    }

    async findByName(nombre:string): Promise<Estado|null>{
        return this.estadosDao.findByName(nombre)
    }
}