import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Autorise l'accès aux ressources de dev (HMR…) depuis d'autres appareils du
  // réseau local (ex. test sur téléphone). Dev uniquement.
  allowedDevOrigins: ["192.168.1.119"],
};

export default nextConfig;
