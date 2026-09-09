"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { usePageTransition } from "./PageTransition";
import { infoLinks, isExternalUrl, mainLinks, memberLinks } from "../lib/nav";
import FooterShader from "./FooterShader";

// Pied de page. Porte l'ancre #contact, cible du bouton « Contactez nous » de
// la barre de navigation. Même registre que les sections sombres : noir, filets
// à white/10, serif italique pour l'accroche, capitales pour les libellés.

// TODO : adresse de contact à confirmer.
const CONTACT_EMAIL = "contact@jarvis-connect.fr";

// Identité société : reprise des mentions légales (app/mentions-legales).
const ADDRESS_1 = "4 Avenue de la Libération";
const ADDRESS_2 = "60160 Montataire, France";

// Mot-symbole révélé lettre par lettre : chaque lettre monte depuis sa ligne
// derrière un masque, en cascade. Même effet que le titre du menu et que le
// « VI » du hero, ici déclenché par l'entrée de la section dans le viewport.
const WORDMARK = "Jarvis Connect";
const STEP = 45; // ms entre deux lettres

function Wordmark() {
  const ref = useRef<HTMLParagraphElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Le décalage se compte sur les lettres visibles : l'espace entre les deux
  // mots ne doit pas créer de trou dans la cascade.
  let idx = -1;

  return (
    <p
      ref={ref}
      aria-label={WORDMARK}
      className="-mx-6 mt-24 whitespace-nowrap text-center font-sans text-[10vw] font-bold uppercase leading-none tracking-tight text-white sm:-mx-12 sm:mt-32"
    >
      {[...WORDMARK].map((char, i) => {
        if (char === " ") return " ";
        idx += 1;
        return (
          <span key={i} aria-hidden className="reveal-mask">
            <span
              className={`inline-block transition-transform duration-700 ease-out ${
                shown ? "translate-y-0" : "translate-y-full"
              }`}
              style={{ transitionDelay: shown ? `${idx * STEP}ms` : "0ms" }}
            >
              {char}
            </span>
          </span>
        );
      })}
    </p>
  );
}

export default function Footer() {
  const pathname = usePathname();
  const { navigate, cover } = usePageTransition();

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

  // Sortie du site : on couvre d'abord d'un voile noir, puis on part — même
  // fondu que les changements de page internes. Les raccourcis d'ouverture en
  // nouvel onglet (ctrl/cmd/⇧ + clic, clic milieu) restent au navigateur.
  const onExternal = (e: React.MouseEvent, href: string) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    cover(() => {
      window.location.href = href;
    });
  };

  const linkClass =
    "text-sm font-medium uppercase tracking-tight text-white/70 transition-colors hover:text-white";

  const column = (label: string, links: typeof mainLinks) => (
    <div className="flex flex-col gap-3">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
        {label}
      </span>
      {links.map((link) => {
        // Externe : voile puis départ. mailto:/tel: : lien nu (rien à couvrir).
        // Interne : <Link> + transition de page.
        if (isExternalUrl(link.href)) {
          return (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => onExternal(e, link.href)}
              className={linkClass}
            >
              {link.label}
            </a>
          );
        }
        if (/^(mailto:|tel:)/.test(link.href)) {
          return (
            <a key={link.href} href={link.href} className={linkClass}>
              {link.label}
            </a>
          );
        }
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={(e) => onNav(e, link.href)}
            className={linkClass}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );

  return (
    <footer id="contact" data-nav-dark className="relative bg-black text-white">
      {/* Flux animé en arrière-plan (WebGL) */}
      <FooterShader />

      <div className="relative w-full px-6 pb-10 pt-28 sm:px-12 sm:pb-14 sm:pt-36 lg:pb-16 lg:pt-48">
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

          {/* Colonnes de liens */}
          <div className="flex flex-col gap-12 sm:flex-row sm:gap-16 lg:gap-20">
            {column("Navigation", mainLinks)}

            {column("Informations", infoLinks)}

            {column("Membre de Jarvis", memberLinks)}
          </div>
        </div>

        {/* Mot-symbole en bas de page, comme sous le hero de l'accueil : mêmes
            réglages typographiques (10vw, capitales, tracking serré), en blanc,
            révélé lettre par lettre à l'arrivée sur la section. */}
        <Wordmark />
      </div>
    </footer>
  );
}
