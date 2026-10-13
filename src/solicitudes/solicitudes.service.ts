
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { EstadosService } from '../estados/estados.service.js';
import { EstadoNombre } from '../estados/constantes/estado.constants.js';
import { UsuarioAutenticado } from '../users/users.service.js';
import { CreateSolicitudDto } from './dto/create-solicitude.dto.js';
import { UpdateEstadoDto } from './dto/update-estado.dto.js';
import { Solicitud } from './entities/solicitud.entity.js';
import { SolicitudesDao } from './dao/solicitudes.dao.js';

@Injectable()
export class SolicitudesService {
  constructor(
    private readonly solicitudesDao: SolicitudesDao,
    private readonly estadosService: EstadosService,
  ) {}

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

    const asesor =
      usuario.rol === 'asesor'
        ? usuario.username
        : dto.asesor ?? usuario.username;

    return this.solicitudesDao.create({
      cliente: dto.cliente,
      descripcion: dto.descripcion,
      asesor,
      estado: estadoInicial,
    });
  }

  findAll(
    usuario: UsuarioAutenticado,
  ): Promise<Solicitud[]> {
    if (usuario.rol === 'asesor') {
      return this.solicitudesDao.findAllByAsesor(
        usuario.username,
      );
    }

    return this.solicitudesDao.findAll();
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

    return this.solicitudesDao.save(solicitud);
  }
}