import Menu from "../components/Menu";
import Mission from "../components/Mission";
import ScrollToTarget from "../components/ScrollToTarget";
import ScrollUpHome from "../components/ScrollUpHome";
import { ZoomParallax } from "../components/zoom-parallax";
import ExpertiseGallery from "../components/ExpertiseGallery";
import Clients from "../components/Clients";
import Formations from "../components/Formations";
import ImageBreak from "../components/ImageBreak";
import Faq from "../components/Faq";
import { DEFENSE, ILLUSTRATIONS } from "../lib/images";
import Footer from "../components/Footer";

// Le premier cadre est celui sur lequel le zoom se referme, titre « nos
// Expertises » par-dessus : c'est l'image de la section. Les six autres
// composent la mosaïque autour — La Défense en est retirée pour ne pas s'y
// répéter, et la liste est complétée pour garder sept cadres.
const others = ILLUSTRATIONS.filter((img) => img !== DEFENSE);
const showcaseImages = Array.from({ length: 7 }, (_, i) =>
  i === 0 ? DEFENSE : others[(i - 1) % others.length],
);

export default function DecouvrirPage() {
  return (
    <>
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
          <ZoomParallax
            images={showcaseImages}
            title="Expertises"
            eyebrow="nos"
          />

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

        {/* Section formations : image plein écran + grand titre révélé */}
        <Formations />

        {/* Image plein écran que le scroll dézoome en mosaïque */}
        <ImageBreak />

        {/* FAQ, en clôture de page */}
        <Faq />
      </main>

      <Footer />
    </>
  );
}
