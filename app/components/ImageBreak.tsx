"use client";

import { ZoomParallax } from "./zoom-parallax";

// Après l'index des formations : on arrive sur une image plein écran, puis le scroll
// DÉZOOME et révèle la mosaïque des autres visuels. C'est le `ZoomParallax` des
// expertises joué à l'envers (`direction="out"`), donc la page ouvre et referme
// sur le même geste. Images = PLACEHOLDERS.
// La première image est celle qui occupe l'écran au départ (elle est au centre,
// sans décalage) ; les six suivantes composent la mosaïque autour d'elle.
const mosaic = [
  {
    src: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1920&h=1280&fit=crop&crop=entropy&auto=format&q=80",
    alt: "",
  },
  {
    src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80",
    alt: "",
  },
  {
    src: "https://images.unsplash.com/photo-1557683316-973673baf926?w=800&h=800&fit=crop&crop=entropy&auto=format&q=80",
    alt: "",
  },
  {
    src: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80",
    alt: "",
  },
  {
    src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=800&fit=crop&crop=entropy&auto=format&q=80",
    alt: "",
  },
  {
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80",
    alt: "",
  },
  {
    src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80",
    alt: "",
  },
];

export default function ImageBreak() {
  return (
    <section data-nav-dark className="relative bg-black">
      <ZoomParallax images={mosaic} direction="out" />
    </section>
  );
}
