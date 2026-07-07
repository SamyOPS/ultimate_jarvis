"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePageTransition } from "./PageTransition";

// Révélation masquée lettre par lettre au chargement (même effet que la citation).
function RevealText({
  text,
  base = 0,
  step = 0.03,
  className,
}: {
  text: string;
  base?: number;
  step?: number;
  className?: string;
}) {
  let idx = -1;
  const words = text.split(" ");
  return (
    <span className={className} aria-label={text}>
      {words.map((word, wi) => (
        <span
          key={wi}
          className={`inline-block whitespace-nowrap${
            wi < words.length - 1 ? " mr-[0.25em]" : ""
          }`}
        >
          {[...word].map((char, ci) => {
            idx += 1;
            return (
              <span key={ci} aria-hidden className="reveal-mask">
                <span
                  className="reveal-inner"
                  style={{ animationDelay: `${base + idx * step}s` }}
                >
                  {char}
                </span>
              </span>
            );
          })}
        </span>
      ))}
    </span>
  );
}

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ignited, setIgnited] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const { navigate } = usePageTransition();

  // Bascule sur l'image du réacteur allumé pour simuler un allumage constant.
  const ignite = () => setIgnited(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Accessibilité : si l'utilisateur préfère réduire les animations, on
    // affiche directement le réacteur allumé. Sinon, filet de sécurité au cas
    // où la vidéo ne se charge pas (autoplay bloqué, erreur réseau…).
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const delay = reduceMotion ? 0 : 12000;
    const timer = window.setTimeout(ignite, delay);
    return () => window.clearTimeout(timer);
  }, []);

  // Parallaxe : le réacteur s'incline légèrement en suivant le curseur (3D).
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const { innerWidth, innerHeight } = window;
    const x = (e.clientX / innerWidth - 0.5) * 2; // -1 → 1
    const y = (e.clientY / innerHeight - 0.5) * 2; // -1 → 1
    setTilt({ x, y });
  };

  const resetTilt = () => setTilt({ x: 0, y: 0 });

  // Bouton « Nous découvrir » : transition (fondu au noir) vers la page
  // découverte (discours, expertises, offres).
  const discover = () => {
    navigate("/decouvrir");
  };

  // Citation : animée lettre par lettre (cascade verticale) après le titre.
  const quote = "Records are made to be broken!";
  const quoteBaseDelay = 1.3; // s, après l'apparition du titre
  const quoteStep = 0.04; // s entre chaque lettre
  const quoteLetterCount = quote.replace(/\s/g, "").length;
  const captionDelay = quoteBaseDelay + quoteLetterCount * quoteStep + 0.25;
  let letterIndex = -1; // incrémenté uniquement sur les caractères visibles

  return (
    <section
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTilt}
      className="relative h-dvh w-full overflow-hidden bg-white"
      style={{ perspective: "1200px" }}
    >
      {/* Réacteur (vidéo puis image) avec parallaxe 3D au curseur.
          Sur portable (écran court) : léger retrait vertical pour dégager le titre. */}
      <div
        className="absolute inset-0 transition-transform duration-300 ease-out laptop:inset-y-[6%]"
        style={{
          transform: `rotateY(${tilt.x * 4}deg) rotateX(${-tilt.y * 4}deg) translateX(${tilt.x * 8}px) translateY(${tilt.y * 8}px)`,
        }}
      >
        {/* Vidéo d'allumage du réacteur en fond plein écran.
            Elle s'efface une fois l'image allumée prête (le ratio de la vidéo
            diffère du PNG, sa lueur dépasserait sinon les bords de l'image). */}
        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full object-contain mix-blend-multiply transition-opacity duration-1000 ${
            ignited ? "opacity-0" : "opacity-100"
          }`}
          src="/Video/allumage_reacteur_v1.mp4"
          autoPlay
          muted
          playsInline
          preload="auto"
          onEnded={ignite}
        />

        {/* Image du réacteur allumé : prend le relais à la fin de la vidéo (fixe) */}
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ${
            ignited ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src="/Image/reacteur_ark_allume_de_fasse.png"
            alt="Réacteur Ark allumé"
            fill
            priority
            sizes="100vw"
            className="object-contain mix-blend-multiply"
          />

          {/* Halo lumineux qui respire au centre du réacteur */}
          <div
            aria-hidden
            className="animate-core pointer-events-none absolute left-[58%] top-[62%] h-[28vmin] w-[28vmin] -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
            style={{
              background:
                "radial-gradient(circle, rgba(220,240,255,0.95) 0%, rgba(150,210,255,0.55) 45%, rgba(255,255,255,0) 70%)",
            }}
          />
        </div>
      </div>

      {/* Flash de bloom au moment exact de l'allumage */}
      {ignited && (
        <div
          aria-hidden
          className="animate-bloom pointer-events-none absolute left-1/2 top-[46%] h-[50vmin] w-[50vmin] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(160,220,255,0.6) 40%, rgba(255,255,255,0) 70%)",
          }}
        />
      )}

      {/* Phrase d'accroche + mots clés, centrés en haut de page */}
      <div className="pointer-events-none absolute left-1/2 top-10 z-20 flex max-w-2xl -translate-x-1/2 flex-col items-center gap-4 px-4 text-center sm:top-12">
        <p
          className="animate-fade-in text-2xl font-semibold leading-snug text-zinc-800 sm:text-4xl"
          style={{ animationDelay: "0.5s" }}
        >
          Propulsez vos projets IT &amp; digital.
        </p>
        <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500 sm:text-sm">
          <RevealText text="Support" base={1.5} step={0.03} />
          <span className="text-zinc-300">·</span>
          <RevealText text="Développement" base={1.7} step={0.03} />
          <span className="text-zinc-300">·</span>
          <RevealText text="Sécurité" base={2} step={0.03} />
        </div>
      </div>

      {/* « VI » (6 en chiffres romains), style hachuré, en haut à droite */}
      <span
        aria-hidden
        className="pointer-events-none absolute right-8 top-[32%] z-20 -translate-y-1/2 select-none font-sans text-8xl font-bold leading-none tracking-tight sm:right-12 sm:text-[12rem] laptop:top-[42%]"
      >
        {["V", "I"].map((char, i) => (
          <span key={i} className="reveal-mask">
            <span
              className="reveal-inner bg-clip-text text-transparent"
              style={{
                animationDelay: `${quoteBaseDelay + i * 0.12}s`,
                backgroundImage:
                  "repeating-linear-gradient(45deg, #18181b 0, #18181b 1.5px, transparent 1.5px, transparent 7px)",
              }}
            >
              {char}
            </span>
          </span>
        ))}
      </span>

      {/* Citation, à gauche, centrée verticalement, animée lettre par lettre */}
      <figure className="pointer-events-none absolute left-8 top-[32%] z-20 max-w-xs -translate-y-1/2 sm:left-12 sm:max-w-sm laptop:top-[42%]">
        <span
          aria-hidden
          className="animate-fade-in block font-sans text-5xl font-bold leading-none text-zinc-900"
          style={{ animationDelay: `${quoteBaseDelay - 0.2}s` }}
        >
          “
        </span>
        <blockquote
          aria-label={quote}
          className="mt-1 font-sans text-xl font-bold uppercase leading-snug tracking-tight text-zinc-900 sm:text-2xl"
        >
          {quote.split(" ").map((word, wi, words) => (
            <span
              key={wi}
              className={`inline-block whitespace-nowrap${
                wi < words.length - 1 ? " mr-[0.25em]" : ""
              }`}
            >
              {[...word].map((char, ci) => {
                letterIndex += 1;
                return (
                  <span key={ci} aria-hidden className="reveal-mask">
                    <span
                      className="reveal-inner"
                      style={{
                        animationDelay: `${quoteBaseDelay + letterIndex * quoteStep}s`,
                      }}
                    >
                      {char}
                    </span>
                  </span>
                );
              })}
            </span>
          ))}
        </blockquote>
        <figcaption
          className="animate-fade-in mt-4 text-sm font-normal text-zinc-500"
          style={{ animationDelay: `${captionDelay}s` }}
        >
          T.S.
        </figcaption>
      </figure>

      {/* Titre de marque + bouton, en bas de page, fondu à l'arrivée */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-5 px-2 pb-8 sm:pb-12">
        <h1 className="animate-fade-in whitespace-nowrap font-sans text-center text-[10vw] font-bold uppercase leading-none tracking-tight text-zinc-900 laptop:text-[8vw]">
          Jarvis Connect
        </h1>

        {/* Bouton de découverte : même style que « Contactez nous », en plus
            grand. Transition (fondu au noir) vers /decouvrir. */}
        <button
          type="button"
          onClick={discover}
          className="animate-fade-in pointer-events-auto inline-flex items-center gap-2 rounded-full border border-zinc-900 px-8 py-4 text-sm font-semibold uppercase tracking-tight text-zinc-900 transition-colors duration-300 hover:bg-zinc-900 hover:text-white"
          style={{ animationDelay: "2.4s" }}
        >
          Nous découvrir
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="19 12 12 19 5 12" />
          </svg>
        </button>
      </div>

    </section>
  );
}
