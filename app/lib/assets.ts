const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Prefixes public asset paths with the Next.js basePath when deployed
 * under a repository subpath (such as GitHub Pages).
 */
export function assetPath(path: string): string {
  return `${BASE_PATH}${path}`;
}
