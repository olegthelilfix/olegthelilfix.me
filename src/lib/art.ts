import type { CoverArt } from "@/data/types";

/** Record/album sleeve placeholder — a hard diagonal split, as on the shelf. */
export function sleeveGradient({ from, to }: CoverArt): string {
  return `linear-gradient(150deg, ${from} 0%, ${from} 46%, ${to} 46%, ${to} 100%)`;
}

/** Project "diagram" placeholder — a technical hatch over a colour wash. */
export function diagramGradient({ from, to }: CoverArt): string {
  return `repeating-linear-gradient(90deg, ${to} 0 2px, transparent 2px 14px), linear-gradient(120deg, ${from}, ${to})`;
}

/** Photo/contact-sheet placeholder — a woven hatch seeded by an angle. */
export function photoGradient(seed: number): string {
  return `repeating-linear-gradient(${seed}deg, #ded7c6 0 8px, #d0c8b4 8px 16px)`;
}
