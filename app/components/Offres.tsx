"use client";

import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef, useState } from "react";

// Réglages (progression du scroll : 0 → 1).
// Séquence : texte pleinement visible → fondu net → (texte disparu) → escalier.
const BANDS = 5; // nombre de marches
const OPEN_START = 0.3; // la marche du bas s'ouvre (l'image commence à s'ouvrir)
const STAGGER = 0.1; // décalage d'ouverture entre deux marches
const DURATION = 0.26; // durée d'ouverture d'une marche
// Titre : affiché tant que l'image est entière, masqué juste avant l'ouverture.
// Deux seuils (hystérésis) pour éviter tout clignotement « disparaît/réapparaît »
// sur un petit mouvement de scroll ou le jitter d'épinglage :
//  - on MASQUE en franchissant HIDE_AT (juste avant l'ouverture) ;
//  - on ne RÉAFFICHE qu'en repassant sous SHOW_AT (bien plus bas) ;
//  - entre les deux, l'état ne change pas.
const TITLE_HIDE_AT = OPEN_START - 0.06; // 0.24
const TITLE_SHOW_AT = 0.1;
const BLEED = 0.5; // léger chevauchement vertical entre marches (anti-liseré)
// L'image étant opaque (assombrie via brightness), les recouvrements ne
// cumulent aucune transparence : pas de couture visible entre les morceaux.

// Le « capot » : image plein écran assombrie (sans voile semi-transparent, pour
// éviter le cumul dans les zones de recouvrement). Rendu à l'identique dans
// chaque moitié de chaque marche.
function Cover() {
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&h=1280&fit=crop&crop=entropy&auto=format&q=80"
      alt=""
      draggable={false}
      className="h-full w-full object-cover brightness-[0.8]"
    />
  );
}

// Une marche : bande horizontale du capot, coupée en deux au centre. Ses deux
// moitiés s'écartent au scroll. La marche du bas s'ouvre en premier.
function Band({
  index,
  progress,
}: {
  index: number;
  progress: MotionValue<number>;
}) {
  const fromBottom = BANDS - 1 - index; // 0 pour la marche du bas
  const start = OPEN_START + fromBottom * STAGGER;
  const end = start + DURATION;
  const leftX = useTransform(progress, [start, end], ["0%", "-100%"]);
  const rightX = useTransform(progress, [start, end], ["0%", "100%"]);

  // Découpe verticale de la bande (avec un léger débord pour éviter un liseré).
  const top = index === 0 ? 0 : (index / BANDS) * 100 - BLEED;
  const bottom =
    index === BANDS - 1 ? 0 : ((BANDS - 1 - index) / BANDS) * 100 - BLEED;

  return (
    <>
      {/* Moitié gauche (glisse vers la gauche) — recouvrement de 0,5 % au centre */}
      <motion.div
        style={{ x: leftX, clipPath: `inset(${top}% 49.5% ${bottom}% 0)` }}
        className="absolute inset-0 z-10"
      >
        <Cover />
      </motion.div>
      {/* Moitié droite (glisse vers la droite) */}
      <motion.div
        style={{ x: rightX, clipPath: `inset(${top}% 0 ${bottom}% 49.5%)` }}
        className="absolute inset-0 z-10"
      >
        <Cover />
      </motion.div>
    </>
  );
}

// Titre « nos Offres d'emploi » : calque unique au-dessus du capot. Affiché/
// masqué par un état à hystérésis (voir seuils ci-dessus) ; le fondu est une
// transition CSS basée sur le TEMPS (pas sur la position exacte du scroll),
// donc il ne peut pas « repartir en arrière » au moindre soubresaut.
function TitleOverlay({ progress }: { progress: MotionValue<number> }) {
  const [hidden, setHidden] = useState(false);
  useMotionValueEvent(progress, "change", (v) => {
    if (v >= TITLE_HIDE_AT) setHidden(true); // seuil haut → on masque
    else if (v <= TITLE_SHOW_AT) setHidden(false); // seuil bas → on réaffiche
    // entre les deux : on ne touche à rien (hystérésis)
  });

  return (
    <div
      className={`pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-4 transition-all duration-500 ease-out ${
        hidden ? "-translate-y-4 opacity-0" : "translate-y-0 opacity-100"
      }`}
    >
      <div className="flex flex-col items-start">
        <span className="mb-1 ml-[0.1em] font-quote text-[clamp(1.1rem,3.5vw,2.5rem)] italic leading-none text-white/90">
          nos
        </span>
        <h2 className="text-[clamp(2.5rem,9vw,8rem)] font-bold uppercase leading-[0.95] tracking-tight text-white">
          Offres
        </h2>
        <span className="mt-1 mr-[0.1em] self-end font-quote text-[clamp(1.1rem,3.5vw,2.5rem)] italic leading-none text-white/90">
          d&apos;emploi
        </span>
      </div>
    </div>
  );
}

// Ce qui apparaît derrière l'image une fois les marches ouvertes.
// Pour l'instant : simple fond noir (le contenu des offres viendra plus tard).
function OffersBehind() {
  return <div className="absolute inset-0 bg-black" />;
}

export default function Offres() {
  // Section haute + capot épinglé (sticky) : le scroll efface le texte puis
  // écarte les marches.
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  return (
    <section
      ref={sectionRef}
      id="offres"
      data-nav-dark
      className="relative h-[350vh] scroll-mt-24 bg-black"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Contenu révélé derrière */}
        <OffersBehind />

        {/* Capot en marches (du bas vers le haut) */}
        {Array.from({ length: BANDS }, (_, i) => (
          <Band key={i} index={i} progress={scrollYProgress} />
        ))}

        {/* Titre, qui s'efface avant l'escalier */}
        <TitleOverlay progress={scrollYProgress} />
      </div>
    </section>
  );
}
