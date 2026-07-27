import { useState } from 'react';
import { Plus, Search, Filter, X } from 'lucide-react';
import { TarjetaUsuarios } from '../../vistas/components/UI/Tarjetas/TarjetaUsuarios';
import { TablaUsuarios } from '../../vistas/components/UI/Tablas/TablaUsuarios';
import { ModalRegistro } from '../components/UI/Modales/ModalRegistroVista'; 
import { ModalEdicionUsuario } from '../components/organismos/ModalEdicionUsuario';
import { useUsuarios } from '../../modelos-vista/hooks/useUsuarios';
import { useModal } from '../../modelos-vista/hooks/useModal'; 
import { ModalDetallesUsuario } from '../components/organismos/ModalDetallesUsuario';
import { ModalEliminarUsuario } from '../components/organismos/ModalEliminarUsuario';

export const Usuarios = () => {
  // Estado local para mostrar u ocultar el panel de filtros
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const { 
    usuarios, 
    metricas, 
    busquedaQuery,
    isLoading, 
    isFetching,
    setBusquedaQuery,
    filtrosAvanzados,          
    setFiltrosAvanzados,       
    handleVistaUsuario,
    abrirModalEdicion,         
    isModalEdicionOpen,        
    usuarioEditando,           
    cerrarModalEdicion,        
    handleGuardarEdicion,      
    handleRestablecerContrasena,
    handleEliminarUsuario,
    cargarDatos,
    isModalDetallesOpen,       
    usuarioViendo,     
    cerrarModalDetalles,     
    isModalEliminarOpen,
    usuarioEliminando,
    cerrarModalEliminar,
    confirmarEliminacion
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

      {/* CONTENEDOR PRINCIPAL DE BÚSQUEDA, BOTONES Y FILTROS */}
      <div className="bg-white rounded-t-2xl border-t border-l border-r border-slate-200 shadow-sm overflow-hidden z-10 relative relative">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4">
          
          {/* BUSCADOR */}
          <div className="relative w-full sm:w-96">
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

          {/* BOTONES DE ACCIÓN */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button 
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className={`flex-1 sm:flex-none px-4 py-2 text-sm font-medium flex items-center justify-center gap-2 border rounded-lg transition-colors shadow-sm ${
                mostrarFiltros 
                  ? 'bg-blue-50 border-blue-200 text-blue-700' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Filter className="w-4 h-4" /> 
              Filtros Avanzados
              
              {/* Indicador visual si hay filtros aplicados */}
              {(filtrosAvanzados.estado || filtrosAvanzados.rol_id) && (
                <span className="flex h-2 w-2 relative ml-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400"></span>
                </span>
              )}
            </button>
            
            <button 
              onClick={modalRegistro.openModal}
              className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 font-medium shadow-sm shadow-blue-200 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Nuevo Usuario
            </button>
          </div>
        </div>

        {/* PANEL DESPLEGABLE DE FILTROS */}
        {mostrarFiltros && (
          <div className="bg-slate-50 p-4 border-t border-slate-200 flex flex-col sm:flex-row gap-6 animate-in slide-in-from-top-2 duration-200">
            
            <div className="flex flex-col gap-1.5 w-full sm:w-1/4">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Estado de Cuenta</label>
              <select 
                value={filtrosAvanzados.estado}
                onChange={(e) => setFiltrosAvanzados({ ...filtrosAvanzados, estado: e.target.value })}
                className="w-full p-2 rounded-lg border border-slate-200 text-sm bg-white text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">Todos los estados</option>
                <option value="1">Activos</option>
                <option value="0">Inactivos</option>
              </select>
            </div>
            
            <div className="flex flex-col gap-1.5 w-full sm:w-1/4">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Rol en el Sistema</label>
              <select 
                value={filtrosAvanzados.rol_id}
                onChange={(e) => setFiltrosAvanzados({ ...filtrosAvanzados, rol_id: e.target.value })}
                className="w-full p-2 rounded-lg border border-slate-200 text-sm bg-white text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">Todos los roles</option>
                <option value="2">Administrador</option>
                <option value="1">Operador</option>
              </select>
            </div>

            <div className="flex items-end pb-1">
              {(filtrosAvanzados.estado || filtrosAvanzados.rol_id) && (
                <button 
                  onClick={() => setFiltrosAvanzados({ estado: '', rol_id: '' })}
                  className="text-sm flex items-center gap-1 text-slate-500 font-medium hover:text-red-600 transition-colors"
                >
                  <X className="w-4 h-4" /> Limpiar filtros
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* TABLA DE USUARIOS */}
      <div className="-mt-8 relative z-0">
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

      {/* Modales */}
      <ModalRegistro 
        isOpen={modalRegistro.isOpen} 
        onClose={modalRegistro.closeModal}
        onSuccess={() => {
          modalRegistro.closeModal(); 
          if (cargarDatos) cargarDatos();
        }}
      />

      <ModalEdicionUsuario
        isOpen={isModalEdicionOpen}
        onClose={cerrarModalEdicion}
        usuarioEditando={usuarioEditando}
        onGuardar={handleGuardarEdicion}
      />
      <ModalDetallesUsuario
        isOpen={isModalDetallesOpen}
        onClose={cerrarModalDetalles}
        usuario={usuarioViendo}
      />
      <ModalEliminarUsuario
        isOpen={isModalEliminarOpen}
        onClose={cerrarModalEliminar}
        usuario={usuarioEliminando}
        onConfirm={confirmarEliminacion}
      />
    </div>
  );
};