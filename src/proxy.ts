import { NextResponse, type NextRequest } from "next/server";
import { LOCALE_COOKIE } from "@/lib/i18n/config";

const PUBLIC_FILE = /\.[^/]+$/;

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split("/");
  const maybeLocale = segments[1];

  // Explicit /fa/... → rewrite to unprefixed Persian URLs (canonical is unprefixed)
  if (maybeLocale === "fa") {
    const rest = "/" + segments.slice(2).join("/");
    const url = request.nextUrl.clone();
    url.pathname = rest === "/" ? "/" : rest.replace(/\/$/, "") || "/";
    const response = NextResponse.redirect(url, 308);
    response.cookies.set(LOCALE_COOKIE, "fa", {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
    return response;
  }

  if (maybeLocale === "en") {
    const response = NextResponse.next();
    response.cookies.set(LOCALE_COOKIE, "en", {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
    // Rewrite /en and /en/... to /en/... internally (already correct path under [locale])
    return response;
  }

  // Unprefixed paths → Persian (rewrite to /fa/...)
  // The URL owns the language, so canonical Persian URLs stay stable even
  // after visiting English pages. Cookies must not change indexed content.
  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? "/fa" : `/fa${pathname}`;
  const response = NextResponse.rewrite(url);
  response.cookies.set(LOCALE_COOKIE, "fa", {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\..*).*)"],
};
