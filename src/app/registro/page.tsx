"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, AtSign, Lock, Mail, User } from "lucide-react";
import { useStore } from "@/lib/store";
import { toast } from "@/components/Toast";
import styles from "@/components/auth.module.css";

export default function RegistroPage() {
  const router = useRouter();
  const { login } = useStore();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [role, setRole] = useState<"client" | "artisan">("client");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !username || !email || !pwd) {
      toast("Completa todos los campos incluyendo el nombre de usuario", "error");
      return;
    }
    login({
      id: `u-${Date.now()}`,
      name,
      username,
      email,
      role,
      points: 20,
      createdAt: new Date().toISOString(),
    });
    toast(`Bienvenido a Ayni Crea, ${name.split(" ")[0]}! +20 pts por registrarte`);
    router.push(role === "artisan" ? "/dashboard" : "/");
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={styles.form}
      >
        <div className="text-center">
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#151717]/60">
            Únete a Ayni Crea
          </span>
          <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-[#151717]">
            Crear cuenta
          </h1>
          <p className="mt-1 text-sm leading-relaxed text-[#151717]/70">
            Elige cómo quieres usar Ayni Crea.
          </p>
          <span className="mx-auto mt-3 block h-1 w-12 rounded-full bg-[#151717]/80" />
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Quiero usar Ayni Crea como</span>
          <div className={styles.roleRow}>
            <button
              type="button"
              onClick={() => setRole("client")}
              aria-pressed={role === "client"}
              className={`${styles.roleCard} ${role === "client" ? styles.roleCardActive : ""}`}
            >
              <span className={styles.roleTitle}>Cliente</span>
              <span className={styles.roleSubtitle}>Diseña y compra</span>
            </button>
            <button
              type="button"
              onClick={() => setRole("artisan")}
              aria-pressed={role === "artisan"}
              className={`${styles.roleCard} ${role === "artisan" ? styles.roleCardActive : ""}`}
            >
              <span className={styles.roleTitle}>Artesano</span>
              <span className={styles.roleSubtitle}>Recibe pedidos</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className={styles.field}>
            <label htmlFor="reg-name" className={styles.label}>
              Nombre completo
            </label>
            <div className={styles.inputForm}>
              <User className={styles.icon} />
              <input
                id="reg-name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Nombre completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={styles.input}
              />
            </div>
          </div>
          <div className={styles.field}>
            <label htmlFor="reg-username" className={styles.label}>
              Nombre de usuario
            </label>
            <div className={styles.inputForm}>
              <AtSign className={styles.icon} />
              <input
                id="reg-username"
                name="username"
                type="text"
                autoComplete="username"
                placeholder="Nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={styles.input}
              />
            </div>
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="reg-email" className={styles.label}>
            Correo electrónico
          </label>
          <div className={styles.inputForm}>
            <Mail className={styles.icon} />
            <input
              id="reg-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="reg-password" className={styles.label}>
            Contraseña
          </label>
          <div className={styles.inputForm}>
            <Lock className={styles.icon} />
            <input
              id="reg-password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="Contraseña"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              className={styles.input}
            />
          </div>
        </div>

        <button type="submit" className={styles.submit}>
          Crear cuenta
          <ArrowRight className="w-4 h-4" />
        </button>

        <p className={styles.footerText}>
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className={styles.footerLink}>
            Iniciar sesión
          </Link>
        </p>
        <p className={styles.disclaimer}>
          Prototipo: la autenticación es simulada (no se envía información a ningún servidor).
        </p>
      </motion.form>
    </div>
  );
}
