"use client";

import { useCallback, useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { SearchBar } from "@/components/SearchBar";
import { CharacterGrid } from "@/components/CharacterGrid";
import { CharacterModal } from "@/components/CharacterModal";
import { characters, getCharacterBySlug } from "@/data/characters";
import type { Character } from "@/data/characters";

export type SortOption =
  | "name-asc"
  | "name-desc"
  | "newest"
  | "images-desc"
  | "images-asc";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "name-asc", label: "Name A → Z" },
  { value: "name-desc", label: "Name Z → A" },
  { value: "newest", label: "Newest first" },
  { value: "images-desc", label: "Most images" },
  { value: "images-asc", label: "Fewest images" },
];

function sortCharacters(list: Character[], sort: SortOption): Character[] {
  const arr = [...list];
  switch (sort) {
    case "name-asc":
      return arr.sort((a, b) => a.name.localeCompare(b.name));
    case "name-desc":
      return arr.sort((a, b) => b.name.localeCompare(a.name));
    case "newest":
      return arr.sort((a, b) => {
        const aNew = a.status === "new" ? 1 : 0;
        const bNew = b.status === "new" ? 1 : 0;
        if (bNew !== aNew) return bNew - aNew;
        return a.name.localeCompare(b.name);
      });
    case "images-desc":
      return arr.sort((a, b) => {
        const diff = (b.images?.length ?? 0) - (a.images?.length ?? 0);
        return diff !== 0 ? diff : a.name.localeCompare(b.name);
      });
    case "images-asc":
      return arr.sort((a, b) => {
        const diff = (a.images?.length ?? 0) - (b.images?.length ?? 0);
        return diff !== 0 ? diff : a.name.localeCompare(b.name);
      });
    default:
      return arr;
  }
}

function HomeContent() {
  const searchParams = useSearchParams();
  const slugFromUrl = searchParams.get("character");

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("name-asc");
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);

  const sortedCharacters = useMemo(
    () => sortCharacters(characters, sort),
    [sort]
  );

  const openCharacter = useCallback((character: Character) => {
    setSelectedCharacter(character);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setSelectedCharacter(null);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.delete("character");
      window.history.replaceState({}, "", url.pathname + url.search);
    }
  }, []);

  useEffect(() => {
    if (!slugFromUrl || modalOpen) return;
    const character = getCharacterBySlug(slugFromUrl);
    if (character) {
      setSelectedCharacter(character);
      setModalOpen(true);
    }
  }, [slugFromUrl, modalOpen]);

  const handleSelectCharacter = useCallback(
    (character: Character) => {
      openCharacter(character);
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.set("character", character.slug);
        window.history.replaceState(
          {},
          "",
          url.pathname + "?" + url.searchParams.toString()
        );
      }
    },
    [openCharacter]
  );

  return (
    <>
      <main className="min-h-screen bg-codex-bg">
        <motion.header
          className="sticky top-0 z-10 border-b border-codex-border bg-codex-bg/95 backdrop-blur-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-4 sm:flex-row sm:justify-between sm:gap-6">
            <div className="text-center sm:text-left">
              <h1 className="font-display text-2xl font-bold tracking-tight text-zinc-100 sm:text-3xl">
                Eyeverse Character Bible
              </h1>
              <p className="mt-0.5 text-sm text-codex-muted">
                Lore archive · character index
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
              <div className="w-full sm:w-56">
                <SearchBar value={search} onChange={setSearch} />
              </div>
              <label className="flex shrink-0 items-center gap-2 text-sm text-codex-muted">
                <span className="hidden sm:inline">Sort</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  aria-label="Sort characters"
                  className="rounded-lg border border-codex-border bg-codex-surface px-3 py-2.5 text-zinc-100 focus:border-codex-accent focus:outline-none focus:ring-1 focus:ring-codex-accent/50"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </motion.header>

        <div className="px-2 py-6 sm:px-4">
          <CharacterGrid
            characters={sortedCharacters}
            searchQuery={search}
            onSelectCharacter={handleSelectCharacter}
          />
        </div>
      </main>

      <CharacterModal
        character={selectedCharacter}
        open={modalOpen}
        onOpenChange={(open) => {
          if (!open) closeModal();
        }}
      />
    </>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-codex-bg">
          <p className="text-codex-muted">Loading…</p>
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
