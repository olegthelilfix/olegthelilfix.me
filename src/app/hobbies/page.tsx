import type { Metadata } from "next";
import Link from "next/link";
import { getHobbies } from "@/lib/content";
import styles from "../supporting.module.css";

export const metadata: Metadata = {
  title: "Hobbies",
  description:
    "Doorways into the things done outside work — writing, drums, cycling, self-hosting, collecting and side projects.",
};

export default async function HobbiesPage() {
  const hobbies = await getHobbies();
  return (
    <div className={styles.page}>
      <header className={styles.intro}>
        <p className={styles.kicker}>Outside of work</p>
        <h1 className={styles.title}>Hobbies</h1>
        <p className={styles.lede}>
          Little worlds of their own. Each one links off to wherever it actually
          lives on the site.
        </p>
      </header>

      <div className={styles.hobbyGrid}>
        {hobbies.map((h) => (
          <Link key={h.id} href={h.href} className={styles.hobby}>
            <span className={styles.hobbyTag}>{h.tag}</span>
            <span className={styles.hobbyName}>{h.name}</span>
            <span className={styles.hobbyBody}>{h.body}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
