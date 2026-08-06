import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const sourceRoots = ["src", "docs"];
const appRoot = path.join(root, "src", "app");
const publicRoot = path.join(root, "public");

const ignoredPrefixes = [
  "/_next",
  "/cdn-cgi",
];

function walk(dir, extensions, files = []) {
  if (!existsSync(dir)) return files;

  for (const entry of readdirSync(dir)) {
    const fullPath = path.join(dir, entry);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      walk(fullPath, extensions, files);
    } else if (extensions.includes(path.extname(entry))) {
      files.push(fullPath);
    }
  }

  return files;
}

function routeFromPage(pageFile) {
  const relative = path.relative(appRoot, pageFile).replaceAll("\\", "/");
  const route = relative.replace(/\/page\.tsx$/, "").replace(/^page\.tsx$/, "");
  return route ? `/${route}` : "/";
}

function collectAppRoutes() {
  return new Set(walk(appRoot, [".tsx"]).filter((file) => path.basename(file) === "page.tsx").map(routeFromPage));
}

function hasPublicAsset(href) {
  const cleanHref = href.split("?")[0].split("#")[0];
  return existsSync(path.join(publicRoot, cleanHref));
}

function routeExists(href, routes) {
  const cleanHref = href.split("?")[0].split("#")[0] || "/";
  if (routes.has(cleanHref)) return true;
  if (cleanHref === "/robots.txt" || cleanHref === "/sitemap.xml" || cleanHref === "/manifest.webmanifest") return true;
  if (cleanHref === "/opengraph-image" || cleanHref === "/twitter-image") return true;
  return hasPublicAsset(cleanHref);
}

function shouldCheck(href) {
  if (!href || !href.startsWith("/")) return false;
  return !ignoredPrefixes.some((prefix) => href.startsWith(prefix));
}

const hrefPatterns = [
  /href=["'`]([^"'`]+)["'`]/g,
  /href:\s*["'`]([^"'`]+)["'`]/g,
  /actionHref:\s*["'`]([^"'`]+)["'`]/g,
];

const routes = collectAppRoutes();
const files = sourceRoots.flatMap((dir) => walk(path.join(root, dir), [".ts", ".tsx", ".md", ".mdx"]));
const failures = [];

for (const file of files) {
  const source = readFileSync(file, "utf8");
  for (const pattern of hrefPatterns) {
    for (const match of source.matchAll(pattern)) {
      const href = match[1];
      if (!shouldCheck(href)) continue;
      if (!routeExists(href, routes)) {
        failures.push({
          file: path.relative(root, file),
          href,
        });
      }
    }
  }
}

if (failures.length) {
  console.error("Missing internal destinations:");
  for (const failure of failures) {
    console.error(`- ${failure.file}: ${failure.href}`);
  }
  process.exit(1);
}

console.log(`Internal link check passed (${routes.size} app routes scanned).`);
