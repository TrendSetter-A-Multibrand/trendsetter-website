import { SkeletonCard } from "@/components/ui/SkeletonCard";

/**
 * The file's "Поиск — загрузка": the head's own H1 and four Skeleton cards where
 * the results will be. The cards wait 300 ms before they show.
 */
export default function SearchLoading() {
  return (
    <section className="px-4 pb-10 pt-6 md:px-10 md:pt-12">
      <h1 className="type-h1 text-ink">Поиск</h1>
      <div className="mt-8 grid gap-x-6 md:mt-12 md:grid-cols-2 md:gap-y-10 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </section>
  );
}
