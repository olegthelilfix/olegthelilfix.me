import type { Metadata } from "next";
import { getPostcards } from "@/lib/content";
import { PostcardDeck } from "./PostcardDeck";
import styles from "./postcards.module.css";

export const metadata: Metadata = {
  title: "Postcards",
  description:
    "A postal archive — cards from Lisbon to Ljubljana, mostly written to myself. View them on the desk, in the archive, or on a map.",
};

export default async function PostcardsPage() {
  const postcards = await getPostcards();
  return (
    <div className={styles.page}>
      <header className={styles.intro}>
        <p className={styles.kicker}>Postal archive · 46 cards</p>
        <h1 className={styles.title}>Postcards</h1>
        <p className={styles.lede}>
          Most of these I sent to myself, from places I wanted to remember being.
          The handwriting is the point.
        </p>
      </header>
      <PostcardDeck postcards={postcards} />
    </div>
  );
}
