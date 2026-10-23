import { readdir, readFile, stat } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const exportRoot = process.argv[2] ? resolve(process.argv[2]) : join(repositoryRoot, "apps", "web", "out");
const chunksRoot = join(exportRoot, "_next", "static", "chunks");
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/+$/, "");
const publicPath = `${basePath}/_next/`;

async function listJavaScriptFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory() ? listJavaScriptFiles(path) : [path];
    }),
  );

  return files.flat().filter((path) => path.endsWith(".js"));
}

const indexHtml = await readFile(join(exportRoot, "index.html"), "utf8");
if (indexHtml.includes('="./_next/')) {
  throw new Error(
    "Static HTML uses a relative ./_next asset prefix. Worker chunks resolve that prefix " +
      "relative to their own directory and request a duplicated /_next/static/chunks path.",
  );
}
const nextAssets = [...indexHtml.matchAll(/(?:src|href)="([^\"]*\/_next\/[^\"]+)"/g)].map((match) => match[1]);
if (nextAssets.length === 0 || nextAssets.some((asset) => !asset.startsWith(publicPath))) {
  throw new Error(`Static HTML assets must use the ${publicPath} public path.`);
}

for (const name of ["index.js", "occt-wasm.js", "occt-wasm.wasm"]) {
  const asset = await stat(join(exportRoot, "occt", name));
  if (!asset.isFile() || asset.size === 0) throw new Error(`Missing or empty OCCT runtime asset: ${name}`);
}

const workerChunks = [];
for (const path of await listJavaScriptFiles(chunksRoot)) {
  const source = await readFile(path, "utf8");
  if (source.includes("importScripts(") && source.includes("static/chunks/")) {
    workerChunks.push({ path, source });
  }
}

if (workerChunks.length === 0) {
  throw new Error("Could not find the generated CAD worker runtime to verify its public path.");
}

for (const { path, source } of workerChunks) {
  if (!source.includes(`.p=${JSON.stringify(publicPath)}`) && !source.includes(`.p='${publicPath}'`)) {
    throw new Error(`Worker runtime ${path} does not use the ${publicPath} public path.`);
  }
}

console.log(`Verified static HTML, OCCT assets and ${workerChunks.length} worker runtime(s) using ${publicPath}.`);
