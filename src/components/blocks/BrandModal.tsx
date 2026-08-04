"use client";

import { useEffect } from "react";
import Image from "next/image";
import type { Brand } from "@/lib/brands";

/** 1214x819 sheet centred over a dimmed page, 40 of padding all round. */
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <button
        type="button"
        aria-label="Закрыть"
        onClick={onClose}
        className="absolute inset-0 bg-ink/40"
      />

      {/* 819 is what the mockup draws; min rather than fixed so a longer write-up
          grows the sheet instead of scrolling inside a page-height box */}
      <div className="relative flex max-h-full w-full max-w-[1214px] flex-col overflow-y-auto bg-white p-6 lg:min-h-[819px] lg:p-10">
        <div className="flex items-start gap-6 lg:gap-[27px]">
          <div className="relative hidden h-14 w-[180px] shrink-0 text-[#253746] lg:block">
            <Image src={brand.logo} alt="" fill className="object-contain object-left" />
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-2 lg:gap-[16px]">
            <p className="font-mono text-lg uppercase lg:text-2xl/none">
              [{brand.name}]
            </p>
            <p className="font-mono text-xs uppercase lg:text-sm/none">
              {brand.categories.map((c) => `[${c}]`).join(" ")}
            </p>
          </div>

          <button
            type="button"
            aria-label="Закрыть"
            onClick={onClose}
            className="shrink-0 p-1 transition-colors hover:text-brand"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="m1 1 16 16M17 1 1 17" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
        </div>

        <div className="relative mt-6 aspect-[1134/280] w-full shrink-0 bg-surface-strong lg:mt-[25px]">
          <Image src={brand.image} alt="" fill sizes="1134px" className="object-cover" />
        </div>

        <p className="mt-6 text-base lg:text-xl/6">{brand.description}</p>

        <hr className="mt-8 border-ink/15 lg:mt-[33px]" />

        <h2 className="mt-6 font-mono text-base uppercase lg:mt-[30px] lg:text-xl/none">
          [Наличие в магазинах]
        </h2>

        <ul className="mt-4 flex flex-col gap-[11px] lg:mt-[22px]">
          {brand.stores.map((store) => (
            <li key={store.name} className="flex items-center gap-4 lg:text-xl/6">
              <span
                aria-hidden="true"
                className={`h-[18px] w-[18px] shrink-0 rounded-full ${
                  store.available ? "bg-[#71CC98]" : "bg-brand"
                }`}
              />
              {store.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
