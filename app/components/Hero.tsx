"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ignited, setIgnited] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

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
      {/* Réacteur (vidéo puis image) avec parallaxe 3D au curseur */}
      <div
        className="absolute inset-0 transition-transform duration-300 ease-out"
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

      {/* Navbar */}
      <Navbar />

      {/* « VI » (6 en chiffres romains), style hachuré, en haut à droite */}
      <span
        aria-hidden
        className="pointer-events-none absolute right-8 top-[32%] z-20 -translate-y-1/2 select-none font-sans text-8xl font-bold leading-none tracking-tight sm:right-12 sm:text-[12rem]"
      >
        {["V", "I"].map((char, i) => (
          <span
            key={i}
            className="animate-letter bg-clip-text text-transparent"
            style={{
              animationDelay: `${0.6 + i * 0.12}s`,
              backgroundImage:
                "repeating-linear-gradient(45deg, #18181b 0, #18181b 1.5px, transparent 1.5px, transparent 7px)",
            }}
          >
            {char}
          </span>
        ))}
      </span>

      {/* Citation, à gauche, centrée verticalement, animée lettre par lettre */}
      <figure className="pointer-events-none absolute left-8 top-[32%] z-20 max-w-xs -translate-y-1/2 sm:left-12 sm:max-w-sm">
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
                  <span
                    key={ci}
                    aria-hidden
                    className="animate-letter"
                    style={{
                      animationDelay: `${quoteBaseDelay + letterIndex * quoteStep}s`,
                    }}
                  >
                    {char}
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

      {/* Titre de marque, en bas de page, gros et impactant, fondu à l'arrivée */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center px-2 pb-8 sm:pb-12">
        <h1 className="animate-fade-in whitespace-nowrap font-sans text-center text-[10vw] font-bold uppercase leading-none tracking-tight text-zinc-900">
          Jarvis Connect
        </h1>
      </div>
    </section>
  );
}
