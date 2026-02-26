import { createContext, useContext, useState } from "react";
import ModalRoot from "./ModalRoot";

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [modal, setModal] = useState({
    open: false,
    type: null,
    props: {},
  });

  function openModal(type, props = {}) {
    setModal({ open: true, type, props });
  }

  function closeModal() {
    setModal({ open: false, type: null, props: {} });
  }

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <ModalRoot modal={modal} closeModal={closeModal} />
    </ModalContext.Provider>
  );
}

export function useModal() {
  return useContext(ModalContext);
}