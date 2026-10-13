import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('estados')
export class Estado {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 30, unique: true})
    nombre: string 
}