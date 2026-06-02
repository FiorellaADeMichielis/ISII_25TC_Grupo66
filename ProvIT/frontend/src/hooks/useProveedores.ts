import { useState, useEffect, useCallback } from 'react';
import { proveedoresService } from '../services/proveedorService';
import { useAuthContext } from '../context/AuthContext';
import { ROLES } from '../types/layout.types';
import type { Proveedor } from '../types/proveedor.types';

export const useProveedores = () => {
  // 1. Contexto de Usuario y Permisos
  const { user } = useAuthContext();
  const rolActual = user?.rol ?? ROLES.OPERADOR;
  const puedeEliminar = rolActual === ROLES.ADMINISTRADOR || rolActual === ROLES.GERENTE;
  const incluirInactivos = rolActual === ROLES.ADMINISTRADOR || rolActual === ROLES.GERENTE;

  // 2. Estado de Datos (El "Modelo")
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 3. Estado de la Interfaz (La "Vista")
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [proveedorEditando, setProveedorEditando] = useState<Proveedor | null>(null);

  // === LÓGICA DE DATOS (API) ===
  const verProveedores = useCallback(async (traerTodos: boolean = false) => {
    setLoading(true);
    try {
      const data = await proveedoresService.obtenerTodos(traerTodos);
      setProveedores(data);
    } catch (err: any) {
      setError('Error al cargar proveedores. Verifica la conexión con Django.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    verProveedores(incluirInactivos); 
  }, [verProveedores, incluirInactivos]);

  const agregarProveedor = async (nuevoProv: Omit<Proveedor, 'id'>) => {
    try {
      const creado = await proveedoresService.crear(nuevoProv);
      setProveedores((prev) => [creado, ...prev]);
      return { exito: true, errores: null };
    } catch (errores: any) {
      return { exito: false, errores };
    }
  };

  const editarProveedor = async (id: number, datosActualizados: Partial<Proveedor>) => {
    try {
      const actualizado = await proveedoresService.actualizar(id, datosActualizados);
      setProveedores((prev) => prev.map(p => p.id === id ? actualizado : p));
      return { exito: true, errores: null };
    } catch (errores: any) {
      return { exito: false, errores };
    }
  };

  // === HANDLERS DE LA INTERFAZ ===
  const abrirModalNuevo = () => {
    setProveedorEditando(null);
    setIsModalOpen(true);
  };

  const abrirModalEdicion = (prov: Proveedor) => {
    setProveedorEditando(prov);
    setIsModalOpen(true);
  };

  const cerrarModal = () => {
    setIsModalOpen(false);
  };

  // ==========================================================
  // ACÁ OCURRE LA MAGIA DEL RBAC Y EL CAMBIO DE ESTADO
  // ==========================================================
  const handleGuardarDesdeModal = async (datos: Omit<Proveedor, "id">) => {
    if (proveedorEditando) {
      
      // 1. Intentamos actualizar los datos estándar (Nombre, CUIT, etc)
      const resultadoEdicion = await editarProveedor(proveedorEditando.id, datos);
      
      // Si el backend rebotó la edición (ej. CUIT duplicado), frenamos acá
      if (!resultadoEdicion.exito) return resultadoEdicion;

      // 2. Evaluamos si el Administrador/Gerente modificó el select de "Estado"
      if (proveedorEditando.estado !== datos.estado) {
        try {
          if (datos.estado === 'Inactivo') {
            await proveedoresService.eliminar(proveedorEditando.id);
          } else {
            await proveedoresService.reactivar(proveedorEditando.id);
          }
          
          // Reflejamos el cambio visual en la tabla sin recargar toda la API
          setProveedores((prev) => prev.map(p => 
            p.id === proveedorEditando.id ? { ...p, estado: datos.estado } : p
          ));
        } catch (errorEstado: any) {
          // Si Django rechaza el cambio de estado (ej. 403 Forbidden), pasamos el error al Modal
          return { exito: false, errores: errorEstado };
        }
      }

      return { exito: true, errores: null };
    }
    
    // Si no había proveedor en edición, es uno nuevo.
    return await agregarProveedor(datos);
  };

  const handleCambiarEstado = async (prov: Proveedor): Promise<void> => {
    if (!puedeEliminar) {
      alert("No tenés permisos para cambiar el estado de los proveedores.");
      return;
    }

    const accion = prov.estado === 'Activo' ? 'dar de baja' : 'reactivar';
    
    if (window.confirm(`¿Estás seguro de que deseás ${accion} a ${prov.nombre}?`)) {
      try {
        if (prov.estado === 'Activo') {
          await proveedoresService.eliminar(prov.id);
          setProveedores((prev) => prev.map(p => p.id === prov.id ? { ...p, estado: 'Inactivo' } : p));
        } else {
          await proveedoresService.reactivar(prov.id);
          setProveedores((prev) => prev.map(p => p.id === prov.id ? { ...p, estado: 'Activo' } : p));
        }
      } catch (err) {
        setError(`No se pudo ${accion} el proveedor. Verificá la consola.`);
      }
    }
  };

  return {
    proveedores,
    loading,
    error,
    isModalOpen,
    proveedorEditando,
    rolActual,
    puedeEliminar,
    abrirModalNuevo,
    abrirModalEdicion,
    cerrarModal,
    handleGuardarDesdeModal,
    handleCambiarEstado
  };
};