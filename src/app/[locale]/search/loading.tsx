"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SearchHead } from "@/components/blocks/SearchHead";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import { useSiteSettings } from "@/components/layout/SettingsContext";
import { useLocale } from "@/lib/i18n/useLocale";

type Copy = ReturnType<typeof useSiteSettings>["search"];

/** The head with the query off the address; the build prerenders this file, so it sits under Suspense. */
function HeadFromAddress({ locale, copy }: { locale: string; copy: Copy }) {
  const params = useSearchParams();
  return (
    <SearchHead
      locale={locale}
      query={(params.get("q") ?? "").trim()}
      type={params.get("type") ?? "all"}
      copy={copy}
    />
  );
}

/**
 * The file's "Поиск — загрузка": the head stays - the field with the query in
 * it, the H1 and the chips - and four Skeleton cards stand where the results
 * will be. The cards wait 300 ms before they show. It is a client file only to
 * read the query off the address, which a loading file is not handed.
 */
export default function SearchLoading() {
  const locale = useLocale();
  const { search } = useSiteSettings();

  return (
    <>
      <Suspense fallback={<SearchHead locale={locale} query="" type="all" copy={search} />}>
        <HeadFromAddress locale={locale} copy={search} />
      </Suspense>
      <div className="grid gap-x-6 px-4 pb-10 md:grid-cols-2 md:gap-y-10 md:px-10 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </>
  );
}
