import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateSolicitudDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    cliente: string;

    @IsString()
    @IsNotEmpty()
    descripcion: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    asesor?: string;
}
