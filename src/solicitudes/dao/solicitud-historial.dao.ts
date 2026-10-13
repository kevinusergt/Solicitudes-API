import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SolicitudHistorial } from '../entities/solicitud-historial.entity.js';

@Injectable()
export class SolicitudHistorialDao {
  constructor(
    @InjectRepository(SolicitudHistorial)
    private readonly repository: Repository<SolicitudHistorial>,
  ) {}

  // Solo lectura: los eventos se insertan dentro de la transacción del service
  async findBySolicitud(
    solicitudId: number,
  ): Promise<SolicitudHistorial[]> {
    return this.repository.find({
      where: { solicitudId },
      order: { fechaEvento: 'ASC', id: 'ASC' },
    });
  }
}