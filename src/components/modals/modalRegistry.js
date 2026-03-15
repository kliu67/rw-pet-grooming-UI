import DeleteModal from "./genericModal/DeleteModal";
import UserModal from "./genericModal/UserModal";
import AuthModal from "./genericModal/AuthModal";
export const MODAL_TYPES = {
  DELETE: "DELETE",
  USER: "USER",
  AUTH: "AUTH",
};

export const MODAL_COMPONENTS = {
  [MODAL_TYPES.DELETE]: DeleteModal,
  [MODAL_TYPES.USER]: UserModal,
  [MODAL_TYPES.AUTH]: AuthModal,
};
