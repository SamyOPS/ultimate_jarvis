import Link from "next/link";

const links = [
  { label: "Services", href: "#services" },
  { label: "Expertise", href: "#expertise" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  return (
    <nav className="animate-fade-in absolute inset-x-0 top-0 z-30 flex items-center justify-between px-8 py-6 sm:px-12">
      {/* Marque */}
      <Link
        href="/"
        className="text-sm font-bold uppercase tracking-tight text-zinc-900"
      >
        Jarvis Connect
      </Link>

      {/* Liens */}
      <div className="hidden items-center gap-8 md:flex">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900"
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Link
          href="#contact"
          className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-700"
        >
          Nous contacter
        </Link>

        <Link
          href="/login"
          aria-label="Connexion"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-300 text-zinc-700 transition-colors hover:border-zinc-900 hover:text-zinc-900"
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" y1="12" x2="3" y2="12" />
          </svg>
        </Link>
      </div>
    </nav>
  );
}
