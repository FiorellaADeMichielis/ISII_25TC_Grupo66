import React, { useState, useMemo } from 'react';
import type { DatosFiltrosUI } from '../../../modelos/types/analisis.types';
import { ModalFiltrosVista } from '../UI/Modales/modalFiltroVista';

export interface ModalFiltrosAnalisisProps {
  datosFiltrosUI: DatosFiltrosUI;
  onAnalizar: (filtrosSeleccionados: any) => void;
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
  
  // Las fechas inician vacías para traer todo el historial por defecto
  const [fechaInicio, setFechaInicio] = useState<string>('');
  const [fechaFin, setFechaFin] = useState<string>('');

  // 2. LÓGICA DEL SWITCH
  const handleCambiarTipo = (nuevoTipo: 'proveedor' | 'producto') => {
    setTipoBusqueda(nuevoTipo);
    // Limpiamos el combo desplegable al cambiar entre producto/proveedor
    setElementoSeleccionado(''); 
  };

  // 3. ORDENAMIENTO ALFABÉTICO (Se recalcula automáticamente si cambian los datos o el switch)
  const opcionesDropdown = useMemo(() => {
    const listaOriginal = tipoBusqueda === 'proveedor' 
      ? datosFiltrosUI.proveedores 
      : datosFiltrosUI.productos;

    return [...listaOriginal].sort((a, b) => a.label.localeCompare(b.label));
  }, [tipoBusqueda, datosFiltrosUI]);

  // 4. ARMADO DEL ENVÍO AL BACKEND
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalizar({
      id: Number(elementoSeleccionado),
      tipo: tipoBusqueda, 
      fecha_inicio: fechaInicio || undefined,
      fecha_fin: fechaFin || undefined,
    });
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