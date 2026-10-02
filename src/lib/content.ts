import "server-only";

import { articles } from "@content/articles";
import { cvProfile, cvSections } from "@content/cv";
import { hobbies, nowEntries, photos } from "@content/hobbies";
import { homeCurrent, homeHero, homeLatest, chaosCards, type ChaosCard } from "@content/home";
import { journey } from "@content/journey";
import { memories } from "@content/memories";
import { postcards } from "@content/postcards";
import { projects } from "@content/projects";
import type {
  Article,
  CvSection,
  Hobby,
  JourneyEvent,
  Memory,
  Photo,
  Postcard,
  Project,
  VinylRecord,
} from "@content/types";
import { records } from "@content/vinyl";

// Repository files under /content are the only editorial source of truth.
// Pages keep using this small server-only access layer so visibility filtering
// stays centralized and a future storage change would not leak into the UI.

function publicOnly<T extends { visibility: string }>(items: readonly T[]): T[] {
  return items.filter((item) => item.visibility === "public");
}

export async function getRecords(): Promise<VinylRecord[]> {
  return publicOnly(records);
}

export async function getPostcards(): Promise<Postcard[]> {
  return publicOnly(postcards);
}

export async function getArticles(): Promise<Article[]> {
  return publicOnly(articles);
}

export async function getJourney(): Promise<JourneyEvent[]> {
  return publicOnly(journey);
}

export async function getProjects(): Promise<Project[]> {
  return publicOnly(projects);
}

export async function getMemories(): Promise<Memory[]> {
  return publicOnly(memories);
}

export async function getHobbies(): Promise<Hobby[]> {
  return publicOnly(hobbies);
}

export async function getPhotos(): Promise<Photo[]> {
  return publicOnly(photos);
}

export async function getNow() {
  return nowEntries;
}

export type CvContent = {
  profile: { name: string; role: string; summary: string; location: string; email: string };
  sections: CvSection[];
};

export async function getCv(): Promise<CvContent> {
  return { profile: cvProfile, sections: cvSections };
}

export type HomeContent = {
  hero: { title: string; body: string; year: string };
  latest: { kind: string; title: string; excerpt: string; date: string; readTime: string };
  current: { name: string; line1: string; line2: string };
  chaos: ChaosCard[];
};

export async function getHome(): Promise<HomeContent> {
  return {
    hero: homeHero,
    latest: homeLatest,
    current: homeCurrent,
    chaos: chaosCards,
  };
}
