// Single source of truth for navigation and the "wander" button.
// Keeping this in one place means the nav, the footer, and the random-route
// wander can never drift out of sync or point at a 404.

export type NavLink = {
  href: string;
  label: string;
  /** Shown in the primary top nav. */
  primary?: boolean;
  /** Rendered in the accent colour (e.g. Remember). */
  accent?: boolean;
};

export const navLinks: NavLink[] = [
  { href: "/cv", label: "CV", primary: true },
  { href: "/journey", label: "Journey", primary: true },
  { href: "/projects", label: "Projects", primary: true },
  { href: "/articles", label: "Articles", primary: true },
  { href: "/collections", label: "Collections", primary: true },
  { href: "/photos", label: "Photos", primary: true },
  { href: "/hobbies", label: "Hobbies", primary: true },
  { href: "/now", label: "Now", primary: true },
  { href: "/remember", label: "Remember", primary: true, accent: true },
];

// Every reachable route — the wander button picks from here so it can also
// land on the deeper collection pages, and never on the current page.
export const wanderRoutes: string[] = [
  "/",
  "/cv",
  "/journey",
  "/remember",
  "/articles",
  "/projects",
  "/collections",
  "/collections/vinyl",
  "/collections/postcards",
  "/photos",
  "/hobbies",
  "/now",
];
