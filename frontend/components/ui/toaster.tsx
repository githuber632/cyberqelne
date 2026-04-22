"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      theme="dark"
      toastOptions={{
        classNames: {
          toast: "glass-card border border-cyber-glass-border text-white font-sans",
          title: "font-semibold",
          description: "text-gray-400 text-sm",
          success: "border-green-500/40",
          error: "border-red-500/40",
          warning: "border-yellow-500/40",
        },
      }}
    />
  );
}
