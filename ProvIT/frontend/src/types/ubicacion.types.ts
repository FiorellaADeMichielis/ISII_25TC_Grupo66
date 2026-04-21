export interface Provincia {
  id_provincia: number;
  nombre_provincia: string;
}

export interface Localidad {
  id_localidad: number;
  nombre_localidad: string;
  codigo_postal: number;
  fk_provincia: number;
}