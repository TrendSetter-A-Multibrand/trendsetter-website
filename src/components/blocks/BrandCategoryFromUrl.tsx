"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { categoriesFromParam } from "@/lib/brands";

/**
 * Reads `?category=` once the page is in the browser and hands it to the filter,
 * so a tile on the home page lands on the brands of its own category. It draws
 * nothing, and it sits apart from the directory so that the directory itself is
 * still prerendered with every brand in the page.
 */
export function BrandCategoryFromUrl({
  known,
  onChoose,
}: {
  known: string[];
  onChoose: (categories: string[]) => void;
}) {
  const params = useSearchParams();

  useEffect(() => {
    const wanted = categoriesFromParam(params.getAll("category"), known);
    if (wanted.length > 0) onChoose(wanted);
  }, [params, known, onChoose]);

  return null;
}
