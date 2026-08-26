"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Mail, Lock, ArrowRight } from "lucide-react";
import { useStore } from "@/lib/store";
import { toast } from "@/components/Toast";

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
      toast("Completa email y contraseña");
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
        className="bg-white rounded-2xl border border-ayni-beige p-7 shadow-soft"
      >
        <div className="flex items-center gap-2 mb-1">
          <div className="w-9 h-9 rounded-xl bg-ayni-azul grid place-items-center">
            <Sparkles className="w-4 h-4 text-ayni-dorado" />
          </div>
          <span className="font-display font-bold">Ayni Crea</span>
        </div>
        <h1 className="font-display text-2xl font-extrabold mt-3">Iniciar sesión</h1>
        <p className="text-sm text-ayni-azul/70">
          Ingresa para personalizar y seguir tus pedidos.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-3">
          <Field icon={Mail} type="email" placeholder="tu@correo.com" value={email} onChange={setEmail} />
          <Field icon={Lock} type="password" placeholder="Contraseña" value={pwd} onChange={setPwd} />

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setRole("client")}
              className={`flex-1 p-3 rounded-xl border text-sm font-medium text-center transition ${
                role === "client"
                  ? "border-ayni-azul bg-ayni-crema"
                  : "border-ayni-beige bg-white"
              }`}
            >
              Soy cliente
            </button>
            <button
              type="button"
              onClick={() => setRole("artisan")}
              className={`flex-1 p-3 rounded-xl border text-sm font-medium text-center transition ${
                role === "artisan"
                  ? "border-ayni-azul bg-ayni-crema"
                  : "border-ayni-beige bg-white"
              }`}
            >
              Soy artesano
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-ayni-azul text-ayni-crema font-bold py-3 rounded-xl hover:bg-ayni-azul/90 transition flex items-center justify-center gap-2"
          >
            Entrar <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-xs text-ayni-azul/70 mt-5 text-center">
          ¿No tienes cuenta?{" "}
          <Link href="/registro" className="text-ayni-terracota font-semibold hover:underline">
            Crear cuenta
          </Link>
        </p>
        <p className="text-[10px] text-ayni-azul/40 text-center mt-2">
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
  icon: any;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ayni-azul/50" />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-ayni-crema border border-ayni-beige text-sm focus:outline-none focus:ring-2 focus:ring-ayni-dorado/50"
      />
    </div>
  );
}
