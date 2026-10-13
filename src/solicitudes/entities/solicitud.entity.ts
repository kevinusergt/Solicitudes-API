import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
} from 'typeorm'
import { Estado } from '../../estados/entities/estado.entity.js'; 

@Entity('solicitudes')
@Index(['asesor'])
@Index(['creadaEn'])
export class Solicitud {

    @PrimaryGeneratedColumn()
    id:number;

    @Column({length: 100})
    cliente: string;

    @Column({type: 'text'})
    descripcion: string;

    // null = solicitud sin asignar
    @Column({type: 'varchar', length: 100, nullable: true})
    asesor: string | null;

    @ManyToOne(()=> Estado, {nullable: false, eager: true})
    @JoinColumn({name: 'estado_id'})
    estado: Estado

    @CreateDateColumn()
    creadaEn: Date;

    @UpdateDateColumn()
    actualizadaEn: Date;
}
