"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePageTransition } from "./PageTransition";
import { infoLinks, mainLinks } from "../lib/nav";
import FooterShader from "./FooterShader";

// Pied de page. Porte l'ancre #contact, cible du bouton « Contactez nous » de
// la barre de navigation. Même registre que les sections sombres : noir, filets
// à white/10, serif italique pour l'accroche, capitales pour les libellés.

// TODO : adresse de contact à confirmer.
const CONTACT_EMAIL = "contact@jarvis-connect.fr";

// Identité société : reprise des mentions légales (app/mentions-legales).
const ADDRESS_1 = "4 Avenue de la Libération";
const ADDRESS_2 = "60160 Montataire, France";

export default function Footer() {
  const pathname = usePathname();
  const { navigate } = usePageTransition();

  // Même comportement que les liens du menu : ancre de la page courante →
  // défilement doux ; autre page → voile de transition (et cible mémorisée
  // pour que ScrollToTarget fasse défiler à l'arrivée).
  const onNav = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    const [rawPath, hash] = href.split("#");
    const path = rawPath || pathname; // "#foo" seul → page courante
    const anchor = hash ? `#${hash}` : "";

    if (path === pathname) {
      if (anchor) {
        document.querySelector(anchor)?.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    if (anchor) {
      try {
        sessionStorage.setItem("jc:scrollTarget", anchor);
      } catch {
        /* sessionStorage indisponible : on ignore */
      }
    }
    navigate(path);
  };

  const column = (label: string, links: typeof mainLinks) => (
    <div className="flex flex-col gap-3">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
        {label}
      </span>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={(e) => onNav(e, link.href)}
          className="text-sm font-medium uppercase tracking-tight text-white/70 transition-colors hover:text-white"
        >
          {link.label}
        </Link>
      ))}
    </div>
  );

  return (
    <footer
      id="contact"
      data-nav-dark
      className="relative bg-black text-white"
    >
      {/* Flux animé en arrière-plan (WebGL) */}
      <FooterShader />

      <div className="relative w-full px-6 py-28 sm:px-12 sm:py-36 lg:py-48">
        <div className="flex flex-col gap-16 lg:flex-row lg:justify-between lg:gap-24">
          {/* Accroche + contact */}
          <div className="max-w-md">
            <p className="font-quote ml-[0.1em] text-3xl italic leading-none text-white/55 sm:text-4xl">
              parlons de
            </p>
            <p className="mt-1 text-[clamp(2.25rem,6vw,4.5rem)] font-bold uppercase leading-[0.95] tracking-tight">
              votre projet
            </p>

            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="group relative mt-6 inline-flex items-baseline gap-2 text-base text-white sm:text-lg"
            >
              {CONTACT_EMAIL}
              <span
                aria-hidden
                className="inline-block transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
              <span
                aria-hidden
                className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-white transition-transform duration-500 ease-out group-hover:scale-x-100"
              />
            </a>

            <p className="mt-8 text-sm leading-relaxed text-white/45">
              {ADDRESS_1}
              <br />
              {ADDRESS_2}
            </p>
          </div>

          {/* Colonnes de liens + réseaux */}
          <div className="flex flex-col gap-12 sm:flex-row sm:gap-16 lg:gap-20">
            {column("Navigation", mainLinks)}

            <div className="flex flex-col gap-8">
              {column("Informations", infoLinks)}

              <div className="flex gap-3">
                <a
                  href="https://www.linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white/70 transition-colors hover:border-white hover:text-white"
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-1 1.83-2.05 3.75-2.05 4 0 4.75 2.65 4.75 6.1V21h-4v-5.4c0-1.3 0-2.95-1.8-2.95s-2.05 1.4-2.05 2.85V21H10V9Z" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white/70 transition-colors hover:border-white hover:text-white"
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
          </div>
        </div>
      </div>
    </footer>
  );
}
