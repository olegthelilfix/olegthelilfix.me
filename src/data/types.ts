// Content model for the archive. These interfaces are the stand-in for the
// future Strapi content types: the mock modules that implement them return
// plain facts only — no colours, transforms or layout. Presentation lives in
// the components. Every content item carries an id, a `visibility` field
// (all "public" in Stage 1, enforced later by the backend), and — where it
// helps the "everything is connected" idea — light id relations.

export type Visibility = "public" | "unlisted" | "private";

/** A two-colour spec used to render placeholder cover/diagram art. */
export type CoverArt = {
  from: string;
  to: string;
};

export interface VinylRecord {
  id: string;
  /** Catalogue number in Oleg's own shelf system, e.g. "LS-042". */
  catalog: string;
  artist: string;
  title: string;
  releaseYear: number;
  edition: string;
  boughtWhere: string;
  favTrack: string;
  note: string;
  cover: CoverArt;
  visibility: Visibility;
}

export interface Postcard {
  id: string;
  ref: string;
  city: string;
  country: string;
  year: string;
  date: string;
  text: string;
  /** Free "desk" scatter layout, in percentages / px / degrees. */
  desk: { x: number; y: number; rotate: number; width: number };
  /** Position of the pin on the schematic map, in percentages. */
  map: { x: number; y: number };
  visibility: Visibility;
}

export type JourneyCategory = "work" | "life" | "projects" | "small";
export type JourneySize = "s" | "m" | "l";

export interface JourneyEvent {
  id: string;
  year: string;
  category: JourneyCategory;
  size: JourneySize;
  title: string;
  body: string;
  /** Optional handwritten margin note. */
  note?: string;
  visibility: Visibility;
}

export interface Memory {
  id: string;
  kind: string;
  title: string;
  body: string;
  /** Where this piece of evidence is filed, e.g. "journey / 2018". */
  filedUnder: string;
  visibility: Visibility;
}

export type ProjectStatus =
  | "Idea"
  | "Research"
  | "In progress"
  | "Working"
  | "Completed"
  | "Frozen"
  | "Abandoned";

export interface Project {
  id: string;
  code: string;
  name: string;
  status: ProjectStatus;
  description: string;
  period: string;
  tech: string;
  learned: string;
  cover: CoverArt;
  visibility: Visibility;
}

export type ArticleKind =
  | "essay"
  | "technical"
  | "note"
  | "long read"
  | "project log"
  | "personal";

export interface Article {
  id: string;
  kind: ArticleKind;
  title: string;
  date: string;
  readTime: string;
  tags: string;
  excerpt: string;
  visibility: Visibility;
}

export interface CvRow {
  head: string;
  meta: string;
  body: string;
}

export interface CvSection {
  title: string;
  rows: CvRow[];
}

export interface Hobby {
  id: string;
  name: string;
  tag: string;
  body: string;
  href: string;
  visibility: Visibility;
}

export interface NowEntry {
  label: string;
  text: string;
}

export interface Photo {
  id: string;
  caption: string;
  meta: string;
  /** Placeholder art seed (gradient angle) until real media exists. */
  seed: number;
  visibility: Visibility;
}
