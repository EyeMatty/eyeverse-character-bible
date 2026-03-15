# Eyeverse Character Bible

A production-ready lore website for the **Eyeverse** universe. Browse a searchable character index, open character modals with looping image slideshows and blurbs, and keep all art normalized to a consistent 1000×1000 format.

## Stack

- **Next.js** (App Router), **TypeScript**, **Tailwind CSS**
- **Framer Motion** for animations
- **shadcn/ui** (Radix) for dialog/modal
- **Embla Carousel** for looping slideshows
- **sharp** for image processing

## Install

```bash
npm install
```

## Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Build for production:

```bash
npm run build
npm start
```

## Content workflow

### 1. Get the character art

**Easiest: use the zip.** Download the whole Drive folder as a zip, put it in the project root as **`character-art.zip`**, then run **`npm run setup:drive-zip`**. That extracts and copies all character folders into `source-assets/characters/` (and skips the PowerPoint). Then run `npm run process:characters` (step 2).

- **Primary source:** [Character art – Google Drive](https://drive.google.com/drive/folders/14CO9YsMBUu9FUsyj8u0WN-nG3NmbUXAF?usp=drive_link)
- Download the folder locally, then place each character’s images into a folder named by **slug** (or keep Drive folder names—script maps them) under:

```
/source-assets/characters/
  /Aern/
  /Batul/
  /Emerald Barks/
  /Eye Prince/
  /EyeKing/        ← maps to slug "king"
  /Golem King/
  … (etc., same names as on Drive)
```

  You can keep Drive’s folder names (including spaces and "EyeKing"); the processor maps them to the slugs used in the app. Skip the PowerPoint file—only character image folders go in `source-assets/characters/`.

- Each character folder can contain multiple images in **png**, **jpg**, **jpeg**, or **webp**. The script processes them in alphabetical order and outputs `01.webp`, `02.webp`, etc., and writes **data/character-images.json** so the site’s slideshows use the new images automatically.

### 2. Run the image processor

From the project root:

```bash
npm run process:characters
```

This script:

- Scans `/source-assets/characters/`
- Resizes every image into a **1000×1000** square canvas (aspect ratio preserved, centered, padded with a dark neutral background)
- Exports optimized **webp** files to `/public/characters/[slug]/` (e.g. `01.webp`, `02.webp`)
- Writes **data/character-images.json** so the app’s slideshows use the processed images automatically (no need to edit `data/characters.ts` for image paths)

### 3. Update character data

Edit **`/data/characters.ts`**:

- **Blurbs:** The official character blurbs live in a Google Slides presentation—one slide per character. Open [the presentation](https://docs.google.com/presentation/d/1LJw4nKn9tWzcWCY_wC3bczYEFdqowFOJ/edit?usp=sharing), copy the text from each slide, and paste it into the matching character’s **`blurb`** field (match by character name).
- **Images:** After running `npm run process:characters`, image paths are written to **data/character-images.json** and the app uses them automatically. You only need to edit **`blurb`** (and names/ids) in `data/characters.ts`. Ensure each character’s **`slug`** matches what the script uses (e.g. `king` for the EyeKing folder, `emerald-barks` for Emerald Barks).

### 4. Verify

Run the site and confirm each character opens in the modal with a looping slideshow and blurb.

## Adding a new character

1. Create a folder under `/source-assets/characters/[slug]/` and add source images.
2. Run `npm run process:characters` and note the new paths under `/public/characters/[slug]/`.
3. In `/data/characters.ts`, add a new entry:

```ts
{
  id: "new-slug",
  name: "Display Name",
  slug: "new-slug",
  blurb: "Short description from your source.",
  images: ["/characters/new-slug/01.webp", "/characters/new-slug/02.webp"],
}
```

## Updating a blurb

Character blurbs are sourced from the [Google Slides presentation](https://docs.google.com/presentation/d/1LJw4nKn9tWzcWCY_wC3bczYEFdqowFOJ/edit?usp=sharing) (one slide per character). To update a blurb: copy the text from the slide, then edit the `blurb` field for that character in `/data/characters.ts`. No need to re-run the image script.

## Keeping every image at 1000×1000

- All images are served from `/public/characters/` after processing. The script always outputs 1000×1000 webp files (contain + center, no stretching).
- Re-run `npm run process:characters` after adding or replacing source files; then update the `images` array in `data/characters.ts` if the number or order of files changed.

## Troubleshooting

### Missing images

- **Card or modal shows “No image” / placeholder**  
  - Confirm the character’s folder exists under `/source-assets/characters/[slug]/` with at least one image (png/jpg/jpeg/webp).  
  - Run `npm run process:characters` and check the log for that slug.  
  - In `data/characters.ts`, ensure `images` lists the correct paths (e.g. `/characters/gabrer/01.webp`) and that those files exist under `/public/characters/[slug]/`.

### Processor errors

- **“Source directory not found”**  
  Create `/source-assets/characters/` and add at least one character folder with images.

- **“No character folders found”**  
  Add folders named by slug (e.g. `gabrer`, `malice`) inside `/source-assets/characters/`.

- **Sharp / permission errors**  
  Ensure Node has read access to `source-assets` and write access to `public/characters`. On Windows, run the terminal as a user that can write to the project directory.

### Build / runtime

- If the app fails to build, run `npm run build` and fix any TypeScript or lint errors reported.
- For missing styles, ensure Tailwind content paths in `tailwind.config.ts` include your `app` and `components` directories.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run setup:drive-zip` | Extract `character-art.zip` (or given path) into `source-assets/characters/` |
| `npm run process:characters` | Process source images to 1000×1000 webp in `/public/characters/` |
| `npm run lint` | Run ESLint |

## Project structure

```
/app
  page.tsx          # Homepage with search and grid
  layout.tsx
  globals.css
/components
  CharacterCard.tsx
  CharacterCarousel.tsx  # Looping slideshow (Embla), arrows, dots
  CharacterGrid.tsx
  CharacterModal.tsx     # Modal with carousel, blurb, keyboard (Esc, arrows)
  SearchBar.tsx
  ui/dialog.tsx
/data
  characters.ts     # Character records (id, name, slug, blurb, images)
/lib
  getCharacterImages.ts
  utils.ts
/scripts
  process-character-images.ts
/public
  /characters       # Processed 1000×1000 webp (generated)
/source-assets
  /characters       # Drop Google Drive art here by slug
```

## Deep linking

You can open a character directly via URL:

- `/?character=gabrer` — opens the Gabrer modal on load.

Closing the modal clears the query param.

## License

Private / project use. Character art and lore are property of the Eyeverse project.
