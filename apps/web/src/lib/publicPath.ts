/** Resolve a public asset or app URL under the deployment's build-time base path. */
export function publicPath(path: string, basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ""): string {
  // Imported images may already be data/blob URLs, and external links stay external.
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(path)) return path;
  const prefix = basePath.trim().replace(/^\/+|\/+$/g, "");
  return `${prefix ? `/${prefix}` : ""}/${path.replace(/^\/+/, "")}`;
}
