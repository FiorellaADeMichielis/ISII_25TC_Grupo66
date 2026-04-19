export const Tableros = () => {
  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Tableros de Control</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tarjetas de ejemplo */}
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <h3 className="text-slate-500 text-sm font-medium">Total Proveedores</h3>
          <p className="text-3xl font-bold text-slate-800 mt-2">124</p>
        </div>
      </div>
    </div>
  );
};