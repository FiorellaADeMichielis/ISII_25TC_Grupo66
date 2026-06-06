import React, { useState } from 'react';
import type { PedidoFormData, ErroresFormPedido } from '../../../modelos/types/pedido.types';
import { ModalPedidoVista } from '../UI/Modales/ModalPedidoVista';
import { useForm } from '../../../modelos-vista/hooks/useForm';
import { useProveedores } from '../../../modelos-vista/hooks/useProveedores';
import { useProductos } from '../../../modelos-vista/hooks/useProducto';

export const ModalFormularioPedido = ({ isOpen, onClose, onGuardar, procesarOCR, isSubmitting, procesandoOCR }: any) => {

  const { proveedores, loading: loadingProveedores } = useProveedores();
  const { productos, loading: loadingProductos } = useProductos();

  const rules = {
    proveedorId: (val: any) => !val ? 'Proveedor requerido' : undefined,
    fechaEntregaEsperada: (val: any) => !val ? 'Fecha requerida' : undefined,
  };

  const { values: formData, setFormData, errors, setErrorsState, clearError, validate } = useForm<PedidoFormData>({
    proveedorId: '',
    fechaEntregaEsperada: '',
    fechaEntregaReal: '',
    detalles: [{ productoId: '', cantidad: '', precioUnitario: '' }]
  }, rules as any);

  const [modo, setModo] = useState<'ocr' | 'manual'>('ocr');
  const [erroresDetalle, setErroresDetalle] = useState<Record<number, Record<string, string>>>({});

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
        detalles: datosExtraidos.detalles?.length ? datosExtraidos.detalles : formData.detalles
      });
      setModo('manual');
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
      setFormData({ proveedorId: '', fechaEntregaEsperada: '', fechaEntregaReal: '', detalles: [{ productoId: '', cantidad: '', precioUnitario: '' }] });
      setModo('ocr');
    } else {
      setErrorsState({ general: 'Error al registrar el pedido.' });
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
      proveedores={proveedores} 
      productos={productos}
      isLoadingProveedores={loadingProveedores}
      isLoadingProductos={loadingProductos}
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