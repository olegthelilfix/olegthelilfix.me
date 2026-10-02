"use client";

import { useEffect, useRef, useState } from "react";
import type { VinylRecord } from "@content/types";
import { sleeveGradient } from "@/lib/art";
import styles from "./vinyl.module.css";

export function VinylShelf({ records }: { records: VinylRecord[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const selected = selectedId
    ? (records.find((r) => r.id === selectedId) ?? null)
    : null;

  // Drive the native <dialog>: showModal() gives us Esc-to-close, a focus trap
  // and focus restoration for free.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (selectedId && !dialog.open) dialog.showModal();
    if (!selectedId && dialog.open) dialog.close();
  }, [selectedId]);

  return (
    <>
      <div className={styles.shelf}>
        {records.map((r, i) => (
          <button
            key={r.id}
            type="button"
            className={styles.tile}
            style={{ ["--rot" as string]: `${((i % 5) - 2) * 0.5}deg` }}
            onClick={() => setSelectedId(r.id)}
          >
            <span className={styles.sleeve} style={{ background: sleeveGradient(r.cover) }}>
              <span className={styles.sleeveCat}>{r.catalog}</span>
            </span>
            <span className={styles.tileArtist}>{r.artist}</span>
            <span className={styles.tileTitle}>{r.title}</span>
          </button>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-labelledby="record-title"
        onClose={() => setSelectedId(null)}
        onClick={(e) => {
          // Click on the backdrop (the dialog element itself) closes it.
          if (e.target === dialogRef.current) setSelectedId(null);
        }}
      >
        {selected && (
          <div className={styles.record}>
            <div
              className={styles.recordSleeve}
              style={{ background: sleeveGradient(selected.cover) }}
              aria-hidden="true"
            >
              <span className={styles.recordCat}>{selected.catalog}</span>
            </div>
            <div className={styles.recordBody}>
              <button
                type="button"
                className={styles.close}
                onClick={() => setSelectedId(null)}
                aria-label="Close record details"
              >
                ✕
              </button>
              <div className={styles.recordArtist}>{selected.artist}</div>
              <h2 id="record-title" className={styles.recordTitle}>
                {selected.title}
              </h2>
              <dl className={styles.facts}>
                <div>
                  <dt>Released</dt>
                  <dd>{selected.releaseYear}</dd>
                </div>
                <div>
                  <dt>Edition</dt>
                  <dd>{selected.edition}</dd>
                </div>
                <div>
                  <dt>Bought</dt>
                  <dd>{selected.boughtWhere}</dd>
                </div>
                <div>
                  <dt>Favourite</dt>
                  <dd>{selected.favTrack}</dd>
                </div>
              </dl>
              <p className={styles.recordNote}>{selected.note}</p>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
