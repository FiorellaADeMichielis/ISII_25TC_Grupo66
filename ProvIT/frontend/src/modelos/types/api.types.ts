
/**
 * Interfaz global que refleja el helper `respuestaExitosa` y `respuestaError` de Django.
 */
export interface APIResponse<T> {
  success: boolean;
  data: T;
  mensaje?: string;
  errores?: any;
}