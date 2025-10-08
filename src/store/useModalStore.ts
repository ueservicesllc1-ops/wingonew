import { create } from 'zustand';

interface ModalStore {
  showLoginModal: boolean;
  showRegisterModal: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  openRegisterModal: () => void;
  closeRegisterModal: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  showLoginModal: false,
  showRegisterModal: false,
  openLoginModal: () => set({ showLoginModal: true }),
  closeLoginModal: () => set({ showLoginModal: false }),
  openRegisterModal: () => set({ showRegisterModal: true }),
  closeRegisterModal: () => set({ showRegisterModal: false }),
}));
