// Aggregated content for the shifting home collage. Facts only; the page
// decides how densely to show them (Calm / Normal / Oleg).

export const homeHero = {
  title: "Grew from backend developer to engineering manager",
  body: "Eleven years, four titles, one very long migration and nine interns who now know things I do not.",
  year: "2014 → 2026",
};

export const homeLatest = {
  kind: "Essay",
  title: "The migration that taught me to write",
  excerpt:
    "Three quarters of moving one service. The code was the easy part; the document explaining why was rewritten eleven times.",
  date: "June 2026",
  readTime: "12 min",
};

export const homeCurrent = {
  name: "IUS-01 · personal infrastructure",
  line1: "uptime 214d · 2 disks · 1 UPS · 0 subscriptions",
  line2: "last change: moved backups to a second location",
};

// Scattered cards shown only in the busier density modes — a live cross-section
// of the whole archive, each linking somewhere deeper.
export type ChaosCard = {
  tag: string;
  text: string;
  href: string;
  tone: "paper" | "ink" | "yellow" | "sage" | "lilac" | "accent";
};

export const chaosCards: ChaosCard[] = [
  { tag: "CV § languages", text: "Russian, English, German (B2, aggressively practised)", href: "/cv", tone: "paper" },
  { tag: "record LS-090", text: "Music for 18 Musicians — the on-call soundtrack", href: "/collections/vinyl", tone: "ink" },
  { tag: "note, undated", text: "Everything in this cabinet was once a Tuesday.", href: "/journey", tone: "yellow" },
  { tag: "project IUS-07", text: "Postcard scanner · frozen · scanned four cards", href: "/projects", tone: "sage" },
  { tag: "photo 04", text: "Elbe, 6:40, the good light", href: "/photos", tone: "sage" },
  { tag: "small victory", text: "Fixed the washing machine (2022)", href: "/journey", tone: "paper" },
  { tag: "hobby", text: "Drums, month 7, still counting out loud", href: "/hobbies", tone: "lilac" },
  { tag: "for later", text: "You have been here before →", href: "/remember", tone: "accent" },
];
