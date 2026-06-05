import React, { useRef } from 'react';
import { X, UploadCloud, Plus, Trash2, FileText, Keyboard, AlertCircle } from 'lucide-react';
import type { PedidoFormData, ErroresFormPedido } from '../../../../modelos/types/pedido.types';

interface ModalPedidoVistaProps {
  isOpen: boolean;
  modo: 'ocr' | 'manual';
  formData: PedidoFormData;
  errores: ErroresFormPedido;
  isSubmitting: boolean;
  procesandoOCR: boolean;
  proveedores: any[];
  productos: any[];
  onClose: () => void;
  onCambiarModo: (modo: 'ocr' | 'manual') => void;
  onSubirArchivo: (archivo: File) => void;
  onChangeCabecera: (campo: string, valor: any) => void;
  onChangeDetalle: (index: number, campo: keyof PedidoFormData['detalles'][0], valor: any) => void;
  onAgregarDetalle: () => void;
  onQuitarDetalle: (index: number) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ModalPedidoVista = ({
  isOpen, modo, formData, errores, isSubmitting, procesandoOCR, proveedores, productos,
  onClose, onCambiarModo, onSubirArchivo, onChangeCabecera, onChangeDetalle, onAgregarDetalle, onQuitarDetalle, onSubmit
}: ModalPedidoVistaProps) => {

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onSubirArchivo(e.target.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Cabecera */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Registrar Nuevo Pedido</h2>
            <p className="text-slate-500 text-sm mt-1">Ingresá los datos de la orden de compra</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Pestañas (Tabs) */}
        <div className="flex border-b border-slate-200 px-6 shrink-0 pt-4">
          <button
            onClick={() => onCambiarModo('ocr')}
            className={`flex items-center gap-2 px-6 py-3 border-b-2 font-medium transition-colors ${modo === 'ocr' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            <FileText size={18} /> Carga Inteligente (OCR)
          </button>
          <button
            onClick={() => onCambiarModo('manual')}
            className={`flex items-center gap-2 px-6 py-3 border-b-2 font-medium transition-colors ${modo === 'manual' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            <Keyboard size={18} /> Carga Manual
          </button>
        </div>

        {/* Contenido Scrollable */}
        <div className="overflow-y-auto p-6 bg-white">
          
          {errores.general && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 font-medium text-sm flex items-center gap-2">
              <AlertCircle size={18} /> {errores.general}
            </div>
          )}

          {/* VISTA 1: OCR AREA */}
          {modo === 'ocr' && (
            <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 transition-colors hover:bg-blue-50 hover:border-blue-300">
              {procesandoOCR ? (
                <div className="flex flex-col items-center text-blue-600">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                  <p className="font-medium">Leyendo documento con EasyOCR...</p>
                  <p className="text-sm text-slate-500 mt-1">Esto puede demorar unos segundos</p>
                </div>
              ) : (
                <>
                  <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                    <UploadCloud size={48} className="text-blue-500" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-700 mb-2">Subí la factura del proveedor</h3>
                  <p className="text-slate-500 text-center max-w-sm mb-6">
                    El sistema extraerá automáticamente el proveedor, las fechas y los productos para autocompletar el formulario.
                  </p>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,image/*" />
                  <button onClick={() => fileInputRef.current?.click()} className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-sm transition-colors">
                    Seleccionar Archivo
                  </button>
                </>
              )}
            </div>
          )}

          {/* VISTA 2: FORMULARIO MANUAL */}
          {modo === 'manual' && (
            <form id="form-pedido" onSubmit={onSubmit} className="space-y-6">
              
              {/* Sección Cabecera */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="sm:col-span-1">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Proveedor *</label>
                  <select 
                    className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                    value={formData.proveedorId} onChange={(e) => onChangeCabecera('proveedorId', Number(e.target.value))} required
                  >
                    <option value="">Seleccione...</option>
                    {proveedores.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Entrega Esperada *</label>
                  <input 
                    type="date" required
                    className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                    value={formData.fechaEntregaEsperada} onChange={(e) => onChangeCabecera('fechaEntregaEsperada', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Entrega Real <span className="text-slate-400 font-normal">(Opcional)</span>
                  </label>
                  <input 
                    type="date" 
                    className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                    value={formData.fechaEntregaReal || ''} onChange={(e) => onChangeCabecera('fechaEntregaReal', e.target.value)}
                  />
                </div>
              </div>

              {/* Sección Detalles Dinámicos */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-800 border-b-2 border-blue-600 pb-1 inline-block">Detalle de Productos</h3>
                  <button type="button" onClick={onAgregarDetalle} className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                    <Plus size={16} /> Agregar Fila
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.detalles.map((detalle, index) => (
                    <div key={index} className="flex flex-col sm:flex-row gap-3 items-end p-3 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-blue-300 transition-colors">
                      <div className="w-full sm:flex-1">
                        <label className="block text-xs font-medium text-slate-500 mb-1">Producto</label>
                        <select 
                          required value={detalle.productoId} onChange={(e) => onChangeDetalle(index, 'productoId', Number(e.target.value))}
                          className="w-full p-2 border border-slate-300 rounded text-sm outline-none focus:border-blue-500"
                        >
                          <option value="">Seleccionar...</option>
                          {productos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                        </select>
                      </div>
                      <div className="w-full sm:w-24">
                        <label className="block text-xs font-medium text-slate-500 mb-1">Cant.</label>
                        <input 
                          type="number" required min="1" value={detalle.cantidad} onChange={(e) => onChangeDetalle(index, 'cantidad', Number(e.target.value))}
                          className="w-full p-2 border border-slate-300 rounded text-sm outline-none focus:border-blue-500"
                        />
                      </div>
                      <div className="w-full sm:w-32">
                        <label className="block text-xs font-medium text-slate-500 mb-1">Precio Unit. ($)</label>
                        <input 
                          type="number" required min="0" step="0.01" value={detalle.precioUnitario} onChange={(e) => onChangeDetalle(index, 'precioUnitario', Number(e.target.value))}
                          className="w-full p-2 border border-slate-300 rounded text-sm outline-none focus:border-blue-500"
                        />
                      </div>
                      <button 
                        type="button" onClick={() => onQuitarDetalle(index)}
                        className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Eliminar fila"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Botonera Fija Abajo */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 shrink-0 flex justify-end gap-3">
          <button type="button" onClick={onClose} disabled={isSubmitting || procesandoOCR} className="px-5 py-2.5 text-slate-600 hover:bg-slate-200 font-medium rounded-lg transition-colors">
            Cancelar
          </button>
          
          {modo === 'manual' && (
            <button type="submit" form="form-pedido" disabled={isSubmitting} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center gap-2">
              {isSubmitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Guardar Pedido'}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};