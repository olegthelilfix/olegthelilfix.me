import type { Metadata } from "next";
import { getProjects } from "@/lib/content";
import { statusColor } from "@content/projects";
import { diagramGradient } from "@/lib/art";
import styles from "../supporting.module.css";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "An archive of personal technical projects — working, completed, frozen and abandoned. Unfinished ones are part of the story too.",
};

export default async function ProjectsPage() {
  const projects = await getProjects();
  return (
    <div className={styles.page}>
      <header className={styles.intro}>
        <p className={styles.kicker}>Engineering lab</p>
        <h1 className={styles.title}>Projects</h1>
        <p className={styles.lede}>
          Working, completed, frozen, abandoned. None of these had to succeed
          commercially — an abandoned project is not a failed one if you can say
          what it taught you.
        </p>
      </header>

      <div className={styles.projectGrid}>
        {projects.map((p) => (
          <article key={p.id} className={styles.project}>
            <div
              className={styles.projectDiagram}
              style={{ background: diagramGradient(p.cover) }}
              aria-hidden="true"
            />
            <div className={styles.projectBody}>
              <div className={styles.projectTop}>
                <span className={styles.projectCode}>{p.code}</span>
                <span
                  className={styles.projectStatus}
                  style={{ color: statusColor[p.status] }}
                >
                  {p.status}
                </span>
              </div>
              <h2 className={styles.projectName}>{p.name}</h2>
              <p className={styles.projectDesc}>{p.description}</p>
              <div className={styles.projectFoot}>
                <span className={styles.projectRow}>{p.period}</span>
                <span className={styles.projectRow}>{p.tech}</span>
                <span className={styles.projectLearned}>{p.learned}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
