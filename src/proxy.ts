import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, hideDefaultLocale, locales, publicPath } from "@/lib/i18n/locales";

/**
 * Every page lives under its locale inside the app (`/ru_ru/brands`). While the
 * default market's prefix is hidden, a visitor never sees it: `/brands` is served
 * from `/ru_ru/brands` without a redirect, and an old `/ru_ru/brands` address is
 * sent to `/brands`. With the prefix shown again, a bare address is sent to the
 * default locale as before.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (hasLocale) {
    const shown = publicPath(pathname);
    if (shown === pathname) return NextResponse.next();
    const url = request.nextUrl.clone();
    url.pathname = shown;
    return NextResponse.redirect(url, 308);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return hideDefaultLocale ? NextResponse.rewrite(url) : NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
