import type { Metadata } from "next";
import { getJourney } from "@/lib/content";
import { JourneyArchive } from "./JourneyArchive";
import styles from "./journey.module.css";

export const metadata: Metadata = {
  title: "Journey",
  description:
    "The path so far — work, life, projects and small victories. An emotional archive of events large and small, not a corporate timeline.",
};

export default async function JourneyPage() {
  const events = await getJourney();
  return (
    <div className={styles.page}>
      <header className={styles.intro}>
        <p className={styles.kicker}>Life & development · 2014 → 2026</p>
        <h1 className={styles.title}>The path so far</h1>
        <p className={styles.lede}>
          Not a résumé timeline. A wall of things that happened — a move, an
          exam, a washing machine, a team — kept at the size they actually felt.
          The small victories are load-bearing.
        </p>
      </header>
      <JourneyArchive events={events} />
    </div>
  );
}
