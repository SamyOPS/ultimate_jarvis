"use client";

import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { lockScroll, unlockScroll } from "../lib/scrollLock";

// Expertises présentées en fiches (image + métadonnées + grand titre serif),
// parcourues par un défilement horizontal piloté par le scroll vertical.
// Un clic sur une image l'agrandit (layout partagé) en plein écran centré, avec
// toutes les infos de l'expertise. Images = PLACEHOLDERS.
const items = [
  {
    index: "01",
    domaine: "Infrastructure",
    approche: "Assistance & infogérance",
    desc: "Assistance réactive et infogérance de votre parc au quotidien, pour des équipes toujours opérationnelles.",
    points: [
      "Helpdesk et support de proximité",
      "Gestion et supervision du parc",
      "Maintenance préventive et curative",
      "Gestion des incidents et des demandes",
    ],
    title: ["Support", "informatique"],
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&h=1000&fit=crop&crop=entropy&auto=format&q=80",
  },
  {
    index: "02",
    domaine: "Applicatif",
    approche: "Sur mesure",
    desc: "Applications web et outils métiers conçus pour vos process, du besoin à la mise en production.",
    points: [
      "Applications web sur mesure",
      "Outils et portails métiers",
      "Intégrations et API",
      "Maintenance évolutive",
    ],
    title: ["Développement"],
    image:
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1600&h=1000&fit=crop&crop=entropy&auto=format&q=80",
  },
  {
    index: "03",
    domaine: "Sécurité",
    approche: "Audit & protection",
    desc: "Audits, sécurisation et sensibilisation pour protéger vos données et garantir votre conformité.",
    points: [
      "Audits et tests d'intrusion",
      "Sécurisation des systèmes et réseaux",
      "Sensibilisation des équipes",
      "Mise en conformité (RGPD)",
    ],
    title: ["Cybersécurité"],
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&h=1000&fit=crop&crop=entropy&auto=format&q=80",
  },
  {
    index: "04",
    domaine: "Cloud",
    approche: "Supervision & gestion",
    desc: "Migration, supervision et gestion de vos environnements pour une infrastructure disponible et maîtrisée.",
    points: [
      "Migration vers le cloud",
      "Supervision 24/7",
      "Sauvegarde et plan de reprise",
      "Optimisation des coûts",
    ],
    title: ["Infogérance", "& Cloud"],
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600&h=1000&fit=crop&crop=entropy&auto=format&q=80",
  },
];

// Départ lent → accélération → ralentissement (ease-in-out) pour un rendu fluide
const IMG_TRANSITION = { duration: 0.65, ease: [0.83, 0, 0.17, 1] as const };

export default function ExpertiseGallery() {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  // Le scroll vertical translate la piste horizontale. Chaque fiche fait 86vw
  // et la piste a une marge de 7vw : la fiche active est centrée, avec un aperçu
  // des voisines (les 4 catégories paraissent plus resserrées).
  const x = useTransform(
    scrollYProgress,
    [0, 0.9],
    ["0vw", `-${(items.length - 1) * 86}vw`]
  );

  // Détail plein écran. On mémorise la position/taille exacte de l'image
  // cliquée pour n'animer QUE celle-ci (une image overlay), sans toucher aux
  // autres — indépendamment de la position de scroll.
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [rect, setRect] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);
  const active = openIndex !== null ? items[openIndex] : null;
  const close = () => setOpenIndex(null);
  const openImage = (i: number, el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
    setOpenIndex(i);
  };

  // Verrou du scroll + fermeture au clavier (Échap) quand le détail est ouvert.
  useEffect(() => {
    if (openIndex === null) return;
    lockScroll();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      unlockScroll();
      window.removeEventListener("keydown", onKey);
    };
  }, [openIndex]);

  return (
    <section
      ref={container}
      style={{ height: `${items.length * 100}vh` }}
      className="relative bg-white text-zinc-900"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div style={{ x }} className="flex h-full px-[7vw]">
          {items.map((it, i) => (
            <article
              key={it.index}
              className="flex h-full w-[86vw] shrink-0 items-center gap-6 px-4 sm:gap-8 sm:px-6"
            >
              {/* Grande image rectangulaire, cliquable */}
              <button
                type="button"
                onClick={(e) => openImage(i, e.currentTarget)}
                aria-label={`Voir le détail : ${it.title.join(" ")}`}
                className="group relative h-[65vh] flex-1 overflow-hidden rounded-xl bg-zinc-100"
              >
                <motion.img
                  src={it.image}
                  alt={it.title.join(" ")}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className={`absolute inset-0 h-full w-full object-cover ${
                    openIndex === i ? "opacity-0" : ""
                  }`}
                />
                <div className="pointer-events-none absolute inset-0 rounded-xl bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
              </button>

              {/* Texte sur le côté : métadonnées en haut, titre en bas */}
              <div className="flex h-[65vh] w-[26%] max-w-md shrink-0 flex-col justify-between">
                <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-[0.7rem] font-semibold uppercase tracking-wide">
                  <dt className="text-zinc-400">Domaine</dt>
                  <dd className="text-zinc-900">{it.domaine}</dd>
                  <dt className="text-zinc-400">Approche</dt>
                  <dd className="text-zinc-900">{it.approche}</dd>
                </dl>

                <div>
                  <p className="mb-4 max-w-xs text-sm leading-relaxed text-zinc-500">
                    {it.desc}
                  </p>
                  <h3 className="font-quote text-5xl leading-[0.95] sm:text-6xl">
                    {it.title.map((line, li) => (
                      <span key={li} className="block">
                        {line}
                      </span>
                    ))}
                  </h3>
                </div>
              </div>
            </article>
          ))}
        </motion.div>
      </div>

      {/* Détail plein écran : SEULE l'image cliquée s'anime, depuis sa position
          mesurée jusqu'au plein écran (et retour). Pas de fond, pas de doublon
          (l'image source de la galerie est masquée pendant l'ouverture). */}
      <AnimatePresence>
        {active && rect && (
          <motion.div
            key={openIndex}
            role="dialog"
            aria-modal="true"
            aria-label={active.title.join(" ")}
            onClick={close}
            className="fixed inset-0 z-[80]"
          >
            <motion.img
              src={active.image}
              alt={active.title.join(" ")}
              initial={{
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height,
                borderRadius: 12,
              }}
              animate={{
                top: 0,
                left: 0,
                width: window.innerWidth,
                height: window.innerHeight,
                borderRadius: 0,
              }}
              exit={{
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height,
                borderRadius: 12,
              }}
              transition={IMG_TRANSITION}
              className="fixed object-cover"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
