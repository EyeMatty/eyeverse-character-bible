"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { X, Download } from "lucide-react";
import JSZip from "jszip";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  CharacterCarousel,
  type CharacterCarouselHandle,
} from "./CharacterCarousel";
import { cn } from "@/lib/utils";
import type { Character } from "@/data/characters";

interface CharacterModalProps {
  character: Character | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CharacterModal({
  character,
  open,
  onOpenChange,
}: CharacterModalProps) {
  const carouselRef = useRef<CharacterCarouselHandle>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  useEffect(() => {
    if (!open) return;
    const listener = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        carouselRef.current?.scrollPrev();
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        carouselRef.current?.scrollNext();
      }
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [open, handleClose]);

  const handleDownloadCurrent = useCallback(() => {
    if (!character || character.images.length === 0) return;
    const src = character.images[currentSlideIndex];
    if (src.startsWith("data:")) return;
    const ext = src.includes(".gif") ? "gif" : "webp";
    const num = String(currentSlideIndex + 1).padStart(2, "0");
    const name = character.name.replace(/\s+/g, "-");
    const a = document.createElement("a");
    a.href = src;
    a.download = `${name}-${num}.${ext}`;
    a.click();
  }, [character, currentSlideIndex]);

  const handleDownloadAll = useCallback(async () => {
    if (!character || character.images.length === 0) return;
    const zip = new JSZip();
    const name = character.name.replace(/\s+/g, "-");
    try {
      await Promise.all(
        character.images.map(async (src, i) => {
          if (src.startsWith("data:")) return;
          const res = await fetch(src);
          const blob = await res.blob();
          const ext = src.includes(".gif") ? "gif" : "webp";
          const num = String(i + 1).padStart(2, "0");
          zip.file(`${num}.${ext}`, blob);
        })
      );
      const blob = await zip.generateAsync({ type: "blob" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${name}-images.zip`;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (e) {
      console.error("Download all failed:", e);
    }
  }, [character]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && character && (
          <DialogContent
            className="max-h-[90vh] overflow-y-auto border-codex-border bg-codex-surface modal-glow sm:max-w-2xl"
            showClose={false}
          >
            <div className="relative">
              <button
                type="button"
                onClick={handleClose}
                className={cn(
                  "absolute right-0 top-0 z-10 rounded-full p-2",
                  "text-codex-muted hover:bg-codex-accent-dim hover:text-codex-accent",
                  "focus:outline-none focus:ring-2 focus:ring-codex-accent focus:ring-offset-2 focus:ring-offset-codex-surface"
                )}
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>

              <DialogHeader className="pr-12">
                <DialogTitle className="font-display text-2xl font-semibold tracking-wide text-zinc-100">
                  {character.name}
                </DialogTitle>
              </DialogHeader>

              <div className="codex-divider my-4" aria-hidden />

              {character.images.length > 0 ? (
                <CharacterCarousel
                  ref={carouselRef}
                  images={character.images}
                  characterName={character.name}
                  onSlideChange={setCurrentSlideIndex}
                  className="mt-2"
                />
              ) : (
                <div className="mt-2 flex aspect-square w-full items-center justify-center rounded-lg border border-codex-border bg-codex-bg">
                  <p className="max-w-xs px-4 text-center text-sm text-codex-muted">
                    Entry being compiled by the Eyeverse archives.
                  </p>
                </div>
              )}

              {(character.blurb || character.bio) ? (
                <>
                  <div className="codex-divider my-6" aria-hidden />
                  <DialogDescription asChild>
                    <p className="text-codex-muted leading-relaxed">
                      {character.blurb || character.bio}
                    </p>
                  </DialogDescription>
                </>
              ) : (
                <>
                  <div className="codex-divider my-6" aria-hidden />
                  <p className="text-center text-codex-muted italic">
                    Entry being compiled by the Eyeverse archives.
                  </p>
                </>
              )}

              <div className="codex-divider mt-6" aria-hidden />

              <div className="mt-4 flex flex-wrap items-center gap-3">
                {character.images.length > 0 && (
                  <>
                    <button
                      type="button"
                      onClick={handleDownloadCurrent}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-lg border border-codex-border bg-codex-surface px-3 py-2 text-sm text-zinc-200",
                        "hover:border-codex-accent hover:bg-codex-accent-dim hover:text-codex-accent",
                        "focus:outline-none focus:ring-2 focus:ring-codex-accent focus:ring-offset-2 focus:ring-offset-codex-surface"
                      )}
                    >
                      <Download className="h-4 w-4" />
                      Download current
                    </button>
                    {character.images.length > 1 && (
                      <button
                        type="button"
                        onClick={handleDownloadAll}
                        className={cn(
                          "inline-flex items-center gap-2 rounded-lg border border-codex-border bg-codex-surface px-3 py-2 text-sm text-zinc-200",
                          "hover:border-codex-accent hover:bg-codex-accent-dim hover:text-codex-accent",
                          "focus:outline-none focus:ring-2 focus:ring-codex-accent focus:ring-offset-2 focus:ring-offset-codex-surface"
                        )}
                      >
                        <Download className="h-4 w-4" />
                        Download all (ZIP)
                      </button>
                    )}
                  </>
                )}
                <a
                  href={`/profile/${character.slug}`}
                  className="inline-block text-sm text-codex-accent hover:underline"
                >
                  View full profile →
                </a>
              </div>
            </div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
}

function DialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col space-y-1.5 text-center sm:text-left",
        className
      )}
      {...props}
    />
  );
}
