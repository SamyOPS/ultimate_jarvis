"use client";

import {
  motion,
  useInView,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef } from "react";

interface Image {
  src: string;
  alt?: string;
}

interface ZoomParallaxProps {
  /** Tableau d'images affichées dans l'effet parallaxe (7 max) */
  images: Image[];
  /** Titre révélé lettre par lettre au fil du scroll (optionnel) */
  title?: string;
}

// Une lettre qui monte depuis sa ligne (comme les textes du menu), mais pilotée
// par la progression du scroll plutôt que par le temps.
function RevealLetter({
  char,
  progress,
  start,
  end,
}: {
  char: string;
  progress: MotionValue<number>;
  start: number;
  end: number;
}) {
  const y = useTransform(progress, [start, end], ["120%", "0%"]);
  return (
    <span aria-hidden className="reveal-mask">
      <motion.span className="inline-block" style={{ y }}>
        {char}
      </motion.span>
    </span>
  );
}

export function ZoomParallax({ images, title }: ZoomParallaxProps) {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4]);
  const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
  const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
  const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8]);
  const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9]);

  const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9];

  // Déclenche la révélation « en volet » des images quand le parallaxe entre
  // à l'écran (fiable, contrairement à un whileInView par image dans le sticky).
  const inView = useInView(container, { once: true, amount: 0.1 });

  const letters = title ? [...title] : [];

  return (
    <div ref={container} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {images.map(({ src, alt }, index) => {
          const scale = scales[index % scales.length];

          return (
            <motion.div
              key={index}
              style={{ scale }}
              className={`absolute top-0 flex h-full w-full items-center justify-center ${index === 1 ? "[&>div]:!-top-[30vh] [&>div]:!left-[5vw] [&>div]:!h-[30vh] [&>div]:!w-[35vw]" : ""} ${index === 2 ? "[&>div]:!-top-[10vh] [&>div]:!-left-[25vw] [&>div]:!h-[45vh] [&>div]:!w-[20vw]" : ""} ${index === 3 ? "[&>div]:!left-[27.5vw] [&>div]:!h-[25vh] [&>div]:!w-[25vw]" : ""} ${index === 4 ? "[&>div]:!top-[27.5vh] [&>div]:!left-[5vw] [&>div]:!h-[25vh] [&>div]:!w-[20vw]" : ""} ${index === 5 ? "[&>div]:!top-[27.5vh] [&>div]:!-left-[22.5vw] [&>div]:!h-[25vh] [&>div]:!w-[30vw]" : ""} ${index === 6 ? "[&>div]:!top-[22.5vh] [&>div]:!left-[25vw] [&>div]:!h-[15vh] [&>div]:!w-[15vw]" : ""} `}
            >
              <motion.div
                className="relative h-[25vh] w-[25vw]"
                initial={{ clipPath: "inset(0 0 100% 0)" }}
                animate={{
                  clipPath: inView ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)",
                }}
                transition={{
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                  delay: index * 0.08,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src || "/placeholder.svg"}
                  alt={alt || `Image parallaxe ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </motion.div>
            </motion.div>
          );
        })}

        {/* Titre révélé progressivement pendant le zoom (transition vers la
            section expertises) */}
        {title && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-4">
            <h2 className="text-center font-sans text-[clamp(2.5rem,12vw,11rem)] font-bold uppercase leading-none tracking-tight text-white">
              <span aria-label={title}>
                {letters.map((char, i) => {
                  const start = 0.55 + (i / letters.length) * 0.3;
                  const end = start + 0.15;
                  return (
                    <RevealLetter
                      key={i}
                      char={char}
                      progress={scrollYProgress}
                      start={start}
                      end={end}
                    />
                  );
                })}
              </span>
            </h2>
          </div>
        )}
      </div>
    </div>
  );
}
