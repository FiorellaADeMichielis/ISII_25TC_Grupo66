import axios, { type AxiosInstance } from 'axios';
//se aplica el patron singleton para evitar multiples instancias de axios y lograr centralizar la configuración
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
        // Busca el token donde estaba guardada
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
        // Si Django devuelve un 401, el token expiró o es inválido
        if (error.response && error.response.status === 401) {
          console.warn('Sesión expirada o no autorizada.');
          
          //borra los datos de sesión y mandar al usuario al Login
          localStorage.removeItem('access_token');
          //forzar la redirección:
          window.location.href = '/login';
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