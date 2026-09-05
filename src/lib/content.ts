import "server-only";
import { records as mockRecords } from "@/data/vinyl";
import { postcards as mockPostcards } from "@/data/postcards";
import { articles as mockArticles } from "@/data/articles";
import { journey as mockJourney } from "@/data/journey";
import { projects as mockProjects } from "@/data/projects";
import { memories as mockMemories } from "@/data/memories";
import {
  hobbies as mockHobbies,
  nowEntries as mockNow,
  photos as mockPhotos,
} from "@/data/hobbies";
import { cvProfile as mockCvProfile, cvSections as mockCvSections } from "@/data/cv";
import {
  homeHero as mockHero,
  homeLatest as mockLatest,
  homeCurrent as mockCurrent,
  chaosCards as mockChaos,
  type ChaosCard,
} from "@/data/home";
import type {
  VinylRecord,
  Postcard,
  Article,
  ArticleKind,
  JourneyEvent,
  JourneyCategory,
  JourneySize,
  Project,
  ProjectStatus,
  Memory,
  Hobby,
  Photo,
  NowEntry,
  CvSection,
} from "@/data/types";

// Data-access layer. Fetches published content from Strapi; if the CMS is
// unreachable (e.g. not running at build time), it transparently falls back to
// the local mock modules so the site never breaks. Only `public` content is
// requested for collections — enforced by the query and, later, the backend.

const STRAPI_URL = process.env.STRAPI_URL ?? "http://localhost:1337";
const STRAPI_PAGE_SIZE = 100;

async function fetchPublic<T>(path: string): Promise<T[] | null> {
  try {
    const data: T[] = [];
    let page = 1;

    while (true) {
      const separator = path.includes("?") ? "&" : "?";
      const url =
        `${STRAPI_URL}/api/${path}${separator}` +
        `filters[visibility][$eq]=public&pagination[pageSize]=${STRAPI_PAGE_SIZE}` +
        `&pagination[page]=${page}&pagination[withCount]=true`;
      const res = await fetch(url, { next: { revalidate: 60 } });
      if (!res.ok) return null;

      const json = (await res.json()) as {
        data?: T[];
        meta?: { pagination?: { page?: number; pageCount?: number } };
      };
      if (!json.data) return null;
      data.push(...json.data);

      const currentPage = json.meta?.pagination?.page ?? page;
      const pageCount = json.meta?.pagination?.pageCount;
      if (pageCount === undefined ? json.data.length < STRAPI_PAGE_SIZE : currentPage >= pageCount) {
        return data;
      }
      page = currentPage + 1;
    }
  } catch {
    return null;
  }
}

async function fetchSingle<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${STRAPI_URL}/api/${path}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: T | null };
    return json.data ?? null;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ vinyl */

type StrapiRecord = {
  documentId: string;
  catalog: string;
  artist: string;
  title: string;
  releaseYear: number;
  edition: string;
  boughtWhere: string;
  favTrack: string;
  note: string;
  coverFrom: string;
  coverTo: string;
  visibility: VinylRecord["visibility"];
};

export async function getRecords(): Promise<VinylRecord[]> {
  const data = await fetchPublic<StrapiRecord>("records?sort=catalog:asc");
  return data
    ? data.map((e) => ({
        id: e.documentId,
        catalog: e.catalog,
        artist: e.artist,
        title: e.title,
        releaseYear: e.releaseYear,
        edition: e.edition,
        boughtWhere: e.boughtWhere,
        favTrack: e.favTrack,
        note: e.note,
        cover: { from: e.coverFrom, to: e.coverTo },
        visibility: e.visibility,
      }))
    : mockRecords;
}

/* -------------------------------------------------------------- postcards */

type StrapiPostcard = {
  documentId: string;
  ref: string;
  city: string;
  country: string;
  year: string;
  date: string;
  text: string;
  deskX: number;
  deskY: number;
  deskRotate: number;
  deskWidth: number;
  mapX: number;
  mapY: number;
  visibility: Postcard["visibility"];
};

export async function getPostcards(): Promise<Postcard[]> {
  const data = await fetchPublic<StrapiPostcard>("postcards?sort=ref:asc");
  return data
    ? data.map((e) => ({
        id: e.documentId,
        ref: e.ref,
        city: e.city,
        country: e.country,
        year: e.year,
        date: e.date,
        text: e.text,
        desk: { x: e.deskX, y: e.deskY, rotate: e.deskRotate, width: e.deskWidth },
        map: { x: e.mapX, y: e.mapY },
        visibility: e.visibility,
      }))
    : mockPostcards;
}

/* --------------------------------------------------------------- articles */

type StrapiArticle = {
  documentId: string;
  kind: string;
  title: string;
  date: string;
  readTime: string;
  tags: string;
  excerpt: string;
  visibility: Article["visibility"];
};

export async function getArticles(): Promise<Article[]> {
  const data = await fetchPublic<StrapiArticle>("articles?sort=id:asc");
  return data
    ? data.map((e) => ({
        id: e.documentId,
        kind: e.kind as ArticleKind,
        title: e.title,
        date: e.date,
        readTime: e.readTime,
        tags: e.tags,
        excerpt: e.excerpt,
        visibility: e.visibility,
      }))
    : mockArticles;
}

/* ---------------------------------------------------------------- journey */

type StrapiJourney = {
  documentId: string;
  year: string;
  category: string;
  size: string;
  title: string;
  body: string;
  note: string | null;
  visibility: JourneyEvent["visibility"];
};

export async function getJourney(): Promise<JourneyEvent[]> {
  const data = await fetchPublic<StrapiJourney>("journey-events?sort=id:asc");
  return data
    ? data.map((e) => ({
        id: e.documentId,
        year: e.year,
        category: e.category as JourneyCategory,
        size: e.size as JourneySize,
        title: e.title,
        body: e.body,
        note: e.note ?? undefined,
        visibility: e.visibility,
      }))
    : mockJourney;
}

/* --------------------------------------------------------------- projects */

type StrapiProject = {
  documentId: string;
  code: string;
  name: string;
  status: string;
  description: string;
  period: string;
  tech: string;
  learned: string;
  coverFrom: string;
  coverTo: string;
  visibility: Project["visibility"];
};

export async function getProjects(): Promise<Project[]> {
  const data = await fetchPublic<StrapiProject>("projects?sort=id:asc");
  return data
    ? data.map((e) => ({
        id: e.documentId,
        code: e.code,
        name: e.name,
        status: e.status as ProjectStatus,
        description: e.description,
        period: e.period,
        tech: e.tech,
        learned: e.learned,
        cover: { from: e.coverFrom, to: e.coverTo },
        visibility: e.visibility,
      }))
    : mockProjects;
}

/* --------------------------------------------------------------- memories */

type StrapiMemory = {
  documentId: string;
  kind: string;
  title: string;
  body: string;
  filedUnder: string;
  visibility: Memory["visibility"];
};

export async function getMemories(): Promise<Memory[]> {
  const data = await fetchPublic<StrapiMemory>("memories?sort=id:asc");
  return data
    ? data.map((e) => ({
        id: e.documentId,
        kind: e.kind,
        title: e.title,
        body: e.body,
        filedUnder: e.filedUnder,
        visibility: e.visibility,
      }))
    : mockMemories;
}

/* ---------------------------------------------------------------- hobbies */

type StrapiHobby = {
  documentId: string;
  name: string;
  tag: string;
  body: string;
  href: string;
  visibility: Hobby["visibility"];
};

export async function getHobbies(): Promise<Hobby[]> {
  const data = await fetchPublic<StrapiHobby>("hobbies?sort=id:asc");
  return data
    ? data.map((e) => ({
        id: e.documentId,
        name: e.name,
        tag: e.tag,
        body: e.body,
        href: e.href,
        visibility: e.visibility,
      }))
    : mockHobbies;
}

/* ----------------------------------------------------------------- photos */

type StrapiPhoto = {
  documentId: string;
  caption: string;
  meta: string;
  seed: number;
  visibility: Photo["visibility"];
};

export async function getPhotos(): Promise<Photo[]> {
  const data = await fetchPublic<StrapiPhoto>("photos?sort=id:asc");
  return data
    ? data.map((e) => ({
        id: e.documentId,
        caption: e.caption,
        meta: e.meta,
        seed: e.seed,
        visibility: e.visibility,
      }))
    : mockPhotos;
}

/* -------------------------------------------------------------------- now */

type StrapiNow = { label: string; text: string };

export async function getNow(): Promise<NowEntry[]> {
  const data = await fetchPublic<StrapiNow>("now-entries?sort=order:asc");
  return data ? data.map((e) => ({ label: e.label, text: e.text })) : mockNow;
}

/* --------------------------------------------------------------------- cv */

export type CvContent = {
  profile: { name: string; role: string; summary: string; location: string; email: string };
  sections: CvSection[];
};

type StrapiCv = {
  name: string;
  role: string;
  summary: string;
  location: string;
  email: string;
  sections: { title: string; rows: { head: string; meta: string; body: string }[] }[];
};

export async function getCv(): Promise<CvContent> {
  const data = await fetchSingle<StrapiCv>("cv?populate[sections][populate]=rows");
  if (!data) return { profile: mockCvProfile, sections: mockCvSections };
  return {
    profile: {
      name: data.name,
      role: data.role,
      summary: data.summary,
      location: data.location,
      email: data.email,
    },
    sections: (data.sections ?? []).map((s) => ({
      title: s.title,
      rows: (s.rows ?? []).map((r) => ({ head: r.head, meta: r.meta, body: r.body })),
    })),
  };
}

/* ------------------------------------------------------------------- home */

export type HomeContent = {
  hero: { title: string; body: string; year: string };
  latest: { kind: string; title: string; excerpt: string; date: string; readTime: string };
  current: { name: string; line1: string; line2: string };
  chaos: ChaosCard[];
};

type StrapiHome = {
  heroTitle: string;
  heroBody: string;
  heroYear: string;
  latestKind: string;
  latestTitle: string;
  latestExcerpt: string;
  latestDate: string;
  latestReadTime: string;
  currentName: string;
  currentLine1: string;
  currentLine2: string;
  chaosCards: ChaosCard[];
};

export async function getHome(): Promise<HomeContent> {
  const data = await fetchSingle<StrapiHome>("home?populate=chaosCards");
  if (!data) {
    return { hero: mockHero, latest: mockLatest, current: mockCurrent, chaos: mockChaos };
  }
  return {
    hero: { title: data.heroTitle, body: data.heroBody, year: data.heroYear },
    latest: {
      kind: data.latestKind,
      title: data.latestTitle,
      excerpt: data.latestExcerpt,
      date: data.latestDate,
      readTime: data.latestReadTime,
    },
    current: { name: data.currentName, line1: data.currentLine1, line2: data.currentLine2 },
    chaos: (data.chaosCards ?? []).map((c) => ({
      tag: c.tag,
      text: c.text,
      href: c.href,
      tone: c.tone,
    })),
  };
}
