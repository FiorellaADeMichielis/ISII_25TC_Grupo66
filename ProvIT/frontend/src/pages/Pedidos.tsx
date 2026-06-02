// src/pages/Pedidos.tsx
import React, { useState, useEffect } from 'react';
import { pedidoService } from '../services/pedidoService';
import type { Pedido } from '../types/pedido.types';
import { FileText, AlertCircle, CheckCircle, Clock } from 'lucide-react';

export const Pedidos = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarPedidos = async () => {
      try {
        setLoading(true);
        const data = await pedidoService.obtenerTodos();
        setPedidos(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    cargarPedidos();
  }, []);

  // Helper visual para los estados de la factura
  const renderEstadoFactura = (estado: number) => {
    switch (estado) {
      case 1:
        return <span className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full"><CheckCircle size={12} /> Validada</span>;
      case 2:
        return <span className="flex items-center gap-1 text-xs font-medium text-red-700 bg-red-100 px-2 py-1 rounded-full"><AlertCircle size={12} /> Rechazada</span>;
      default:
        return <span className="flex items-center gap-1 text-xs font-medium text-yellow-700 bg-yellow-100 px-2 py-1 rounded-full"><Clock size={12} /> Pendiente</span>;
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Pedidos</h2>
        <p className="text-slate-600">Aquí podrás gestionar los pedidos de tus proveedores y sus facturas asociadas.</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-sm text-slate-600 tracking-wider">
                  <th className="p-4 font-semibold">Nº Pedido</th>
                  <th className="p-4 font-semibold">Proveedor</th>
                  <th className="p-4 font-semibold">Fecha Emisión</th>
                  <th className="p-4 font-semibold">Estado</th>
                  <th className="p-4 font-semibold">Facturas Asociadas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pedidos.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">
                      No hay pedidos registrados en el sistema.
                    </td>
                  </tr>
                ) : (
                  pedidos.map((pedido) => (
                    <tr key={pedido.id_pedido} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-medium text-slate-800">#{pedido.id_pedido}</td>
                      <td className="p-4 text-slate-600">{pedido.proveedor_nombre}</td>
                      <td className="p-4 text-slate-600">{pedido.fecha_emision}</td>
                      <td className="p-4">
                        <span className="text-xs font-medium bg-blue-50 text-blue-700 px-2 py-1 rounded-full border border-blue-100">
                          {pedido.estado_pedido}
                        </span>
                      </td>
                      <td className="p-4">
                        {pedido.facturas && pedido.facturas.length > 0 ? (
                          <div className="flex flex-col gap-2">
                            {pedido.facturas.map((factura) => (
                              <div key={factura.id_factura} className="flex items-center justify-between bg-slate-50 p-2 rounded border border-slate-100 text-sm">
                                <div className="flex items-center gap-2">
                                  <FileText size={14} className="text-slate-400" />
                                  <span className="font-medium text-slate-700">F-{factura.nro_factura}</span>
                                  <span className="text-slate-500">${factura.monto_total}</span>
                                </div>
                                {renderEstadoFactura(factura.estado_validacion)}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400 italic">Sin facturas</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};