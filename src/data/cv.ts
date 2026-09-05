import type { CvSection } from "./types";

export const cvProfile = {
  name: "Oleg Aleksandrov",
  role: "Engineering Manager · Backend Developer",
  summary:
    "Engineering manager and backend developer with eleven years on JVM systems. Comfortable owning services end to end, growing engineers, and preferring a clear written decision over a long meeting.",
  location: "Germany",
  email: "hello@olegthelilfix.com",
};

export const cvSections: CvSection[] = [
  {
    title: "Experience",
    rows: [
      {
        head: "Engineering Manager",
        meta: "2023 — present",
        body: "Two backend teams, six engineers. Hiring, growth plans, architecture review, and a platform migration delivered over three quarters. Reduced on-call incidents by roughly half by making ownership explicit and boring.",
      },
      {
        head: "Tech Lead, Backend",
        meta: "2021 — 2023",
        body: "Led a team of four on JVM services handling order and pricing flows. Introduced structured code review, a written decision log and an internship track.",
      },
      {
        head: "Senior Backend Developer",
        meta: "2018 — 2021",
        body: "Kotlin/Java services on Spring Boot, PostgreSQL and Kafka. Owned a payments integration end to end, including the parts nobody wanted to own.",
      },
      {
        head: "Backend Developer",
        meta: "2014 — 2018",
        body: "Monolith maintenance, then extraction of the first three services. Learned the difference between a system that works and a system you can operate.",
      },
    ],
  },
  {
    title: "Selected achievements",
    rows: [
      {
        head: "Nine interns mentored",
        meta: "2022 — present",
        body: "Designed the programme, curriculum and review rituals. Six converted to full-time roles.",
      },
      {
        head: "Platform migration",
        meta: "2024 — 2025",
        body: "Moved core services with no customer-visible downtime; the written plan became the team’s reference document.",
      },
      {
        head: "Performance work",
        meta: "2025",
        body: "40× improvement on a critical query path, and a profiling practice the team still uses.",
      },
    ],
  },
  {
    title: "Technical",
    rows: [
      {
        head: "Kotlin · Java · Spring Boot · PostgreSQL · Kafka · Docker · Kubernetes · Grafana · JMH",
        meta: "",
        body: "Comfortable in JVM performance work, service extraction, observability and pragmatic testing. Not a frontend engineer, and honest about it.",
      },
    ],
  },
  {
    title: "Management",
    rows: [
      {
        head: "Hiring · growth plans · one-to-ones · incident culture · written decisions",
        meta: "",
        body: "Prefer clear documents over long meetings, and explicit ownership over heroics.",
      },
    ],
  },
  {
    title: "Languages & education",
    rows: [
      {
        head: "Russian (native) · English (fluent) · German (B2)",
        meta: "",
        body: "German exam passed 2023; still working towards C1 with the enthusiasm of someone who must call the tax office.",
      },
      {
        head: "BSc, Computer Science",
        meta: "graduated 2014",
        body: "Thesis on distributed task scheduling; the code has mercifully been lost.",
      },
    ],
  },
  {
    title: "Contact",
    rows: [
      {
        head: "hello@olegthelilfix.com",
        meta: "",
        body: "Open to conversations about engineering management, mentorship and JVM performance. Not looking, but always reading.",
      },
    ],
  },
];
