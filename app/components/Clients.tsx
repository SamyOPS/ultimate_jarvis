"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

// Bandeau clients (juste après les expertises). Intitulé serif en haut à gauche,
// puis deux lignes de logos qui défilent en sens opposés au scroll, entre de
// fins filets noirs. PLACEHOLDERS texte — à remplacer par les vrais logos.
const clients = [
  "Groupe Solaris",
  "Atlas Tech",
  "Méridian",
  "Néo Finance",
  "Volt Industries",
  "Cirrus",
  "Horizon",
  "Aurea",
  "Novéa",
  "Lumen",
  "Kairos",
  "Vertex",
];

const row1 = clients.slice(0, 6);
const row2 = clients.slice(6);

function Logo({ name }: { name: string }) {
  return (
    <span className="flex shrink-0 items-center justify-center px-10 text-lg font-bold tracking-tight text-zinc-900 sm:px-16 sm:text-xl">
      {name}
    </span>
  );
}

export default function Clients() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Ligne 1 vers la gauche, ligne 2 vers la droite (les rangées sont doublées
  // pour rester pleines sur les bords pendant le défilement).
  const x1 = useTransform(scrollYProgress, [0, 1], ["0vw", "-16vw"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["-16vw", "0vw"]);

  return (
    <section ref={ref} id="clients" className="bg-white pb-24 sm:pb-32">
      <div className="px-6 pt-24 sm:px-12 sm:pt-32">
        <p className="font-quote text-4xl text-zinc-900 sm:text-5xl">
          Ils nous font confiance
        </p>
      </div>

      <div className="mt-12">
        {/* Ligne 1 : défile vers la gauche */}
        <div className="overflow-hidden border-t border-zinc-900">
          <motion.div style={{ x: x1 }} className="flex w-max py-16 lg:py-24">
            {[...row1, ...row1].map((name, i) => (
              <Logo key={i} name={name} />
            ))}
          </motion.div>
        </div>

        {/* Ligne 2 : défile vers la droite */}
        <div className="overflow-hidden border-y border-zinc-900">
          <motion.div style={{ x: x2 }} className="flex w-max py-16 lg:py-24">
            {[...row2, ...row2].map((name, i) => (
              <Logo key={i} name={name} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
