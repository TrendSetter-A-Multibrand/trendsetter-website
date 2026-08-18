import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/locales";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { PageCover } from "@/components/blocks/PageCover";
import { TextWithPhoto } from "@/components/blocks/TextWithPhoto";
import { MissionBand } from "@/components/blocks/MissionBand";
import { PhotoCards } from "@/components/blocks/PhotoCards";
import { TeamGrid } from "@/components/blocks/TeamGrid";
import { ContactForm } from "@/components/blocks/ContactForm";
import {
  ABOUT_CARDS,
  ABOUT_FEATURE,
  ABOUT_MISSION,
  TEAM,
} from "@/lib/company";

export default async function AboutPage({
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
          items={[{ label: "Главная", href: `/${locale}` }, { label: "О нас" }]}
        />
      </div>

      <PageCover
        title="О нас"
        subtitle="История, наша миссия и цели"
        imageSrc="/images/covers/articles.jpg"
        flush={false}
      />

      <TextWithPhoto {...ABOUT_FEATURE} />
      <MissionBand body={ABOUT_MISSION} />
      <PhotoCards cards={ABOUT_CARDS} />

      <TeamGrid members={TEAM} />

      <div className="pt-10">
        <ContactForm locale={locale} />
      </div>
    </>
  );
}
