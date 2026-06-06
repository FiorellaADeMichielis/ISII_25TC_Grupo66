import React, { useState } from 'react';
import type { ErroresFormPedido, PedidoFormData } from '../../../modelos/types/pedido.types';
import { ModalPedidoVista } from '../UI/Modales/ModalPedidoVista';
import { useForm } from '../../../modelos-vista/hooks/useForm';

interface ModalFormularioPedidoProps {
  isOpen: boolean;
  onClose: () => void;
  onGuardar: (datos: PedidoFormData) => Promise<boolean>;
  procesarOCR: (archivo: File) => Promise<Partial<PedidoFormData> | null>;
  isSubmitting: boolean;
  procesandoOCR: boolean;
}

const formInicial: PedidoFormData = {
  proveedorId: '',
  fechaEntregaEsperada: '',
  fechaEntregaReal: '',
  detalles: [{ productoId: '', cantidad: '', precioUnitario: '' }]
};

export const ModalFormularioPedido = ({
  isOpen, onClose, onGuardar, procesarOCR, isSubmitting, procesandoOCR
}: ModalFormularioPedidoProps) => {

  const rules = {
    proveedorId: (val: any) => !val ? 'Proveedor requerido' : undefined,
    fechaEntregaEsperada: (val: any) => !val ? 'Fecha requerida' : undefined,
  };

  const { values: formData, setFormData, errors, setErrorsState, clearError, validate } = useForm<PedidoFormData>(formInicial, rules as any);

  const [modo, setModo] = useState<'ocr' | 'manual'>('ocr');
  const [erroresDetalle, setErroresDetalle] = useState<Record<number, Record<string, string>>>({});

  const mockProveedores = [{ id: 1, nombre: 'TechInsumos S.A.' }, { id: 2, nombre: 'Distribuidora Litoral' }];
  const mockProductos = [{ id: 1, nombre: 'Monitor 24"' }, { id: 2, nombre: 'Teclado Mecánico' }];

  const handleCambiarModo = (nuevoModo: 'ocr' | 'manual') => {
    setModo(nuevoModo);
    setErrorsState({});
    setErroresDetalle({});
  };

  const handleCargaArchivoOCR = async (archivo: File) => {
    const datosExtraidos = await procesarOCR(archivo);
    if (datosExtraidos) {
      setFormData({
        proveedorId: datosExtraidos.proveedorId || '',
        fechaEntregaEsperada: datosExtraidos.fechaEntregaEsperada || '',
        fechaEntregaReal: datosExtraidos.fechaEntregaReal || '',
        detalles: datosExtraidos.detalles?.length ? datosExtraidos.detalles : formInicial.detalles
      });
      setModo('manual');
    } else {
      setErrorsState({ general: 'No se pudo leer el documento. Por favor, realice la carga manual.' });
    }
  };

  const handleAgregarDetalle = () => {
    setFormData({ ...formData, detalles: [...formData.detalles, { productoId: '', cantidad: '', precioUnitario: '' }] });
  };

  const handleQuitarDetalle = (index: number) => {
    const nuevosDetalles = formData.detalles.filter((_, i) => i !== index);
    setFormData({ ...formData, detalles: nuevosDetalles.length ? nuevosDetalles : [{ productoId: '', cantidad: '', precioUnitario: '' }] });
  };

  const handleChangeCabecera = (campo: keyof PedidoFormData, valor: any) => {
    setFormData({ ...formData, [campo]: valor });
    clearError(campo);
  };

  const handleChangeDetalle = (index: number, campo: string, valor: any) => {
    const nuevosDetalles = [...formData.detalles];
    nuevosDetalles[index] = { ...nuevosDetalles[index], [campo]: valor };
    setFormData({ ...formData, detalles: nuevosDetalles });
    
    if (erroresDetalle[index]) {
       const nuevosErrores = { ...erroresDetalle };
       delete nuevosErrores[index][campo];
       setErroresDetalle(nuevosErrores);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isCabeceraValida = validate();
    
    const nuevosErroresDetalle: Record<number, Record<string, string>> = {};
    formData.detalles.forEach((det, i) => {
      const fila: Record<string, string> = {};
      if (!det.productoId) fila['productoId'] = 'Requerido';
      if (!det.cantidad || Number(det.cantidad) <= 0) fila['cantidad'] = 'Inválido';
      if (!det.precioUnitario || Number(det.precioUnitario) <= 0) fila['precioUnitario'] = 'Inválido';
      
      if (Object.keys(fila).length > 0) nuevosErroresDetalle[i] = fila;
    });

    setErroresDetalle(nuevosErroresDetalle);

    if (!isCabeceraValida || Object.keys(nuevosErroresDetalle).length > 0) return;
    
    const exito = await onGuardar(formData);
    if (exito) {
      setFormData(formInicial);
      setModo('ocr');
    } else {
      setErrorsState({ general: 'Error al registrar el pedido en la base de datos.' });
    }
  };

  return (
    <ModalPedidoVista
      isOpen={isOpen}
      modo={modo}
      formData={formData}
      errores={errors as ErroresFormPedido}
      erroresDetalle={erroresDetalle}
      isSubmitting={isSubmitting}
      procesandoOCR={procesandoOCR}
      proveedores={mockProveedores}
      productos={mockProductos}
      onClose={onClose}
      onCambiarModo={handleCambiarModo}
      onSubirArchivo={handleCargaArchivoOCR}
      onChangeCabecera={handleChangeCabecera}
      onChangeDetalle={handleChangeDetalle}
      onAgregarDetalle={handleAgregarDetalle}
      onQuitarDetalle={handleQuitarDetalle}
      onSubmit={handleSubmit}
    />
  );
};