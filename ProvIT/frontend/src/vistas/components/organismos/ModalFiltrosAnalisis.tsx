import React, { useState, useMemo } from 'react';
import type { DatosFiltrosUI, FiltrosAnalisisProveedor } from '../../../modelos/types/analisis.types';
import { ModalFiltrosVista } from '../UI/Modales/modalFiltroVista';

export interface ModalFiltrosAnalisisProps {
  datosFiltrosUI: DatosFiltrosUI;
  onAnalizar: (filtrosSeleccionados: FiltrosAnalisisProveedor) => void;
  isLoading: boolean;
  onClose: () => void;
}

export const ModalFiltrosAnalisis = ({ 
  datosFiltrosUI,
  onAnalizar, 
  isLoading,
  onClose
}: ModalFiltrosAnalisisProps) => {

  // 1. ESTADOS
  const [tipoBusqueda, setTipoBusqueda] = useState<'proveedor' | 'producto'>('proveedor');
  const [elementoSeleccionado, setElementoSeleccionado] = useState<number | ''>('');
  const [fechaInicio, setFechaInicio] = useState<string>('');
  const [fechaFin, setFechaFin] = useState<string>('');

  // 2. LÓGICA DEL SWITCH
  const handleCambiarTipo = (nuevoTipo: 'proveedor' | 'producto') => {
    setTipoBusqueda(nuevoTipo);
    setElementoSeleccionado(''); 
  };

  // 3. ORDENAMIENTO ALFABÉTICO
  const opcionesDropdown = useMemo(() => {
    const listaOriginal = tipoBusqueda === 'proveedor' 
      ? datosFiltrosUI.proveedores 
      : datosFiltrosUI.productos;

    return [...listaOriginal].sort((a, b) => a.label.localeCompare(b.label));
  }, [tipoBusqueda, datosFiltrosUI]);

  // 4. ARMADO DEL ENVÍO AL BACKEND
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  // El payload DEBE coincidir con el nombre de campo que espera el backend
  const payload: any = {
    fecha_inicio: fechaInicio,
    fecha_fin: fechaFin,
    // Aquí definimos la clave exacta:
    [tipoBusqueda === 'proveedor' ? 'proveedor_id' : 'producto_id']: Number(elementoSeleccionado)
  };

  console.log("Lo que se envía al servicio:", payload);
  onAnalizar(payload);
};

  return (
    <ModalFiltrosVista 
      tipoBusqueda={tipoBusqueda}
      opcionesDropdown={opcionesDropdown}
      elementoSeleccionado={elementoSeleccionado}
      fechaInicio={fechaInicio}
      fechaFin={fechaFin}
      isLoading={isLoading}
      onCambiarTipo={handleCambiarTipo}
      onChangeElemento={setElementoSeleccionado}
      onChangeFechaInicio={setFechaInicio}
      onChangeFechaFin={setFechaFin}
      onSubmit={handleSubmit}
      onClose={onClose}
    />
  );
};