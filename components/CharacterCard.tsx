"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Character } from "@/data/characters";

const SLIDESHOW_INTERVAL_MS = 3500;

interface CharacterCardProps {
  character: Character;
  index: number;
  onSelect: (character: Character) => void;
}

const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1000' height='1000' viewBox='0 0 1000 1000' fill='none'%3E%3Crect width='1000' height='1000' fill='%23121214'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2371717a' font-size='24' font-family='sans-serif'%3ENo image%3C/text%3E%3C/svg%3E";

export function CharacterCard({ character, index, onSelect }: CharacterCardProps) {
  const [slideIndex, setSlideIndex] = useState(0);
  const images = character.images.length > 0 ? character.images : [FALLBACK_IMAGE];
  const hasSlideshow = character.images.length > 1;
  const currentSrc = images[slideIndex % images.length];
  const isStaticData = currentSrc.startsWith("data:");

  useEffect(() => {
    if (!hasSlideshow) return;
    const id = setInterval(() => {
      setSlideIndex((i) => (i + 1) % images.length);
    }, SLIDESHOW_INTERVAL_MS);
    return () => clearInterval(id);
  }, [hasSlideshow, images.length]);

  const handleClick = useCallback(() => {
    onSelect(character);
  }, [character, onSelect]);

  const tilt = (index % 3) - 1;
  const rotation = tilt * 0.75;

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      className={cn(
        "group relative flex w-full max-w-[140px] flex-col",
        "rounded-sm border-2 border-zinc-700/80 bg-zinc-800/90 shadow-md",
        "transition-all duration-300 ease-out",
        "hover:border-codex-accent/60 hover:shadow-glow hover:shadow-codex-accent/20",
        "focus:outline-none focus:ring-2 focus:ring-codex-accent focus:ring-offset-2 focus:ring-offset-codex-bg"
      )}
      style={{ transform: `rotate(${rotation}deg)` }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.02, 0.5) }}
      whileHover={{ scale: 1.08, rotate: 0 }}
      whileTap={{ scale: 0.98 }}
      aria-label={`Open ${character.name} profile`}
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-t-sm bg-codex-bg">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={slideIndex}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            {isStaticData ? (
              <div
                className="h-full w-full bg-codex-surface"
                style={{
                  backgroundImage: `url("${FALLBACK_IMAGE}")`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            ) : (
              <Image
                src={currentSrc}
                alt={`${character.name} — image ${slideIndex + 1}`}
                fill
                sizes="140px"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = "block";
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>
        <div
          className="absolute inset-0 hidden bg-codex-surface bg-cover bg-center"
          style={{ backgroundImage: `url("${FALLBACK_IMAGE}")` }}
          aria-hidden
        />
      </div>
      <div className="border-t border-zinc-600/50 px-1.5 py-1.5 text-center">
        <span className="font-display text-xs font-semibold leading-tight text-zinc-200 group-hover:text-codex-accent">
          {character.name}
        </span>
      </div>
    </motion.button>
  );
}
