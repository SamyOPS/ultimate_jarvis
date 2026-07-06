"use client";

import { useEffect } from "react";

// À l'arrivée sur l'accueil avec une cible de défilement (venant d'une autre
// page) : on affiche d'abord le haut de l'accueil (le hero), puis, une fois le
// voile de transition dissipé, on défile en douceur jusqu'à la section choisie.
//
// La cible est passée par sessionStorage (fiable à travers la navigation). On
// accepte aussi une ancre d'URL (#section) pour les liens ouverts directement.
// Important : on NE renvoie PAS de cleanup qui annulerait le timeout — sinon,
// en dev (StrictMode), le double montage de l'effet annulerait le défilement.
export default function HashScroll() {
  useEffect(() => {
    let target = "";
    try {
      target = sessionStorage.getItem("jc:scrollTarget") || "";
      if (target) sessionStorage.removeItem("jc:scrollTarget");
    } catch {
      /* sessionStorage indisponible : on ignore */
    }

    if (!target && window.location.hash.length > 1) {
      target = window.location.hash;
      window.history.replaceState(null, "", window.location.pathname);
    }

    if (!target) return;

    // Départ tout en haut de l'accueil, puis défilement doux après la
    // révélation de la page.
    window.scrollTo(0, 0);
    window.setTimeout(() => {
      document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
    }, 900);
  }, []);

  return null;
}
