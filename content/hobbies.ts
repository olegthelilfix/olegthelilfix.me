import type { Hobby, NowEntry, Photo } from "./types";

export const hobbies: Hobby[] = [
  { id: "hb-writing", name: "Writing", tag: "41 000 words", body: "One novel in progress, several essays, a lot of deleted first paragraphs.", href: "/articles", visibility: "public" },
  { id: "hb-drums", name: "Drums", tag: "month 7", body: "A four-piece kit, mesh heads, and a metronome I have learned to respect.", href: "/now", visibility: "public" },
  { id: "hb-cycling", name: "Cycling", tag: "11 240 km", body: "Long, flat, unglamorous rides. The bakery is a load-bearing part of the plan.", href: "/journey", visibility: "public" },
  { id: "hb-selfhost", name: "Self-hosting", tag: "two disks, one UPS", body: "Running my own small internet, badly and happily.", href: "/projects", visibility: "public" },
  { id: "hb-collecting", name: "Collecting", tag: "214 + 46", body: "Records and postcards. An argument with forgetting.", href: "/collections", visibility: "public" },
  { id: "hb-side", name: "Side projects", tag: "nine, some alive", body: "Started for curiosity, kept for the lesson, abandoned without shame.", href: "/projects", visibility: "public" },
];

export const nowEntries: NowEntry[] = [
  { label: "Working on", text: "Leading two backend teams through the second half of a platform migration. Mostly writing documents, holding one-to-ones and removing obstacles that turn out to be other documents." },
  { label: "Learning", text: "Drums, month 7 — currently the paradiddle, currently losing. Also German C1 grammar, at a pace best described as geological." },
  { label: "Reading", text: "A biography of an engineer I had never heard of, and a very slow novel I keep restarting on purpose." },
  { label: "Building", text: "This archive, and a JVM allocation-profiling lab that exists mainly so I can stop guessing." },
  { label: "Riding", text: "Rebuilding base mileage after a flat winter. Target: 3 000 km this year, currently 1 180." },
  { label: "Next", text: "Recording the drums badly and keeping the take. Possibly a fanzine about records nobody bought." },
];

export const photos: Photo[] = [
  { id: "ph-01", caption: "The flat, first week. One chair, borrowed.", meta: "Germany · Feb 2018", seed: 32, visibility: "public" },
  { id: "ph-02", caption: "Record shop basement, Lisbon. Smelled exactly as expected.", meta: "Portugal · May 2019", seed: 61, visibility: "public" },
  { id: "ph-03", caption: "Kit assembled on the living-room rug. Instructions ignored.", meta: "Home · Jan 2025", seed: 12, visibility: "public" },
  { id: "ph-04", caption: "Km 170. The face of a man who has made choices.", meta: "Elbe route · May 2024", seed: 47, visibility: "public" },
  { id: "ph-05", caption: "Harbour cranes, sideways rain.", meta: "Hamburg · Mar 2022", seed: 78, visibility: "public" },
  { id: "ph-06", caption: "Twenty minutes of light after seven hours of rain.", meta: "Bergen · Sep 2024", seed: 24, visibility: "public" },
];
