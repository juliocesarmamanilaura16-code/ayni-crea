"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, User, Mail, Lock } from "lucide-react";
import { useStore } from "@/lib/store";
import { toast } from "@/components/Toast";

export default function RegistroPage() {
  const router = useRouter();
  const { login } = useStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [role, setRole] = useState<"client" | "artisan">("client");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !pwd) {
      toast("Completa todos los campos");
      return;
    }
    login({
      id: `u-${Date.now()}`,
      name,
      email,
      role,
      points: 20,
      createdAt: new Date().toISOString(),
    });
    toast(`Bienvenido a Ayni Crea, ${name.split(" ")[0]}! +20 pts por registrarte`);
    router.push(role === "artisan" ? "/dashboard" : "/");
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
        <h1 className="font-display text-2xl font-extrabold mt-3">Crear cuenta</h1>
        <p className="text-sm text-ayni-azul/70">
          ¿Cómo quieres usar Ayni Crea?
        </p>

        <div className="grid grid-cols-2 gap-2 mt-4">
          <button
            type="button"
            onClick={() => setRole("client")}
            className={`p-4 rounded-xl border text-left transition ${
              role === "client"
                ? "border-ayni-azul bg-ayni-crema"
                : "border-ayni-beige bg-white"
            }`}
          >
            <p className="font-display font-bold">Quiero crear y comprar</p>
            <p className="text-[11px] text-ayni-azul/60 mt-0.5">Diseña productos únicos</p>
          </button>
          <button
            type="button"
            onClick={() => setRole("artisan")}
            className={`p-4 rounded-xl border text-left transition ${
              role === "artisan"
                ? "border-ayni-azul bg-ayni-crema"
                : "border-ayni-beige bg-white"
            }`}
          >
            <p className="font-display font-bold">Soy artesano</p>
            <p className="text-[11px] text-ayni-azul/60 mt-0.5">Recibe pedidos personalizados</p>
          </button>
        </div>

        <form onSubmit={submit} className="mt-5 space-y-3">
          <Field icon={User} type="text" placeholder="Nombre completo" value={name} onChange={setName} />
          <Field icon={Mail} type="email" placeholder="Correo electrónico" value={email} onChange={setEmail} />
          <Field icon={Lock} type="password" placeholder="Contraseña" value={pwd} onChange={setPwd} />

          <button
            type="submit"
            className="w-full bg-ayni-azul text-ayni-crema font-bold py-3 rounded-xl hover:bg-ayni-azul/90 transition flex items-center justify-center gap-2"
          >
            Crear cuenta <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-xs text-ayni-azul/70 mt-5 text-center">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-ayni-terracota font-semibold hover:underline">
            Iniciar sesión
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
  icon: typeof Sparkles;
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
