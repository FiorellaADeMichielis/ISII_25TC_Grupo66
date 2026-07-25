import React, { useState, useEffect } from 'react';
import { ModalEdicionUsuarioVista } from '../UI/Modales/ModalEdicionUsuarioVista';
import type { Usuario, ErroresFormUsuario } from '../../../modelos/types/usuarios.types';

interface ModalEdicionUsuarioProps {
  isOpen: boolean;
  onClose: () => void;
  usuarioEditando: Usuario | null;
  onGuardar: (id: string, datos: { nombre: string; apellido: string; dni: string; email: string; rol_id: string }) => Promise<{ exito: boolean; errores?: any }>;
}

const formInicial = {
  nombre: '',
  apellido: '',
  dni: '',
  email: '',
  rol_id: '1',
};

export const ModalEdicionUsuario = ({
  isOpen, 
  onClose, 
  usuarioEditando, 
  onGuardar
}: ModalEdicionUsuarioProps) => {
  const [formData, setFormData] = useState(formInicial);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errores, setErrores] = useState<ErroresFormUsuario>({});

  useEffect(() => {
    if (usuarioEditando) {
      const partesNombre = usuarioEditando.nombre.split(' ');
      setFormData({
        nombre: partesNombre[0] || '',
        apellido: partesNombre.slice(1).join(' ') || '',
        dni: (usuarioEditando as any).dni?.toString() || '', // Recuperamos el DNI si viene en el objeto
        email: usuarioEditando.email || '',
        rol_id: usuarioEditando.rol === 'Administrador' ? '2' : '1',
      });
    }
    setErrores({});
  }, [usuarioEditando, isOpen]);

  const handleChangeData = (datosNuevos: Partial<typeof formInicial>) => {
    setFormData((prev) => ({ ...prev, ...datosNuevos }));
    const camposCambiados = Object.keys(datosNuevos) as Array<keyof ErroresFormUsuario>;
    setErrores((prev) => {
      const nuevos = { ...prev };
      camposCambiados.forEach(c => delete nuevos[c]);
      return nuevos;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nuevosErrores: ErroresFormUsuario = {};
    const regexLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    const regexDni = /^\d{8}$/;
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre no puede estar vacío.';
    } else if (!regexLetras.test(formData.nombre.trim())) {
      nuevosErrores.nombre = 'El nombre no admite números ni caracteres especiales.';
    }

    if (!formData.apellido.trim()) {
      nuevosErrores.apellido = 'El apellido no puede estar vacío.';
    } else if (!regexLetras.test(formData.apellido.trim())) {
      nuevosErrores.apellido = 'El apellido no admite números ni caracteres especiales.';
    }

    if (!regexDni.test(formData.dni)) {
      nuevosErrores.dni = 'El DNI debe contener exactamente 8 números.';
    }

    if (!regexEmail.test(formData.email.trim())) {
      nuevosErrores.email = 'El formato del correo es inválido.';
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return; 
    }

    if (!usuarioEditando) return;

    setErrores({});
    setIsSubmitting(true);
    const resultado = await onGuardar(usuarioEditando.id, formData);
    setIsSubmitting(false);

    if (resultado.exito) {
      onClose();
    } else if (resultado.errores) {
      setErrores({ general: resultado.errores.mensaje || 'Error al actualizar el usuario' });
    }
  };

  return (
    <ModalEdicionUsuarioVista
      isOpen={isOpen}
      onClose={onClose}
      formData={formData}
      errores={errores}
      isSubmitting={isSubmitting}
      nombreUsuario={usuarioEditando?.nombre}
      onChangeData={handleChangeData}
      onSubmit={handleSubmit}
    />
  );
};