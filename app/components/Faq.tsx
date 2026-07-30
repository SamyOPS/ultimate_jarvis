"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

// FAQ : colonne de gauche épinglée (titre + grand numéro hachuré qui suit la
// question ouverte) et accordéon à filets à droite. Une seule réponse ouverte à
// la fois, ce qui permet au numéro de gauche de refléter l'état courant.
// Textes = PLACEHOLDERS à valider.

// TODO : adresse de contact à confirmer.
const CONTACT_EMAIL = "contact@jarvis-connect.fr";

// Sortie très amortie (même courbe que le cercle de la section clients).
const EASE = [0.16, 1, 0.3, 1] as const;

const items = [
  {
    n: "01",
    q: "Quels types d'entreprises accompagnez-vous ?",
    a: "Des PME comme des grands comptes, de dix à plusieurs milliers de postes. Nos équipes s'adaptent à votre organisation : un interlocuteur unique pour les structures les plus petites, une équipe dédiée sur site pour les plus grandes.",
  },
  {
    n: "02",
    q: "En combien de temps intervenez-vous ?",
    a: "Les délais de prise en charge sont fixés au contrat et varient selon la criticité de l'incident. Le support est joignable par téléphone, par e-mail et via un portail de tickets, avec un suivi de bout en bout.",
  },
  {
    n: "03",
    q: "Peut-on vous confier seulement une partie de notre informatique ?",
    a: "Oui. Vous pouvez nous déléguer l'intégralité de votre informatique comme un périmètre précis : le support utilisateurs, la sécurité, le cloud ou un projet applicatif. Nous intervenons aussi en renfort d'une DSI existante.",
  },
  {
    n: "04",
    q: "Intervenez-vous sur site ou à distance ?",
    a: "Les deux. La majorité des demandes se traite à distance, mais nous assurons également une présence sur site, ponctuelle ou permanente, selon vos besoins et vos implantations.",
  },
  {
    n: "05",
    q: "Comment démarre une collaboration ?",
    a: "Par un audit de votre parc et de vos usages, sans engagement. Nous en tirons un plan d'action chiffré et priorisé, puis une reprise progressive du périmètre pour ne rien interrompre côté utilisateurs.",
  },
  {
    n: "06",
    q: "Vos contrats sont-ils engageants ?",
    a: "Nos contrats d'infogérance sont annuels et reconductibles, avec un préavis clair. Les prestations ponctuelles et les projets se font au forfait ou en régie, sans engagement de durée.",
  },
];

function Item({
  it,
  i,
  open,
  onToggle,
}: {
  it: (typeof items)[number];
  i: number;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12%" }}
      transition={{ duration: 0.7, ease: EASE, delay: i * 0.05 }}
      className="border-b border-white/15"
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`faq-${it.n}`}
        className="group flex w-full cursor-pointer items-start gap-5 py-6 text-left sm:gap-8 sm:py-7"
      >
        <span
          className={`font-quote mt-1 w-6 shrink-0 text-base italic transition-colors duration-300 sm:w-8 sm:text-lg ${
            open ? "text-white" : "text-white/40 group-hover:text-white"
          }`}
        >
          {it.n}
        </span>

        <span className="flex-1 text-[clamp(1.05rem,2.1vw,1.6rem)] font-semibold leading-snug tracking-tight transition-transform duration-500 ease-out group-hover:translate-x-1.5">
          {it.q}
        </span>

        {/* + qui devient − : seule la barre verticale s'escamote */}
        <span
          aria-hidden
          className="relative mt-2 h-4 w-4 shrink-0 sm:h-5 sm:w-5"
        >
          <span className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 bg-white" />
          <span
            className={`absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 bg-white transition-transform duration-500 ease-out ${
              open ? "scale-y-0" : "scale-y-100"
            }`}
          />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`faq-${it.n}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
            className="overflow-hidden"
          >
            {/* Aligné sur le texte de la question (largeur du numéro + gap) */}
            <p className="max-w-2xl pb-8 pl-11 text-sm leading-relaxed text-white/60 sm:pb-9 sm:pl-16 sm:text-base">
              {it.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Faq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" data-nav-dark className="bg-black text-white">
      <div className="mx-auto grid max-w-[1600px] gap-12 px-5 py-20 sm:px-10 sm:py-28 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:py-36">
        {/* Colonne épinglée : titre, numéro courant, relance */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="font-quote ml-[0.1em] text-2xl italic leading-none text-white/50 sm:text-3xl">
            vos
          </p>
          <h2 className="text-[clamp(2.5rem,7vw,6rem)] font-bold uppercase leading-[0.9] tracking-tight">
            Questions
          </h2>

          {/* Grand numéro hachuré : celui de la question ouverte, sinon le
              nombre total. Le chiffre glisse vers le haut à chaque changement. */}
          <div className="mt-6 h-[clamp(4.5rem,11vw,10rem)] overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={open ?? "total"}
                initial={{ y: "70%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                exit={{ y: "-70%", opacity: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="text-hatched-light text-[clamp(4.5rem,11vw,10rem)] font-bold leading-none tracking-tighter"
              >
                {open !== null
                  ? items[open].n
                  : String(items.length).padStart(2, "0")}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="mt-8 sm:mt-10">
            <p className="text-sm text-white/50">Une autre question ?</p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="group relative mt-2 inline-flex items-baseline gap-2"
            >
              <span className="font-quote text-xl italic leading-none text-white/55 transition-colors duration-300 group-hover:text-white sm:text-2xl">
                écrivez-
              </span>
              <span className="text-base font-bold uppercase leading-none tracking-tight sm:text-lg">
                nous
              </span>
              <span
                aria-hidden
                className="text-base leading-none transition-transform duration-300 group-hover:translate-x-1.5 sm:text-lg"
              >
                →
              </span>
              <span
                aria-hidden
                className="absolute -bottom-2 left-0 h-px w-full origin-left scale-x-0 bg-white transition-transform duration-500 ease-out group-hover:scale-x-100"
              />
            </a>
          </div>
        </div>

        {/* Accordéon */}
        <div className="border-t border-white/15">
          {items.map((it, i) => (
            <Item
              key={it.n}
              it={it}
              i={i}
              open={open === i}
              onToggle={() => setOpen((cur) => (cur === i ? null : i))}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
