"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { Chip } from "@/components/Chip";
import { sleeveGradient } from "@/lib/art";
import type { ChaosCard } from "@content/home";
import type { VinylRecord, Hobby } from "@content/types";
import styles from "./home.module.css";

type Density = "calm" | "normal" | "oleg";

type HomeCollageProps = {
  hero: { title: string; body: string; year: string };
  latest: { kind: string; title: string; excerpt: string; date: string; readTime: string };
  current: { name: string; line1: string; line2: string };
  chaos: ChaosCard[];
  shelf: VinylRecord[];
  hobbies: Hobby[];
};

const DENSITY_KEY = "archive-density";

const densityOptions: { value: Density; label: string }[] = [
  { value: "calm", label: "Calm" },
  { value: "normal", label: "Normal" },
  { value: "oleg", label: "Oleg" },
];

const noteFor = (d: Density) =>
  d === "calm"
    ? "quiet today. that is allowed."
    : d === "oleg"
      ? "you asked for this"
      : "the usual amount of everything";

// Density is client-persisted external state, so it's read through
// useSyncExternalStore: the server (and first hydration) sees "normal", then
// React reconciles to the stored value without a hydration mismatch.
const DENSITY_EVENT = "archive-density-change";

function subscribe(callback: () => void) {
  window.addEventListener(DENSITY_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(DENSITY_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function readDensity(): Density {
  const saved = window.localStorage.getItem(DENSITY_KEY);
  return saved === "calm" || saved === "oleg" ? saved : "normal";
}

export function HomeCollage({
  hero,
  latest,
  current,
  chaos,
  shelf,
  hobbies,
}: HomeCollageProps) {
  const density = useSyncExternalStore(
    subscribe,
    readDensity,
    (): Density => "normal",
  );

  const choose = (d: Density) => {
    window.localStorage.setItem(DENSITY_KEY, d);
    window.dispatchEvent(new Event(DENSITY_EVENT));
  };

  const notCalm = density !== "calm";
  const isOleg = density === "oleg";

  return (
    <div className={styles.page} data-density={density}>
      <header className={styles.hero}>
        <h1 className={styles.name}>Oleg Aleksandrov</h1>
        <p className={styles.tagline}>
          Engineering manager, developer, mentor, writer, collector of things and
          occasional builder of unnecessary systems.
        </p>
        <p className={styles.est}>
          Personal archive · olegthelilfix.me · est. somewhere around 2014
        </p>
      </header>

      <div className={styles.densityBar} data-noprint="1">
        <span className={styles.densityLabel}>Density</span>
        <div className={styles.densityChips}>
          {densityOptions.map((o) => (
            <Chip
              key={o.value}
              active={density === o.value}
              onClick={() => choose(o.value)}
            >
              {o.label}
            </Chip>
          ))}
        </div>
        <span className={styles.densityNote}>{noteFor(density)}</span>
      </div>

      <div className={styles.collage}>
        <section className={`${styles.card} ${styles.achievement}`}>
          <div className={styles.eyebrowAccent}>Selected achievement</div>
          <h2 className={styles.achievementTitle}>{hero.title}</h2>
          <p className={styles.achievementBody}>{hero.body}</p>
          <div className={styles.stampMono}>{hero.year}</div>
        </section>

        {notCalm && (
          <figure className={styles.polaroid}>
            <div className={styles.polaroidImg} aria-hidden="true">
              <span>photo · first winter in Germany, 2018</span>
            </div>
            <figcaption>no furniture yet, but the kettle worked</figcaption>
          </figure>
        )}

        <section className={styles.latest}>
          <div className={styles.eyebrow}>Latest article · {latest.kind}</div>
          <Link href="/articles" className={styles.latestTitle}>
            {latest.title}
          </Link>
          <p className={styles.latestExcerpt}>{latest.excerpt}</p>
          <div className={styles.stampMono}>
            {latest.date} · {latest.readTime}
          </div>
        </section>

        <section className={styles.terminal}>
          <div className={styles.terminalTop}>
            <span>current project</span>
            <span className={styles.running}>● running</span>
          </div>
          <div className={styles.terminalName}>{current.name}</div>
          <div className={styles.terminalLine}>{current.line1}</div>
          <div className={styles.terminalLine}>{current.line2}</div>
          <Link href="/projects" className={styles.terminalLink}>
            open the lab →
          </Link>
        </section>

        {notCalm && (
          <section className={styles.shelf}>
            <div className={styles.eyebrow}>From the shelf</div>
            <div className={styles.shelfRow}>
              {shelf.map((r) => (
                <Link
                  key={r.id}
                  href="/collections/vinyl"
                  className={styles.shelfItem}
                >
                  <span
                    className={styles.shelfCover}
                    style={{ background: sleeveGradient(r.cover) }}
                  />
                  <span className={styles.shelfCat}>{r.catalog}</span>
                  <span className={styles.shelfArtist}>{r.artist}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {notCalm && (
          <section className={styles.hobbies}>
            <div className={styles.eyebrow}>Also, currently</div>
            <div className={styles.hobbyRow}>
              {hobbies.slice(0, isOleg ? 6 : 4).map((h) => (
                <Link key={h.id} href={h.href} className={styles.hobbyChip}>
                  <span className={styles.hobbyName}>{h.name}</span>
                  <span className={styles.hobbyTag}>{h.tag}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {isOleg && (
          <section className={styles.chaos}>
            <div className={styles.eyebrow}>Everything at once</div>
            <div className={styles.chaosGrid}>
              {chaos.map((c, i) => (
                <Link
                  key={i}
                  href={c.href}
                  className={`${styles.chaosCard} ${styles[`tone_${c.tone}`]}`}
                >
                  <span className={styles.chaosTag}>{c.tag}</span>
                  <span className={styles.chaosText}>{c.text}</span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
