import { useState } from "react";
import AiChat from "./AiChat";

/**
 * ChatModal renders a floating robot button on mobile (hidden on md+).
 * Tapping the button opens a fullscreen modal that shows the AiChat component.
 */
export default function ChatModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating button */}
      <button
        type="button"
        aria-label="Open Ai Chat"
        onClick={() => setOpen(true)}
        className="fixed right-3 top-1/2 -translate-y-1/2 z-50 md:hidden flex items-center justify-center w-12 h-12 rounded-full bg-purple-600 text-white shadow-lg focus:outline-none"
      >
        <i className="fas fa-robot text-lg" />
      </button>

      {/* Modal overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex justify-center items-center md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />

          {/* Chat container */}
          <div className="relative w-[95vw] max-w-lg h-[85vh]">
            <div className="absolute inset-0 bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col">
              {/* Close button */}
              <button
                type="button"
                aria-label="Close Ai Chat"
                onClick={() => setOpen(false)}
                className="absolute right-3 top-3 text-gray-600 hover:text-gray-900"
              >
                <i className="fas fa-times text-xl" />
              </button>
              <AiChat />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
