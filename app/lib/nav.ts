// Liens de navigation partagés par le menu (panneau latéral) et le footer :
// une seule source de vérité, pour qu'un renommage de section (ex. « Offres »
// devenue « Formations ») n'ait pas à être répercuté à deux endroits.

export const mainLinks = [
  { label: "Accueil", href: "/" },
  { label: "Expertises", href: "/decouvrir#expertises" },
  { label: "Formations", href: "/decouvrir#formations" },
  { label: "FAQ", href: "/decouvrir#faq" },
];

export const infoLinks = [
  { label: "Mentions légales", href: "/mentions-legales" },
  { label: "CGU", href: "/cgu" },
  {
    label: "Politique de confidentialité",
    href: "/politique-de-confidentialite",
  },
  { label: "S'inscrire à la newsletter", href: "#newsletter" },
];
