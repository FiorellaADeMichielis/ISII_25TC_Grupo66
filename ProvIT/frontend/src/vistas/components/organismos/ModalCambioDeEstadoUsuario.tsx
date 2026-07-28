import { useState, useEffect } from 'react';
import type { Usuario } from '../../../modelos/types/usuarios.types';
import { ModalCambioEstadoVista } from '../UI/Modales/ModalCambioDeEstadoUsuarioVista';

interface ModalCambioEstadoProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<{ exito: boolean; mensaje?: string } | void>;
  usuario: Usuario | null;
  accion: 'inactivar' | 'reactivar';
}

export const ModalCambioEstado = ({ isOpen, onClose, onConfirm, usuario, accion }: ModalCambioEstadoProps) => {
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setInputValue('');
      setError(null);
      setIsProcessing(false);
    }
  }, [isOpen]);

  if (!isOpen || !usuario) return null;

  const isBotonHabilitado = inputValue === usuario.email;

  const handleConfirmar = async () => {
    if (!isBotonHabilitado) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const resultado = await onConfirm();
      if (resultado && !resultado.exito) {
        setError(resultado.mensaje || 'Error desconocido');
        setIsProcessing(false);
      }
    } catch (err) {
      setError('Ocurrió un error de conexión');
      setIsProcessing(false);
    }
  };

  return (
    <ModalCambioEstadoVista
      usuario={usuario}
      accion={accion}
      inputValue={inputValue}
      setInputValue={setInputValue}
      isProcessing={isProcessing}
      error={error}
      isBotonHabilitado={isBotonHabilitado}
      onClose={onClose}
      onConfirm={handleConfirmar}
    />
  );
};