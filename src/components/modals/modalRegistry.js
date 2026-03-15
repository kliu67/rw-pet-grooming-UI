import DeleteModal from "./genericModal/DeleteModal";
import UserModal from "./genericModal/UserModal";

export const MODAL_TYPES = {
  DELETE: "DELETE",
  USER: "USER"
};

export const MODAL_COMPONENTS = {
  [MODAL_TYPES.DELETE]: DeleteModal,
  [MODAL_TYPES.USER]: UserModal
};