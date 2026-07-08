"use client";

import { animate, useMotionValue } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type Direction = "down" | "up";

type TransitionCtx = {
  // `direction` fait glisser le contenu dans le sens du scroll pendant le fondu.
  navigate: (href: string, direction?: Direction) => void;
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

  // Glissement du contenu SORTANT pendant le fondu (simulation de scroll). Le
  // transform n'est appliqué que lorsque la valeur ≠ 0 (sinon on casserait les
  // éléments `fixed`/`sticky` au repos). Le conteneur a un fond noir : l'espace
  // découvert par le glissement est noir et se fond dans le voile (pas de blanc).
  // À l'arrivée on remet 0 (pas de translation d'entrée → navbar visible tout de
  // suite, pas de zone blanche).
  const contentEl = useRef<HTMLDivElement>(null);
  const contentY = useMotionValue(0);
  useEffect(() => {
    return contentY.on("change", (v) => {
      const el = contentEl.current;
      if (el) el.style.transform = v === 0 ? "" : `translateY(${v}px)`;
    });
  }, [contentY]);

  const navigate = useCallback(
    (href: string, direction?: Direction) => {
      const targetPath = href.split("#")[0] || pathname;
      if (targetPath === pathname && !href.includes("#")) return;
      pendingRef.current = targetPath;
      setCovering(true);
      if (direction) {
        const offset = window.innerHeight * 0.14;
        contentY.set(0);
        animate(contentY, direction === "down" ? -offset : offset, {
          duration: DURATION / 1000,
          ease: [0.4, 0, 1, 1],
        });
      }
      window.setTimeout(() => router.push(href), DURATION);
    },
    [pathname, router, contentY]
  );

  const cover = useCallback((action?: () => void) => {
    setCovering(true);
    window.setTimeout(() => {
      action?.();
      window.setTimeout(() => setCovering(false), 100);
    }, DURATION);
  }, []);

  // Nouvelle page chargée → contenu posé à sa place (transform 0), puis on
  // dissipe le voile.
  useEffect(() => {
    if (pendingRef.current && pendingRef.current === pathname) {
      pendingRef.current = null;
      contentY.set(0);
      const t = window.setTimeout(() => setCovering(false), 100);
      return () => window.clearTimeout(t);
    }
  }, [pathname, contentY]);

  return (
    <TransitionContext.Provider value={{ navigate, cover }}>
      <div
        ref={contentEl}
        className="flex min-h-full flex-1 flex-col overflow-x-clip bg-black"
      >
        {children}
      </div>
      <div
        aria-hidden
        className={`fixed inset-0 z-[100] bg-black transition-opacity duration-500 ease-in-out ${
          covering ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
    </TransitionContext.Provider>
  );
}
