import { useState } from 'react';
import { useRegistro } from './useRegistro';
import type { RegisterData } from '../types/auth.types';

export interface RegistroFormData extends Omit<RegisterData, 'dni'> {
  dni: string;
  confirmarPassword: string;
}

export const useRegistroForm = () => {
  const { registrarUsuario, loading, errorGlobal } = useRegistro();
  const [exito, setExito] = useState(false);
  const [erroresLocales, setErroresLocales] = useState<Partial<RegistroFormData>>({});

  const [formData, setFormData] = useState<RegistroFormData>({
    nombre: '',
    apellido: '',
    dni: '',
    email: '',
    password: '',
    confirmarPassword: ''
  });

  // Manejador genérico para limpiar el código de la vista
  const handleChange = (campo: keyof RegistroFormData, valor: string) => {
    setFormData((prev) => ({ ...prev, [campo]: valor }));
    // Limpiamos el error local cuando el usuario vuelve a escribir
    if (erroresLocales[campo]) {
      setErroresLocales((prev) => ({ ...prev, [campo]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nuevosErrores: Partial<RegistroFormData> = {};

    if (formData.dni.length < 7 || formData.dni.length > 8) {
      nuevosErrores.dni = 'El DNI debe tener entre 7 y 8 dígitos.';
    }
    if (formData.password.length < 6) {
      nuevosErrores.password = 'La contraseña debe tener al menos 6 caracteres.';
    }
    if (formData.password !== formData.confirmarPassword) {
      nuevosErrores.confirmarPassword = 'Las contraseñas no coinciden.';
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErroresLocales(nuevosErrores);
      return;
    }

    setErroresLocales({});
    
    const payload: RegisterData = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      dni: parseInt(formData.dni, 10),
      email: formData.email,
      password: formData.password
    };

    const creado = await registrarUsuario(payload);
    if (creado) {
      setExito(true);
    }
  };

  return {
    formData,
    erroresLocales,
    handleChange,
    handleSubmit,
    loading,
    errorGlobal,
    exito
  };
};