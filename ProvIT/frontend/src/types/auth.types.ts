
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
}

export interface AuthResponse {
  token: string;
  user: Usuario;
}