import { useState, useCallback, useEffect } from 'react';
import { pedidoService } from '../../modelos/services/pedidoService';
import type { PedidoUI, PedidoFormData } from '../../modelos/types/pedido.types';

export const usePedidos = (rolUsuario: number) => {
  const [pedidos, setPedidos] = useState<PedidoUI[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // estado para controlar el proceso de OCR (Inteligencia Artificial)
  const [procesandoOCR, setProcesandoOCR] = useState<boolean>(false);

  const puedeCrearPedido = rolUsuario === 1;

  const cargarPedidos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await pedidoService.obtenerTodos();
      setPedidos(data);
    } catch (err: any) {
      console.error(err);
      setError('Error al cargar la lista de pedidos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarPedidos();
  }, [cargarPedidos]);

  const handleCrearPedido = async (datosNuevoPedido: PedidoFormData) => {
    if (!puedeCrearPedido) {
      setError("No tienes permisos para registrar pedidos.");
      return false;
    }
    setIsSubmitting(true);
    try {
      const nuevoPedido = await pedidoService.crearPedido(datosNuevoPedido);
      setPedidos((prev) => [nuevoPedido, ...prev]);
      cerrarModal();
      return true;
    } catch (err: any) {
      console.error(err);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // función para procesar la factura con IA (OCR) y extraer datos para el formulario de pedido
  const procesarFacturaConIA = async (archivo: File): Promise<Partial<PedidoFormData> | null> => {
    setProcesandoOCR(true);
    try {
      const datosExtraidos = await pedidoService.analizarFacturaOCR(archivo);
      return datosExtraidos;
    } catch (err) {
      console.error("Fallo el OCR:", err);
      return null;
    } finally {
      setProcesandoOCR(false);
    }
  };

  const abrirModalNuevo = () => setIsModalOpen(true);
  const cerrarModal = () => setIsModalOpen(false);

  return {
    pedidos,
    loading,
    error,
    isModalOpen,
    isSubmitting,
    procesandoOCR,
    puedeCrearPedido,
    abrirModalNuevo,
    cerrarModal,
    handleCrearPedido,
    procesarFacturaConIA
  };
};