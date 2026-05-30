import axios, { type AxiosInstance } from 'axios';

// Se aplica el patrón singleton para evitar múltiples instancias de axios y lograr centralizar la configuración
class ApiClient {
  private static instance: ApiClient;
  public axiosInstance: AxiosInstance;

  // El constructor es privado
  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: 'http://localhost:8000/api', 
      headers: {
        'Content-Type': 'application/json',
      },
    });
    // Inicializa los interceptores al crear la instancia
    this.configurarInterceptores();
  }

  private configurarInterceptores() {
    // Interceptor de Petición (Request)
    // Se ejecuta ANTES de que la petición salga hacia Django
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Busca el token donde estaba guardado
        const token = localStorage.getItem('access_token');
        
        // Si hay token, se lo inyecta a la cabecera de autorización
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Interceptor de Respuesta (Response)
    // Se ejecuta CUANDO Django responde, antes de llegar a los componentes
    this.axiosInstance.interceptors.response.use(
      (response) => {
        // Si todo sale bien, deja pasar la respuesta
        return response;
      },
      (error) => {
        // 1. Captura la URL a la que el frontend intentó acceder
        const urlPeticion = error.config?.url || '';

        // 2. Verifica si la petición iba dirigida a la autenticación (login o token)
        const esRutaAutenticacion = urlPeticion.includes('token') || urlPeticion.includes('login');
        
        // 3. Verifica en qué pantalla física está parado el usuario
        const estaEnPantallaLogin = window.location.pathname === '/login';

        if (error.response && error.response.status === 401 && !esRutaAutenticacion) {
          console.warn('Sesión expirada o no autorizada.');
          
          // Borro TODO rastro de la sesión
          localStorage.removeItem('access_token');
          localStorage.removeItem('token'); 
          localStorage.removeItem('user'); 
          
          // Manda al usuario al Login (solo si no está ya ahí)
          if (!estaEnPantallaLogin) {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Único punto de acceso a la instancia en toda la aplicación
  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }
}

// Exporta la instancia configurada de Axios para usar en los servicios
export const api = ApiClient.getInstance().axiosInstance;