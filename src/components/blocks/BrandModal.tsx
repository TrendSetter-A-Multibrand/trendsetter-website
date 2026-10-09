"use client";

import { useEffect } from "react";
import Image from "next/image";
import type { Brand } from "@/lib/brands";
import { Divider } from "@/components/ui/Divider";
import { Marker } from "@/components/ui/Marker";
import { ModalPhoto } from "@/components/ui/ModalSheet";
import { SectionTitle } from "@/components/ui/SectionTitle";

/**
 * Test photo shown while a brand has no `image` in Storyblok - taken from the
 * home news cards. Тестовая, заменить на фото бренда из Storyblok: flip the flag
 * to false (or delete both lines) once the brands have their own.
 */
const TEST_BRAND_PHOTO = "/images/home/news/1.jpg";
const USE_TEST_BRAND_PHOTO = true;

/**
 * The library's Modal: a 1280 sheet centred over the dimmed page, 40 of air at
 * the head and the foot and 40 between its blocks. Everything inside keeps
 * 40 off the edges except the photo, which runs the full width of the sheet.
 */
export function BrandModal({
  brand,
  onClose,
}: {
  brand: Brand;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={brand.name}
      className="fixed inset-0 z-50 flex items-end justify-center pt-16 lg:items-center lg:p-4"
    >
      <button
        type="button"
        aria-label="Закрыть"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      <div className="relative flex max-h-full w-full max-w-[1280px] flex-col gap-10 overflow-y-auto bg-white py-10">
        <div className="flex items-center justify-between gap-6 px-6 lg:px-10">
          <div className="flex min-w-0 flex-1 items-center gap-6">
            {/* 160x55, and the logo keeps its own colours */}
            {brand.showLogo && brand.logo && (
              <div className="relative hidden h-[55px] w-40 shrink-0 lg:block">
                <Image
                  src={brand.logo}
                  alt=""
                  fill
                  className="object-contain object-left"
                />
              </div>
            )}

            <div className="flex min-w-0 flex-col gap-2">
              {/* Inter Tight 24 on a 29 line, not the mono it reads as */}
              <p className="text-2xl/[29px] font-medium uppercase tracking-[1px]">
                {brand.name}
              </p>
              <p className="flex flex-wrap gap-2 font-mono text-xs/[16px] font-medium uppercase tracking-[1px] text-brand">
                {brand.categories.map((category) => (
                  <span key={category}>[{category}]</span>
                ))}
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Закрыть"
            onClick={onClose}
            className="shrink-0 transition-colors hover:text-brand"
          >
            {/* 18 of ink in a 24 box, the same cross the cookie plate wears */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="m3 3 18 18M21 3 3 21" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-6">
          {/* The full 1280 across - the one block that ignores the sheet's own
              margins */}
          <ModalPhoto
            fixed
            src={brand.image || (USE_TEST_BRAND_PHOTO ? TEST_BRAND_PHOTO : undefined)}
          />

          <p className="px-6 text-base/5 lg:px-10">{brand.description}</p>

          <div className="px-6 lg:px-10">
            <Divider />
          </div>
        </div>

        <section className="flex flex-col gap-6">
          <SectionTitle heading="Наличие в магазинах" className="px-6 lg:px-10" />

          {/* 16 apart, the marker 16 off the name. The names are written in the
              brand's own colour, not the ink the rest of the sheet is set in. */}
          <ul className="flex flex-col gap-4 px-6 lg:px-10">
            {brand.stores.map((store) => (
              <li
                key={store.name}
                style={brand.color ? { color: brand.color } : undefined}
                className="flex items-center gap-4 text-sm/[19px] uppercase tracking-[1px]"
              >
                <Marker tone={store.available ? "green" : "red"} />
                {store.name}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
