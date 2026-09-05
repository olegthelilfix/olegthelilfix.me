"use client";

import { useState } from "react";
import { Chip } from "@/components/Chip";
import type { Postcard } from "@/data/types";
import styles from "./postcards.module.css";

type View = "desk" | "archive" | "map";

const views: { value: View; label: string }[] = [
  { value: "desk", label: "Desk" },
  { value: "archive", label: "Archive" },
  { value: "map", label: "Map" },
];

export function PostcardDeck({ postcards }: { postcards: Postcard[] }) {
  const [view, setView] = useState<View>("desk");
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});

  const toggle = (id: string) =>
    setFlipped((f) => ({ ...f, [id]: !f[id] }));

  return (
    <>
      <div className={styles.switch} data-noprint="1">
        {views.map((v) => (
          <Chip
            key={v.value}
            active={view === v.value}
            onClick={() => setView(v.value)}
          >
            {v.label}
          </Chip>
        ))}
        <span className={styles.hint}>
          {view === "desk"
            ? "tap a card to read the back"
            : view === "map"
              ? "where they were sent from"
              : "46 cards, most written to myself"}
        </span>
      </div>

      {view === "map" ? (
        <div className={styles.map} role="img" aria-label="Schematic map of postcard origins">
          {postcards.map((p) => (
            <span
              key={p.id}
              className={styles.pin}
              style={{ left: `${p.map.x}%`, top: `${p.map.y}%` }}
            >
              <span className={styles.pinDot} />
              <span className={styles.pinLabel}>
                {p.city} <em>{p.year}</em>
              </span>
            </span>
          ))}
        </div>
      ) : (
        <div className={view === "desk" ? styles.desk : styles.archive}>
          {postcards.map((p) => {
            const isBack = !!flipped[p.id];
            const positioned =
              view === "desk"
                ? {
                    left: `${p.desk.x}%`,
                    top: `${p.desk.y}%`,
                    width: `${p.desk.width}px`,
                    ["--rot" as string]: `${p.desk.rotate}deg`,
                  }
                : undefined;
            return (
              <button
                key={p.id}
                type="button"
                className={styles.card}
                style={positioned}
                aria-pressed={isBack}
                onClick={() => toggle(p.id)}
              >
                {isBack ? (
                  <span className={styles.back}>
                    <span className={styles.backHead}>
                      <span>{p.ref}</span>
                      <span>{p.date}</span>
                    </span>
                    <span className={styles.message}>{p.text}</span>
                  </span>
                ) : (
                  <span className={styles.front}>
                    <span
                      className={styles.art}
                      style={{
                        background: `repeating-linear-gradient(${20 + p.desk.x}deg, #e0d8c6 0 8px, #d4cbb6 8px 16px)`,
                      }}
                    />
                    <span className={styles.stamp}>{p.city}</span>
                    <span className={styles.place}>
                      {p.city}, {p.country} · {p.year}
                    </span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </>
  );
}
