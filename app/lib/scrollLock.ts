// Verrou de défilement à compteur : plusieurs sources peuvent verrouiller le
// scroll (le menu ouvert, la « porte » du hero…). On ne le déverrouille que
// lorsque toutes les sources ont relâché leur verrou.
let count = 0;

export function lockScroll() {
  count += 1;
  if (count === 1) {
    document.documentElement.style.overflow = "hidden";
  }
}

export function unlockScroll() {
  if (count === 0) return;
  count -= 1;
  if (count === 0) {
    document.documentElement.style.overflow = "";
  }
}
