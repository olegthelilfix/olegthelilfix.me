"use client";

import { usePathname, useRouter } from "next/navigation";
import { wanderRoutes } from "@/lib/routes";
import styles from "./WanderButton.module.css";

/** "Take me somewhere" — jumps to a random route that isn't the current one. */
export function WanderButton() {
  const router = useRouter();
  const pathname = usePathname();

  function wander() {
    const pool = wanderRoutes.filter((r) => r !== pathname);
    const next = pool[Math.floor(Math.random() * pool.length)] ?? "/";
    router.push(next);
  }

  return (
    <button type="button" className={styles.button} onClick={wander}>
      Take me somewhere ↗
    </button>
  );
}
