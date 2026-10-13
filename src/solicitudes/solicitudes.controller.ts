import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { Roles } from '../common/decorators/roles.decorator.js'; 
import { ApiKeyGuard } from '../common/guards/api-key.guard.js'; 
import { RolesGuard } from '../common/guards/roles.guard.js';
import { UserGuard } from '../common/guards/user.guard.js';
import type { UsuarioAutenticado } from '../users/users.service.js';
import { CreateSolicitudDto } from './dto/create-solicitude.dto.js';
import { UpdateEstadoDto } from './dto/update-estado.dto.js';
import { AssignSolicitudDto } from './dto/assign-solicitud.dto.js';
import { FilterSolicitudesDto } from './dto/filter-solicitudes.dto.js';
import { SolicitudesService } from './solicitudes.service.js';

@ApiTags('Solicitudes')
@ApiSecurity('api-key')
@ApiSecurity('x-user')
@ApiHeader({
  name: 'x-api-key',
  required: true,
  description: 'Una API Key definida en API_KEYS',
})
@ApiHeader({
  name: 'x-user',
  required: true,
  description: 'Usuario de prueba: Sr. Admin, Super. Mario, Alex P. o R. Castro',
})
@Controller('solicitudes')
@UseGuards(ApiKeyGuard, UserGuard, RolesGuard)
@Roles('admin', 'supervisor', 'asesor')
export class SolicitudesController {
  constructor(
    private readonly solicitudesService: SolicitudesService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear una solicitud comercial' })
  @ApiResponse({ status: 201, description: 'Solicitud creada' })
  @ApiResponse({ status: 400, description: 'DTO inválido' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  create(
    @Body() dto: CreateSolicitudDto,
    @CurrentUser() usuario: UsuarioAutenticado,
  ) {
    return this.solicitudesService.create(dto, usuario);
  }

  @Get()
  @ApiOperation({
    summary:
      'Listar solicitudes con filtros y paginación según el rol del usuario',
  })
  @ApiResponse({
    status: 200,
    description: 'Objeto con items y pagination (page, limit, total, totalPages)',
  })
  @ApiResponse({ status: 400, description: 'Filtros o paginación inválidos' })
  @ApiResponse({ status: 401, description: 'API Key o usuario inválido' })
  findAll(
    @Query() filtros: FilterSolicitudesDto,
    @CurrentUser() usuario: UsuarioAutenticado,
  ) {
    return this.solicitudesService.findAll(filtros, usuario);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una solicitud por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Solicitud encontrada' })
  @ApiResponse({ status: 404, description: 'Solicitud inexistente' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() usuario: UsuarioAutenticado,
  ) {
    return this.solicitudesService.findOne(id, usuario);
  }

  @Patch(':id/estado')
  @ApiOperation({ summary: 'Actualizar el estado de una solicitud' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Estado actualizado' })
  @ApiResponse({ status: 409, description: 'Transición no permitida' })
  updateEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEstadoDto,
    @CurrentUser() usuario: UsuarioAutenticado,
  ) {
    return this.solicitudesService.updateEstado(
      id,
      dto,
      usuario,
    );
  }

  @Patch(':id/asignacion')
  @Roles('admin', 'supervisor')
  @ApiOperation({ summary: 'Asignar o reasignar una solicitud a un asesor' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Solicitud asignada' })
  @ApiResponse({ status: 400, description: 'Asesor inexistente o sin rol asesor' })
  @ApiResponse({ status: 401, description: 'API Key o usuario inválido' })
  @ApiResponse({ status: 403, description: 'Rol sin permisos para asignar' })
  @ApiResponse({ status: 404, description: 'Solicitud inexistente' })
  @ApiResponse({ status: 409, description: 'Solicitud RESUELTA: no se puede reasignar' })
  asignar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AssignSolicitudDto,
    @CurrentUser() usuario: UsuarioAutenticado,
  ) {
    return this.solicitudesService.asignar(id, dto, usuario);
  }

  @Get(':id/historial')
  @ApiOperation({ summary: 'Consultar el historial de auditoría de una solicitud' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Eventos del historial' })
  @ApiResponse({ status: 401, description: 'API Key o usuario inválido' })
  @ApiResponse({ status: 403, description: 'Solicitud de otro asesor' })
  @ApiResponse({ status: 404, description: 'Solicitud inexistente' })
  findHistorial(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() usuario: UsuarioAutenticado,
  ) {
    return this.solicitudesService.findHistorial(id, usuario);
  }
}