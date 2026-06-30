import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-white px-6 text-center">
      <h1 className="text-3xl font-bold uppercase tracking-tight text-zinc-900">
        Connexion
      </h1>
      <p className="max-w-md text-zinc-600">
        Page de connexion à venir.
      </p>
      <Link
        href="/"
        className="rounded-full border border-zinc-300 px-6 py-2 font-medium text-zinc-700 transition-colors hover:border-zinc-900 hover:text-zinc-900"
      >
        Retour à l&apos;accueil
      </Link>
    </main>
  );
}
