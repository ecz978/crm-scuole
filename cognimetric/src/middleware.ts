import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, isLocale, locales, matchLocale } from "@/lib/i18n/config";

const LOCALE_COOKIE = "cm_locale";

function getLocaleFromPath(pathname: string) {
  const seg = pathname.split("/")[1];
  return isLocale(seg) ? seg : null;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const pathLocale = getLocaleFromPath(pathname);
  if (pathLocale) {
    const res = NextResponse.next();
    res.cookies.set(LOCALE_COOKIE, pathLocale, { maxAge: 60 * 60 * 24 * 365 });
    return res;
  }

  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale =
    cookieLocale && isLocale(cookieLocale)
      ? cookieLocale
      : matchLocale(request.headers.get("accept-language"));

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};

export { locales };
