"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// Paragraphes de la section mission (le premier sert d'accroche).
const paragraphs = [
  "Chez Jarvis Connect, nous croyons que la technologie n’a de valeur que lorsqu’elle rapproche les idées, les talents et les ambitions.",
  "Notre mission est d’accompagner les entreprises dans leur transformation numérique avec des solutions fiables, agiles et humaines. En tant qu’ESN, nous mettons l’expertise de nos équipes au service de vos projets, de vos enjeux métiers et de votre croissance.",
  "Nous avançons avec une conviction forte : chaque collaboration doit créer un impact durable, mesurable et utile.",
];

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

  // Classe de révélation (fondu + légère montée) et délai en cascade.
  const reveal = `transition-all duration-700 ease-out ${
    shown ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
  }`;
  const delay = (i: number) => ({
    transitionDelay: shown ? `${i * 150}ms` : "0ms",
  });

  return (
    <section
      ref={ref}
      data-nav-dark
      className="relative z-10 flex min-h-dvh items-center bg-black px-6 py-28 text-white sm:px-12"
    >
      <div className="font-quote mx-auto max-w-3xl">
        {paragraphs.map((text, i) => (
          <p
            key={i}
            className={`${reveal} ${
              i === 0
                ? "text-3xl leading-snug text-white sm:text-4xl"
                : "mt-6 text-xl leading-relaxed text-white/70 sm:text-2xl"
            }`}
            style={delay(i)}
          >
            {text}
          </p>
        ))}

        <p
          className={`mt-10 text-3xl tracking-tight text-white sm:text-4xl ${reveal}`}
          style={delay(paragraphs.length)}
        >
          Bienvenue chez Jarvis Connect.
        </p>

        {/* Signature manuscrite : l'image est noire, on l'inverse en blanc
            pour la rendre visible sur le panneau noir. */}
        <Image
          src="/Image/signature.png"
          alt="Signature"
          width={2508}
          height={627}
          className={`mt-8 ml-auto block h-auto w-72 -rotate-[12deg] invert sm:w-96 ${reveal}`}
          style={delay(paragraphs.length + 1)}
        />
      </div>
    </section>
  );
}
