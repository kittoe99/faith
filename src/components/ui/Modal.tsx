"use client";
import { ReactNode, MouseEvent } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string | ReactNode;
  children: ReactNode;
  /** Optional max-width classes, e.g. 'max-w-lg' */
  widthClass?: string;
}

/**
 * Reusable overlay modal – fills viewport with semi-transparent backdrop,
 * scrollable body, and sticky header containing a title + close button.
 *
 * Usage:
 * <Modal open={isOpen} onClose={() => setIsOpen(false)} title="My Modal">
 *   ...content...
 * </Modal>
 */
export default function Modal({ open, onClose, title, children, widthClass = "max-w-lg" }: ModalProps) {
  if (!open) return null;

  const stop = (e: MouseEvent) => e.stopPropagation();

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-lg w-[95%] ${widthClass} max-h-[90vh] overflow-y-auto shadow-xl`}
        onClick={stop}
      >
        {
          <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10 border-b pb-2 px-5 pt-5">
            {title && <h3 className="text-xl font-semibold mr-4">{title}</h3>}
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800 focus:outline-none"
            >
              <i className="fas fa-times text-lg" />
            </button>
          </div>
        }
        <div className="px-5 pb-6">{children}</div>
      </div>
    </div>
  );
}
