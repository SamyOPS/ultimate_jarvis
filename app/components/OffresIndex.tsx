"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { lockScroll, unlockScroll } from "../lib/scrollLock";

// Contenu révélé derrière le capot en escalier (composant Offres) : un index
// typographique des postes ouverts, pas une liste.
//  - une ligne = un poste, titre en capitales, filets pleine largeur ;
//  - au survol (souris uniquement) : balayage blanc, texte inversé, les autres
//    lignes s'estompent, et une image portrait suit le curseur ;
//  - au clic : panneau plein écran (image + typo + missions + candidature).
// Images = PLACEHOLDERS.

// TODO : adresse de réception des candidatures à confirmer.
const CONTACT_EMAIL = "recrutement@jarvis-connect.fr";

// Même courbe que les autres transitions du site (départ lent → sortie douce).
const EASE = [0.83, 0, 0.17, 1] as const;

type Offre = {
  index: string;
  title: string;
  sub: string;
  contrat: string;
  lieu: string;
  equipe: string;
  desc: string;
  missions: string[];
  profil: string[];
  image: string;
};

const offres: Offre[] = [
  {
    index: "01",
    title: "Technicien support",
    sub: "Support de proximité — niveau 1 / 2",
    contrat: "CDI",
    lieu: "Paris",
    equipe: "Support",
    desc: "Vous êtes le premier réflexe des utilisateurs. Au sein d'une équipe de proximité, vous prenez en charge les incidents et les demandes, de la prise d'appel à la résolution, chez nos clients grands comptes.",
    missions: [
      "Prise en charge des incidents et demandes (téléphone, ticket, présentiel)",
      "Diagnostic et résolution niveau 1 / 2 sur poste de travail et périphériques",
      "Préparation, masterisation et déploiement des équipements",
      "Documentation des procédures et alimentation de la base de connaissances",
    ],
    profil: [
      "Bac +2 informatique ou expérience équivalente",
      "Windows 10 / 11, Active Directory, Office 365",
      "Sens du service et vraie aisance relationnelle",
    ],
    image:
      "https://images.unsplash.com/photo-1557683316-973673baf926?w=900&h=1200&fit=crop&crop=entropy&auto=format&q=80",
  },
  {
    index: "02",
    title: "Développeur full-stack",
    sub: "Applications métiers — React / Node",
    contrat: "CDI",
    lieu: "Paris",
    equipe: "Applicatif",
    desc: "Vous concevez les outils métiers de nos clients, du cadrage du besoin à la mise en production. Des projets courts, très proches des utilisateurs, où vous avez la main sur l'ensemble de la chaîne.",
    missions: [
      "Cadrage technique et estimation avec le client",
      "Développement front et back d'applications sur mesure",
      "Conception et intégration d'API avec le SI existant",
      "Mise en production, suivi et maintenance évolutive",
    ],
    profil: [
      "3 ans d'expérience minimum sur des projets web",
      "TypeScript, React / Next.js, Node.js, SQL",
      "Goût du produit et du travail au contact des utilisateurs",
    ],
    image:
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=900&h=1200&fit=crop&crop=entropy&auto=format&q=80",
  },
  {
    index: "03",
    title: "Ingénieur cybersécurité",
    sub: "Audit, durcissement & conformité",
    contrat: "CDI",
    lieu: "Lyon",
    equipe: "Sécurité",
    desc: "Vous évaluez le niveau de sécurité de nos clients, corrigez ce qui doit l'être et embarquez leurs équipes. Un poste qui mêle technique, conseil et pédagogie.",
    missions: [
      "Audits techniques et organisationnels, tests d'intrusion",
      "Durcissement des systèmes, réseaux et environnements cloud",
      "Réponse à incident et analyse post-mortem",
      "Sensibilisation des équipes et mise en conformité RGPD",
    ],
    profil: [
      "Bac +5 avec spécialisation sécurité",
      "Réseaux, systèmes, EDR / SIEM, outillage offensif",
      "Capacité à expliquer un risque à un non-technicien",
    ],
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&h=1200&fit=crop&crop=entropy&auto=format&q=80",
  },
  {
    index: "04",
    title: "Admin système & cloud",
    sub: "Infogérance — Azure / Microsoft 365",
    contrat: "CDI",
    lieu: "Paris",
    equipe: "Cloud",
    desc: "Vous maintenez en condition opérationnelle les infrastructures que nous infogérons, et vous accompagnez leur migration vers le cloud. Disponibilité, sauvegarde, maîtrise des coûts.",
    missions: [
      "Administration des environnements Windows Server et Azure",
      "Migration d'infrastructures on-premise vers le cloud",
      "Supervision, sauvegarde et plan de reprise d'activité",
      "Automatisation des tâches récurrentes (PowerShell, IaC)",
    ],
    profil: [
      "4 ans d'expérience en administration système",
      "Azure, Microsoft 365, virtualisation, réseau",
      "Rigueur et réflexe documentaire",
    ],
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=900&h=1200&fit=crop&crop=entropy&auto=format&q=80",
  },
];

const mailto = (o: Offre) =>
  `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    `Candidature — ${o.title}`
  )}`;

// Une ligne de l'index. Le survol est piloté par l'état du parent (et non par
// `group-hover`) car il faut aussi estomper les AUTRES lignes.
function Row({
  o,
  last,
  active,
  dim,
  onHover,
  onOpen,
}: {
  o: Offre;
  last: boolean;
  active: boolean;
  dim: boolean;
  onHover: (v: boolean) => void;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      onFocus={() => onHover(true)}
      onBlur={() => onHover(false)}
      onClick={onOpen}
      aria-label={`Voir l'offre : ${o.title}`}
      className={`relative flex h-[18vh] min-h-[86px] shrink-0 cursor-pointer items-center overflow-hidden border-white/15 text-left ${
        last ? "border-y" : "border-t"
      }`}
    >
      {/* Balayage blanc qui monte depuis le bas de la ligne */}
      <motion.span
        aria-hidden
        initial={false}
        animate={{ y: active ? "0%" : "101%" }}
        transition={{ duration: 0.55, ease: EASE }}
        className="absolute inset-0 bg-white"
      />

      <motion.span
        initial={false}
        animate={{ x: active ? 12 : 0 }}
        transition={{ duration: 0.55, ease: EASE }}
        className={`relative flex w-full items-center gap-4 px-5 transition-colors duration-500 sm:gap-8 sm:px-10 ${
          active ? "text-black" : dim ? "text-white/25" : "text-white"
        }`}
      >
        <span className="font-quote w-7 shrink-0 text-base italic sm:w-9 sm:text-xl">
          {o.index}
        </span>

        <span className="min-w-0 flex-1 truncate text-[clamp(1rem,5vw,1.5rem)] font-bold uppercase leading-[0.95] tracking-tight sm:text-[clamp(1.25rem,5.4vh,3.75rem)]">
          {o.title}
        </span>

        <span className="hidden shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] sm:block">
          {o.contrat}
          <span className={active ? "text-black/40" : "text-white/40"}> · </span>
          {o.lieu}
        </span>

        <motion.span
          aria-hidden
          initial={false}
          animate={{ x: active ? 0 : -8, opacity: active ? 1 : 0.35 }}
          transition={{ duration: 0.55, ease: EASE }}
          className="shrink-0 text-lg sm:text-2xl"
        >
          ↗
        </motion.span>
      </motion.span>
    </button>
  );
}

// Panneau plein écran d'une offre : image d'un côté, typo de l'autre.
// Le contenu réapparaît en cascade à chaque changement d'offre (clé = index).
function Detail({
  o,
  onClose,
  onNext,
}: {
  o: Offre;
  onClose: () => void;
  onNext: () => void;
}) {
  const stack = {
    hidden: {},
    show: { transition: { staggerChildren: 0.055, delayChildren: 0.3 } },
  };
  const line = {
    hidden: { y: 26, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.6, ease: EASE } },
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={o.title}
      initial={{ y: "100%" }}
      animate={{ y: "0%" }}
      exit={{ y: "100%" }}
      transition={{ duration: 0.75, ease: EASE }}
      className="fixed inset-0 z-[90] bg-black text-white"
    >
      {/* En bas à droite : le coin haut droit est occupé par la navbar (logo à
          gauche, CTA + burger à droite), qui reste peinte au-dessus du panneau. */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Fermer l'offre"
        className="group absolute bottom-6 right-5 z-10 flex cursor-pointer items-center gap-2 rounded-full border border-white/25 bg-black/70 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-white backdrop-blur transition-colors hover:bg-white hover:text-black sm:bottom-8 sm:right-10"
      >
        Fermer
        <span className="inline-block text-base transition-transform duration-300 group-hover:rotate-90">
          ✕
        </span>
      </button>

      <div className="grid h-full grid-cols-1 lg:grid-cols-[1fr_0.78fr]">
        {/* Texte */}
        <motion.div
          key={o.index}
          variants={stack}
          initial="hidden"
          animate="show"
          className="order-2 overflow-y-auto px-5 pb-28 pt-10 sm:px-10 lg:order-1 lg:pb-16 lg:pt-[12vh]"
        >
          <motion.p
            variants={line}
            className="font-quote text-lg italic text-white/50 sm:text-2xl"
          >
            offre {o.index}
          </motion.p>

          <motion.h3
            variants={line}
            className="mt-1 text-[clamp(2rem,5.6vw,4.5rem)] font-bold uppercase leading-[0.92] tracking-tight"
          >
            {o.title}
          </motion.h3>

          <motion.p
            variants={line}
            className="mt-3 text-sm text-white/60 sm:text-base"
          >
            {o.sub}
          </motion.p>

          <motion.div
            variants={line}
            className="mt-7 flex flex-wrap gap-x-8 gap-y-2 border-y border-white/10 py-4 font-mono text-[10px] uppercase tracking-[0.18em] text-white/50"
          >
            <span>{o.contrat}</span>
            <span>{o.lieu}</span>
            <span>Pôle {o.equipe}</span>
          </motion.div>

          <motion.p
            variants={line}
            className="mt-8 max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base"
          >
            {o.desc}
          </motion.p>

          <div className="mt-12 grid gap-10 sm:grid-cols-2 sm:gap-14">
            {[
              { label: "Vos missions", items: o.missions },
              { label: "Votre profil", items: o.profil },
            ].map((bloc) => (
              <motion.div key={bloc.label} variants={line}>
                <p className="font-quote text-xl italic text-white/70 sm:text-2xl">
                  {bloc.label}
                </p>
                <ul className="mt-4 border-t border-white/10">
                  {bloc.items.map((txt, k) => (
                    <li
                      key={txt}
                      className="flex gap-4 border-b border-white/10 py-3 text-sm leading-relaxed text-white/70"
                    >
                      <span className="mt-[3px] shrink-0 font-mono text-[10px] text-white/35">
                        0{k + 1}
                      </span>
                      {txt}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <motion.div
            variants={line}
            className="mt-14 flex flex-wrap items-center gap-x-10 gap-y-4"
          >
            <a
              href={mailto(o)}
              className="group relative text-[clamp(1.5rem,3.4vw,2.75rem)] font-bold uppercase leading-none tracking-tight"
            >
              Postuler
              <span className="absolute -bottom-1 left-0 h-[2px] w-full origin-left scale-x-0 bg-white transition-transform duration-500 ease-out group-hover:scale-x-100" />
            </a>

            <button
              type="button"
              onClick={onNext}
              className="cursor-pointer font-mono text-[10px] uppercase tracking-[0.18em] text-white/50 transition-colors hover:text-white"
            >
              Offre suivante →
            </button>
          </motion.div>
        </motion.div>

        {/* Image : bandeau en haut sur mobile, colonne pleine hauteur sur grand écran */}
        <div className="order-1 h-[34vh] overflow-hidden lg:order-2 lg:h-full">
          <motion.img
            key={o.image}
            src={o.image}
            alt=""
            aria-hidden="true"
            draggable={false}
            initial={{ scale: 1.12 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.1, ease: EASE }}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </motion.div>
  );
}

export default function OffresIndex({
  progress,
  revealFrom,
  revealTo,
}: {
  progress: MotionValue<number>;
  revealFrom: number;
  revealTo: number;
}) {
  // L'index « se pose » pendant que l'escalier le découvre (léger zoom arrière).
  const scale = useTransform(progress, [revealFrom, revealTo], [1.06, 1]);
  const opacity = useTransform(progress, [revealFrom, revealTo], [0.45, 1]);

  // Survol : souris fine uniquement (pas de suivi de curseur au tactile).
  const [pointer, setPointer] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const apply = () => setPointer(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const [hovered, setHovered] = useState<number | null>(null);
  // On garde la dernière image survolée pour que la vignette s'efface en
  // douceur au lieu de disparaître d'un coup quand on quitte une ligne.
  const [lastHovered, setLastHovered] = useState(0);

  // Vignette qui suit le curseur (ressort). Coordonnées relatives au bloc.
  const listRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 320, damping: 38, mass: 0.7 });
  const sy = useSpring(my, { stiffness: 320, damping: 38, mass: 0.7 });

  const [open, setOpen] = useState<number | null>(null);
  const close = () => setOpen(null);

  // Verrou du scroll + Échap quand le panneau est ouvert.
  useEffect(() => {
    if (open === null) return;
    lockScroll();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      unlockScroll();
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <motion.div
        style={{ scale, opacity }}
        className="absolute inset-0 bg-black"
      >
        <div
          ref={listRef}
          onMouseMove={(e) => {
            if (!pointer) return;
            const r = listRef.current?.getBoundingClientRect();
            if (!r) return;
            mx.set(e.clientX - r.left);
            my.set(e.clientY - r.top);
          }}
          className="relative flex h-full flex-col"
        >
          {/* Bloc de lignes à hauteur fixe, centré verticalement : il respire
              dans l'écran épinglé au lieu de l'occuper entièrement. */}
          <div className="flex min-h-0 flex-1 flex-col justify-center">
            {offres.map((o, i) => (
              <Row
                key={o.index}
                o={o}
                last={i === offres.length - 1}
                active={hovered === i}
                dim={hovered !== null && hovered !== i}
                onHover={(v) => {
                  if (v) {
                    setHovered(i);
                    setLastHovered(i);
                  } else {
                    setHovered((cur) => (cur === i ? null : cur));
                  }
                }}
                onOpen={() => setOpen(i)}
              />
            ))}
          </div>

          {/* Vignette suiveuse (souris uniquement) */}
          {pointer && (
            <motion.div
              aria-hidden
              style={{ x: sx, y: sy }}
              className="pointer-events-none absolute left-0 top-0 z-20"
            >
              <motion.div
                style={{ x: "-50%", y: "-50%" }}
                initial={false}
                animate={{
                  opacity: hovered !== null ? 1 : 0,
                  scale: hovered !== null ? 1 : 0.8,
                  rotate: hovered !== null ? -3 : 4,
                }}
                transition={{ duration: 0.45, ease: EASE }}
                className="overflow-hidden"
              >
                <motion.img
                  key={offres[hovered ?? lastHovered].image}
                  src={offres[hovered ?? lastHovered].image}
                  alt=""
                  draggable={false}
                  className="aspect-[4/5] w-[clamp(150px,13vw,230px)] object-cover"
                />
              </motion.div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Panneau plein écran, hors du bloc épinglé (pas de rognage possible) */}
      <AnimatePresence>
        {open !== null && (
          <Detail
            o={offres[open]}
            onClose={close}
            onNext={() => setOpen((i) => ((i ?? 0) + 1) % offres.length)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
