import Link from "next/link";
import {
  getCharacterBySlug,
  getAllCharacterSlugs,
} from "@/data/characters";
import { notFound } from "next/navigation";

const FALLBACK_TEXT = "Entry being compiled by the Eyeverse archives.";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  const slugs = getAllCharacterSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default function ProfilePage({ params }: Props) {
  const character = getCharacterBySlug(params.slug);
  if (!character) notFound();

  const hasContent =
    (character.blurb && character.blurb.length > 0) ||
    (character.bio && character.bio.length > 0);
  const body = hasContent
    ? (character.blurb || character.bio)
    : FALLBACK_TEXT;

  return (
    <main className="min-h-screen bg-codex-bg">
      <div className="mx-auto max-w-2xl px-4 py-16">
        <h1 className="font-display text-3xl font-semibold text-zinc-100">
          {character.name}
        </h1>
        {character.status === "new" && (
          <span className="mt-2 inline-block rounded bg-codex-accent-dim px-2 py-0.5 text-xs text-codex-accent">
            New
          </span>
        )}
        <p
          className={
            hasContent
              ? "mt-6 leading-relaxed text-codex-muted"
              : "mt-6 italic text-codex-muted"
          }
        >
          {body}
        </p>
        <Link
          href="/"
          className="mt-10 inline-block text-codex-accent hover:underline"
        >
          ← Back to Character Bible
        </Link>
      </div>
    </main>
  );
}
