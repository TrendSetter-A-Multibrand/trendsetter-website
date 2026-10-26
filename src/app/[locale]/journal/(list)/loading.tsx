import { ListSkeleton } from "@/components/blocks/ListSkeleton";
import { defaultLocale } from "@/lib/i18n/locales";

// A loading file gets no params, so the crumbs lead to the default market; the
// page replaces this within the same breath for everyone else
export default function JournalLoading() {
  return <ListSkeleton section="journal" locale={defaultLocale} />;
}
