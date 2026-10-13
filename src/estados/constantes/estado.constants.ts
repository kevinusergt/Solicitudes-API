
export const ESTADOS_VALIDOS = [
    'PENDIENTE',
    'EN_GESTION',
    'RESUELTA',
] as const;

export type EstadoNombre = (typeof
    ESTADOS_VALIDOS)[number]