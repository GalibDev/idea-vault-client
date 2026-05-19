"use client";

import { createContext, useContext, useMemo, useState } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const api = useMemo(() => ({
    showToast(message, type = "success") {
      setToast({ message, type });
      window.setTimeout(() => setToast(null), 2800);
    },
  }), []);

  return (
    <ToastContext.Provider value={api}>
      {children}
      {toast ? (
        <div className={`toast toast-${toast.type}`} role="status">
          {toast.message}
        </div>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
