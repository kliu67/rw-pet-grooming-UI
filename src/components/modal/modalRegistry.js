import CreateServiceModal from "./types/CreateServiceModal";
import EditServiceModal from "./types/EditServiceModal";
import DeleteServiceModal from "./types/DeleteServiceModal";

export const MODAL_TYPES = {
  CREATE_SERVICE: "CREATE_SERVICE",
  UPDATE_SERVICE: "EDIT_SERVICE",
  DELETE_SERVICE: "DELETE_SERVICE",
};

export const MODAL_COMPONENTS = {
  [MODAL_TYPES.CREATE_SERVICE]: CreateServiceModal,
  [MODAL_TYPES.UPDATE_SERVICE]: EditServiceModal,
  [MODAL_TYPES.DELETE_SERVICE]: DeleteServiceModal,
};