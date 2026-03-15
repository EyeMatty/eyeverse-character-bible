import { characters, getCharacterBySlug } from "@/data/characters";

/**
 * Returns the list of image paths for a character by slug.
 * Paths are relative to the public folder (e.g. /characters/gabrer/01.webp).
 */
export function getCharacterImages(slug: string): string[] {
  const character = getCharacterBySlug(slug);
  return character?.images ?? [];
}

/**
 * Returns all character slugs that have at least one image.
 */
export function getCharactersWithImages(): string[] {
  return characters.filter((c) => c.images.length > 0).map((c) => c.slug);
}
