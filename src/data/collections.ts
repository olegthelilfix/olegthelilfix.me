// The collections "cabinet" — drawers pointing into each collection. Some are
// fully built (vinyl, postcards); others are placeholders for later, kept here
// so the cabinet reads as a real, slightly overfull piece of furniture.

export type Drawer = {
  code: string;
  name: string;
  note: string;
  count: string;
  href: string;
  tone: "ink" | "paper" | "sand" | "sage" | "stone" | "lilac" | "yellow";
  live: boolean;
};

export const drawers: Drawer[] = [
  { code: "DR-01", name: "Vinyl", note: "214 records, a system only I understand.", count: "→ open the shelf", href: "/collections/vinyl", tone: "ink", live: true },
  { code: "DR-02", name: "Postcards", note: "Mostly written to myself.", count: "46 cards", href: "/collections/postcards", tone: "paper", live: true },
  { code: "DR-03", name: "Photos", note: "Contact sheets and a few enlargements.", count: "9 sheets", href: "/photos", tone: "sand", live: true },
  { code: "DR-04", name: "Books", note: "Read, half-read, and aspirational.", count: "183 volumes", href: "/collections", tone: "sage", live: false },
  { code: "DR-05", name: "Devices", note: "Two dead laptops kept for parts and sentiment.", count: "11 items", href: "/projects", tone: "stone", live: false },
  { code: "DR-06", name: "Memories", note: "Not catalogued. Cannot be.", count: "open /remember", href: "/remember", tone: "lilac", live: true },
  { code: "DR-07", name: "Unfinished projects", note: "The largest drawer, obviously.", count: "∞", href: "/projects", tone: "yellow", live: false },
];
