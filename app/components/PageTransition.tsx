"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type TransitionCtx = {
  navigate: (href: string) => void;
  // Voile noir sans changer de page : couvre, exécute `action`, puis révèle.
  cover: (action?: () => void) => void;
};

const TransitionContext = createContext<TransitionCtx>({
  navigate: () => {},
  cover: () => {},
});

export const usePageTransition = () => useContext(TransitionContext);

// Durée du fondu du voile noir (doit correspondre à `duration-500`).
const DURATION = 500;

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [covering, setCovering] = useState(false);
  const pendingRef = useRef<string | null>(null);

  // Déclenche la transition : voile noir → navigation → révélation.
  // `href` peut contenir une ancre (ex. "/#expertises") : on ne compare que la
  // partie chemin, et c'est elle qu'on attend pour dissiper le voile.
  const navigate = useCallback(
    (href: string) => {
      const targetPath = href.split("#")[0] || pathname;
      if (targetPath === pathname && !href.includes("#")) return;
      pendingRef.current = targetPath;
      setCovering(true);
      // On laisse le voile finir de couvrir avant de changer de page.
      window.setTimeout(() => router.push(href), DURATION);
    },
    [pathname, router]
  );

  // Voile noir sur place (sans navigation) : on couvre, on exécute l'action
  // (ex. défiler vers une section) pendant que c'est noir, puis on révèle.
  const cover = useCallback((action?: () => void) => {
    setCovering(true);
    window.setTimeout(() => {
      action?.();
      window.setTimeout(() => setCovering(false), 100);
    }, DURATION);
  }, []);

  // Nouvelle page chargée (le pathname a changé) → on dissipe le voile.
  useEffect(() => {
    if (pendingRef.current && pendingRef.current === pathname) {
      pendingRef.current = null;
      // Petit délai pour laisser la nouvelle page peindre avant de révéler.
      const t = window.setTimeout(() => setCovering(false), 100);
      return () => window.clearTimeout(t);
    }
  }, [pathname]);

  return (
    <TransitionContext.Provider value={{ navigate, cover }}>
      {children}
      <div
        aria-hidden
        className={`fixed inset-0 z-[100] bg-black transition-opacity duration-500 ease-in-out ${
          covering ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
    </TransitionContext.Provider>
  );
}
