"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Mail, Lock, User, ArrowRight } from "lucide-react";
import { useStore } from "@/lib/store";
import { toast } from "@/components/Toast";
import styles from "./login.module.css";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/";
  const { login } = useStore();

  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [role, setRole] = useState<"client" | "artisan">("client");
  const [username, setUsername] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !pwd || !username) {
      toast("Completa email, contraseña y nombre de usuario", "error");
      return;
    }
    login({
      id: `u-${Date.now()}`,
      name: username,
      username,
      email,
      role,
      points: 0,
      createdAt: new Date().toISOString(),
    });
    toast(`Bienvenido a Ayni Crea`);
    router.push(role === "artisan" ? "/dashboard" : next);
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
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-white/40 grid place-items-center shadow-sm">
            <Sparkles className="w-4 h-4 text-[#151717]" />
          </div>
          <span className="font-display font-bold text-[#151717]">Ayni Crea</span>
        </div>

        <div>
          <h1 className="font-display text-2xl font-extrabold text-[#151717]">
            Iniciar sesión
          </h1>
          <p className="text-sm text-[#151717]/70">
            Ingresa para personalizar y seguir tus pedidos.
          </p>
        </div>

        <div className={styles.field}>
          <label htmlFor="login-email" className={styles.label}>
            Correo electrónico
          </label>
          <div className={styles.inputForm}>
            <Mail className={styles.icon} />
            <input
              id="login-email"
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
          <label htmlFor="login-password" className={styles.label}>
            Contraseña
          </label>
          <div className={styles.inputForm}>
            <Lock className={styles.icon} />
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Contraseña"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="login-username" className={styles.label}>
            Nombre de usuario
          </label>
          <div className={styles.inputForm}>
            <User className={styles.icon} />
            <input
              id="login-username"
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

        <div className={styles.field}>
          <span className={styles.label}>Ingresa como</span>
          <div className={styles.roleRow}>
            <button
              type="button"
              onClick={() => setRole("client")}
              aria-pressed={role === "client"}
              className={`${styles.roleButton} ${role === "client" ? styles.roleActive : ""}`}
            >
              Soy cliente
            </button>
            <button
              type="button"
              onClick={() => setRole("artisan")}
              aria-pressed={role === "artisan"}
              className={`${styles.roleButton} ${role === "artisan" ? styles.roleActive : ""}`}
            >
              Soy artesano
            </button>
          </div>
        </div>

        <button type="submit" className={styles.submit}>
          Entrar
          <ArrowRight className="w-4 h-4" />
        </button>

        <p className={styles.footerText}>
          ¿No tienes cuenta?{" "}
          <Link href="/registro" className={styles.footerLink}>
            Crear cuenta
          </Link>
        </p>
        <p className={styles.disclaimer}>
          Prototipo: la autenticación es simulada (no se envía información a ningún servidor).
        </p>
      </motion.form>
    </div>
  );
}
