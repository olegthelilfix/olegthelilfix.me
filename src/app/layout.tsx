import type { Metadata } from "next";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "@fontsource/newsreader/300.css";
import "@fontsource/newsreader/300-italic.css";
import "@fontsource/newsreader/400.css";
import "@fontsource/newsreader/400-italic.css";
import "@fontsource/newsreader/500.css";
import "@fontsource/newsreader/500-italic.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/400-italic.css";
import "@fontsource/ibm-plex-mono/500.css";
import "@fontsource/ibm-plex-mono/500-italic.css";
import "@fontsource/ibm-plex-mono/600.css";
import "@fontsource/ibm-plex-mono/600-italic.css";
import "@fontsource/caveat/400.css";
import "@fontsource/caveat/600.css";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "Oleg Aleksandrov — personal archive",
  title: {
    default: "Oleg Aleksandrov — personal archive",
    template: "%s · Oleg Aleksandrov",
  },
  description:
    "The personal archive of Oleg Aleksandrov — engineering manager, backend developer, mentor, writer, and collector of records and postcards.",
  authors: [{ name: "Oleg Aleksandrov", url: SITE_URL }],
  creator: "Oleg Aleksandrov",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Oleg Aleksandrov — personal archive",
    title: "Oleg Aleksandrov — personal archive",
    description:
      "A digital museum, archive and cabinet of curiosities by Oleg Aleksandrov.",
  },
  twitter: {
    card: "summary",
    title: "Oleg Aleksandrov — personal archive",
    description:
      "A digital museum, archive and cabinet of curiosities by Oleg Aleksandrov.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      {/* suppressHydrationWarning: browser extensions (Grammarly, etc.) inject
          attributes onto <body> before hydration; ignore those diffs. */}
      <body suppressHydrationWarning>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
