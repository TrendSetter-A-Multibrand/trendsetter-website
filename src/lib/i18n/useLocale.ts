"use client";

import { useParams } from "next/navigation";
import { defaultLocale, isLocale, type Locale } from "./locales";

/**
 * The locale out of the address. For components that sit on pages which cannot
 * hand it down - the news row is on the 404 page, where Next gives no params -
 * everything else takes it as a prop and stays on the server.
 */
export function useLocale(): Locale {
  const value = useParams().locale;
  return typeof value === "string" && isLocale(value) ? value : defaultLocale;
}
