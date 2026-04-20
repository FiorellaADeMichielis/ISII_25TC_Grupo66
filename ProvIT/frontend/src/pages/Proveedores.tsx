import { useState } from "react";
import { Plus, Edit2, Trash2, Building2 } from "lucide-react";
import { useProveedores } from "../hooks/useProveedores";
import { useAuthContext } from "../context/AuthContext";
import { ModalFormularioProveedor } from "../components/proveedores/modalProveedores";
import { ROLES } from "../types/layout.types";
import type { Proveedor } from "../types/proveedor.types";

export const Proveedores = () => {
  const { proveedores, loading, error, agregarProveedor, editarProveedor, eliminarProveedor } = useProveedores();
  const { user } = useAuthContext();

  const [isModalOpen,        setIsModalOpen]        = useState(false);
  const [proveedorEditando,  setProveedorEditando]  = useState<Proveedor | null>(null);

  const rolActual = user?.rol ?? ROLES.OPERADOR;
  const puedeEliminar = rolActual === ROLES.ADMINISTRADOR || rolActual === ROLES.GERENTE;

  const handleGuardarDesdeModal = async (datos: Omit<Proveedor, "id">): Promise<boolean> => {
    if (proveedorEditando) {
      return await editarProveedor(proveedorEditando.id, datos);
    }
    return await agregarProveedor(datos);
  };

  const handleEliminar = async (id: number): Promise<void> => {
    if (!puedeEliminar) {
      alert("No tenés permisos para eliminar proveedores.");
      return;
    }
    if (window.confirm("¿Estás seguro de que deseás eliminar este proveedor?")) {
      await eliminarProveedor(id);
    }
  };

  return (
    <div className="animate-fade-in space-y-6">

      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Building2 size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Proveedores</h1>
            <p className="text-sm text-slate-500">Gestioná el directorio y la información de contacto</p>
          </div>
        </div>
        <button
          onClick={() => { setProveedorEditando(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
        >
          <Plus size={20} />
          <span>Nuevo Proveedor</span>
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-100 font-medium">
          {error}
        </div>
      )}

      {/* Tabla */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
              <tr>
                <th className="px-6 py-4">Nombre</th>
                <th className="px-6 py-4">CUIT</th>
                <th className="px-6 py-4">Contacto</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading && proveedores.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    Cargando proveedores...
                  </td>
                </tr>
              )}
              {!loading && proveedores.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    No hay proveedores registrados.
                  </td>
                </tr>
              )}
              {proveedores.map((prov) => (
                <tr key={prov.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{prov.nombre}</td>
                  <td className="px-6 py-4 text-slate-600">{prov.cuit}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-slate-900">{prov.email}</span>
                      <span className="text-slate-500 text-xs">{prov.telefono}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      prov.estado === "Activo"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-slate-100 text-slate-700 border-slate-200"
                    }`}>
                      {prov.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => { setProveedorEditando(prov); setIsModalOpen(true); }}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleEliminar(prov.id)}
                      disabled={!puedeEliminar}
                      className={`p-2 rounded-lg transition-colors ${
                        puedeEliminar
                          ? "text-slate-400 hover:text-red-600 hover:bg-red-50"
                          : "text-slate-300 cursor-not-allowed"
                      }`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <ModalFormularioProveedor
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        proveedorEditando={proveedorEditando}
        onGuardar={handleGuardarDesdeModal}
        rolUsuario={rolActual}
      />

    </div>
  );
};