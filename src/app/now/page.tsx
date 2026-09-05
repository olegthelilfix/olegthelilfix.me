import type { Metadata } from "next";
import { getNow } from "@/lib/content";
import styles from "../supporting.module.css";

export const metadata: Metadata = {
  title: "Now",
  description:
    "A current snapshot — what Oleg is working on, learning, reading, building and planning right now.",
};

export default async function NowPage() {
  const nowEntries = await getNow();
  return (
    <div className={styles.page}>
      <header className={styles.intro}>
        <p className={styles.kicker}>A snapshot · updated when it changes</p>
        <h1 className={styles.title}>Now</h1>
        <p className={styles.lede}>
          What has my attention at the moment. Older versions get kept, so this
          page slowly becomes its own little history.
        </p>
      </header>

      <div className={styles.nowList}>
        {nowEntries.map((n) => (
          <div key={n.label} className={styles.nowRow}>
            <span className={styles.nowLabel}>{n.label}</span>
            <p className={styles.nowText}>{n.text}</p>
          </div>
        ))}
      </div>
      <p className={styles.nowStamp}>— written this month, in a good week</p>
    </div>
  );
}
