"use client";

import type { Brand } from "@/lib/brands";
import { ModalPhoto, ModalSheet } from "@/components/ui/ModalSheet";
import { StockRow } from "@/components/ui/StockRow";
import { useLocale } from "@/lib/i18n/useLocale";

/**
 * Test photo shown while a brand has no `image` in Storyblok - taken from the
 * home news cards. Тестовая, заменить на фото бренда из Storyblok: flip the flag
 * to false (or delete both lines) once the brands have their own.
 */
const TEST_BRAND_PHOTO = "/images/home/news/1.jpg";
const USE_TEST_BRAND_PHOTO = true;

/**
 * The file's Brand sheet, on the Sheet: the brand's categories in Red brackets
 * over its name in H2, a 21:9 photo, the description in Body and "[Наличие в
 * магазинах]" over one Stock row for every shop, each with an arrow to the shops
 * page. 880 wide on a desktop, the whole screen on a phone.
 */
export function BrandModal({ brand, onClose }: { brand: Brand; onClose: () => void }) {
  const locale = useLocale();

  return (
    <ModalSheet title={brand.name} labels={brand.categories} onClose={onClose}>
      <ModalPhoto src={brand.image || (USE_TEST_BRAND_PHOTO ? TEST_BRAND_PHOTO : undefined)} />

      <div className="flex flex-col gap-6 px-4 md:gap-8 md:px-8">
        {brand.description && <p className="type-body">{brand.description}</p>}

        {brand.stores.length > 0 && (
          <section className="flex flex-col gap-3">
            <h3 className="type-label">[Наличие в магазинах]</h3>
            <ul>
              {brand.stores.map((store) => (
                <StockRow
                  key={store.name}
                  shop={store.name}
                  available={store.available}
                  href={`/${locale}/stores`}
                />
              ))}
            </ul>
          </section>
        )}
      </div>
    </ModalSheet>
  );
}
