import { usePedidos } from '../../modelos-vista/hooks/usePedido';
import { FileText, AlertCircle, CheckCircle, Clock, Plus, ShoppingCart } from 'lucide-react';
import { ModalFormularioPedido } from '../components/organismos/ModalFormularioPedido';

export const Pedidos = () => {
  // ==========================================================================
  // 1. AUTENTICACIÓN Y ROLES
  // ==========================================================================
  const rolActual = 1; 

  // ==========================================================================
  // 2. CONEXIÓN CON EL VIEWMODEL (Cerebro)
  // ==========================================================================
  // ¡ACÁ ESTABA EL ERROR! Faltaba extraer las funciones y estados del modal
  const { 
    pedidos, 
    loading, 
    error, 
    abrirModalNuevo,
    puedeCrearPedido,
    isModalOpen,
    isSubmitting,
    procesandoOCR,
    cerrarModal,
    handleCrearPedido,
    procesarFacturaConIA
  } = usePedidos(rolActual);

  // ==========================================================================
  // 3. HELPERS VISUALES
  // ==========================================================================
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

  // ==========================================================================
  // 4. RENDERIZADO DE LA VISTA
  // ==========================================================================
  return (
    <div className="p-6 bg-slate-50 min-h-screen animate-fade-in space-y-6">
      
      {/* --- ENCABEZADO --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <ShoppingCart size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Registro de Pedidos</h1>
            <p className="text-sm text-slate-500">Visualización y control de órdenes de compra y facturas asociadas</p>
          </div>
        </div>
        
        {/* --- BOTÓN CONDICIONAL (RBAC) --- */}
        {puedeCrearPedido && (
          <button
            onClick={abrirModalNuevo}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
          >
            <Plus size={20} />
            <span>Registrar Pedido</span>
          </button>
        )}
      </div>

      {/* --- MENSAJE DE ERROR --- */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200 font-medium">
          {error}
        </div>
      )}

      {/* --- ÁREA DE LA TABLA --- */}
      {loading ? (
        <div className="flex justify-center items-center p-12 bg-white rounded-xl border border-slate-200 min-h-[300px]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
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
                    <td colSpan={5} className="p-12 text-center text-slate-500">
                      <ShoppingCart size={40} className="mx-auto text-slate-300 mb-3" />
                      <p className="font-medium text-slate-600">No hay pedidos registrados en el sistema.</p>
                      <p className="text-sm mt-1">Los pedidos registrados aparecerán aquí.</p>
                    </td>
                  </tr>
                ) : (
                  pedidos.map((pedido) => (
                    <tr key={pedido.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-medium text-slate-800">#{pedido.id}</td>
                      <td className="p-4 text-slate-600 font-medium">{pedido.proveedorNombre}</td>
                      <td className="p-4 text-slate-600">{pedido.fechaEmision}</td>
                      <td className="p-4">
                        <span className="text-xs font-medium bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-100">
                          {pedido.estado}
                        </span>
                      </td>
                      <td className="p-4">
                        {pedido.facturas && pedido.facturas.length > 0 ? (
                          <div className="flex flex-col gap-2">
                            {/* ¡CORRECCIÓN! Usamos camelCase: idFactura, nroFactura, montoTotal */}
                            {pedido.facturas.map((factura) => (
                              <div key={factura.idFactura} className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-slate-200 text-sm shadow-sm">
                                <div className="flex items-center gap-2">
                                  <FileText size={16} className="text-slate-400" />
                                  <span className="font-bold text-slate-700">F-{factura.nroFactura}</span>
                                  <span className="text-slate-500 font-medium">${factura.montoTotal}</span>
                                </div>
                                {renderEstadoFactura(factura.estadoValidacion)}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400 italic bg-slate-50 px-3 py-1 rounded border border-slate-100">
                            Sin facturas asociadas
                          </span>
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

      {/* --- MODAL PARA REGISTRAR PEDIDOS --- */}
      <ModalFormularioPedido
        isOpen={isModalOpen}
        onClose={cerrarModal}
        onGuardar={handleCrearPedido}
        procesarOCR={procesarFacturaConIA}
        isSubmitting={isSubmitting}
        procesandoOCR={procesandoOCR}
      />
    </div>
  );
};