import CreateServiceModal from "./types/CreateServiceModal";
import EditServiceModal from "./types/EditServiceModal";
import DeleteServiceModal from "./types/DeleteServiceModal";
import DeleteModal from "./types/DeleteModal";

export const MODAL_TYPES = {
  CREATE_SERVICE: "CREATE_SERVICE",
  EDIT_SERVICE: "EDIT_SERVICE",
  DELETE_SERVICE: "DELETE_SERVICE",
  DELETE: "DELETE"
};

export const MODAL_COMPONENTS = {
  [MODAL_TYPES.CREATE_SERVICE]: CreateServiceModal,
  [MODAL_TYPES.EDIT_SERVICE]: EditServiceModal,
  [MODAL_TYPES.DELETE_SERVICE]: DeleteServiceModal,
  [MODAL_TYPES.DELETE]: DeleteModal
};