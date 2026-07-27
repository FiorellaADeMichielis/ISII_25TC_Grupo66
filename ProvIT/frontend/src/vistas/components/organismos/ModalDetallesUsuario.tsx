import type { Usuario } from '../../../modelos/types/usuarios.types'; 
import { ModalDetallesUsuarioVista } from '../UI/Modales/ModalDetallesUsuarioVista';

interface ModalDetallesUsuarioProps {
  isOpen: boolean;
  onClose: () => void;
  usuario: Usuario | null;
}

export const ModalDetallesUsuario = ({ isOpen, onClose, usuario }: ModalDetallesUsuarioProps) => {
  
  // =================================================================
  // 1. GUARDIA DE SEGURIDAD (Early Return)
  // =================================================================
  // Si el modal no debe abrirse, o por alguna razón el estado 
  // 'usuario' es null, corta la ejecución
  if (!isOpen || !usuario) return null;

  // =================================================================
  // 2. LÓGICA DE NEGOCIO (Smart)
  // =================================================================
  // Al separar la vista de la lógica, si en el futuro necesitas:
  // - Hacer un fetch extra para traer el historial de este usuario...
  // - Formatear la fecha de usuario.ultimoLogin a la zona horaria local...
  // - Enviar un evento de analíticas (Google Analytics) de "Perfil Visto"...
  // Todo ese código iría exactamente aquí, sin ensuciar el HTML/Tailwind.

  // =================================================================
  // 3. RENDER DE LA VISTA (Dumb)
  // =================================================================
  return (
    <ModalDetallesUsuarioVista
      usuario={usuario}
      onClose={onClose}
    />
  );
};