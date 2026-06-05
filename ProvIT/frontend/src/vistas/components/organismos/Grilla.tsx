import { Tarjeta } from '../UI/Tarjetas/Tarjeta';

// 1. Definimos el contrato de datos que necesita la grilla
interface GrillaKpiProps {
  total: number;
  activos: number;
  inactivos: number;
}

// 2. Recibimos las props y las inyectamos en las tarjetas
export const GrillaKpi = ({ total, activos, inactivos }: GrillaKpiProps) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
    <Tarjeta titulo="Total proveedores" valor={total} claseBordeColor="border-gray-400" />
    <Tarjeta titulo="Proveedores activos" valor={activos} claseBordeColor="border-green-500" />
    <Tarjeta titulo="Proveedores inactivos" valor={inactivos} claseBordeColor="border-red-500" />
  </div>
);