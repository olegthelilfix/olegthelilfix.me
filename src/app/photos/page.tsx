import type { Metadata } from "next";
import { getPhotos } from "@/lib/content";
import { photoGradient } from "@/lib/art";
import styles from "../supporting.module.css";

export const metadata: Metadata = {
  title: "Photos",
  description:
    "Not the whole archive — selected moments, each with a little context: where it was, when, and the small story attached.",
};

export default async function PhotosPage() {
  const photos = await getPhotos();
  return (
    <div className={styles.page}>
      <header className={styles.intro}>
        <p className={styles.kicker}>Contact sheets</p>
        <h1 className={styles.title}>Photos</h1>
        <p className={styles.lede}>
          Not every photo — the ones with a story. Placeholders for now; the real
          frames arrive with the archive backend.
        </p>
      </header>

      <div className={styles.photoGrid}>
        {photos.map((p) => (
          <figure key={p.id} className={styles.photo}>
            <div
              className={styles.photoImg}
              style={{ background: photoGradient(p.seed) }}
              aria-hidden="true"
            />
            <figcaption className={styles.photoCaption}>{p.caption}</figcaption>
            <div className={styles.photoMeta}>{p.meta}</div>
          </figure>
        ))}
      </div>
    </div>
  );
}
