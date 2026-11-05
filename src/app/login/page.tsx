"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Lock, User } from "lucide-react";
import { useStore } from "@/lib/store";
import { toast } from "@/components/Toast";
import styles from "@/components/auth.module.css";

type Mode = "login" | "register";

export default function AuthPage() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/";
  const { login } = useStore();

  const [mode, setMode] = useState<Mode>("login");

  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [role, setRole] = useState<"client" | "artisan">("client");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !pwd) {
      toast("Completa email y contraseña", "error");
      return;
    }
    if (mode === "register" && (!name || !username)) {
      toast("Completa nombre completo y nombre de usuario", "error");
      return;
    }
    login({
      id: `u-${Date.now()}`,
      name: mode === "register" ? name : username,
      username,
      email,
      role,
      points: mode === "register" ? 20 : 0,
      createdAt: new Date().toISOString(),
    });
    toast(mode === "register" ? `Bienvenido a Ayni Crea, ${name.split(" ")[0]}!` : "Bienvenido a Ayni Crea");
    router.push(role === "artisan" ? "/dashboard" : next);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] px-4 py-12 text-[var(--color-text-primary)] font-sans">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={styles.form}
      >
        <div className="text-center mb-8">
          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--color-text-muted)]">
            Ayni Crea
          </span>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-[var(--color-text-primary)]">
            {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
          </h1>
          <p className="mt-1 text-sm leading-relaxed text-[var(--color-text-secondary)]">
            {mode === "login"
              ? "Ingresa para personalizar y seguir tus pedidos."
              : "Únete y comienza a comprar o vender artesanías."}
          </p>
          <span className="mx-auto mt-3 block h-1 w-12 rounded-full bg-[var(--color-text-primary)]/20" />
        </div>

        <div className={styles.toggleWrapper}>
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`${styles.toggleButton} ${mode === "login" ? styles.toggleActive : ""}`}
          >
            Iniciar sesión
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={`${styles.toggleButton} ${mode === "register" ? styles.toggleActive : ""}`}
          >
            Crear cuenta
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div className={styles.field}>
            <label htmlFor="auth-email" className={styles.label}>
              Correo electrónico
            </label>
            <div className={styles.inputForm}>
              <Mail className={styles.icon} />
              <input
                id="auth-email"
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
            <label htmlFor="auth-password" className={styles.label}>
              Contraseña
            </label>
            <div className={styles.inputForm}>
              <Lock className={styles.icon} />
              <input
                id="auth-password"
                name="password"
                type="password"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                placeholder="Contraseña"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                className={styles.input}
              />
            </div>
          </div>

          {mode === "register" && (
            <>
              <div className={styles.field}>
                <label htmlFor="auth-name" className={styles.label}>
                  Nombre completo
                </label>
                <div className={styles.inputForm}>
                  <User className={styles.icon} />
                  <input
                    id="auth-name"
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
                <label htmlFor="auth-username" className={styles.label}>
                  Nombre de usuario
                </label>
                <div className={styles.inputForm}>
                  <User className={styles.icon} />
                  <input
                    id="auth-username"
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
            </>
          )}

          {mode === "login" && (
            <div className={styles.field}>
              <span className={styles.label}>Ingresa como</span>
              <div className={styles.roleRow}>
                <button
                  type="button"
                  onClick={() => setRole("client")}
                  aria-pressed={role === "client"}
                  className={`${styles.roleButton} ${role === "client" ? styles.roleActive : ""}`}
                >
                  Cliente
                </button>
                <button
                  type="button"
                  onClick={() => setRole("artisan")}
                  aria-pressed={role === "artisan"}
                  className={`${styles.roleButton} ${role === "artisan" ? styles.roleActive : ""}`}
                >
                  Artesano
                </button>
              </div>
            </div>
          )}

          <button type="submit" className={styles.submit}>
            {mode === "login" ? "Entrar" : "Crear cuenta"}
            <ArrowRight className="w-4 h-4" />
          </button>

          <p className={styles.footerText}>
            {mode === "login"
              ? "¿No tienes cuenta? "
              : "¿Ya tienes cuenta? "}<Link
              href="/login"
              onClick={(e) => {
                e.preventDefault();
                setMode(mode === "login" ? "register" : "login");
              }}
              className={styles.footerLink}
            >
              {mode === "login" ? "Crear cuenta" : "Iniciar sesión"}
            </Link>
          </p>
          <p className={styles.disclaimer}>
            Prototipo: la autenticación es simulada (no se envía información a ningún servidor).
          </p>
        </form>
      </motion.div>
    </div>
  );
}
