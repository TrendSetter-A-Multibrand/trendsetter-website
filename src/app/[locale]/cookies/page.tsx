import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

/**
 * Placeholder copy until the mockup and the client's own legal wording arrive -
 * the layout is deliberately plain, only the type scale is the site's own.
 */
const SECTIONS = [
  {
    title: "Что такое файлы cookie",
    body: "Cookie - небольшие текстовые файлы, которые сайт сохраняет в вашем браузере. Они позволяют запомнить выбранный город и магазин, не показывать это уведомление на каждой странице и понимать, какие разделы читают чаще.",
  },
  {
    title: "Какие файлы мы используем",
    body: "Обязательные - те, без которых сайт не работает: они хранят настройки языка и состояние сессии. Аналитические - помогают увидеть обезличенную статистику посещений: какие страницы открывают, сколько времени на них проводят, откуда пришли.",
  },
  {
    title: "Как отказаться",
    body: "Отключить или удалить файлы cookie можно в настройках браузера - в разделе конфиденциальности. Учтите, что без обязательных файлов часть страниц может работать некорректно.",
  },
  {
    title: "Вопросы",
    body: "Если остались вопросы о том, какие данные собирает сайт и как они хранятся, напишите нам - мы ответим и при необходимости удалим собранные данные.",
  },
];

export default async function CookiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="pb-16">
      <Breadcrumbs
        items={[
          { label: "Главная", href: `/${locale}` },
          { label: "Файлы cookie" },
        ]}
      />

      <div className="px-6 pt-11 lg:px-10">
        <h1 className="font-mono text-2xl uppercase tracking-[5px] lg:text-4xl">
          [Файлы cookie]
        </h1>

        <div className="mt-10 flex max-w-[1140px] flex-col gap-10">
          {SECTIONS.map((section) => (
            <section key={section.title}>
              <h2 className="font-mono text-base uppercase tracking-[3px] text-brand lg:text-xl">
                {section.title}
              </h2>
              <p className="mt-4 text-base lg:text-xl/8">{section.body}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
