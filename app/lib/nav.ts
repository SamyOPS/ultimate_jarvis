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

// Bloc « Membre de Jarvis », repris tel quel par le panneau du menu et le footer.
// Ces deux destinations vivent sur un site séparé : ce sont des liens externes,
// rendus en <a> classique (ni <Link> ni router : ce ne sont pas des routes de
// cette application), mais précédés du même fondu au noir que les changements
// de page internes.
export const AUTH_HREF = "https://site-jarvis.vercel.app/auth";
export const JOBS_HREF = "https://site-jarvis.vercel.app/offres";

export const memberLinks = [
  { label: "Accéder à mon espace", href: AUTH_HREF },
  { label: "Offres d'emploi", href: JOBS_HREF },
];

// Quitte le site : mérite le voile. Un mailto:/tel: n'est PAS concerné — il
// n'y a pas de navigation, seul le client de messagerie s'ouvre.
export const isExternalUrl = (href: string) => /^https?:/.test(href);
