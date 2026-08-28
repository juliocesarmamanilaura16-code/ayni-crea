"use client";

import { Toaster, toast as sonnerToast } from "sonner";

/** Mantiene la API simple: toast("mensaje") */
export function toast(text: string) {
  sonnerToast.success(text);
}

export function toastError(text: string) {
  sonnerToast.error(text);
}

export function toastInfo(text: string) {
  sonnerToast(text);
}

export function ToastHost() {
  return (
    <Toaster
      position="top-center"
      richColors={false}
      toastOptions={{
        style: {
          background: "#0F2A47",
          color: "#FAF6EE",
          border: "1px solid rgba(201, 162, 74, 0.35)",
          borderRadius: "14px",
          fontFamily: "var(--font-sans)",
        },
        className: "shadow-lift",
      }}
    />
  );
}
