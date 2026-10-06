/**
 * The lists the editor keeps herself: Settings → Datasources. A field in a
 * block can offer one of them as its choices, so adding a value is adding an
 * entry there - no schema, no deploy.
 *
 * It creates what is missing and never touches what is there: an entry the
 * editor renamed or removed stays as she left it.
 *
 * npm run storyblok:seed-datasources
 */
import { BRAND_CATEGORIES } from "../src/lib/brands.ts";
import { api } from "./mapi.mjs";

const SOURCES = [
  {
    slug: "brand-categories",
    name: "Категории брендов",
    entries: BRAND_CATEGORIES,
  },
];

for (const source of SOURCES) {
  const { datasources } = await api("/datasources");
  let current = datasources.find((d: { slug: string }) => d.slug === source.slug);

  if (!current) {
    ({ datasource: current } = await api("/datasources", {
      method: "POST",
      body: JSON.stringify({
        datasource: { name: source.name, slug: source.slug },
      }),
    }));
    console.log(`создан  ${source.slug}`);
  }

  const { datasource_entries: have } = await api(
    `/datasource_entries?datasource_id=${current.id}&per_page=1000`
  );

  for (const value of source.entries) {
    if (have.some((e: { value: string }) => e.value === value)) continue;
    await api("/datasource_entries", {
      method: "POST",
      body: JSON.stringify({
        datasource_entry: { name: value, value, datasource_id: current.id },
      }),
    });
    console.log(`  + ${value}`);
  }
}
