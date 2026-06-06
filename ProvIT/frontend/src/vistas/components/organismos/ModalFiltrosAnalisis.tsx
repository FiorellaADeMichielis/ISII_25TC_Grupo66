import { useState, useMemo } from 'react';
import type { DatosFiltrosUI, FiltrosAnalisisProveedor } from '../../../modelos/types/analisis.types';
import { ModalFiltrosVista } from '../UI/Modales/modalFiltroVista';

export interface ModalFiltrosAnalisisProps {
  datosFiltrosUI: DatosFiltrosUI;
  onAnalizar: (filtrosSeleccionados: FiltrosAnalisisProveedor) => void;
  isLoading: boolean;
  onClose: () => void;
}

// Interfaz interna para errores
interface FormErrors {
  elemento?: string;
  fechaInicio?: string;
  fechaFin?: string;
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
  
  // Estado para errores
  const [errors, setErrors] = useState<FormErrors>({});

  // 2. VALIDACIÓN
  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!elementoSeleccionado) newErrors.elemento = "Seleccione una opción.";
    if (!fechaInicio) newErrors.fechaInicio = "Campo requerido.";
    if (!fechaFin) newErrors.fechaFin = "Campo requerido.";
    
    // Validación lógica de fechas
    if (fechaInicio && fechaFin && new Date(fechaFin) < new Date(fechaInicio)) {
      newErrors.fechaFin = "Debe ser posterior al inicio.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCambiarTipo = (nuevoTipo: 'proveedor' | 'producto') => {
    setTipoBusqueda(nuevoTipo);
    setElementoSeleccionado(''); 
    setErrors({}); // Limpiar errores al cambiar
  };

  const opcionesDropdown = useMemo(() => {
    const listaOriginal = tipoBusqueda === 'proveedor' 
      ? datosFiltrosUI.proveedores 
      : datosFiltrosUI.productos;
    return [...listaOriginal].sort((a, b) => a.label.localeCompare(b.label));
  }, [tipoBusqueda, datosFiltrosUI]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      const payload: any = {
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
        [tipoBusqueda === 'proveedor' ? 'proveedor_id' : 'producto_id']: Number(elementoSeleccionado)
      };
      onAnalizar(payload);
    }
  };

  return (
    <ModalFiltrosVista 
      tipoBusqueda={tipoBusqueda}
      opcionesDropdown={opcionesDropdown}
      elementoSeleccionado={elementoSeleccionado}
      fechaInicio={fechaInicio}
      fechaFin={fechaFin}
      isLoading={isLoading}
      // PASAMOS LOS ERRORES AL HIJO
      errors={errors} 
      onCambiarTipo={handleCambiarTipo}
      onChangeElemento={(val) => {
        setElementoSeleccionado(val);
        if (errors.elemento) setErrors(prev => ({...prev, elemento: undefined}));
      }}
      onChangeFechaInicio={(val) => {
        setFechaInicio(val);
        if (errors.fechaInicio) setErrors(prev => ({...prev, fechaInicio: undefined}));
      }}
      onChangeFechaFin={(val) => {
        setFechaFin(val);
        if (errors.fechaFin) setErrors(prev => ({...prev, fechaFin: undefined}));
      }}
      onSubmit={handleSubmit}
      onClose={onClose}
    />
  );
};