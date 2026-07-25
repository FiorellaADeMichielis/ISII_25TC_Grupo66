import { useState } from 'react';

export const useModal = (estadoInicial: boolean = false) => {
  const [isOpen, setIsOpen] = useState(estadoInicial);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const toggleModal = () => setIsOpen((prev) => !prev);

  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal,
  };
};