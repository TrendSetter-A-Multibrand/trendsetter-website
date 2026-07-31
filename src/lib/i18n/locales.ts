export const locales = ["ru_ru", "ru_am"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ru_ru";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
