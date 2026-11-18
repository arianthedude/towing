export { localizedPath } from "@/lib/i18n/config";

export function getSiteUrl() {
  // Server-only SITE_URL can change at container startup without rebuilding.
  // Keep the old public variable as a fallback for existing installations.
  const site = new URL(
    process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  );
  if (
    !["http:", "https:"].includes(site.protocol) ||
    site.username || site.password || site.pathname !== "/" || site.search || site.hash
  ) {
    throw new Error("SITE_URL must be an absolute HTTP(S) origin without credentials, a path, query or fragment.");
  }
  return site.origin;
}
