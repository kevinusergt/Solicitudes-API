
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstadosModule } from '../estados/estado.module.js';
import { UsersModule } from '../users/users.module.js';
import { ApiKeyGuard } from '../common/guards/api-key.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { UserGuard } from '../common/guards/user.guard.js';
import { Solicitud } from './entities/solicitud.entity.js';
import { SolicitudesController } from './solicitudes.controller.js';
import { SolicitudesDao } from './dao/solicitudes.dao.js';
import { SolicitudesService } from './solicitudes.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Solicitud]),
    EstadosModule,
    UsersModule,
  ],
  controllers: [SolicitudesController],
  providers: [
    SolicitudesDao,
    SolicitudesService,
    ApiKeyGuard,
    UserGuard,
    RolesGuard,
  ],
})
export class SolicitudesModule {}