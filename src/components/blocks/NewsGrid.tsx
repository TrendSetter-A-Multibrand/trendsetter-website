type NewsItem = {
  tags: string[];
  title: string;
  href?: string;
  image?: string;
};

type NewsGridProps = {
  heading?: string;
  items?: NewsItem[];
};

const DEFAULT_ITEMS: NewsItem[] = [
  {
    tags: ["Впечатления", "Дом"],
    title:
      "Не только Dolce&Gabbana: home-коллекции модных брендов, о которых мы могли не знать",
  },
  {
    tags: ["Красота", "Косметика"],
    title: "Что положить в косметичку: 8 уходовых средств на все случаи жизни",
  },
  {
    tags: ["Мода", "Тренды"],
    title:
      "Неделя моды весна-лето 2026. Чего (не) ждать от предстоящих показов нового сезона",
  },
  {
    tags: ["Комьюнити", "Общество"],
    title:
      "Карабин, пленка и Тарковский: как «нишевость» и стремление быть «не как все» превратились в мем",
  },
];

export function NewsGrid({
  heading = "Последние новости",
  items = DEFAULT_ITEMS,
}: NewsGridProps) {
  return (
    <section className="px-6 py-16 lg:px-10">
      <div className="mb-8 flex items-center gap-6">
        <h2 className="whitespace-nowrap text-sm font-semibold uppercase tracking-[0.2em]">
          [{heading}]
        </h2>
        <div className="h-px flex-1 bg-black/20" />
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => (
          <a key={i} href={item.href ?? "#"} className="flex flex-col gap-3">
            <div className="aspect-[3/2] w-full overflow-hidden bg-neutral-200">
              {item.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.image} alt="" className="h-full w-full object-cover" />
              ) : null}
            </div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand">
              {item.tags.map((tag) => `[${tag}]`).join(" ")}
            </p>
            <p className="font-medium leading-snug">{item.title}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
