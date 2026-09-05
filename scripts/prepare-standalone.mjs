import { cp, mkdir } from "node:fs/promises";

const standaloneRoot = ".next/standalone";

await mkdir(`${standaloneRoot}/.next`, { recursive: true });
await cp("public", `${standaloneRoot}/public`, { recursive: true, force: true });
await cp(".next/static", `${standaloneRoot}/.next/static`, {
  recursive: true,
  force: true,
});

console.log("Prepared .next/standalone with public and static assets.");
