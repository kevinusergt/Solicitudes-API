import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class AssignSolicitudDto {
  @ApiProperty({
    example: 'Alex P.',
    description: 'Username del asesor (debe existir y tener rol asesor)',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  asesorId: string;
}