import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Estado } from "../entities/estado.entity.js";
import { Repository } from "typeorm";


@Injectable()
export class EstadosDao{
    constructor
    (@InjectRepository(Estado)
    private readonly repository: Repository<Estado>
    ){}

    async findByName(nombre: string): Promise<Estado|null>{
        return this.repository.findOne({
            where: {nombre}
        });
    }

    async createIfNotExist(nombre:string): Promise<void>{

        const nuevoEstado = await this.findByName(nombre)

        if(!nuevoEstado){
            await this.repository.save(
                this.repository.create({nombre})
            )
        }
    }
}