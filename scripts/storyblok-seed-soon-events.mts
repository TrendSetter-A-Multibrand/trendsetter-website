/**
 * Several coming events with sign-up open, for trying the sign-up itself: the
 * fifteen of storyblok-seed-test-rows are spread from September and only the
 * last still lies ahead, so there is one event to test on and a second try on it
 * is a repeat. These start tomorrow and run a few weeks on, some with seats,
 * some without a limit.
 *
 * Slugs are test-soon-NN, titles "Тестовая запись NN", so they are easy to spot
 * and to take out again:
 *
 * npm run storyblok:seed-soon-events
 * npm run storyblok:seed-soon-events -- --clean
 */
import { api, block, folder, putStory } from "./mapi.mjs";

const COUNT = 6;
const two = (n: number) => String(n).padStart(2, "0");
const PLACES = ['ТЦ "Атриум"', "Хлебозавод №9", "Дубровка", 'ТЦ "Мозаика"', 'ТЦ "Вегас"', 'ТЦ "Авеню"'];
const IMAGES = [1, 2, 3, 4].map((i) => `/images/home/events/${i}.jpg`);
const SEATS = ["", "20", "5", "", "30", "2"];
const LOREM = "Тестовое описание события: проверяем запись гостей и подтверждение.";

/** From tomorrow, three days apart, evenings. */
function when(n: number) {
  const day = new Date();
  day.setUTCDate(day.getUTCDate() + 1 + (n - 1) * 3);
  return `${day.toISOString().slice(0, 10)} ${two(15 + (n % 5))}:00`;
}

const body = () => [block("article_text", { subtitle: LOREM, body: LOREM })];

async function clean() {
  const { stories } = (await api("/stories?starts_with=journal/test-soon-")) as {
    stories: { id: number; slug: string; full_slug: string }[];
  };
  for (const story of stories.filter((s) => s.slug.startsWith("test-soon-"))) {
    await api(`/stories/${story.id}`, { method: "DELETE" });
    console.log(`удалена   ${story.full_slug}`);
  }
  console.log(stories.length ? `
всего удалено: ${stories.length}` : "тестовых записей нет");
}

async function seed() {
  const journal = await folder("journal", "Журнал");
  for (let n = 1; n <= COUNT; n++) {
    const slug = `test-soon-${two(n)}`;
    const title = `Тестовая запись ${two(n)}`;
    const date = when(n);
    const done = await putStory(
      slug,
      title,
      {
        component: "news_event",
        title,
        tags: ["События"],
        excerpt: LOREM,
        hero: { filename: IMAGES[(n - 1) % IMAGES.length] },
        author: "Имя Фамилия (тест)",
        published_at: "2026-11-13 12:00",
        reading_minutes: "3",
        views: "0",
        date,
        location: PLACES[(n - 1) % PLACES.length],
        card_title: title,
        cta_label: "Записаться",
        signup_enabled: true,
        ...(SEATS[n - 1] ? { seats: SEATS[n - 1] } : {}),
        body: body(),
      },
      journal,
      `journal/${slug}`
    );
    console.log(`${done}  journal/${slug}  ${date}${SEATS[n - 1] ? `  мест: ${SEATS[n - 1]}` : ""}`);
  }
}

if (process.argv.includes("--clean")) await clean();
else await seed();
