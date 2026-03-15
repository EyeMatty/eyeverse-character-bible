"use client";

import { useMemo } from "react";
import { CharacterCard } from "./CharacterCard";
import { cn } from "@/lib/utils";
import type { Character } from "@/data/characters";

interface CharacterGridProps {
  characters: Character[];
  searchQuery: string;
  onSelectCharacter: (character: Character) => void;
  className?: string;
}

export function CharacterGrid({
  characters,
  searchQuery,
  onSelectCharacter,
  className,
}: CharacterGridProps) {
  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return characters;
    return characters.filter((c) =>
      c.name.toLowerCase().includes(q)
    );
  }, [characters, searchQuery]);

  if (filtered.length === 0) {
    return (
      <div
        className={cn(
          "flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-codex-border bg-codex-surface/50 py-12",
          className
        )}
      >
        <p className="text-codex-muted">
          {searchQuery
            ? `No characters match "${searchQuery}".`
            : "No characters yet."}
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "mx-auto grid max-w-[1600px] grid-cols-4 gap-2 sm:grid-cols-6 sm:gap-3 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12",
        className
      )}
      role="list"
    >
      {filtered.map((character, index) => (
        <div key={character.id} role="listitem" className="flex justify-center">
          <CharacterCard
            character={character}
            index={index}
            onSelect={onSelectCharacter}
          />
        </div>
      ))}
    </div>
  );
}
