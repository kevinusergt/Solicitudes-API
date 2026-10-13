import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { EstadosService } from '../estados/estados.service.js';
import { EstadoNombre } from '../estados/constantes/estado.constants.js';
import { UsersService, UsuarioAutenticado } from '../users/users.service.js';
import { CreateSolicitudDto } from './dto/create-solicitude.dto.js';
import { UpdateEstadoDto } from './dto/update-estado.dto.js';
import { AssignSolicitudDto } from './dto/assign-solicitud.dto.js';
import { FilterSolicitudesDto } from './dto/filter-solicitudes.dto.js';
import { Solicitud } from './entities/solicitud.entity.js';
import { SolicitudHistorial } from './entities/solicitud-historial.entity.js';
import { TipoEvento } from './constantes/tipo-evento.constants.js';
import { SolicitudesDao } from './dao/solicitudes.dao.js';
import { SolicitudHistorialDao } from './dao/solicitud-historial.dao.js';

@Injectable()
export class SolicitudesService {
  constructor(
    private readonly solicitudesDao: SolicitudesDao,
    private readonly historialDao: SolicitudHistorialDao,
    private readonly estadosService: EstadosService,
    private readonly usersService: UsersService,
    private readonly dataSource: DataSource,
  ) {}

  // Inserta un evento de historial usando el manager de la transacción
  private registrarEvento(
    manager: EntityManager,
    solicitudId: number,
    tipoEvento: TipoEvento,
    valorAnterior: string | null,
    valorNuevo: string,
    usuarioActor: string,
  ): Promise<SolicitudHistorial> {
    const evento = manager.create(SolicitudHistorial, {
      solicitudId,
      tipoEvento,
      valorAnterior,
      valorNuevo,
      usuarioActor,
    });
    return manager.save(evento);
  }

  async create(
    dto: CreateSolicitudDto,
    usuario: UsuarioAutenticado,
  ): Promise<Solicitud> {
    const estadoInicial =
      await this.estadosService.findByName('PENDIENTE');

    if (!estadoInicial) {
      throw new InternalServerErrorException(
        'No está configurado el estado inicial',
      );
    }

    // RN-07: asesor -> queda a su nombre; admin/supervisor -> sin asignar
    const asesor =
      usuario.rol === 'asesor' ? usuario.username : null;

    return this.dataSource.transaction(async (manager) => {
      const solicitud = await manager.save(
        manager.create(Solicitud, {
          cliente: dto.cliente,
          descripcion: dto.descripcion,
          asesor,
          estado: estadoInicial,
        }),
      );

      await this.registrarEvento(
        manager,
        solicitud.id,
        'CREACION',
        null,
        'PENDIENTE',
        usuario.username,
      );

      return solicitud;
    });
  }

  async findAll(
    filtros: FilterSolicitudesDto,
    usuario: UsuarioAutenticado,
  ) {
    const { desde, hasta } = filtros;

    if (desde && hasta && new Date(desde) > new Date(hasta)) {
      throw new BadRequestException(
        'La fecha "desde" no puede ser posterior a "hasta"',
      );
    }

    // RN-08: el asesor SIEMPRE ve solo lo suyo, ignora el filtro asesor=...
    const asesor =
      usuario.rol === 'asesor' ? usuario.username : filtros.asesor;

    const [items, total] = await this.solicitudesDao.findPaginated({
      estado: filtros.estado,
      asesor,
      cliente: filtros.cliente,
      desde: desde ? new Date(desde) : undefined,
      hasta: hasta ? new Date(hasta) : undefined,
      page: filtros.page,
      limit: filtros.limit,
    });

    return {
      items,
      pagination: {
        page: filtros.page,
        limit: filtros.limit,
        total,
        totalPages: Math.ceil(total / filtros.limit),
      },
    };
  }

  async findOne(
    id: number,
    usuario: UsuarioAutenticado,
  ): Promise<Solicitud> {
    const solicitud = await this.solicitudesDao.findById(id);

    if (!solicitud) {
      throw new NotFoundException(
        `No existe una solicitud con ID ${id}`,
      );
    }

    if (
      usuario.rol === 'asesor' &&
      solicitud.asesor !== usuario.username
    ) {
      throw new ForbiddenException(
        'No puede acceder a solicitudes de otro asesor',
      );
    }

    return solicitud;
  }

  async asignar(
    id: number,
    dto: AssignSolicitudDto,
    usuario: UsuarioAutenticado,
  ): Promise<Solicitud> {
    // El rol (admin/supervisor) ya se validó con @Roles en el controller
    const solicitud = await this.findOne(id, usuario);

    const asesor = this.usersService.findByUsername(dto.asesorId);

    if (!asesor || asesor.rol !== 'asesor') {
      throw new BadRequestException(
        'El usuario asignado debe existir y tener el rol asesor',
      );
    }

    if (solicitud.estado.nombre === 'RESUELTA') {
      throw new ConflictException(
        'No se puede reasignar una solicitud RESUELTA',
      );
    }

    // Si ya es de ese asesor no hay nada que cambiar ni que auditar
    if (solicitud.asesor === asesor.username) {
      return solicitud;
    }

    const asesorAnterior = solicitud.asesor;
    solicitud.asesor = asesor.username;

    return this.dataSource.transaction(async (manager) => {
      const guardada = await manager.save(solicitud);

      await this.registrarEvento(
        manager,
        guardada.id,
        'ASIGNACION',
        asesorAnterior,
        asesor.username,
        usuario.username,
      );

      return guardada;
    });
  }

  async findHistorial(
    id: number,
    usuario: UsuarioAutenticado,
  ): Promise<SolicitudHistorial[]> {
    // findOne valida que exista y que el usuario tenga acceso
    await this.findOne(id, usuario);
    return this.historialDao.findBySolicitud(id);
  }

  async updateEstado(
    id: number,
    dto: UpdateEstadoDto,
    usuario: UsuarioAutenticado,
  ): Promise<Solicitud> {
    const solicitud = await this.findOne(id, usuario);

    const estadoActual = solicitud.estado.nombre;
    const nuevoNombre = dto.estado;

    const transicionValida =
      (estadoActual === 'PENDIENTE' &&
        nuevoNombre === 'EN_GESTION') ||
      (estadoActual === 'EN_GESTION' &&
        nuevoNombre === 'RESUELTA');

    if (!transicionValida) {
      throw new ConflictException(
        `Transición no permitida: ${estadoActual} -> ${nuevoNombre}`,
      );
    }

    const nuevoEstado =
      await this.estadosService.findByName(
        nuevoNombre as EstadoNombre,
      );

    if (!nuevoEstado) {
      throw new InternalServerErrorException(
        `No está configurado el estado ${nuevoNombre}`,
      );
    }

    solicitud.estado = nuevoEstado;

    // RN-09: cambio de estado + evento de historial en una sola transacción
    return this.dataSource.transaction(async (manager) => {
      const guardada = await manager.save(solicitud);

      await this.registrarEvento(
        manager,
        guardada.id,
        'ESTADO',
        estadoActual,
        nuevoNombre,
        usuario.username,
      );

      return guardada;
    });
  }
}