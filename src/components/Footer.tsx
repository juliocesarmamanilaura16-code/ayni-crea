"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone, Instagram, Facebook, Twitter, Shield, Truck, BadgeCheck, Heart } from "lucide-react";
import { useState } from "react";
import { Button } from "./Button";
import { toast } from "./Toast";

const sections = {
  marketplace: [
    { label: "Explorar productos", href: "/explorar" },
    { label: "Artesanos", href: "/artesanos" },
    { label: "Categorías", href: "/explorar" },
    { label: "Crear producto", href: "/crear" },
  ],
  cuenta: [
    { label: "Iniciar sesión", href: "/login" },
    { label: "Crear cuenta", href: "/registro" },
    { label: "Mis pedidos", href: "/pedidos" },
    { label: "Mi perfil", href: "/perfil" },
  ],
  soporte: [
    { label: "Centro de ayuda", href: "#" },
    { label: "Cómo funciona", href: "#" },
    { label: "Garantías", href: "#" },
    { label: "Contacto", href: "#" },
  ],
  legal: [
    { label: "Términos y condiciones", href: "#" },
    { label: "Política de privacidad", href: "#" },
    { label: "Política de cookies", href: "#" },
  ],
};

const trustSignals = [
  { icon: Shield, label: "Pago seguro" },
  { icon: BadgeCheck, label: "Artesanos verificados" },
  { icon: Truck, label: "Envío a todo Bolivia" },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast("Ingresa un email válido", "error");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      toast("¡Suscripción exitosa! Revisa tu correo.", "success");
      setEmail("");
      setLoading(false);
    }, 800);
  };

  return (
    <footer className="bg-secondary text-neutral-100 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-dots opacity-[0.05]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />

      <div className="relative">
        {/* Trust Signals Bar */}
        <div className="border-b border-neutral-800">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {trustSignals.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-center gap-3 py-2 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/20 grid place-items-center group-hover:bg-primary-500/20 transition-colors">
                    <item.icon className="w-5 h-5 text-primary-400" />
                  </div>
                  <span className="text-sm font-medium text-neutral-200">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Footer */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-12">
            {/* Brand + Newsletter */}
            <div className="col-span-2 md:col-span-2 space-y-5">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-glow group-hover:scale-105 transition-transform">
                  <Image src="/logo-ayni-crea.png" alt="Ayni Crea" fill className="object-cover" />
                </div>
                <span className="font-display font-bold text-xl tracking-tight">
                  Ayni <span className="text-primary">Crea</span>
                </span>
              </Link>

              <p className="text-sm text-neutral-400 leading-relaxed max-w-sm">
                Marketplace artesanal que conecta personas con artesanos de El Alto y La Paz.
                Diseña productos únicos, apoya el comercio local.
              </p>

              <div>
                <p className="text-sm font-semibold mb-3 text-white">
                  Únete a la comunidad
                </p>
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder:text-neutral-500 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    loading={loading}
                    className="px-4"
                  >
                    Unirme
                  </Button>
                </form>
                <p className="text-xs text-neutral-500 mt-2">
                  Recibe novedades y descuentos exclusivos.
                </p>
              </div>
            </div>

            {/* Links sections */}
            <div>
              <h4 className="font-display font-bold text-sm text-white mb-4 uppercase tracking-wider">
                Marketplace
              </h4>
              <ul className="space-y-2.5">
                {sections.marketplace.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-neutral-400 hover:text-primary transition-colors duration-200 inline-flex items-center gap-1 group"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-display font-bold text-sm text-white mb-4 uppercase tracking-wider">
                Mi cuenta
              </h4>
              <ul className="space-y-2.5">
                {sections.cuenta.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-neutral-400 hover:text-primary transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-display font-bold text-sm text-white mb-4 uppercase tracking-wider">
                Soporte
              </h4>
              <ul className="space-y-2.5">
                {sections.soporte.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-neutral-400 hover:text-primary transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-display font-bold text-sm text-white mb-4 uppercase tracking-wider">
                Contacto
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2.5 text-sm text-neutral-400">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary-400" />
                  <span>El Alto & La Paz, Bolivia</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-neutral-400">
                  <Mail className="w-4 h-4 mt-0.5 shrink-0 text-primary-400" />
                  <a href="mailto:hola@aynicrea.com" className="hover:text-primary transition-colors">
                    hola@aynicrea.com
                  </a>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-neutral-400">
                  <Phone className="w-4 h-4 mt-0.5 shrink-0 text-primary-400" />
                  <span>+591 70000000</span>
                </li>
              </ul>

              {/* Social */}
              <div className="flex gap-2 mt-5">
                {[
                  { icon: Instagram, label: "Instagram", href: "#" },
                  { icon: Facebook, label: "Facebook", href: "#" },
                  { icon: Twitter, label: "Twitter", href: "#" },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-800 grid place-items-center hover:bg-primary hover:border-primary hover:scale-110 transition-all duration-200"
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-neutral-800">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-xs text-neutral-500 text-center md:text-left">
                © {new Date().getFullYear()} Ayni Crea. Hecho con{" "}
                <Heart className="w-3 h-3 inline text-primary-500 fill-primary-500" />{" "}
                en Bolivia.
              </p>
              <div className="flex flex-wrap gap-x-5 gap-y-2 justify-center">
                {sections.legal.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-xs text-neutral-500 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
