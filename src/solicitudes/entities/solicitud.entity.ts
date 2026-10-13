import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm'
import { Estado } from '../../estados/entities/estado.entity.js'; 

@Entity('solicitudes')
export class Solicitud {

    @PrimaryGeneratedColumn()
    id:number;

    @Column({length: 100})
    cliente: string;

    @Column({type: 'text'})
    descripcion: string;

    @Column({length: 100})
    asesor: string;

    @ManyToOne(()=> Estado, {nullable: false, eager: true})
    @JoinColumn({name: 'estado_id'})
    estado: Estado

    @CreateDateColumn()
    creadaEn: Date;

    @UpdateDateColumn()
    actualizadaEn: Date;
}
