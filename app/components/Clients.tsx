"use client";

import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef } from "react";

// Logos clients (public/Image/logo_client).
// invert=true  : logo blanc sur fond transparent -> `brightness-0` = noir.
// invert=false : logo en couleur sur fond blanc opaque (ou .webp non vérifié)
//                -> `mix-blend-multiply` fait disparaître le fond blanc et
//                affiche le logo dans sa couleur d'origine (pas de carré noir).
const logos: { src: string; alt: string; invert: boolean; big?: boolean }[] = [
  { src: "/Image/logo_client/3M.png", alt: "3M", invert: true },
  { src: "/Image/logo_client/barriere.png", alt: "Barrière", invert: true },
  { src: "/Image/logo_client/bnp%20paribas.png", alt: "BNP Paribas", invert: true },
  { src: "/Image/logo_client/groupe-bpce.png", alt: "BPCE", invert: true },
  { src: "/Image/logo_client/burberry.png", alt: "Burberry", invert: true },
  { src: "/Image/logo_client/cgi.png", alt: "CGI", invert: true },
  { src: "/Image/logo_client/bureau_veritas.png", alt: "Bureau Veritas", invert: true },
  { src: "/Image/logo_client/engie.png", alt: "Engie", invert: true },
  { src: "/Image/logo_client/ethypharm.png", alt: "Ethypharm", invert: true },
  { src: "/Image/logo_client/foncia.png", alt: "Foncia", invert: true },
  { src: "/Image/logo_client/hp.png", alt: "HP", invert: false },
  { src: "/Image/logo_client/inli.png", alt: "In'li", invert: true },
  { src: "/Image/logo_client/les_mousquetaires.png", alt: "Les Mousquetaires", invert: true },
  { src: "/Image/logo_client/riccobono.png", alt: "Riccobono", invert: true },
  { src: "/Image/logo_client/lvmh.png", alt: "LVMH", invert: true },
  { src: "/Image/logo_client/sisley.png", alt: "Sisley", invert: true },
  { src: "/Image/logo_client/sncf.png", alt: "SNCF", invert: true },
  { src: "/Image/logo_client/stihl.png", alt: "Stihl", invert: false },
  { src: "/Image/logo_client/tpicap.png", alt: "TP ICAP", invert: true },
  { src: "/Image/logo_client/uniqlo.png", alt: "Uniqlo", invert: false },
  { src: "/Image/logo_client/apprentis-auteuil.png", alt: "Apprentis d'Auteuil", invert: true, big: true },
  { src: "/Image/logo_client/jacquemus.png", alt: "Jacquemus", invert: true, big: true },
];

const row1 = logos.slice(0, 7);
const row2 = logos.slice(7, 14);
const row3 = logos.slice(14);

function Logo({
  src,
  alt,
  invert,
  big,
}: {
  src: string;
  alt: string;
  invert: boolean;
  big?: boolean;
}) {
  return (
    <span className="flex shrink-0 items-center justify-center px-8 sm:px-14">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        draggable={false}
        className={`w-auto max-w-[190px] object-contain ${
          big ? "h-10 sm:h-14 lg:h-16 2xl:h-20" : "h-6 sm:h-9 lg:h-10 2xl:h-12"
        } ${invert ? "brightness-0" : "mix-blend-multiply"}`}
      />
    </span>
  );
}

// Une ligne : couche pilotée par le scroll (translation auto) + couche
// draggable par-dessus (glisser à la main). Les deux transforms se cumulent.
function Row({
  x,
  items,
  last,
}: {
  x: MotionValue<string>;
  items: typeof logos;
  last?: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={wrapRef}
      className={`overflow-hidden border-zinc-900 ${last ? "border-y" : "border-t"}`}
    >
      <motion.div style={{ x }}>
        <motion.div
          drag="x"
          dragConstraints={wrapRef}
          dragElastic={0.08}
          className="flex w-max cursor-grab py-5 active:cursor-grabbing sm:py-10 lg:py-14 2xl:py-24"
        >
          {[...items, ...items].map((logo, i) => (
            <Logo
              key={i}
              src={logo.src}
              alt={logo.alt}
              invert={logo.invert}
              big={logo.big}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function Clients() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Ligne 1 vers la gauche, ligne 2 vers la droite, ligne 3 vers la gauche
  // (rangées doublées pour rester pleines sur les bords pendant le défilement).
  const x1 = useTransform(scrollYProgress, [0, 1], ["0vw", "-16vw"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["-16vw", "0vw"]);
  const x3 = useTransform(scrollYProgress, [0, 1], ["0vw", "-22vw"]);

  return (
    <section ref={ref} id="clients" className="bg-white pb-8 sm:pb-16 lg:pb-20 2xl:pb-32">
      <div className="px-6 pt-12 sm:px-12 sm:pt-20 lg:pt-24 2xl:pt-32">
        <p className="font-quote text-2xl text-zinc-900 sm:text-3xl lg:text-4xl 2xl:text-5xl">
          Ils nous font confiance
        </p>
      </div>

      <div className="mt-6 sm:mt-10 lg:mt-12">
        {/* Défilement auto (scroll) + glisser à la main */}
        <Row x={x1} items={row1} />
        <Row x={x2} items={row2} />
        <Row x={x3} items={row3} last />
      </div>
    </section>
  );
}
