
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
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
    summary: 'Listar solicitudes según el rol del usuario',
  })
  @ApiResponse({ status: 200, description: 'Listado de solicitudes' })
  findAll(@CurrentUser() usuario: UsuarioAutenticado) {
    return this.solicitudesService.findAll(usuario);
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
}