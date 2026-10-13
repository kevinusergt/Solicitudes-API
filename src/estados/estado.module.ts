import { Module } from "@nestjs/common";
import { Estado } from "./entities/estado.entity.js";
import {TypeOrmModule} from '@nestjs/typeorm'
import { EstadosService } from "./estados.service.js";
import { EstadosDao } from "./dao/estados.dao.js";



@Module({
    imports: [TypeOrmModule.forFeature([Estado])],
    providers: [EstadosService, EstadosDao],
    exports: [EstadosService],
})

export class EstadosModule {}