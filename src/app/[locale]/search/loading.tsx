"use client";

import { useSearchParams } from "next/navigation";
import { SearchHead } from "@/components/blocks/SearchHead";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import { useSiteSettings } from "@/components/layout/SettingsContext";
import { useLocale } from "@/lib/i18n/useLocale";

/**
 * The file's "Поиск — загрузка": the head stays - the field with the query in
 * it, the H1 and the chips - and four Skeleton cards stand where the results
 * will be. The cards wait 300 ms before they show. It is a client file only to
 * read the query off the address, which a loading file is not handed.
 */
export default function SearchLoading() {
  const params = useSearchParams();
  const locale = useLocale();
  const { search } = useSiteSettings();

  return (
    <>
      <SearchHead
        locale={locale}
        query={(params.get("q") ?? "").trim()}
        type={params.get("type") ?? "all"}
        copy={search}
      />
      <div className="grid gap-x-6 px-4 pb-10 md:grid-cols-2 md:gap-y-10 md:px-10 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </>
  );
}
