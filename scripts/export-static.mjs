// Build from an isolated copy: GitHub Pages has no API server, and Next.js
// cannot export our dynamic API routes. Never rename or remove live sources.
import { spawn } from "node:child_process";
import { cp, mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const webRoot = join(repositoryRoot, "apps", "web");
const stagingParent = join(repositoryRoot, ".next-export");
const exportRoot = join(webRoot, "out");
const env = {
  ...process.env,
  STATIC_EXPORT: "true",
  NEXT_TELEMETRY_DISABLED: "1",
};

function runNode(args) {
  return new Promise((resolveRun, reject) => {
    const child = spawn(process.execPath, args, {
      cwd: repositoryRoot,
      env,
      stdio: "inherit",
    });
    child.once("error", reject);
    child.once("exit", (code, signal) => {
      if (code === 0) resolveRun();
      else reject(new Error(`Static export step failed (${signal ?? `exit ${code}`}): ${args[0]}`));
    });
  });
}

await runNode([join(repositoryRoot, "scripts", "copy-occt-wasm.mjs")]);
await mkdir(stagingParent, { recursive: true });
const stage = await mkdtemp(join(stagingParent, "source-"));

try {
  const apiDirectory = resolve(webRoot, "src", "app", "api");
  await cp(join(webRoot, "src"), join(stage, "src"), {
    recursive: true,
    filter: (source) => resolve(source) !== apiDirectory,
  });
  await Promise.all(
    ["public", "next.config.ts", "postcss.config.mjs", "tsconfig.json", "next-env.d.ts"].map((name) =>
      cp(join(webRoot, name), join(stage, name), { recursive: true }),
    ),
  );

  await runNode([join(repositoryRoot, "node_modules", "next", "dist", "bin", "next"), "build", stage]);
  const stagedExport = join(stage, "out");
  await writeFile(join(stagedExport, ".nojekyll"), "");
  await runNode([join(repositoryRoot, "scripts", "verify-static-worker-assets.mjs"), stagedExport]);

  // Replace the previous artifact only after the new build has passed checks.
  await rm(exportRoot, { recursive: true, force: true });
  await cp(stagedExport, exportRoot, { recursive: true });
  console.log(`[export-static] Ready to publish: ${exportRoot}`);
} finally {
  await rm(stage, { recursive: true, force: true });
}
