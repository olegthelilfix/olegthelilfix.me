import type { Metadata } from "next";
import { getRecords } from "@/lib/content";
import { VinylShelf } from "./VinylShelf";
import styles from "./vinyl.module.css";

export const metadata: Metadata = {
  title: "Vinyl",
  description:
    "A shelf of records, each with a catalogue number, where it was bought, and the story it carries. Part record shop, part zine.",
};

export default async function VinylPage() {
  const records = await getRecords();
  return (
    <div className={styles.page}>
      <header className={styles.intro}>
        <div className={styles.storefront}>
          <span className={styles.openSign}>Open</span>
          <span className={styles.stock}>{records.length} in the case · 214 on the shelf</span>
        </div>
        <h1 className={styles.title}>The record shelf</h1>
        <p className={styles.lede}>
          Not a want-list — a played-list. Pull a sleeve to read where it was
          bought and what it has to do with anything.
        </p>
      </header>
      <VinylShelf records={records} />
    </div>
  );
}
