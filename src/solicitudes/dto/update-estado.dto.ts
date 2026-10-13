import { IsIn } from "class-validator";
import { ESTADOS_VALIDOS } from "../../estados/constantes/estado.constants.js";


export class UpdateEstadoDto {
    @IsIn([...ESTADOS_VALIDOS])
    estado: (typeof ESTADOS_VALIDOS)[number];
}