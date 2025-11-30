import { readdirSync } from "fs";
import path from "path";

export const revalidate = 3600;

const baseUrl = process.env.SITE_URL || "http:localhost:3000";
const baseDir = "src/app/(pages)";
const excludeDirs = ["api", "fonts"];

export default function sitemap() {
  return getRoutes();
}

async function getRoutes() {
  const fullPath = path.join(process.cwd(), baseDir);
  const entries = readdirSync(fullPath, { withFileTypes: true });
  const routes = ["/"];

  entries.forEach((entry) => {
    const isValidRoute =
      entry.isDirectory() && !excludeDirs.includes(entry.name);
    if (isValidRoute) routes.push(`/${entry.name}`);
  });

  const sitemap = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));

  return sitemap;
}
