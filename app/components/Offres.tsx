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

export default function Offres() {
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
      id="offres"
      className="scroll-mt-24 bg-[#96d2ff] text-zinc-900"
    >
      {/* Gros titre de section (même style que les autres sections) */}
      <header className="mx-auto max-w-7xl px-6 pt-32 sm:px-12 sm:pt-40">
        <h2
          ref={titleRef}
          className="text-center text-[clamp(2.5rem,9vw,8rem)] font-bold uppercase leading-[0.95] tracking-tight"
        >
          <RevealTitle text="Offres d'emploi" shown={titleShown} />
        </h2>
      </header>

      <div className="mx-auto max-w-3xl px-6 pb-32 pt-12 text-center sm:px-12">
        <p className="text-lg leading-relaxed text-zinc-800">
          Envie de rejoindre l’aventure Jarvis Connect ? Nos offres arrivent
          bientôt — le détail des postes viendra ici.
        </p>
      </div>
    </section>
  );
}
