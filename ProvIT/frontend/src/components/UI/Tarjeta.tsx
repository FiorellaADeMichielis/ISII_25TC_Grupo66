export const Tarjeta = ({ title, children }: { title: string; children: React.ReactNode }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
        <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
        <p className="text-3xl font-bold text-slate-800 mt-2">{children}</p>
    </div>
  );
}