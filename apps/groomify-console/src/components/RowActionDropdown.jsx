import React from "react";
import { useState, useRef, useEffect } from "react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
export const RowActionsMenu = ({ onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      {/* Trigger */}
      <button
        className="p-2 rounded hover:bg-gray-100"
        onClick={() => setOpen(prev => !prev)}
      >
        <MoreVertical size={16} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="relative right-0 mt-2 w-36 bg-white border rounded-lg shadow-lg z-50">
          <button
            onClick={() => {
              setOpen(false);
              onEdit();
            }}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-100"
          >
            <Pencil size={14} />
            Edit
          </button>

          <button
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}