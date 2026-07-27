import { useState, useEffect } from 'react';
import type { Usuario } from '../../../modelos/types/usuarios.types';
import { ModalEliminarUsuarioVista } from '../UI/Modales/ModalEliminarUsuarioVista';

interface ModalEliminarUsuarioProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<{ exito: boolean; mensaje?: string } | void>;
  usuario: Usuario | null;
}

export const ModalEliminarUsuario = ({ isOpen, onClose, onConfirm, usuario }: ModalEliminarUsuarioProps) => {
  // ==========================================
  // 1. ESTADOS LOCALES
  // ==========================================
  const [inputValue, setInputValue] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ==========================================
  // 2. EFECTOS (Limpiar al abrir/cerrar)
  // ==========================================
  useEffect(() => {
    if (isOpen) {
      setInputValue('');
      setError(null);
      setIsDeleting(false);
    }
  }, [isOpen]);

  // ==========================================
  // 3. GUARDIA DE SEGURIDAD
  // ==========================================
  if (!isOpen || !usuario) return null;

  // ==========================================
  // 4. LÓGICA DE NEGOCIO
  // ==========================================
  const isBotonHabilitado = inputValue === usuario.email;

  const handleConfirmar = async () => {
    if (!isBotonHabilitado) return;
    
    setIsDeleting(true);
    setError(null);
    
    try {
      const resultado = await onConfirm();
      if (resultado && !resultado.exito) {
        setError(resultado.mensaje || 'Error desconocido');
        setIsDeleting(false);
      }
      // NOTA: Si es exitoso, el hook superior cerrará el modal,
      // por lo que no hace falta setear setIsDeleting(false) en caso de éxito.
    } catch (err) {
      setError('Ocurrió un error de conexión');
      setIsDeleting(false);
    }
  };

  // ==========================================
  // 5. RENDERIZAR LA VISTA (Pasando Props)
  // ==========================================
  return (
    <ModalEliminarUsuarioVista
      usuario={usuario}
      inputValue={inputValue}
      setInputValue={setInputValue}
      isDeleting={isDeleting}
      error={error}
      isBotonHabilitado={isBotonHabilitado}
      onClose={onClose}
      onConfirm={handleConfirmar}
    />
  );
};