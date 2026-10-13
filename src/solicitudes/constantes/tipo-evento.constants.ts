export const TIPOS_EVENTO = [
  'CREACION',
  'ESTADO',
  'ASIGNACION',
] as const;

export type TipoEvento = (typeof TIPOS_EVENTO)[number];