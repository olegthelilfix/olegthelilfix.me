import type { Memory } from "./types";

// Feeds the Remember page. Each memory is a real piece of evidence filed under
// somewhere else on the site — support built from events, not slogans.
export const memories: Memory[] = [
  {
    id: "mem-move",
    kind: "Achievement",
    title: "You moved to a country whose language you did not speak.",
    body: "In 2018 you arrived with two suitcases and about forty words. You did the forms, the appointments, the phone calls you dreaded. Everything about your current life stands on that.",
    filedUnder: "journey / 2018",
    visibility: "public",
  },
  {
    id: "mem-lead",
    kind: "An old goal, already reached",
    title: "“Lead a team one day.”",
    body: "Written in a notebook in 2017, when it felt like something other people did. You have now done it for three years, and had the boring hard days that prove it was real work, not luck.",
    filedUnder: "cv / experience",
    visibility: "public",
  },
  {
    id: "mem-elbe",
    kind: "A good moment",
    title: "The morning by the Elbe, 6:40.",
    body: "You had not slept much. The light was ridiculous. You stopped, ate a terrible sandwich, and were happy in a way that did not need a reason.",
    filedUnder: "photos / 2024",
    visibility: "public",
  },
  {
    id: "mem-tunnel",
    kind: "A finished project",
    title: "The tunnel still runs.",
    body: "You built it in 2020 in a week of evenings and it has needed almost nothing since. Quiet things you made are still working while you read this.",
    filedUnder: "projects / IUS-03",
    visibility: "public",
  },
  {
    id: "mem-washer",
    kind: "A small success",
    title: "You fixed the washing machine.",
    body: "One video, one hex key, and the specific satisfaction of a thing that was broken and then was not.",
    filedUnder: "journey / small victories",
    visibility: "public",
  },
  {
    id: "mem-insurance",
    kind: "Once impossible",
    title: "You argued with an insurance company in German. And won.",
    body: "In 2018 you could not order bread without rehearsing it first.",
    filedUnder: "journey / 2023",
    visibility: "public",
  },
  {
    id: "mem-nina",
    kind: "An object with a history",
    title: "LS-042 — Nina Simone, Pastel Blues.",
    body: "Carried in hand luggage from Trieste across two borders because you did not trust the hold. You still put on side one when you need to reset.",
    filedUnder: "collections / vinyl",
    visibility: "public",
  },
  {
    id: "mem-note",
    kind: "A message from a previous you",
    title: "“If today is only maintenance, that is still the job.”",
    body: "Written in 2022, on a week when nothing shipped. It was true then and it is available to you now.",
    filedUnder: "notes / undated",
    visibility: "public",
  },
];
