import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Solicitud } from "../entities/solicitud.entity.js";
import { Repository } from "typeorm";


@Injectable()
export class SolicitudesDao{
    constructor(
        @InjectRepository(Solicitud)
        private readonly repository: Repository<Solicitud>
    ){}

    async create(data: Partial<Solicitud>):Promise<Solicitud>{
        const solicitud = await this.repository.create(data);
        return await this.repository.save(solicitud);
    }

    async findAll(): Promise<Solicitud[]>{
        return await this.repository.find({
            order: {creadaEn: 'DESC'}
        });
    }

    async findAllByAsesor(asesor:string):Promise<Solicitud[]>{
        return await this.repository
        .createQueryBuilder('solicitudes')
        .where('solicitudes.asesor = :asesor', {asesor})
        .orderBy('solicitudes.creadaEn', 'DESC')
        .getMany();
    }

    async findById(id:number): Promise<Solicitud|null>{
        return await this.repository.findOne({
            where:{id},
        });
    }

    async save(solicitud: Solicitud): Promise<Solicitud>{
        return await this.repository.save(solicitud)
    }
}