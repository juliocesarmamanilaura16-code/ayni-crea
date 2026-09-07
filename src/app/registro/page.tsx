"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, User, Mail, Lock } from "lucide-react";
import { useStore } from "@/lib/store";
import { toast } from "@/components/Toast";
import { Button } from "@/components/Button";
import { Input } from "@/components/ui/Input";

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
      toast("Completa todos los campos", "error");
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
        className="bg-white rounded-3xl border border-border p-7 shadow-soft"
      >
        <div className="flex items-center gap-2 mb-1">
          <div className="w-9 h-9 rounded-xl bg-secondary grid place-items-center shadow-soft">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <span className="font-display font-bold text-secondary">Ayni Crea</span>
        </div>
        <h1 className="font-display text-2xl font-extrabold mt-3 text-secondary">Crear cuenta</h1>
        <p className="text-sm text-neutral-500">
          ¿Cómo quieres usar Ayni Crea?
        </p>

        <div className="grid grid-cols-2 gap-2 mt-4">
          <button
            type="button"
            onClick={() => setRole("client")}
            className={`p-4 rounded-xl border text-left transition-all ${
              role === "client"
                ? "border-primary bg-primary-50 shadow-soft dark:bg-neutral-800"
                : "border-border bg-white hover:border-primary/40 dark:bg-neutral-900"
            }`}
          >
            <p className="font-display font-bold text-secondary">Quiero crear y comprar</p>
            <p className="text-[11px] text-neutral-500 mt-0.5">Diseña productos únicos</p>
          </button>
          <button
            type="button"
            onClick={() => setRole("artisan")}
            className={`p-4 rounded-xl border text-left transition-all ${
              role === "artisan"
                ? "border-primary bg-primary-50 shadow-soft dark:bg-neutral-800"
                : "border-border bg-white hover:border-primary/40 dark:bg-neutral-900"
            }`}
          >
            <p className="font-display font-bold text-secondary">Soy artesano</p>
            <p className="text-[11px] text-neutral-500 mt-0.5">Recibe pedidos personalizados</p>
          </button>
        </div>

        <form onSubmit={submit} className="mt-5 space-y-3">
          <Field icon={User} type="text" placeholder="Nombre completo" value={name} onChange={setName} />
          <Field icon={Mail} type="email" placeholder="Correo electrónico" value={email} onChange={setEmail} />
          <Field icon={Lock} type="password" placeholder="Contraseña" value={pwd} onChange={setPwd} />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Crear cuenta
          </Button>
        </form>

        <p className="text-xs text-neutral-500 mt-5 text-center">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-primary font-semibold hover:underline">
            Iniciar sesión
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
