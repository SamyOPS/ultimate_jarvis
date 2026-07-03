"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { usePageTransition } from "./PageTransition";

// Révélation masquée lettre par lettre, pilotée par l'ouverture du panneau.
// Les mots restent insécables (pas de coupure au milieu d'un mot).
function RevealChars({
  text,
  open,
  base = 0,
  step = 25,
}: {
  text: string;
  open: boolean;
  base?: number;
  step?: number;
}) {
  const words = text.split(" ");
  let idx = -1;
  return (
    <span aria-label={text}>
      {words.map((word, wi) => (
        <Fragment key={wi}>
          <span className="inline-block whitespace-nowrap">
            {[...word].map((char, ci) => {
              idx += 1;
              const delay = base + idx * step;
              return (
                <span key={ci} aria-hidden className="reveal-mask">
                  <span
                    className={`inline-block transition-transform duration-700 ease-out ${
                      open ? "translate-y-0" : "translate-y-full"
                    }`}
                    style={{ transitionDelay: open ? `${delay}ms` : "0ms" }}
                  >
                    {char}
                  </span>
                </span>
              );
            })}
          </span>
          {wi < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </span>
  );
}

// Liens principaux (gros, à gauche)
const mainLinks = [
  { label: "Accueil", href: "/" },
  { label: "Expertises", href: "#expertises" },
  { label: "Offres", href: "#offres" },
  { label: "FAQ", href: "#faq" },
];

// Liens secondaires (colonne de droite)
const infoLinks = [
  { label: "Mentions légales", href: "/mentions-legales" },
  { label: "CGU", href: "/cgu" },
  { label: "Politique de confidentialité", href: "/politique-de-confidentialite" },
  { label: "S'inscrire à la newsletter", href: "#newsletter" },
];

export default function Menu() {
  const [open, setOpen] = useState(false);
  const [onDark, setOnDark] = useState(false);
  const close = () => setOpen(false);
  const pathname = usePathname();
  const { navigate } = usePageTransition();

  // La barre passe en blanc quand un panneau sombre (data-nav-dark) la recouvre.
  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      const navY = 48; // point situé dans la barre (haut de page)
      let over = false;
      document.querySelectorAll("[data-nav-dark]").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top <= navY && r.bottom >= navY) over = true;
      });
      setOnDark(over);
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [pathname]);

  // Éléments de la barre en blanc si le menu est ouvert OU sur fond sombre.
  const dark = open || onDark;

  // Clic sur un lien : transition voile noir pour les vraies pages (`/...`),
  // simple fermeture + défilement pour les ancres (`#...`).
  const onNav = (e: React.MouseEvent, href: string) => {
    if (href.startsWith("/")) {
      e.preventDefault();
      if (href === pathname) {
        close();
      } else {
        navigate(href);
      }
    } else {
      close();
    }
  };

  return (
    <>
      {/* Logo au premier plan : passe en blanc quand le panneau s'ouvre */}
      <Link
        href="/"
        onClick={(e) => onNav(e, "/")}
        aria-label="Jarvis — Accueil"
        className="fixed left-8 top-8 z-50 sm:left-12 sm:top-12"
      >
        <Image
          src="/logo.png"
          alt="Jarvis"
          width={48}
          height={48}
          priority
          className={`h-10 w-10 object-contain transition-[filter] duration-300 sm:h-12 sm:w-12 ${
            dark ? "invert" : "invert-0"
          }`}
        />
      </Link>

      {/* Coin haut droit : bouton Contacter + burger (au premier plan) */}
      <div className="fixed right-8 top-8 z-50 flex items-center gap-3 sm:right-12 sm:top-12">
        {/* CTA Contacter, encadré, reste visible sur le panneau noir */}
        <Link
          href="#contact"
          onClick={close}
          className={`animate-fade-in rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-tight transition-colors duration-300 ${
            dark
              ? "border-white text-white hover:bg-white hover:text-black"
              : "border-zinc-900 text-zinc-900 hover:bg-zinc-900 hover:text-white"
          }`}
          style={{ animationDelay: "0.9s" }}
        >
          Contactez nous
        </Link>

        {/* Burger (se transforme en croix à l'ouverture) */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          className="flex h-12 w-12 flex-col items-center justify-center gap-1.5"
        >
          <span
            className={`block h-0.5 w-7 transition-all duration-300 ${
              dark ? "bg-white" : "bg-zinc-900"
            } ${open ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`block h-0.5 w-7 transition-all duration-300 ${
              open ? "opacity-0" : dark ? "bg-white" : "bg-zinc-900"
            }`}
          />
          <span
            className={`block h-0.5 w-7 transition-all duration-300 ${
              dark ? "bg-white" : "bg-zinc-900"
            } ${open ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </div>

      {/* Panneau plein écran qui glisse depuis la droite */}
      <aside
        aria-hidden={!open}
        className={`fixed inset-0 z-40 h-dvh w-full bg-[#1c1a17] text-white transition-transform duration-500 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col px-8 py-8 sm:px-12 sm:py-10">
          {/* Corps : gros liens à gauche + colonne d'infos à droite */}
          <div className="flex flex-1 items-center justify-between gap-8">
            <nav className="flex flex-col gap-1">
              {mainLinks.map((link, i) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => onNav(e, link.href)}
                  className="block text-5xl font-bold uppercase leading-[1.05] tracking-tight text-white transition-colors hover:text-white/60 sm:text-7xl laptop:text-5xl"
                >
                  <RevealChars
                    text={link.label}
                    open={open}
                    base={200 + i * 90}
                    step={35}
                  />
                </Link>
              ))}
            </nav>

            <div className="hidden shrink-0 flex-col gap-8 text-sm sm:flex">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                  <RevealChars text="Contact" open={open} base={700} step={22} />
                </span>
                {infoLinks.map((link, k) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={(e) => onNav(e, link.href)}
                    className="font-medium uppercase tracking-tight text-white/80 transition-colors hover:text-white"
                  >
                    <RevealChars
                      text={link.label}
                      open={open}
                      base={760 + k * 60}
                      step={14}
                    />
                  </Link>
                ))}
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                  <RevealChars
                    text="Membre de Jarvis"
                    open={open}
                    base={1040}
                    step={22}
                  />
                </span>
                <Link
                  href="/login"
                  onClick={(e) => onNav(e, "/login")}
                  className="inline-flex items-center gap-1 font-medium uppercase tracking-tight text-white/80 transition-colors hover:text-white"
                >
                  <RevealChars
                    text="Accéder à mon espace"
                    open={open}
                    base={1120}
                    step={14}
                  />
                  <span aria-hidden className="reveal-mask">
                    <span
                      className={`inline-block transition-transform duration-700 ease-out ${
                        open ? "translate-y-0" : "translate-y-full"
                      }`}
                      style={{ transitionDelay: open ? "1360ms" : "0ms" }}
                    >
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden
                      >
                        <line x1="7" y1="17" x2="17" y2="7" />
                        <polyline points="7 7 17 7 17 17" />
                      </svg>
                    </span>
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* Pied : réseaux sociaux en bas à droite */}
          <div className="flex justify-end gap-3">
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-white/80 transition-colors hover:border-white hover:text-white"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-1 1.83-2.05 3.75-2.05 4 0 4.75 2.65 4.75 6.1V21h-4v-5.4c0-1.3 0-2.95-1.8-2.95s-2.05 1.4-2.05 2.85V21H10V9Z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-white/80 transition-colors hover:border-white hover:text-white"
            >
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <line x1="17.5" y1="6.5" x2="17.5" y2="6.5" />
              </svg>
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}
