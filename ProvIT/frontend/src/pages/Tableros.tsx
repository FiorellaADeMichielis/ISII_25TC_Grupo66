import { Tarjeta } from "../components/UI/Tarjeta";

export const Tableros = () => {
  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Tableros de Control</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Tarjeta title="Total Proveedores">124</Tarjeta>
      <Tarjeta title="Proveedores activos">100</Tarjeta>
      <Tarjeta title="Proveedores inactivos">24</Tarjeta>
      <Tarjeta title="Insumos comprados este mes">????</Tarjeta>
      </div>
    </div>
    
  );
};