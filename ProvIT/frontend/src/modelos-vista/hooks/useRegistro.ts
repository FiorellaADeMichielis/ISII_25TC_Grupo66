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
    
    // --- VALIDACIONES LOCALES (REGEX) ---
    const nuevosErrores: Record<string, string> = {};
    
    // Regla: Solo letras (incluye acentos, ñ y espacios)
    const regexLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    
    if (!regexLetras.test(formData.nombre.trim())) {
      nuevosErrores.nombre = 'El nombre no admite números ni caracteres especiales.';
    }
    
    if (!regexLetras.test(formData.apellido.trim())) {
      nuevosErrores.apellido = 'El apellido no admite números ni caracteres especiales.';
    }

    // Regla: DNI exactamente de 8 dígitos numéricos
    const regexDni = /^\d{8}$/;
    if (!regexDni.test(formData.dni)) {
      nuevosErrores.dni = 'El DNI debe contener exactamente 8 números.';
    }

    // Regla: Formato de correo válido (texto@texto.texto)
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(formData.email.trim())) {
      nuevosErrores.email = 'El formato del correo es inválido (ejemplo@provit.com).';
    }
    
    // Si hay al menos un error, detenemos el envío y los mostramos en la UI
    if (Object.keys(nuevosErrores).length > 0) {
      setErroresLocales(nuevosErrores);
      return; 
    }

    // --- LLAMADA AL BACKEND ---
    setIsLoading(true);
    setErrorServidor(null);

    try {
      const exito = await UsuarioService.crearUsuario(formData);
      
      if (exito) {
        onSuccess();
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