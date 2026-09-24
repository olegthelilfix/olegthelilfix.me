import type { Article, ArticleKind } from "./types";

export const articleKinds: { value: ArticleKind | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "essay", label: "Essays" },
  { value: "technical", label: "Technical" },
  { value: "note", label: "Notes" },
  { value: "long read", label: "Long reads" },
  { value: "project log", label: "Project logs" },
  { value: "personal", label: "Personal" },
];

export const articles: Article[] = [
  { id: "art-migration", kind: "essay", title: "The migration that taught me to write", date: "June 2026", readTime: "12 min", tags: "management, writing", excerpt: "Three quarters of moving one service. The code was the easy part; the document explaining why was rewritten eleven times, and that document is what actually moved the system.", visibility: "public" },
  { id: "art-coroutines", kind: "technical", title: "Kotlin coroutines on a boring Thursday", date: "May 2026", readTime: "9 min", tags: "kotlin, jvm", excerpt: "A structured-concurrency bug that only appeared under load, and the four wrong theories I had before the right one.", visibility: "public" },
  { id: "art-standups", kind: "note", title: "Standing meetings should be shorter than the coffee", date: "April 2026", readTime: "2 min", tags: "management", excerpt: "A rule I keep breaking and keep reintroducing.", visibility: "public" },
  { id: "art-ocr-w6", kind: "project log", title: "OCR pipeline, week 6: it works, sort of", date: "March 2026", readTime: "7 min", tags: "python, side projects", excerpt: "Tesseract, a scanner, 400 catalogue pages and the slow realisation that the interesting problem was never the recognition.", visibility: "public" },
  { id: "art-instrument", kind: "personal", title: "Learning an instrument at an age when you have opinions", date: "February 2026", readTime: "6 min", tags: "drums", excerpt: "Being bad at something in public is a skill you lose and have to deliberately regain.", visibility: "public" },
  { id: "art-reviewer", kind: "long read", title: "On being the person who reviews instead of writes", date: "January 2026", readTime: "15 min", tags: "management, mentorship", excerpt: "What happens to your identity when the thing you were good at is no longer the thing you do all day, and why nobody warns you.", visibility: "public" },
  { id: "art-postgres", kind: "technical", title: "Postgres, one index and a 40× afternoon", date: "Nov 2025", readTime: "8 min", tags: "postgres, performance", excerpt: "The query plan was fine. The assumption underneath it was not.", visibility: "public" },
  { id: "art-selfhost", kind: "note", title: "Self-hosting is a hobby, not a saving", date: "Oct 2025", readTime: "3 min", tags: "self-hosting", excerpt: "I calculated the hourly rate once. I will not do that again.", visibility: "public" },
  { id: "art-paperwork", kind: "personal", title: "Six years of paperwork in a second language", date: "Sep 2025", readTime: "10 min", tags: "germany, life", excerpt: "Anmeldung, Steuer-ID, and the specific loneliness of understanding every word of a letter and none of its meaning.", visibility: "public" },
  { id: "art-collection", kind: "essay", title: "A collection is an argument with forgetting", date: "Aug 2025", readTime: "11 min", tags: "collecting, vinyl", excerpt: "Why I keep postcards addressed to nobody and records I rarely play.", visibility: "public" },
];
