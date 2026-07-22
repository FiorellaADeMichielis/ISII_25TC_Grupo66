import React from 'react';

// 1. Interfaz genérica para la configuración de cada columna
export interface ColumnDef<T> {
  header: string;
  accessorKey?: keyof T; // Para pintar datos planos directamente (ej. "nombre")
  render?: (item: T) => React.ReactNode; // Para celdas complejas (ej. avatares, badges, acciones)
  width?: string; // Para controlar anchos específicos desde el padre
}

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  emptyMessage?: string;
}

// 2. Componente Funcional Genérico <T>
export function DataTable<T>({ 
  data, 
  columns, 
  emptyMessage = "No se encontraron registros." 
}: DataTableProps<T>) {
  
  return (
    <div className="w-full overflow-x-auto bg-white rounded-2xl border border-slate-200 shadow-sm">
      <table className="w-full text-left text-sm text-slate-600">
        
        <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase text-xs tracking-wider">
          <tr>
            {columns.map((col, index) => (
              <th key={index} className={`px-6 py-4 ${col.width || ''}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        
        <tbody className="divide-y divide-slate-100">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-slate-50/80 transition-colors group">
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="px-6 py-4">
                    {/*Si hay un render personalizado, lo usa. Si no, imprime el dato plano */}
                    {col.render 
                      ? col.render(item) 
                      : (item[col.accessorKey as keyof T] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
        
      </table>
    </div>
  );
}