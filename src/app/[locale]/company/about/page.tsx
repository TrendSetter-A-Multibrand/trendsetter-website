import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { PageCover } from "@/components/blocks/PageCover";
import { QuoteMarquee } from "@/components/ui/QuoteMarquee";
import { TextWithPhoto } from "@/components/blocks/TextWithPhoto";
import { PhotoCards } from "@/components/blocks/PhotoCards";
import { TextBanner } from "@/components/blocks/TextBanner";
import { TeamGrid } from "@/components/blocks/TeamGrid";
import { HelpCards } from "@/components/blocks/HelpCards";
import {
  ABOUT_BANNER,
  ABOUT_CARDS,
  ABOUT_FEATURE,
  ABOUT_INTRO,
  ABOUT_QUOTE,
  TEAM,
} from "@/lib/company";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="pb-10">
      <Breadcrumbs
        items={[{ label: "Главная", href: `/${locale}` }, { label: "О нас" }]}
      />

      <div className="pt-11">
        <PageCover
          title="О нас"
          imageSrc="/images/covers/articles.jpg"
          flush={false}
        />
      </div>

      {/* 1744 wide in the mockup, centred - 88 of air either side */}
      <p className="mx-auto mt-10 max-w-[1744px] px-6 text-center font-mono text-base lg:px-0 lg:text-[36px]/[47px]">
        {ABOUT_INTRO}
      </p>

      {/* 80 under the opening paragraph, 40 between every block after it */}
      <div className="mt-20">
        <TextWithPhoto {...ABOUT_FEATURE} />
      </div>

      <div className="mt-10">
        <QuoteMarquee text={ABOUT_QUOTE} />
      </div>

      <div className="mt-10">
        <PhotoCards cards={ABOUT_CARDS} />
      </div>

      <div className="mt-10">
        <TextBanner {...ABOUT_BANNER} />
      </div>

      <div className="mt-10">
        <TeamGrid members={TEAM} />
      </div>

      <div className="mt-20">
        <HelpCards />
      </div>
    </div>
  );
}
