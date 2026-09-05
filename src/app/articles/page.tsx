import type { Metadata } from "next";
import { getArticles } from "@/lib/content";
import styles from "../supporting.module.css";

export const metadata: Metadata = {
  title: "Articles",
  description:
    "Essays, technical write-ups, notes and project logs — on backend engineering, management, mentorship, self-hosting, writing and life in Germany.",
};

export default async function ArticlesPage() {
  const articles = await getArticles();
  return (
    <div className={styles.page}>
      <header className={styles.intro}>
        <p className={styles.kicker}>A quiet literary journal</p>
        <h1 className={styles.title}>Articles</h1>
        <p className={styles.lede}>
          Long essays, short notes, technical write-ups and project logs. Some
          about systems, some about people, most about both.
        </p>
      </header>

      <div className={styles.articleList}>
        {articles.map((a) => (
          <article key={a.id} className={styles.article}>
            <span className={styles.articleKind}>
              {a.kind} · {a.date} · {a.readTime}
            </span>
            <h2 className={styles.articleTitle}>{a.title}</h2>
            <p className={styles.articleExcerpt}>{a.excerpt}</p>
            <span className={styles.articleMeta}>{a.tags}</span>
          </article>
        ))}
      </div>
    </div>
  );
}
