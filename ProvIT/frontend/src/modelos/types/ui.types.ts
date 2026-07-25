interface ModalBaseProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface ModalFormulario extends ModalBaseProps {
  onSuccess: () => void; // Solo los que modifican datos necesitan esto
}