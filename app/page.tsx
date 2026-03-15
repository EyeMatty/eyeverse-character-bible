"use client";

import { useCallback, useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { SearchBar } from "@/components/SearchBar";
import { CharacterGrid } from "@/components/CharacterGrid";
import { CharacterModal } from "@/components/CharacterModal";
import { characters, getCharacterBySlug } from "@/data/characters";
import type { Character } from "@/data/characters";

function HomeContent() {
  const searchParams = useSearchParams();
  const slugFromUrl = searchParams.get("character");

  const [search, setSearch] = useState("");
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);

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
            <div className="w-full sm:w-72">
              <SearchBar value={search} onChange={setSearch} />
            </div>
          </div>
        </motion.header>

        <div className="px-2 py-6 sm:px-4">
          <CharacterGrid
            characters={characters}
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
