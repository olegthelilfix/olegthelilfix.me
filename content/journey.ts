import type { JourneyEvent, JourneyCategory } from "./types";

export const journeyCategories: { value: JourneyCategory | "everything"; label: string }[] = [
  { value: "everything", label: "Everything" },
  { value: "work", label: "Work" },
  { value: "life", label: "Life" },
  { value: "projects", label: "Projects" },
  { value: "small", label: "Small victories" },
];

export const journey: JourneyEvent[] = [
  { id: "jr-2014-work", year: "2014", category: "work", size: "m", title: "First backend job", body: "Java 7, a monolith and a very patient colleague who reviewed everything twice.", visibility: "public" },
  { id: "jr-2016-server", year: "2016", category: "projects", size: "s", title: "First home server", body: "An old laptop under the desk. It ran for eleven days.", note: "still have the sticker", visibility: "public" },
  { id: "jr-2017-kotlin", year: "2017", category: "work", size: "s", title: "Switched to Kotlin", body: "Never went back.", visibility: "public" },
  { id: "jr-2018-move", year: "2018", category: "life", size: "l", title: "Moved to Germany", body: "Two suitcases, a job offer and a vocabulary of about forty words. The first month was mostly forms. The second month was mostly quiet. By the third I had a favourite bakery, which is how you know it worked.", note: "the hardest good decision", visibility: "public" },
  { id: "jr-2019-ride", year: "2019", category: "small", size: "s", title: "First 100 km ride", body: "Nine hours, three wrong turns, one bakery.", visibility: "public" },
  { id: "jr-2019-a2", year: "2019", category: "life", size: "m", title: "A2 German", body: "Passed with a mark that nobody has ever asked about, and which I think about often.", visibility: "public" },
  { id: "jr-2020-flat", year: "2020", category: "life", size: "m", title: "The long flat year", body: "Nothing to show for it externally. Internally: learned how to be alone without it meaning something is wrong.", note: "this counts too", visibility: "public" },
  { id: "jr-2020-tunnel", year: "2020", category: "projects", size: "s", title: "Reverse SSH tunnel", body: "So the flat could talk to the internet on my terms.", visibility: "public" },
  { id: "jr-2021-lead", year: "2021", category: "work", size: "l", title: "Tech lead", body: "Given a team of four and the strange discovery that my best code was now other people’s code. Spent a year learning to say “what do you think?” before saying what I thought.", visibility: "public" },
  { id: "jr-2021-ocr", year: "2021", category: "projects", size: "m", title: "OCR pipeline for supermarket catalogues", body: "A weekend idea that ran for four months and produced a spreadsheet of pasta prices nobody needed.", visibility: "public" },
  { id: "jr-2022-washer", year: "2022", category: "small", size: "s", title: "Fixed the washing machine", body: "One YouTube video, one hex key, enormous satisfaction.", visibility: "public" },
  { id: "jr-2022-mentor", year: "2022", category: "work", size: "m", title: "Started mentoring interns", body: "Nine so far. Six still write. Two are now better engineers than me at their thing.", visibility: "public" },
  { id: "jr-2023-b2", year: "2023", category: "life", size: "m", title: "B2 German", body: "Can now argue with an insurance company in the second language. A real milestone.", note: "ich hätte gerne…", visibility: "public" },
  { id: "jr-2023-em", year: "2023", category: "work", size: "l", title: "Engineering manager", body: "Six people, two teams, one migration that took three quarters and taught me more about writing than any essay.", visibility: "public" },
  { id: "jr-2023-fiction", year: "2023", category: "life", size: "s", title: "Started writing fiction", body: "Badly, and on purpose.", visibility: "public" },
  { id: "jr-2024-200", year: "2024", category: "small", size: "m", title: "200 km in one day", body: "Elbe to the coast. Cried a little around km 170, which I am told is normal.", visibility: "public" },
  { id: "jr-2024-selfhost", year: "2024", category: "projects", size: "s", title: "Self-hosted everything", body: "Photos, notes, RSS, backups. Two disks, one UPS.", visibility: "public" },
  { id: "jr-2025-drums", year: "2025", category: "life", size: "m", title: "Bought a drum kit", body: "Month 7. Still counting out loud. The neighbours have been generous.", note: "paradiddle, eventually", visibility: "public" },
  { id: "jr-2025-left", year: "2025", category: "work", size: "s", title: "First person I hired left for something better", body: "Which is, annoyingly, the goal.", visibility: "public" },
  { id: "jr-2026-archive", year: "2026", category: "projects", size: "m", title: "This archive", body: "Started because I could not remember 2020 and it turned out I had simply never written it down.", visibility: "public" },
];
