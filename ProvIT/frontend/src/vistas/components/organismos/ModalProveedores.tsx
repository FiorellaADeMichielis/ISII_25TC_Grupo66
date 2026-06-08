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
  const [errores, setErrores] = useState<ErroresForm & { calle?: string }>({}); // Extendimos localmente para incluir 'calle'

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
    
    // Limpieza dinámica de errores de dirección
    if (campo === 'altura') setErrores((prev) => ({ ...prev, altura: undefined }));
    if (campo === 'calle') setErrores((prev) => ({ ...prev, calle: undefined }));
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
    const nuevosErrores: ErroresForm & { calle?: string } = {};
    
    // Validaciones de Vacío (CP Anterior)
    if (!formData.nombre.trim()) nuevosErrores.nombre = 'El campo nombre no puede estar vacío';
    if (!formData.email.trim()) nuevosErrores.email = 'El campo Correo electrónico no puede estar vacío';
    if (!formData.direcciones[0]?.calle.trim()) nuevosErrores.calle = 'El campo Calle no puede estar vacío';

    // === VALIDACIONES DE LONGITUD (NUEVO CP) ===

    // Validación CUIT
    if (!formData.cuit.trim()) {
      nuevosErrores.cuit = 'El campo CUIT no puede estar vacío';
    } else if (formData.cuit.length !== 11) {
      // Si ingresa "2744", salta este error
      nuevosErrores.cuit = 'El CUIT debe tener 11 dígitos.';
    }

    // Validación Teléfono
    if (!formData.telefono.trim()) {
      nuevosErrores.telefono = 'El campo Teléfono no puede estar vacío.';
    } else if (formData.telefono.length > 13 || formData.telefono.length < 11) {
      // Si ingresa "100", salta este error
      nuevosErrores.telefono = 'Teléfono inválido (11-13 dígitos).';
    }

    // Validación Altura
    if (!formData.direcciones[0]?.altura) {
      nuevosErrores.altura = 'El campo Altura no puede estar vacío';
    } else {
      const alturaNum = Number(formData.direcciones[0].altura);
      // Si ingresa un número negativo, 0, o un número irreal como "150000", salta este error
      if (alturaNum <= 0 || alturaNum > 99999) {
        nuevosErrores.altura = 'Altura inválida';
      }
    }

    // Cancelar la operación si el objeto nuevosErrores tiene algo adentro
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return; // CORTA LA EJECUCIÓN AQUÍ (Cancela la operación)
    }

    // Si pasa todas las validaciones, limpia errores y guarda
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