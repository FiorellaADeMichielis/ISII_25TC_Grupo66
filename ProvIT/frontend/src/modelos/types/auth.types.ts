import type { RolId } from "./layout.types";
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: RolId; 
}
export interface AuthResponse {
  token: string;
  user: Usuario;
}
