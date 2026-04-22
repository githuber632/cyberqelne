"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, X } from "lucide-react";

interface ToastProps {
  show: boolean;
  message?: string;
  type?: "success" | "error";
  onClose?: () => void;
}

export function AdminToast({ show, message = "Сохранено успешно", type = "success", onClose }: ToastProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 60, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border font-mono text-sm max-w-sm"
          style={{
            background: type === "success" ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
            borderColor: type === "success" ? "rgba(16,185,129,0.4)" : "rgba(239,68,68,0.4)",
            backdropFilter: "blur(16px)",
          }}
        >
          {type === "success" ? (
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
          ) : (
            <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          )}
          <span className={type === "success" ? "text-green-300" : "text-red-300"}>{message}</span>
          {onClose && (
            <button onClick={onClose} className="ml-2 text-gray-500 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
