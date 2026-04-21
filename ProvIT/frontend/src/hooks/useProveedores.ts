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
  const cargarProveedores = useCallback(async (traerTodos: boolean = false) => {
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
    cargarProveedores(incluirInactivos); 
  }, [cargarProveedores, incluirInactivos]);

  const agregarProveedor = async (nuevoProv: Omit<Proveedor, 'id'>) => {
    try {
      const creado = await proveedoresService.crear(nuevoProv);
      setProveedores((prev) => [creado, ...prev]); 
      return true;
    } catch (err) {
      setError('No se pudo crear el proveedor');
      return false;
    }
  };

  const editarProveedor = async (id: number, datosActualizados: Partial<Proveedor>) => {
    try {
      const actualizado = await proveedoresService.actualizar(id, datosActualizados);
      setProveedores((prev) => prev.map(p => p.id === id ? actualizado : p));
      return true;
    } catch (err) {
      setError('No se pudo actualizar el proveedor');
      return false;
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

  const handleGuardarDesdeModal = async (datos: Omit<Proveedor, "id">): Promise<boolean> => {
    if (proveedorEditando) {
      return await editarProveedor(proveedorEditando.id, datos);
    }
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
          // Llama al endpoint DELETE /api/proveedores/{id}/
          await proveedoresService.eliminar(prov.id);
          setProveedores((prev) => prev.map(p => p.id === prov.id ? { ...p, estado: 'Inactivo' } : p));
        } else {
          // Llama al endpoint PATCH /api/proveedores/{id}/reactivar/
          await proveedoresService.reactivar(prov.id);
          setProveedores((prev) => prev.map(p => p.id === prov.id ? { ...p, estado: 'Activo' } : p));
        }
      } catch (err) {
        setError(`No se pudo ${accion} el proveedor. Verificá la consola.`);
      }
    }
  };

  // Exponemos todo a la vista de Proveedores.tsx
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