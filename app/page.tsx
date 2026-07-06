import Hero from "./components/Hero";
import Menu from "./components/Menu";
import Mission from "./components/Mission";
import Expertise from "./components/Expertise";
import Offres from "./components/Offres";
import HashScroll from "./components/HashScroll";

export default function Home() {
  return (
    <main>
      {/* Repositionne sur la bonne section si on arrive avec une ancre (#...) */}
      <HashScroll />

      {/* Menu au premier plan, hors du hero (le perspective 3D du hero
          piégerait sinon les éléments fixes de la barre) */}
      <Menu />

      {/* Scroll classique : les sections s'enchaînent normalement */}
      <Hero />

      {/* Section mission (panneau noir). data-nav-dark : la barre passe en blanc.
          Le texte se révèle quand la section entre à l'écran. */}
      <Mission />

      {/* Section expertises (fond blanc) */}
      <Expertise />

      {/* Section offres d'emploi (fond bleu clair) */}
      <Offres />
    </main>
  );
}
