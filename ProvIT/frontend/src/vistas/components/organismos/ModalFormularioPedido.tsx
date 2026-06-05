import React, { useState } from 'react';
import type { PedidoFormData, ErroresFormPedido } from '../../../modelos/types/pedido.types';
import { ModalPedidoVista } from '../UI/Modales/ModalPedidoVista';

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

  const [modo, setModo] = useState<'ocr' | 'manual'>('ocr');
  const [formData, setFormData] = useState<PedidoFormData>(formInicial);
  const [errores, setErrores] = useState<ErroresFormPedido>({});

  // TODO: Conectar a tu useProveedores/useProductos real
  const mockProveedores = [{ id: 1, nombre: 'TechInsumos S.A.' }, { id: 2, nombre: 'Distribuidora Litoral' }];
  const mockProductos = [{ id: 1, nombre: 'Monitor 24"' }, { id: 2, nombre: 'Teclado Mecánico' }];

  const handleCambiarModo = (nuevoModo: 'ocr' | 'manual') => {
    setModo(nuevoModo);
    setErrores({});
  };

  const handleCargaArchivoOCR = async (archivo: File) => {
    const datosExtraidos = await procesarOCR(archivo);
    if (datosExtraidos) {
      setFormData({
        ...formInicial,
        ...datosExtraidos,
        detalles: datosExtraidos.detalles?.length ? datosExtraidos.detalles : formInicial.detalles
      });
      setModo('manual'); 
    } else {
      setErrores({ general: 'No se pudo leer el documento. Por favor, realice la carga manual.' });
    }
  };

  const handleAgregarDetalle = () => {
    setFormData(prev => ({
      ...prev,
      detalles: [...prev.detalles, { productoId: '', cantidad: '', precioUnitario: '' }]
    }));
  };

  const handleQuitarDetalle = (index: number) => {
    setFormData(prev => {
      const nuevosDetalles = prev.detalles.filter((_, i) => i !== index);
      return { ...prev, detalles: nuevosDetalles.length ? nuevosDetalles : [{ productoId: '', cantidad: '', precioUnitario: '' }] };
    });
  };

  const handleChangeDetalle = (index: number, campo: keyof PedidoFormData['detalles'][0], valor: string | number) => {
    setFormData(prev => {
      const nuevosDetalles = [...prev.detalles];
      nuevosDetalles[index] = { ...nuevosDetalles[index], [campo]: valor };
      return { ...prev, detalles: nuevosDetalles };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.proveedorId || !formData.fechaEntregaEsperada) {
      setErrores({ general: 'Complete los campos obligatorios de cabecera.' });
      return;
    }
    
    const exito = await onGuardar(formData);
    if (exito) {
      setFormData(formInicial);
      setModo('ocr');
    } else {
      setErrores({ general: 'Error al registrar el pedido en la base de datos.' });
    }
  };

  return (
    <ModalPedidoVista
      isOpen={isOpen}
      modo={modo}
      formData={formData}
      errores={errores}
      isSubmitting={isSubmitting}
      procesandoOCR={procesandoOCR}
      proveedores={mockProveedores}
      productos={mockProductos}
      onClose={onClose}
      onCambiarModo={handleCambiarModo}
      onSubirArchivo={handleCargaArchivoOCR}
      onChangeCabecera={(campo, valor) => setFormData(prev => ({ ...prev, [campo]: valor }))}
      onChangeDetalle={handleChangeDetalle}
      onAgregarDetalle={handleAgregarDetalle}
      onQuitarDetalle={handleQuitarDetalle}
      onSubmit={handleSubmit}
    />
  );
};