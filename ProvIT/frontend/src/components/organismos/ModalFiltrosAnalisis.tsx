// components/organisms/ModalFiltrosAnalisis.tsx
import { useState } from 'react';
import { ModalFiltrosVista } from '../UI/Modales/modalFiltroVista'; // La vista tonta que solo se preocupa por dibujar

// El contrato de datos sigue viviendo aquí
export interface FiltrosAnalisis {
  proveedorId: string;
  fechaDesde: string;
  fechaHasta: string;
}

interface ModalFiltrosAnalisisProps {
  onCerrar: () => void;
  onAplicar: (filtros: FiltrosAnalisis) => void;
}

export const ModalFiltrosAnalisis = ({ onCerrar, onAplicar }: ModalFiltrosAnalisisProps) => {
  // 1. Lógica de Estado
  const [filtrosLocales, setFiltrosLocales] = useState<FiltrosAnalisis>({
    proveedorId: '',
    fechaDesde: '',
    fechaHasta: ''
  });

  // 2. Controladores (Handlers)
  const handleAplicar = () => {
    onAplicar(filtrosLocales);
  };

  // 3. Orquestación - aquí podríamos agregar lógica adicional si fuera necesario (validaciones, formateo, etc.)
  return (
    <ModalFiltrosVista 
      filtros={filtrosLocales}
      onProveedorChange={(id) => setFiltrosLocales({ ...filtrosLocales, proveedorId: id })}
      onFechaDesdeChange={(fecha) => setFiltrosLocales({ ...filtrosLocales, fechaDesde: fecha })}
      onFechaHastaChange={(fecha) => setFiltrosLocales({ ...filtrosLocales, fechaHasta: fecha })}
      onCancelar={onCerrar}
      onAplicar={handleAplicar}
    />
  );
};