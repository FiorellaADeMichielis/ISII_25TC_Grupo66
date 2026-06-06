import React, { useState, useEffect } from 'react';
import type { Proveedor, Direccion, ErroresBackend, ErroresForm } from '../../../modelos/types/proveedor.types';
import { ModalProveedorVista } from '../UI/Modales/ModalProveedorVista';

export interface ModalFormularioProveedorProps {
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
}: ModalFormularioProveedorProps) => {
  const [formData, setFormData] = useState<Omit<Proveedor, 'id'>>(formInicial);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errores, setErrores] = useState<ErroresForm>({});

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
    // Limpieza dinámica de errores al cambiar el valor
    const camposCambiados = Object.keys(datosNuevos) as Array<keyof ErroresForm>;
    setErrores((prev) => {
      const nuevos = { ...prev };
      camposCambiados.forEach(c => delete nuevos[c]);
      return nuevos;
    });
  };

  const handleDireccionChange = (campo: keyof Direccion, valor: string | number) => {
    const nuevaDireccion = { ...formData.direcciones[0], [campo]: valor };
    setFormData({ ...formData, direcciones: [nuevaDireccion] });
    // Limpieza específica para altura
    if (campo === 'altura') setErrores((prev) => ({ ...prev, altura: undefined }));
  };

  const mapearErroresBackend = (erroresBackend: ErroresBackend): ErroresForm => ({
    cuit: erroresBackend.cuit?.[0],
    nombre: erroresBackend.nombre_proveedor?.[0],
    email: erroresBackend.correo_proveedor?.[0],
    telefono: erroresBackend.telefono?.[0],
    general: erroresBackend.general,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nuevosErrores: ErroresForm = {};
    
    if (formData.cuit.length !== 11) nuevosErrores.cuit = 'El CUIT debe tener 11 dígitos.';
    if (formData.telefono.length > 13 || formData.telefono.length < 11) nuevosErrores.telefono = 'Teléfono inválido (11-13 dígitos).';
    if (!formData.direcciones[0]?.altura || Number(formData.direcciones[0].altura) <= 0) nuevosErrores.altura = 'Altura inválida.';

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

  return (
    <ModalProveedorVista
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