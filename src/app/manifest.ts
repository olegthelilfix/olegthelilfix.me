import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Oleg Aleksandrov — personal archive",
    short_name: "Oleg's archive",
    description: "A digital museum, archive and cabinet of curiosities.",
    start_url: "/",
    display: "standalone",
    background_color: "#e9e5db",
    theme_color: "#17150f",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
