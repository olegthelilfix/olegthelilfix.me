import type { Metadata } from "next";
import Link from "next/link";
import { drawers } from "@/data/collections";
import styles from "./collections.module.css";

export const metadata: Metadata = {
  title: "Collections",
  description:
    "A cabinet of drawers — vinyl, postcards, photos and a few things not yet catalogued. Each collection kept for its own reasons.",
};

export default function CollectionsPage() {
  return (
    <div className={styles.page}>
      <header className={styles.intro}>
        <p className={styles.kicker}>The cabinet</p>
        <h1 className={styles.title}>Collections</h1>
        <p className={styles.lede}>
          A collection is an argument with forgetting. Some drawers open onto
          full catalogues; others are honest about being half-full.
        </p>
      </header>

      <div className={styles.cabinet}>
        {drawers.map((d) => (
          <Link
            key={d.code}
            href={d.href}
            className={`${styles.drawer} ${styles[`tone_${d.tone}`]}`}
          >
            <div className={styles.drawerTop}>
              <span className={styles.code}>{d.code}</span>
              {!d.live && <span className={styles.soon}>uncatalogued</span>}
            </div>
            <span className={styles.name}>{d.name}</span>
            <p className={styles.note}>{d.note}</p>
            <span className={styles.count}>{d.count}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
