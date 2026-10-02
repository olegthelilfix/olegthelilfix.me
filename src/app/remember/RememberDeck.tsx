"use client";

import { useState } from "react";
import type { Memory } from "@content/types";
import styles from "./remember.module.css";

export function RememberDeck({ memories }: { memories: Memory[] }) {
  const [index, setIndex] = useState(0);
  const total = memories.length;
  const memory = memories[index % total];

  return (
    <div className={styles.deck}>
      <figure key={memory.id} className={styles.card}>
        <figcaption className={styles.kind}>{memory.kind}</figcaption>
        <blockquote className={styles.cardTitle}>{memory.title}</blockquote>
        <p className={styles.cardBody}>{memory.body}</p>
        <div className={styles.stamp}>Filed under: {memory.filedUnder}</div>
      </figure>

      <div className={styles.controls}>
        <span className={styles.progress}>
          {(index % total) + 1} of {total} pieces of evidence
        </span>
        <button
          type="button"
          className={styles.next}
          onClick={() => setIndex((n) => n + 1)}
        >
          Show another memory →
        </button>
      </div>
    </div>
  );
}
