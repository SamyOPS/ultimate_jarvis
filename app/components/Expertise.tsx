"use client";

import { Fragment, useEffect, useRef, useState } from "react";

// Révélation lettre par lettre (masque + montée), comme les textes du menu.
function RevealTitle({ text, shown }: { text: string; shown: boolean }) {
  const words = text.split(" ");
  let idx = -1;
  return (
    <span aria-label={text}>
      {words.map((word, wi) => (
        <Fragment key={wi}>
          <span className="inline-block whitespace-nowrap">
            {[...word].map((char, ci) => {
              idx += 1;
              const delay = idx * 35; // ms entre chaque lettre (comme le menu)
              return (
                <span key={ci} aria-hidden className="reveal-mask">
                  <span
                    className={`inline-block transition-transform duration-700 ease-out ${
                      shown ? "translate-y-0" : "translate-y-full"
                    }`}
                    style={{ transitionDelay: shown ? `${delay}ms` : "0ms" }}
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

// Expertises de Jarvis Connect. Le survol d'une ligne (à droite) met à jour la
// colonne de gauche (titre, accroche, description).
const services = [
  {
    num: "01",
    name: "Support informatique",
    lead: "Une assistance réactive, au bon moment.",
    desc: "Nous prenons en charge le support de vos utilisateurs et l’infogérance de votre parc, pour des équipes toujours opérationnelles.",
    short: "Assistance utilisateurs et infogérance de votre parc.",
  },
  {
    num: "02",
    name: "Développement",
    lead: "Des solutions sur mesure, du besoin à la production.",
    desc: "Applications web, outils métiers et intégrations : nous concevons des solutions fiables, pensées pour vos process et vos utilisateurs.",
    short: "Applications et outils métiers sur mesure.",
  },
  {
    num: "03",
    name: "Cybersécurité",
    lead: "Protéger ce qui compte vraiment.",
    desc: "Audits, sécurisation des systèmes et sensibilisation des équipes : nous renforçons la protection de vos données et votre conformité.",
    short: "Audits, protection des données et conformité.",
  },
  {
    num: "04",
    name: "Infogérance & Cloud",
    lead: "Une infrastructure solide et évolutive.",
    desc: "Migration, supervision et gestion de vos environnements cloud pour une infrastructure disponible, sécurisée et maîtrisée.",
    short: "Migration, supervision et gestion cloud.",
  },
];

export default function Expertise() {
  const [active, setActive] = useState(0);
  const current = services[active];

  // Révèle le titre quand il entre dans le viewport (au scroll).
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [titleShown, setTitleShown] = useState(false);
  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setTitleShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="expertises"
      className="scroll-mt-24 bg-white text-zinc-900"
    >
      {/* Gros titre de section (même style que les pages légales) */}
      <header className="mx-auto max-w-7xl px-6 pt-32 sm:px-12 sm:pt-40">
        <h2
          ref={titleRef}
          className="text-center text-[clamp(2.5rem,9vw,8rem)] font-bold uppercase leading-[0.95] tracking-tight"
        >
          <RevealTitle text="Nos expertises" shown={titleShown} />
        </h2>
      </header>

      <div className="mx-auto grid max-w-7xl gap-12 px-6 pb-24 pt-16 sm:px-12 lg:grid-cols-2 lg:gap-20 lg:pb-32 lg:pt-24">
        {/* Colonne gauche : service actif + CTA */}
        <div className="lg:sticky lg:top-32 lg:h-fit lg:self-start">
          <p className="text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            {current.name}
          </p>
          <p className="mt-6 text-xl font-medium text-zinc-800">
            {current.lead}
          </p>
          <p className="mt-4 max-w-md leading-relaxed text-zinc-500">
            {current.desc}
          </p>

          <a
            href="#contact"
            className="group mt-8 flex max-w-md items-center justify-between rounded-md bg-[#96d2ff] px-4 py-2.5 text-zinc-900 transition-colors hover:bg-[#7cc4ff]"
          >
            <span className="text-xs font-semibold uppercase tracking-wide">
              En savoir plus
            </span>
            <span className="flex h-6 w-6 items-center justify-center rounded bg-black/10 transition-transform group-hover:translate-x-1">
              <svg
                className="h-3.5 w-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </span>
          </a>
        </div>

        {/* Colonne droite : liste des expertises numérotées */}
        <div>
          {services.map((s, i) => {
            const on = i === active;
            return (
              <button
                key={s.num}
                type="button"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                aria-pressed={on}
                className="block w-full border-t border-zinc-200 py-8 text-left last:border-b"
              >
                <div className="flex items-end justify-between gap-6">
                  <div>
                    <h3
                      className={`text-sm font-semibold uppercase tracking-[0.2em] transition-colors ${
                        on ? "text-zinc-900" : "text-zinc-300"
                      }`}
                    >
                      {s.name}
                    </h3>
                    <p
                      className={`mt-2 max-w-xs text-sm leading-snug transition-colors ${
                        on ? "text-zinc-500" : "text-zinc-300"
                      }`}
                    >
                      {s.short}
                    </p>
                  </div>
                  <span
                    className={`text-[clamp(4.5rem,15vw,14rem)] font-semibold leading-none tracking-tight transition-colors ${
                      on ? "text-zinc-900" : "text-zinc-200"
                    }`}
                  >
                    {s.num}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
