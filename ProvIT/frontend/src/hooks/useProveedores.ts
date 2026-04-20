import { useState, useEffect, useCallback } from 'react';
import { proveedoresService } from '../services/proveedorService';
import type { Proveedor } from '../types/proveedor.types';

export const useProveedores = () => {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargarProveedores = useCallback(async (incluirTodos: boolean = false) => {
    setLoading(true);
    try {
      const data = await proveedoresService.obtenerTodos(incluirTodos);
      setProveedores(data);
    } catch (err: any) {
      setError('Error al cargar proveedores. Verifica la conexión con Django.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Por defecto, al entrar a la pantalla, cargamos TODOS para que el Admin los vea.
  useEffect(() => {
    cargarProveedores(true); 
  }, [cargarProveedores]);

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

  // Esta función ahora dispara el DELETE en Django 
  const eliminarProveedor = async (id: number) => {
    try {
      await proveedoresService.eliminar(id);

      setProveedores((prev) => prev.map(p => p.id === id ? { ...p, estado: 'Inactivo' } : p));
    } catch (err) {
      setError('No se pudo eliminar el proveedor');
    }
  };

  // NUEVA FUNCIÓN: Reactivar
  const reactivarProveedor = async (id: number) => {
    try {
      const reactivado = await proveedoresService.reactivar(id);
      // Actualizo el estado local a Activo
      setProveedores((prev) => prev.map(p => p.id === id ? reactivado : p));
      return true;
    } catch (err) {
      setError('No se pudo reactivar el proveedor. ¿Tienes permisos de Administrador?');
      return false;
    }
  };

  return {
    proveedores,
    loading,
    error,
    agregarProveedor,
    editarProveedor,
    eliminarProveedor,
    reactivarProveedor, 
    cargarProveedores
  };
};