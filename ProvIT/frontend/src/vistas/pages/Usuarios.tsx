import { Plus, Search, Filter } from 'lucide-react';
import { TarjetaUsuarios } from '../../vistas/components/UI/Tarjetas/TarjetaUsuarios';
import { TablaUsuarios } from '../../vistas/components/UI/Tablas/TablaUsuarios';
import { ModalRegistro } from '../components/UI/Modales/ModalRegistroVista'; 
import { ModalEdicionUsuario } from '../components/organismos/ModalEdicionUsuario';
import { useUsuarios } from '../../modelos-vista/hooks/useUsuarios';
import { useModal } from '../../modelos-vista/hooks/useModal'; 

export const Usuarios = () => {
  const { 
    usuarios, 
    metricas, 
    busquedaQuery,
    isLoading, 
    setBusquedaQuery,
    handleVistaUsuario,
    abrirModalEdicion,         // Abre el modal con los datos del usuario seleccionado
    isModalEdicionOpen,        // Estado de apertura del modal de edición
    usuarioEditando,           // Datos del usuario que se está editando
    cerrarModalEdicion,        // Cierra el modal de edición
    handleGuardarEdicion,      // Función que ejecuta el PUT al backend
    handleRestablecerContrasena,
    handleEliminarUsuario,
    isFetching,
    cargarDatos
  } = useUsuarios();

  const modalRegistro = useModal();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Gestión de Usuarios</h1>
          <p className="text-slate-500 mt-1">Administra accesos, roles y permisos de la plataforma.</p>
        </div>
      </header>

      {isLoading || !metricas ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white h-32 rounded-xl border border-gray-200 p-5 animate-pulse shadow-sm">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : (
        <TarjetaUsuarios datos={metricas} />
      )}

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-t-2xl border-t border-l border-r border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-96">
            {/* Animación sutil de la lupa cambiando a spinner */}
            {isFetching ? (
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-slate-300 border-t-blue-500 rounded-full animate-spin"></div>
            ) : (
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            )}
            <input 
              type="text" 
              placeholder="Buscar por nombre, correo..." 
              value={busquedaQuery}
              onChange={(e) => setBusquedaQuery(e.target.value)}
              className={`w-full pl-9 pr-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                isFetching ? 'bg-slate-100 border-slate-300' : 'bg-slate-50 border-slate-200 focus:bg-white'
              }`}
            />
          </div>
        <button className="w-full sm:w-auto px-4 py-2 text-sm text-slate-600 font-medium flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors bg-white shadow-sm">
          <Filter className="w-4 h-4" /> Filtros Avanzados
        </button>
        <div className="flex items-center gap-3">
          <button 
            onClick={modalRegistro.openModal}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm shadow-blue-200 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Nuevo Usuario
          </button>
        </div>
      </div>

      <div className="-mt-8">
        {isLoading ? (
          <div className="w-full h-64 flex flex-col items-center justify-center bg-white rounded-b-2xl border border-slate-200 shadow-sm">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <span className="text-slate-500 font-medium animate-pulse">Cargando datos de usuarios...</span>
          </div>
        ) : (
          <TablaUsuarios 
            users={usuarios} 
            onView={handleVistaUsuario}
            onEdit={abrirModalEdicion} 
            onResetPassword={handleRestablecerContrasena}
            onDelete={handleEliminarUsuario}
          />
        )}
      </div>

      {/* Modal de Registro */}
      <ModalRegistro 
        isOpen={modalRegistro.isOpen} 
        onClose={modalRegistro.closeModal}
        onSuccess={() => {
          modalRegistro.closeModal(); 
          if (cargarDatos) cargarDatos();
        }}
      />

      {/* Modal de Edición */}
      <ModalEdicionUsuario
        isOpen={isModalEdicionOpen}
        onClose={cerrarModalEdicion}
        usuarioEditando={usuarioEditando}
        onGuardar={handleGuardarEdicion}
      />

    </div>
  );
};