import type { Metadata } from "next";
import { getCv } from "@/lib/content";
import { PrintButton } from "@/components/PrintButton";
import styles from "./cv.module.css";

export const metadata: Metadata = {
  title: "CV",
  description:
    "Curriculum vitae of Oleg Aleksandrov — engineering manager and backend developer. Experience, achievements, technical and management skills.",
};

export default async function CvPage() {
  const { profile: cvProfile, sections: cvSections } = await getCv();
  return (
    <article className={styles.sheet} data-cv>
      <header className={styles.head}>
        <div className={styles.headMain}>
          <h1 className={styles.name}>{cvProfile.name}</h1>
          <p className={styles.role}>{cvProfile.role}</p>
          <p className={styles.summary}>{cvProfile.summary}</p>
        </div>
        <div className={styles.headSide}>
          <div className={styles.contactLine}>{cvProfile.location}</div>
          <div className={styles.contactLine}>
            <a href={`mailto:${cvProfile.email}`}>{cvProfile.email}</a>
          </div>
          <PrintButton className={styles.print}>Download PDF ↧</PrintButton>
        </div>
      </header>

      {cvSections.map((section) => (
        <section key={section.title} className={styles.section}>
          <h2 className={styles.sectionTitle}>{section.title}</h2>
          <div className={styles.rows}>
            {section.rows.map((row, i) => (
              <div key={i} className={styles.row}>
                <div className={styles.rowHead}>
                  <span className={styles.rowTitle}>{row.head}</span>
                  {row.meta && <span className={styles.rowMeta}>{row.meta}</span>}
                </div>
                <p className={styles.rowBody}>{row.body}</p>
              </div>
            ))}
          </div>
        </section>
      ))}
    </article>
  );
}
