import { MODAL_COMPONENTS } from "./modalRegistry";

export default function ModalRoot({ modal, closeModal }) {
  if (!modal.open) return null;

  const Component = MODAL_COMPONENTS[modal.type];
  if (!Component) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={closeModal}
      />

      {/* Modal container */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-xl p-6">
        <Component {...modal.props} closeModal={closeModal} />
      </div>
    </div>
  );
}