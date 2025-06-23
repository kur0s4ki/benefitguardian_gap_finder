import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext({ addToast: () => {} });

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-dismiss after 5s
    setTimeout(() => dismiss(id), 5000);
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ addToast, dismiss }}>
      {children}
      {/* Toast container */}
      <div className="fixed top-4 right-4 z-[150] space-y-2">
        {toasts.map(({ id, message, type }) => (
          <div
            key={id}
            className={`flex items-start gap-2 px-4 py-3 rounded-lg shadow-lg text-sm text-white max-w-sm animate-fade-in ${
              type === 'error'
                ? 'bg-error'
                : type === 'warning'
                ? 'bg-warning'
                : 'bg-primary'
            }`}
          >
            <span className="flex-1 break-words">{message}</span>
            <button
              onClick={() => dismiss(id)}
              className="ml-2 font-bold focus:outline-none"
              aria-label="Dismiss toast"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext); 