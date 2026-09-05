import type { Metadata } from "next";
import { getMemories } from "@/lib/content";
import { RememberDeck } from "./RememberDeck";
import styles from "./remember.module.css";

export const metadata: Metadata = {
  title: "Remember",
  description:
    "A page mostly for the owner. Real evidence from the archive — an achievement, an old goal reached, a small win — for the days it helps to see it.",
};

export default async function RememberPage() {
  const memories = await getMemories();
  return (
    <div className={styles.page}>
      <header className={styles.intro}>
        <p className={styles.kicker}>For the harder days</p>
        <h1 className={styles.title}>You have been here before.</h1>
        <p className={styles.lede}>
          This page is mostly for me. Not slogans — evidence. Real things that
          happened, filed elsewhere on this site, pulled up one at a time when
          it helps to remember that the path was actually walked.
        </p>
      </header>
      <RememberDeck memories={memories} />
    </div>
  );
}
