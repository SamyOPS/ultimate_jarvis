"use client";

import Image from "next/image";
import { Fragment, useEffect, useRef, useState } from "react";

// Paragraphes de la section mission (le premier sert d'accroche).
const paragraphs = [
  "Chez Jarvis Connect, nous croyons que la technologie n’a de valeur que lorsqu’elle rapproche les idées, les talents et les ambitions.",
  "Notre mission est d’accompagner les entreprises dans leur transformation numérique avec des solutions fiables, agiles et humaines. En tant qu’ESN, nous mettons l’expertise de nos équipes au service de vos projets, de vos enjeux métiers et de votre croissance.",
  "Nous avançons avec une conviction forte : chaque collaboration doit créer un impact durable, mesurable et utile.",
];

const CLOSING = "Bienvenue chez Jarvis Connect.";
const STEP = 6; // ms entre chaque lettre (cascade continue)

// Compte les caractères hors espaces (base de délai de la lettre suivante).
const visibleLen = (t: string) => t.replace(/\s/g, "").length;

// Index de départ (en lettres) de chaque bloc, pour une cascade continue sur
// tout le discours. Calculé une fois, hors rendu (les textes sont constants).
let acc = 0;
const blocks = paragraphs.map((text) => {
  const start = acc;
  acc += visibleLen(text);
  return { text, start };
});
const closingStart = acc;
acc += visibleLen(CLOSING);
const signatureDelay = acc * STEP + 150;

// Révélation lettre par lettre : chaque lettre monte depuis sa ligne (masque),
// en cascade. Même effet que les catégories du menu, piloté par `shown`.
// `start` = nombre de lettres déjà passées avant ce bloc (cascade continue).
function RevealText({
  text,
  shown,
  start,
  className,
}: {
  text: string;
  shown: boolean;
  start: number;
  className?: string;
}) {
  const words = text.split(" ");
  let idx = -1;
  return (
    <span aria-label={text} className={className}>
      {words.map((word, wi) => (
        <Fragment key={wi}>
          <span className="inline-block whitespace-nowrap">
            {[...word].map((char, ci) => {
              idx += 1;
              const delay = (start + idx) * STEP;
              return (
                <span key={ci} aria-hidden className="reveal-mask-text">
                  <span
                    className={`inline-block transition-transform duration-700 ease-out ${
                      shown ? "translate-y-0" : "translate-y-[135%]"
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

export default function Mission() {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  // Révèle le texte quand la section entre dans le viewport (au scroll).
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
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      data-nav-dark
      className="relative z-10 flex min-h-dvh items-center bg-black px-6 py-28 text-white sm:px-12"
    >
      <div className="font-quote mx-auto max-w-3xl">
        {blocks.map(({ text, start }, i) => (
          <p
            key={i}
            className={
              i === 0
                ? "text-3xl leading-snug text-white sm:text-4xl"
                : "mt-6 text-xl leading-relaxed text-white/70 sm:text-2xl"
            }
          >
            <RevealText text={text} shown={shown} start={start} />
          </p>
        ))}

        <p className="mt-10 text-3xl tracking-tight text-white sm:text-4xl">
          <RevealText text={CLOSING} shown={shown} start={closingStart} />
        </p>

        {/* Signature manuscrite : l'image est noire, on l'inverse en blanc
            pour la rendre visible sur le panneau noir. Elle apparaît en fondu
            une fois le texte révélé. */}
        <Image
          src="/Image/signature.png"
          alt="Signature"
          width={2508}
          height={627}
          className={`mt-8 ml-auto block h-auto w-72 -rotate-[12deg] invert transition-all duration-700 ease-out sm:w-96 ${
            shown ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
          style={{ transitionDelay: shown ? `${signatureDelay}ms` : "0ms" }}
        />
      </div>
    </section>
  );
}
