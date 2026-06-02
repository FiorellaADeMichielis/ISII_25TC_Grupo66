// components/organisms/ModalFormularioProveedor.tsx
import React, { useState, useEffect } from 'react';
import type { Proveedor, Direccion, ErroresBackend } from '../../types/proveedor.types';
import { ModalFormularioProveedorVista, type ErroresForm } from '../UI/Modales/ModalProveedorVista';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  proveedorEditando: Proveedor | null;
  onGuardar: (datos: Omit<Proveedor, 'id'>) => Promise<{ exito: boolean; errores: ErroresBackend | null }>;
  rolUsuario: number;
}

const formInicial: Omit<Proveedor, 'id'> = {
  nombre: '',
  cuit: '',
  email: '',
  telefono: '',
  estado: 'Activo',
  direcciones: [{ calle: '', altura: '' as unknown as number, fk_localidad: 1 }],
};

export const ModalFormularioProveedor = ({
  isOpen, onClose, proveedorEditando, onGuardar, rolUsuario,
}: ModalProps) => {
  const [formData, setFormData] = useState<Omit<Proveedor, 'id'>>(formInicial);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errores, setErrores] = useState<ErroresForm>({});

  // Regla de Negocio: Rol 2 (Admin) o 3 (Gerente) pueden cambiar el estado.
  const puedeEditarEstado = rolUsuario === 2 || rolUsuario === 3;

  useEffect(() => {
    if (proveedorEditando) {
      setFormData({
        nombre: proveedorEditando.nombre,
        cuit: proveedorEditando.cuit,
        email: proveedorEditando.email,
        telefono: proveedorEditando.telefono,
        estado: proveedorEditando.estado,
        direcciones: proveedorEditando.direcciones?.length > 0
          ? proveedorEditando.direcciones
          : [{ calle: '', altura: '' as unknown as number, fk_localidad: 1 }],
      });
    } else {
      setFormData(formInicial);
    }
    setErrores({});
  }, [proveedorEditando, isOpen]);

  const handleChangeData = (datosNuevos: Partial<Omit<Proveedor, 'id'>>) => {
    setFormData((prev) => ({ ...prev, ...datosNuevos }));
    // Limpiamos los errores del campo que se está editando si existen
    const camposCambiados = Object.keys(datosNuevos) as Array<keyof ErroresForm>;
    camposCambiados.forEach((campo) => {
      if (errores[campo]) setErrores((prev) => ({ ...prev, [campo]: undefined }));
    });
  };

  const handleDireccionChange = (campo: keyof Direccion, valor: string | number) => {
    const nuevaDireccion = { ...formData.direcciones[0], [campo]: valor };
    setFormData({ ...formData, direcciones: [nuevaDireccion] });
    if (campo === 'altura' && errores.altura) {
      setErrores((prev) => ({ ...prev, altura: undefined }));
    }
  };

  const mapearErroresBackend = (erroresBackend: ErroresBackend): ErroresForm => ({
    cuit:    erroresBackend.cuit?.[0],
    nombre:  erroresBackend.nombre_proveedor?.[0],
    email:   erroresBackend.correo_proveedor?.[0],
    telefono:erroresBackend.telefono?.[0],
    general: erroresBackend.general,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones del frontend
    const nuevosErrores: ErroresForm = {};
    if (formData.cuit.length !== 11)
      nuevosErrores.cuit = 'El CUIT debe tener exactamente 11 dígitos numéricos.';
    if (formData.telefono.length > 13 || formData.telefono.length < 11)
      nuevosErrores.telefono = 'El teléfono no es válido. Debe tener entre 11 y 13 dígitos numéricos.';
    if (!formData.direcciones[0].altura || Number(formData.direcciones[0].altura) <= 0)
      nuevosErrores.altura = 'La altura debe ser un número válido.';

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    setErrores({});
    setIsSubmitting(true);

    const resultado = await onGuardar(formData);

    setIsSubmitting(false);

    if (resultado.exito) {
      onClose();
    } else if (resultado.errores) {
      setErrores(mapearErroresBackend(resultado.errores));
    }
  };

  // Delegamos toda la UI al componente tonto
  return (
    <ModalFormularioProveedorVista
      isOpen={isOpen}
      onClose={onClose}
      formData={formData}
      errores={errores}
      isSubmitting={isSubmitting}
      isEdicion={!!proveedorEditando}
      puedeEditarEstado={puedeEditarEstado}
      onChangeData={handleChangeData}
      onChangeDireccion={handleDireccionChange}
      onSubmit={handleSubmit}
    />
  );
};