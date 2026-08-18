/**
 * Copy for the О нас page. Everything past the opening paragraph is the
 * placeholder text the mockup itself carries - the client's own wording, the
 * team and the photos are still to come.
 */

export const ABOUT_INTRO =
  "TRENDSETTER — международный fashion-стартап, развивающий мультибрендовый магазин одежды, обуви и аксессуаров. В нашем ассортименте представлены популярные мировые бренды, в том числе H&M, Reserved, Sinsay, House и другие.";

/** The mockup fills the left column by repeating this one sentence. */
const FILLER =
  "Неделя моды весна-лето 2026 . Чего (не) ждать от предстоящих показов нового сезона";

export const ABOUT_FEATURE = {
  title: "О TRENDSETTER",
  body: Array.from({ length: 11 }, () => FILLER).join(" "),
  image: "/images/home/journal/2.jpg",
};

export const ABOUT_MISSION =
  "Since 2023, we have been successfully selling products from global brands on Wildberries through exclusive supply channels. In 2025, we expanded offline and opened our first store in the heart of Yerevan, and in 2026 we are opening two more stores in Moscow.";

const HISTORY =
  "Since 2023, we have been successfully selling products from global brands on Wildberries through exclusive supply channels. In 2025, we expanded offline and opened our first store in the heart of Yerevan, and in 2026 we are opening two more stores in Moscow.";

const MISSION =
  "To make stylish, high-quality clothing accessible to everyone. Trendsetter is a flexible and ambitious brand, currently building a strong team and actively expanding across the region. We believe fashion should be simple, accessible, and inspiring — every single day.";

export const ABOUT_CARDS = [
  { title: "Наши преимущества", body: HISTORY, image: "/images/home/news/2.jpg" },
  { title: "Наши преимущества", body: MISSION, image: "/images/home/news/3.jpg" },
  { title: "Наши преимущества", body: MISSION, image: "/images/home/news/4.jpg" },
];

export const ABOUT_BANNER = { title: "Наша миссия", body: HISTORY };

export type TeamMember = { name: string; role: string };

export const TEAM: TeamMember[] = Array.from({ length: 12 }, () => ({
  name: "Иван Иванов",
  role: "Руководитель отдела приколов",
}));

export const SPACE_INTRO =
  "TRENDSETTER — международный fashion-стартап, развивающий мультибрендовый магазин одежды, обуви и аксессуаров. В нашем ассортименте представлены популярные мировые бренды, в том числе H&M, Reserved, Sinsay, House и другие.";

/** Three of the same name in the file - real ones to come from the client. */
export const SPACE_CARDS = [
  { title: "Гончарная мастерская", image: "/images/home/journal/1.jpg" },
  { title: "Гончарная мастерская", image: "/images/home/journal/2.jpg" },
  { title: "Гончарная мастерская", image: "/images/home/news/1.jpg" },
];

/** Вакансии is still a draft in the file - every heading on it reads «Наша миссия». */
export const CAREERS_INTRO = { title: "Наша миссия", body: MISSION };
export const CAREERS_CARDS = ABOUT_CARDS;

/** Six of the same name in the file; the client's own are to come. */
export const COLLABORATIONS = Array.from({ length: 6 }, (_, i) => ({
  slug: `collaboration-${i + 1}`,
  title: "TRENDSETTER x Collaboration",
  image: ["/images/home/journal/1.jpg", "/images/home/journal/2.jpg", "/images/home/news/1.jpg"][i % 3],
}));
