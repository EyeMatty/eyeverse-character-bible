"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1000' height='1000' viewBox='0 0 1000 1000' fill='none'%3E%3Crect width='1000' height='1000' fill='%23121214'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2371717a' font-size='24' font-family='sans-serif'%3ENo image%3C/text%3E%3C/svg%3E";

const AUTOPLAY_INTERVAL_MS = 3500;

export interface CharacterCarouselHandle {
  scrollPrev: () => void;
  scrollNext: () => void;
}

interface CharacterCarouselProps {
  images: string[];
  characterName: string;
  onPrev?: () => void;
  onNext?: () => void;
  className?: string;
}

export const CharacterCarousel = forwardRef<
  CharacterCarouselHandle,
  CharacterCarouselProps
>(function CharacterCarousel(
  { images, characterName, onPrev, onNext, className },
  ref
) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    skipSnaps: false,
  });

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
    onPrev?.();
  }, [emblaApi, onPrev]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
    onNext?.();
  }, [emblaApi, onNext]);

  useImperativeHandle(
    ref,
    () => ({ scrollPrev, scrollNext }),
    [scrollPrev, scrollNext]
  );

  // Autoplay
  useEffect(() => {
    if (!emblaApi || images.length <= 1) return;
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, AUTOPLAY_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [emblaApi, images.length]);

  if (images.length === 0) {
    return (
      <div
        className={cn(
          "flex aspect-square w-full items-center justify-center rounded-lg bg-codex-bg",
          className
        )}
      >
        <span className="text-codex-muted">No images</span>
      </div>
    );
  }

  return (
    <div className={cn("relative w-full", className)}>
      <div className="overflow-hidden rounded-lg" ref={emblaRef}>
        <div className="flex touch-pan-y gap-0">
          {images.map((src, index) => {
            const isDataUrl = src.startsWith("data:");
            return (
              <div
                key={`${src}-${index}`}
                className="relative min-w-0 flex-[0_0_100%]"
              >
                <div className="relative aspect-square w-full bg-codex-bg">
                  {isDataUrl ? (
                    <div
                      className="h-full w-full bg-cover bg-center"
                      style={{ backgroundImage: `url("${FALLBACK_IMAGE}")` }}
                    />
                  ) : (
                    <Image
                      src={src}
                      alt={`${characterName} — image ${index + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 560px"
                      className="object-contain"
                      priority={index === 0}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={scrollPrev}
            className={cn(
              "absolute left-2 top-1/2 -translate-y-1/2 rounded-full",
              "border border-codex-border bg-codex-surface/90 p-2 text-zinc-100",
              "hover:border-codex-accent hover:bg-codex-accent-dim hover:text-codex-accent",
              "focus:outline-none focus:ring-2 focus:ring-codex-accent focus:ring-offset-2 focus:ring-offset-codex-surface",
              "transition-colors"
            )}
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2 rounded-full",
              "border border-codex-border bg-codex-surface/90 p-2 text-zinc-100",
              "hover:border-codex-accent hover:bg-codex-accent-dim hover:text-codex-accent",
              "focus:outline-none focus:ring-2 focus:ring-codex-accent focus:ring-offset-2 focus:ring-offset-codex-surface",
              "transition-colors"
            )}
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <SlideDots
            count={images.length}
            emblaApi={emblaApi}
            className="mt-3 justify-center"
          />
        </>
      )}
    </div>
  );
});

function SlideDots({
  count,
  emblaApi,
  className,
}: {
  count: number;
  emblaApi: ReturnType<typeof useEmblaCarousel>[1];
  className?: string;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    setSelectedIndex(emblaApi.selectedScrollSnap());
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  if (count <= 1) return null;

  return (
    <div className={cn("flex gap-1.5", className)} role="tablist" aria-label="Slide indicators">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          type="button"
          role="tab"
          aria-selected={i === selectedIndex}
          aria-label={`Go to slide ${i + 1}`}
          onClick={() => emblaApi?.scrollTo(i)}
          className={cn(
            "h-2 rounded-full transition-all duration-200",
            i === selectedIndex
              ? "w-6 bg-codex-accent"
              : "w-2 bg-codex-border hover:bg-codex-muted"
          )}
        />
      ))}
    </div>
  );
}

