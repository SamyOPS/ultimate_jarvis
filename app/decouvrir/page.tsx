import Menu from "../components/Menu";
import Mission from "../components/Mission";
import ScrollToTarget from "../components/ScrollToTarget";
import ScrollUpHome from "../components/ScrollUpHome";
import { ZoomParallax } from "../components/zoom-parallax";
import ExpertiseGallery from "../components/ExpertiseGallery";
import Clients from "../components/Clients";
import Offres from "../components/Offres";

// Images du parallaxe — PLACEHOLDERS (à remplacer par tes visuels de marque).
const showcaseImages = [
  {
    src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80",
    alt: "Architecture moderne",
  },
  {
    src: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80",
    alt: "Ville au coucher du soleil",
  },
  {
    src: "https://images.unsplash.com/photo-1557683316-973673baf926?w=800&h=800&fit=crop&crop=entropy&auto=format&q=80",
    alt: "Motif géométrique abstrait",
  },
  {
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80",
    alt: "Paysage de montagne",
  },
  {
    src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=800&fit=crop&crop=entropy&auto=format&q=80",
    alt: "Éléments de design minimaliste",
  },
  {
    src: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80",
    alt: "Vagues et plage",
  },
  {
    src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1280&h=720&fit=crop&crop=entropy&auto=format&q=80",
    alt: "Forêt et lumière",
  },
];

export default function DecouvrirPage() {
  return (
    <main>
      {/* Défile vers la section demandée si on arrive avec une cible (#...) */}
      <ScrollToTarget />

      {/* En haut de page, scroller vers le haut ramène à l'accueil */}
      <ScrollUpHome />

      <Menu />

      {/* Discours */}
      <Mission />

      {/* Parallaxe zoom : sert de transition vers la section expertises.
          Le titre « Expertises » se dévoile au fil du scroll pendant le zoom.
          Fond noir → barre en blanc. */}
      <section data-nav-dark className="relative bg-black">
        <ZoomParallax images={showcaseImages} title="Expertises" eyebrow="nos" />

        {/* Cible du lien « Expertises » : positionnée à la fin du zoom (progress
            ~1, à 200vh sur les 300vh), quand le titre est entièrement affiché. */}
        <span
          id="expertises"
          aria-hidden
          className="pointer-events-none absolute left-0 top-[200vh]"
        />
      </section>

      {/* Détail des expertises : galerie horizontale (fond blanc) */}
      <ExpertiseGallery />

      {/* Section clients : le scroll vertical reprend après la galerie */}
      <Clients />

      {/* Section offres : image plein écran + grand titre révélé */}
      <Offres />
    </main>
  );
}
