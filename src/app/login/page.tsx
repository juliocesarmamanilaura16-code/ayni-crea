"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Mail, Lock, ArrowRight } from "lucide-react";
import { useStore } from "@/lib/store";
import { toast } from "@/components/Toast";
import { Button } from "@/components/Button";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/";
  const { login } = useStore();

  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [role, setRole] = useState<"client" | "artisan">("client");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !pwd) {
      toast("Completa email y contraseña", "error");
      return;
    }
    login({
      id: `u-${Date.now()}`,
      name: email.split("@")[0].replace(/\./g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "Usuario",
      email,
      role,
      points: 0,
      createdAt: new Date().toISOString(),
    });
    toast(`Bienvenido a Ayni Crea`);
    router.push(role === "artisan" ? "/dashboard" : next);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl border border-border p-7 shadow-soft"
      >
        <div className="flex items-center gap-2 mb-1">
          <div className="w-9 h-9 rounded-xl bg-secondary grid place-items-center shadow-soft">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <span className="font-display font-bold text-secondary">Ayni Crea</span>
        </div>
        <h1 className="font-display text-2xl font-extrabold mt-3 text-secondary">Iniciar sesión</h1>
        <p className="text-sm text-neutral-500">
          Ingresa para personalizar y seguir tus pedidos.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-3">
          <Field icon={Mail} type="email" placeholder="tu@correo.com" value={email} onChange={setEmail} />
          <Field icon={Lock} type="password" placeholder="Contraseña" value={pwd} onChange={setPwd} />

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setRole("client")}
              className={`flex-1 p-3 rounded-xl border text-sm font-medium text-center transition-all ${
                role === "client"
                  ? "border-primary bg-primary-50 text-secondary shadow-soft dark:bg-neutral-800 dark:text-white"
                  : "border-border bg-white text-neutral-600 hover:border-primary/40 dark:bg-neutral-900 dark:text-neutral-300"
              }`}
            >
              Soy cliente
            </button>
            <button
              type="button"
              onClick={() => setRole("artisan")}
              className={`flex-1 p-3 rounded-xl border text-sm font-medium text-center transition-all ${
                role === "artisan"
                  ? "border-primary bg-primary-50 text-secondary shadow-soft dark:bg-neutral-800 dark:text-white"
                  : "border-border bg-white text-neutral-600 hover:border-primary/40 dark:bg-neutral-900 dark:text-neutral-300"
              }`}
            >
              Soy artesano
            </button>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Entrar
          </Button>
        </form>

        <p className="text-xs text-neutral-500 mt-5 text-center">
          ¿No tienes cuenta?{" "}
          <Link href="/registro" className="text-primary font-semibold hover:underline">
            Crear cuenta
          </Link>
        </p>
        <p className="text-[10px] text-neutral-400 text-center mt-2">
          Prototipo: la autenticación es simulada (no se envía información a ningún servidor).
        </p>
      </motion.div>
    </div>
  );
}

function Field({
  icon: Icon,
  type,
  placeholder,
  value,
  onChange,
}: {
  icon: typeof Sparkles;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10"
      />
    </div>
  );
}
