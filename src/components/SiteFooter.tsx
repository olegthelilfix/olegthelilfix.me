import Link from "next/link";
import { navLinks } from "@/lib/routes";
import styles from "./SiteFooter.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer} data-noprint="1">
      <div className={styles.inner}>
        <div className={styles.about}>
          <div className={styles.title}>
            <span className={styles.mark}>※</span> Personal archive
          </div>
          <p className={styles.blurb}>
            A digital museum, archive and cabinet of curiosities. Assembled
            slowly around one person. Not a feed — most of this is meant to stay
            worth reading years from now.
          </p>
        </div>
        <nav className={styles.links} aria-label="Footer">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={styles.link}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className={styles.meta}>
          olegthelilfix.com · est. somewhere around 2014 ·{" "}
          <a href="mailto:hello@olegthelilfix.com">hello@olegthelilfix.com</a>
        </div>
      </div>
    </footer>
  );
}
