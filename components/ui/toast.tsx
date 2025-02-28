"use client";

import React, { createContext, useContext, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

// Toast Context for global management
const ToastContext = createContext<any>(null);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<{ id: number; message: string; type: "default" | "error" }[]>([]);

  const addToast = (message: string, type: "default" | "error") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-remove toast after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col space-y-2">
        {toasts.map((toast) => (
          <Toast key={toast.id} id={toast.id} message={toast.message} type={toast.type} setToasts={setToasts} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);

// Toast Component
const Toast = ({ id, message, type, setToasts }: { id: number; message: string; type: string; setToasts: any }) => {
  return (
    <div
      className={cn(
        "relative flex items-center justify-between w-72 p-4 rounded-lg shadow-md transition-all",
        type === "error" ? "bg-red-500 text-white" : "bg-gray-800 text-white"
      )}
    >
      <span>{message}</span>
      <button
        className="ml-4 p-1 rounded-full hover:bg-gray-700 transition"
        onClick={() => setToasts((prev: any) => prev.filter((t: any) => t.id !== id))}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
