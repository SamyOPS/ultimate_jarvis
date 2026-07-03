import Hero from "./components/Hero";
import Menu from "./components/Menu";

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
          data-nav-dark : signale à la barre qu'elle doit passer en blanc. */}
      <section
        data-nav-dark
        className="relative z-10 min-h-dvh bg-black px-6 py-24 text-white sm:px-12"
      >
        <div className="mx-auto max-w-5xl">
          <h2 className="text-4xl font-bold uppercase tracking-tight sm:text-6xl">
            Nos expertises
          </h2>
          <p className="mt-6 max-w-2xl text-lg text-white/70">
            Section à construire — le contenu viendra ici. Il apparaît en
            recouvrant le hero grâce au panneau noir qui monte au défilement.
          </p>
        </div>
      </section>
    </main>
  );
}
