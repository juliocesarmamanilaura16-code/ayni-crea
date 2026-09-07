"use client";

import { Toaster, toast as sonnerToast } from "sonner";

type ToastType = "success" | "error" | "info" | "warning";

/** API simple: toast("mensaje") o toast("mensaje", "error") */
export function toast(text: string, type: ToastType = "success") {
  if (type === "error") sonnerToast.error(text);
  else if (type === "info") sonnerToast(text);
  else if (type === "warning") sonnerToast.warning(text);
  else sonnerToast.success(text);
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
          background: "#0A0A0A",
          color: "#FAFAFA",
          border: "1px solid rgba(255, 107, 0, 0.35)",
          borderRadius: "14px",
          fontFamily: "var(--font-sans)",
          fontSize: "14px",
          padding: "12px 16px",
        },
        className: "shadow-lift",
      }}
    />
  );
}
