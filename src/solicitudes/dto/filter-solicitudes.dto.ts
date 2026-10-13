import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { ESTADOS_VALIDOS } from '../../estados/constantes/estado.constants.js';

export class FilterSolicitudesDto {
  @ApiPropertyOptional({ enum: ESTADOS_VALIDOS })
  @IsOptional()
  @IsIn([...ESTADOS_VALIDOS])
  estado?: (typeof ESTADOS_VALIDOS)[number];

  @ApiPropertyOptional({ description: 'Username del asesor asignado' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  asesor?: string;

  @ApiPropertyOptional({ description: 'Búsqueda parcial por cliente' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  cliente?: string;

  @ApiPropertyOptional({ example: '2026-10-01T00:00:00Z' })
  @IsOptional()
  @IsISO8601({ strict: true })
  desde?: string;

  @ApiPropertyOptional({ example: '2026-10-31T23:59:59Z' })
  @IsOptional()
  @IsISO8601({ strict: true })
  hasta?: string;

  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ default: 10, minimum: 1, maximum: 100 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;
}