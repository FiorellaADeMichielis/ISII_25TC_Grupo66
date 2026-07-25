import { useState } from 'react';
import { UsuarioService } from '../../modelos/services/usuarioService';

export const useModalRegistro = (onSuccess: () => void) => {
  // 1. Estado centralizado para el formulario (Sin contraseñas, el backend usa el DNI)
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    email: '',
    rol_id: '1', // Por defecto: Operador
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorServidor, setErrorServidor] = useState<string | null>(null);
  const [erroresLocales, setErroresLocales] = useState<Record<string, string>>({});

  // 2. Manejador de cambios limpio
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Limpiar errores cuando el usuario vuelve a escribir
    if (errorServidor) setErrorServidor(null);
    if (erroresLocales[name]) {
      setErroresLocales((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // 3. Envío y Validación
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // --- VALIDACIONES LOCALES ---
    const nuevosErrores: Record<string, string> = {};
    if (formData.dni.length < 7 || formData.dni.length > 8) {
      nuevosErrores.dni = 'El DNI debe tener entre 7 y 8 dígitos.';
    }
    
    if (Object.keys(nuevosErrores).length > 0) {
      setErroresLocales(nuevosErrores);
      return; // Detenemos la ejecución si hay errores locales
    }

    // --- LLAMADA AL BACKEND ---
    setIsLoading(true);
    setErrorServidor(null);

    try {
      // Usamos el servicio del Gerente que construimos (asegúrate de que UsuarioService espere estos campos)
      const exito = await UsuarioService.crearUsuario(formData);
      
      if (exito) {
        onSuccess(); // Se cierra el modal y se actualiza la tabla principal
      }
    } catch (error: any) {
      setErrorServidor(error.message || 'Error al registrar el usuario.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    errorServidor,
    erroresLocales,
    handleChange,
    handleSubmit
  };
};