"use client";

import { Fragment, useEffect, useRef, useState } from "react";

// Révélation lettre par lettre (masque + montée), comme les textes du menu.
// Se déclenche une seule fois quand la section entre à l'écran (pas piloté
// par la position du scroll).
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
              const delay = idx * 35;
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
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
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
      data-nav-dark
      className="relative flex min-h-dvh scroll-mt-24 items-center justify-center overflow-hidden bg-black"
    >
      {/* Image placeholder en fond plein écran */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&h=1280&fit=crop&crop=entropy&auto=format&q=80"
        alt=""
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Voile sombre pour la lisibilité du titre */}
      <div className="absolute inset-0 bg-black/45" />

      <div className="relative z-10 flex flex-col items-start px-4">
        {/* Petit « nos » en haut à gauche */}
        <span
          aria-hidden
          className={`mb-1 ml-[0.1em] block font-quote text-[clamp(1.1rem,3.5vw,2.5rem)] italic leading-none text-white/90 transition-all duration-700 ease-out ${
            shown ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          }`}
        >
          nos
        </span>

        {/* Grand titre « OFFRES » */}
        <h2
          ref={titleRef}
          className="text-[clamp(2.5rem,9vw,8rem)] font-bold uppercase leading-[0.95] tracking-tight text-white"
        >
          <RevealTitle text="Offres" shown={shown} />
        </h2>

        {/* Petit « d'emploi » en bas à droite, même style que « nos » */}
        <span
          aria-hidden
          className={`mt-1 mr-[0.1em] block self-end font-quote text-[clamp(1.1rem,3.5vw,2.5rem)] italic leading-none text-white/90 transition-all duration-700 ease-out ${
            shown ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          }`}
          style={{ transitionDelay: shown ? "350ms" : "0ms" }}
        >
          d&apos;emploi
        </span>
      </div>
    </section>
  );
}
