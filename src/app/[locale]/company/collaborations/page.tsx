import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/locales";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { PageCover } from "@/components/blocks/PageCover";
import { SpaceCards } from "@/components/blocks/SpaceCards";
import { ContactForm } from "@/components/blocks/ContactForm";
import { COLLABORATIONS, SPACE_INTRO } from "@/lib/company";

/** Пространство's twin: the same opening and the same cards, six of them. */
export default async function CollaborationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <>
      <div className="py-5">
        <Breadcrumbs
          items={[
            { label: "Главная", href: `/${locale}` },
            { label: "Коллаборации" },
          ]}
        />
      </div>

      <PageCover
        title="Коллаборации"
        subtitle="Для всей семьи"
        imageSrc="/images/covers/articles.jpg"
        flush={false}
      />

      <p className="px-6 pt-10 text-center font-mono text-base lg:px-10 lg:text-2xl/[31.2px]">
        {SPACE_INTRO}
      </p>

      <SpaceCards
        cards={COLLABORATIONS.map((item) => ({
          ...item,
          href: `/${locale}/company/collaborations/${item.slug}`,
        }))}
      />

      <ContactForm locale={locale} />
    </>
  );
}
