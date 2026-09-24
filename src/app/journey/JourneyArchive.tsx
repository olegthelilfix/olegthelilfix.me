"use client";

import { useMemo, useState } from "react";
import { Chip } from "@/components/Chip";
import { journeyCategories } from "@content/journey";
import type { JourneyCategory, JourneyEvent } from "@content/types";
import styles from "./journey.module.css";

type Filter = JourneyCategory | "everything";

export function JourneyArchive({ events }: { events: JourneyEvent[] }) {
  const [filter, setFilter] = useState<Filter>("everything");

  const items = useMemo(
    () =>
      events.filter((e) => filter === "everything" || e.category === filter),
    [filter, events],
  );

  const categoryLabel = (c: JourneyCategory) =>
    journeyCategories.find((k) => k.value === c)?.label ?? c;

  return (
    <>
      <div className={styles.filters} data-noprint="1">
        {journeyCategories.map((c) => (
          <Chip
            key={c.value}
            active={filter === c.value}
            onClick={() => setFilter(c.value)}
          >
            {c.label}
          </Chip>
        ))}
        <span className={styles.count}>
          {items.length} {items.length === 1 ? "entry" : "entries"}
        </span>
      </div>

      <div className={styles.wall}>
        {items.map((e, i) => (
          <article
            key={e.id}
            className={`${styles.card} ${styles[`size_${e.size}`]}`}
            style={{ ["--rot" as string]: `${((i % 5) - 2) * 0.35}deg` }}
          >
            <div className={styles.cardMeta}>
              <span className={styles.year}>{e.year}</span>
              <span className={styles.cat}>{categoryLabel(e.category)}</span>
            </div>
            <h3 className={styles.cardTitle}>{e.title}</h3>
            <p className={styles.cardBody}>{e.body}</p>
            {e.note && <p className={styles.note}>{e.note}</p>}
          </article>
        ))}
      </div>
    </>
  );
}
