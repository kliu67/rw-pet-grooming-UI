import React from "react";
import { XIcon } from "lucide-react";
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
        {closeModal && (
          <button
            type="button"
            onClick={closeModal}
            aria-label="Close"
            className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-md text-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <XIcon className="h-4 w-4" />
          </button>
        )}
        <Component {...modal.props} closeModal={closeModal} />
      </div>
    </div>
  );
}
