import Menu from "../components/Menu";
import Mission from "../components/Mission";
import ScrollToTarget from "../components/ScrollToTarget";

export default function DecouvrirPage() {
  return (
    <main>
      {/* Défile vers la section demandée si on arrive avec une cible (#...) */}
      <ScrollToTarget />

      <Menu />

      {/* Discours */}
      <Mission />
    </main>
  );
}
