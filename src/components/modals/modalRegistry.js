import DeleteModal from "./genericModal/DeleteModal";
import UserModal from "./genericModal/UserModal";
import AuthModal from "./genericModal/AuthModal";
import ConfirmModal from "./genericModal/ConfirmModal";
export const MODAL_TYPES = {
  DELETE: "DELETE",
  USER: "USER",
  AUTH: "AUTH",
  CONFIRM: "CONFIRM"
};

export const MODAL_COMPONENTS = {
  [MODAL_TYPES.DELETE]: DeleteModal,
  [MODAL_TYPES.USER]: UserModal,
  [MODAL_TYPES.AUTH]: AuthModal,
  [MODAL_TYPES.CONFIRM]: ConfirmModal,
};
