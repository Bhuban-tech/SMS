import { X } from "lucide-react";

export default function Modal({ title, close, children }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl relative">
        <button
          onClick={close}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X size={20} />
        </button>

        {title && (
          <h2 className="text-xl font-bold mb-4 text-center">{title}</h2>
        )}

        {children}
      </div>
    </div>
  );
}
