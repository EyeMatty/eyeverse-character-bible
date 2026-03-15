/**
 * Eyeverse Character Bible — character data
 *
 * Blurb source: Google Slides presentation (one slide per character).
 * Copy the text from each slide into the `blurb` field for the matching character.
 * https://docs.google.com/presentation/d/1LJw4nKn9tWzcWCY_wC3bczYEFdqowFOJ/edit?usp=sharing
 *
 * Image paths: filled from data/character-images.json after running npm run process:characters
 * (download Drive folder into source-assets/characters/, then run the script).
 */

import characterImagesMap from "./character-images.json";
import loreCharactersList from "./lore-characters.json";

export type Character = {
  id: string;
  name: string;
  slug: string;
  blurb: string;
  bio?: string;
  images: string[];
  status?: "new";
};

type LoreCharacter = {
  id: string;
  name: string;
  slug: string;
  blurb: string;
  bio?: string;
  images: string[];
  status?: "new";
};

const baseCharactersList: Character[] = [
  {
    id: "aern",
    name: "Aern",
    slug: "aern",
    blurb: "Aern walks the boundary between shadow and light. Their presence marks the threshold where the Eyeverse’s deeper truths begin to surface.",
    images: ["/characters/aern/01.webp"],
  },
  {
    id: "batul",
    name: "Batul",
    slug: "batul",
    blurb: "Batul carries the weight of forgotten oaths. In the Eyeverse, their name is spoken in hushed tones where loyalty and betrayal intertwine.",
    images: ["/characters/batul/01.webp"],
  },
  {
    id: "blazen",
    name: "Blazen",
    slug: "blazen",
    blurb: "Blazen burns with an inner fire that the Eyeverse itself seems to fuel. Where they pass, embers of change linger long after.",
    images: ["/characters/blazen/01.webp"],
  },
  {
    id: "chron",
    name: "Chron",
    slug: "chron",
    blurb: "Chron exists at the crossroads of time and memory. In the Eyeverse, they are both witness and keeper of moments that refuse to fade.",
    images: ["/characters/chron/01.webp"],
  },
  {
    id: "drexel",
    name: "Drexel",
    slug: "drexel",
    blurb: "Drexel moves through the Eyeverse with purpose forged in conflict. Their path is one of reckoning—with the past and with the self.",
    images: ["/characters/drexel/01.webp"],
  },
  {
    id: "ekihaas",
    name: "Ekihaas",
    slug: "ekihaas",
    blurb: "Ekihaas speaks in riddles and visions. To encounter them is to glimpse the Eyeverse through a lens that bends both light and meaning.",
    images: ["/characters/ekihaas/01.webp"],
  },
  {
    id: "emerald-barks",
    name: "Emerald Barks",
    slug: "emerald-barks",
    blurb: "Emerald Barks stands where the wild and the civilized meet. In the Eyeverse, they are the voice of the groves that remember the old ways.",
    images: ["/characters/emerald-barks/01.webp"],
  },
  {
    id: "exemplar",
    name: "Exemplar",
    slug: "exemplar",
    blurb: "Exemplar embodies an ideal that the Eyeverse both upholds and questions. To follow their example is to walk a path of conviction and cost.",
    images: ["/characters/exemplar/01.webp"],
  },
  {
    id: "eye-prince",
    name: "Eye Prince",
    slug: "eye-prince",
    blurb: "The Eye Prince sees what others cannot. In the lore of the Eyeverse, they are bound to the gaze that shapes reality itself.",
    images: ["/characters/eye-prince/01.webp"],
  },
  {
    id: "gabrer",
    name: "Gabrer",
    slug: "gabrer",
    blurb: "Gabrer guards the threshold between worlds. Their role in the Eyeverse is to hold the line—against chaos, against oblivion.",
    images: ["/characters/gabrer/01.webp"],
  },
  {
    id: "gegssend",
    name: "Gegssend",
    slug: "gegssend",
    blurb: "Gegssend carries messages that change destinies. In the Eyeverse, their words have weight beyond sound—they alter the weave of fate.",
    images: ["/characters/gegssend/01.webp"],
  },
  {
    id: "golem",
    name: "Golem",
    slug: "golem",
    blurb: "Golem is form given purpose. In the Eyeverse, they stand as testament to the power of creation—and the price of awakening.",
    images: ["/characters/golem/01.webp"],
  },
  {
    id: "golem-king",
    name: "Golem King",
    slug: "golem-king",
    blurb: "The Golem King rules over the made and the unmade. In the Eyeverse, their dominion spans both the crafted and the born.",
    images: ["/characters/golem-king/01.webp"],
  },
  {
    id: "jein",
    name: "Jein",
    slug: "jein",
    blurb: "Jein walks between identities. In the Eyeverse, they are a reminder that the self can be many things—and still remain whole.",
    images: ["/characters/jein/01.webp"],
  },
  {
    id: "king",
    name: "King",
    slug: "king",
    blurb: "The King holds the crown that the Eyeverse itself seems to acknowledge. Their reign is written into the fabric of this world.",
    images: ["/characters/king/01.webp"],
  },
  {
    id: "liten",
    name: "Liten",
    slug: "liten",
    blurb: "Liten speaks in whispers that carry far. In the Eyeverse, their influence belies their stature—small in form, vast in reach.",
    images: ["/characters/liten/01.webp"],
  },
  {
    id: "malice",
    name: "Malice",
    slug: "malice",
    blurb: "Malice embodies the darker currents of the Eyeverse. Where they tread, shadows deepen and intentions twist.",
    images: ["/characters/malice/01.webp"],
  },
  {
    id: "qalra",
    name: "Qalra",
    slug: "qalra",
    blurb: "Qalra moves through the Eyeverse like a question without an answer. To know them is to accept that some mysteries remain.",
    images: ["/characters/qalra/01.webp"],
  },
  {
    id: "scavenger",
    name: "Scavenger",
    slug: "scavenger",
    blurb: "The Scavenger finds value where others see ruin. In the Eyeverse, they are the one who turns aftermath into opportunity.",
    images: ["/characters/scavenger/01.webp"],
  },
  {
    id: "sonskog",
    name: "Sonskog",
    slug: "sonskog",
    blurb: "Sonskog is born of the mist and the wood. In the Eyeverse, they are the spirit of the forest that never fully sleeps.",
    images: ["/characters/sonskog/01.webp"],
  },
  {
    id: "umog",
    name: "Umog",
    slug: "umog",
    blurb: "Umog stands at the edge of understanding. In the Eyeverse, they represent the boundary between what can be known and what must be felt.",
    images: ["/characters/umog/01.webp"],
  },
  {
    id: "valmor",
    name: "Valmor",
    slug: "valmor",
    blurb: "Valmor carries the weight of legacy. In the Eyeverse, their name is tied to deeds that echo across generations.",
    images: ["/characters/valmor/01.webp"],
  },
  {
    id: "zina",
    name: "Zina",
    slug: "zina",
    blurb: "Zina moves through the Eyeverse with grace and purpose. Their presence marks the intersection of will and destiny.",
    images: ["/characters/zina/01.webp"],
  },
];

const loreCharacters: Character[] = (loreCharactersList as LoreCharacter[]).map(
  (c) => ({
    ...c,
    images:
      (characterImagesMap as Record<string, string[]>)[c.slug]?.length > 0
        ? (characterImagesMap as Record<string, string[]>)[c.slug]
        : c.images,
  })
);

const baseWithImages: Character[] = baseCharactersList.map((c) => ({
  ...c,
  images:
    (characterImagesMap as Record<string, string[]>)[c.slug]?.length > 0
      ? (characterImagesMap as Record<string, string[]>)[c.slug]
      : c.images,
}));

const characters: Character[] = [
  ...baseWithImages,
  ...loreCharacters.filter(
    (lc) => !baseWithImages.some((b) => b.slug === lc.slug)
  ),
].sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));

export { characters };

export function getCharacterBySlug(slug: string): Character | undefined {
  return characters.find((c) => c.slug === slug);
}

export function getCharacterById(id: string): Character | undefined {
  return characters.find((c) => c.id === id);
}

export function getAllCharacterSlugs(): string[] {
  return characters.map((c) => c.slug);
}
