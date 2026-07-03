import type { Metadata } from "next";
import { DM_Sans, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PageTransition from "./components/PageTransition";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Police plus douce (humaniste arrondie), pour les pages de contenu.
const dmSans = DM_Sans({
  variable: "--font-soft",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jarvis Connect — Support informatique & infogérance",
  description:
    "Jarvis Connect, ESN spécialisée dans le support informatique : assistance réactive, infogérance et expertise technique pour vos équipes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
