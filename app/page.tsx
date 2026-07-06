import Hero from "./components/Hero";
import Menu from "./components/Menu";
import Mission from "./components/Mission";

export default function Home() {
  return (
    <main>
      {/* Menu au premier plan, hors du hero (sinon le perspective 3D du hero
          l'enfermerait sous le panneau noir) */}
      <Menu />

      {/* Hero épinglé : il reste fixe pendant que le panneau noir monte par-dessus */}
      <div className="sticky top-0 z-0 h-dvh overflow-hidden">
        <Hero />
      </div>

      {/* Panneau noir qui monte et recouvre le hero au défilement.
          data-nav-dark : signale à la barre qu'elle doit passer en blanc.
          Le texte se révèle en fondu quand la section entre à l'écran. */}
      <Mission />
    </main>
  );
}
