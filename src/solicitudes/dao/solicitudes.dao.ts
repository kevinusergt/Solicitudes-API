import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Solicitud } from "../entities/solicitud.entity.js";
import { Repository } from "typeorm";

export interface FiltrosConsulta {
    estado?: string;
    asesor?: string;
    cliente?: string;
    desde?: Date;
    hasta?: Date;
    page: number;
    limit: number;
}

@Injectable()
export class SolicitudesDao{
    constructor(
        @InjectRepository(Solicitud)
        private readonly repository: Repository<Solicitud>
    ){}

    async findPaginated(
        filtros: FiltrosConsulta,
    ): Promise<[Solicitud[], number]>{
        const qb = this.repository
            .createQueryBuilder('solicitud')
            .leftJoinAndSelect('solicitud.estado', 'estado');

        if (filtros.asesor) {
            qb.andWhere('solicitud.asesor = :asesor', {
                asesor: filtros.asesor,
            });
        }

        if (filtros.estado) {
            qb.andWhere('estado.nombre = :estado', {
                estado: filtros.estado,
            });
        }

        if (filtros.cliente) {
            // se escapan % y _ para que se busquen como texto normal
            const texto = filtros.cliente.replace(/[\\%_]/g, '\\$&');
            qb.andWhere('solicitud.cliente ILIKE :cliente', {
                cliente: `%${texto}%`,
            });
        }

        if (filtros.desde) {
            qb.andWhere('solicitud.creadaEn >= :desde', {
                desde: filtros.desde,
            });
        }

        if (filtros.hasta) {
            qb.andWhere('solicitud.creadaEn <= :hasta', {
                hasta: filtros.hasta,
            });
        }

        return qb
            .orderBy('solicitud.creadaEn', 'DESC')
            .addOrderBy('solicitud.id', 'DESC')
            .skip((filtros.page - 1) * filtros.limit)
            .take(filtros.limit)
            .getManyAndCount();
    }

    async findById(id:number): Promise<Solicitud|null>{
        return await this.repository.findOne({
            where:{id},
        });
    }
}