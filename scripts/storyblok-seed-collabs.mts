/**
 * Brings the «Коллаборации» page to the mockup (957:6551): six cards in the
 * space_cards block, each a link to its own article at
 * company/collaborations/collab-1 ... collab-6.
 *
 * The three existing cards keep their title, text and photo and only get an
 * address; three more are added with the caption «TRENDSETTER x Collaboration»
 * and the first photo found among the existing cards. The page's other blocks go
 * back exactly as they came. No stories are made for the articles: the route
 * company/collaborations/[slug] draws its own template for any slug.
 *
 * Run twice it changes nothing the second time. The page is published only if it
 * had nothing waiting to be published.
 *
 * npm run storyblok:seed-collabs             (dry run: only says what it would do)
 * npm run storyblok:seed-collabs -- --apply
 */
import { COLLAB_PATH, planCollabCards, type CollabCard } from "../src/lib/collabCards.ts";
import { api } from "./mapi.mjs";

const APPLY = process.argv.includes("--apply");

type Block = { component: string; cards?: CollabCard[]; [field: string]: unknown };
type Story = {
  id: number;
  full_slug: string;
  published: boolean;
  unpublished_changes: boolean;
  content: { component: string; body?: Block[]; [field: string]: unknown };
};

console.log(APPLY ? "ЗАПИСЬ" : "dry-run: ничего не пишется (нужен --apply)");

// The list's content_type filter is not trusted, so the story is checked by its component
const { stories } = (await api(`/stories?with_slug=${COLLAB_PATH}`)) as { stories: Story[] };
const found = stories.find((s) => s.full_slug === COLLAB_PATH);
if (!found) throw new Error(`нет страницы ${COLLAB_PATH}`);
const { story } = (await api(`/stories/${found.id}`)) as { story: Story };
if (story.content.component !== "page") throw new Error(`${COLLAB_PATH} не страница`);

const body = story.content.body ?? [];
const index = body.findIndex((b) => b.component === "space_cards");
if (index < 0) throw new Error("на странице нет блока space_cards");

const plan = planCollabCards(body[index].cards ?? [], () => crypto.randomUUID());
plan.cards.forEach((card, i) =>
  console.log(`  ${i + 1}. ${card.title}  ->  ${card.link?.url}`),
);
if (plan.noImage) console.log("ВНИМАНИЕ: ни у одной карточки нет фото - новые будут без картинки");

if (!plan.changed) {
  console.log("уже сделано");
} else if (APPLY) {
  const publish = story.published && !story.unpublished_changes;
  const next = body.map((b, i) => (i === index ? { ...b, cards: plan.cards } : b));
  await api(`/stories/${story.id}`, {
    method: "PUT",
    body: JSON.stringify({
      story: { content: { ...story.content, body: next } },
      ...(publish ? { publish: 1 } : {}),
    }),
  });
  console.log(publish ? "обновлена и опубликована" : "обновлена (только черновик)");
}
