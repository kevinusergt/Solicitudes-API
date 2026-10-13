import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Solicitud } from './solicitud.entity.js';
import type { TipoEvento } from '../constantes/tipo-evento.constants.js';

@Entity('solicitud_historial')
@Index(['solicitudId'])
export class SolicitudHistorial {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'solicitud_id' })
  solicitudId: number;

  @ManyToOne(() => Solicitud, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'solicitud_id' })
  solicitud: Solicitud;

  @Column({ name: 'tipo_evento', type: 'varchar', length: 20 })
  tipoEvento: TipoEvento;

  @Column({
    name: 'valor_anterior',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  valorAnterior: string | null;

  @Column({ name: 'valor_nuevo', type: 'varchar', length: 100 })
  valorNuevo: string;

  @Column({ name: 'usuario_actor', type: 'varchar', length: 100 })
  usuarioActor: string;

  @CreateDateColumn({ name: 'fecha_evento' })
  fechaEvento: Date;
}