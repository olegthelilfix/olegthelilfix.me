import Link from "next/link";
import { navLinks } from "@/lib/routes";
import { WanderButton } from "./WanderButton";
import styles from "./SiteHeader.module.css";

/** Persistent global chrome: always-present nav, an obvious way home, wander. */
export function SiteHeader() {
  return (
    <header className={styles.bar} data-noprint="1">
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <span className={styles.mark}>※</span> Oleg Aleksandrov
        </Link>
        <nav className={styles.nav} aria-label="Primary">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={link.accent ? styles.linkAccent : styles.link}
            >
              {link.label}
            </Link>
          ))}
          <a className={styles.link} href="mailto:hello@olegthelilfix.me">
            Contact
          </a>
        </nav>
        <WanderButton />
      </div>
    </header>
  );
}
