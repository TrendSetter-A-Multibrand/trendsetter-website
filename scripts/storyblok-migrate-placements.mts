/**
 * Moves the events that articles point at onto the articles themselves.
 *
 * Until now an article carried a pointer at an event story (the `event` field).
 * Now the article is the event: it carries a «Ближайшие события» placement
 * (placement_event) and sits in Новости. For every article with the old pointer
 * this builds that placement from the event's story - date, place, title, text,
 * button, photo - and sets the article's section to news.
 *
 * Only the two fields it changes are touched; the rest of the article's content
 * goes back exactly as it came. The `event` field is left filled, so the old
 * state can be read back, and the event stories stay. An article that already
 * has a placement_event is skipped, so the script can be run twice.
 *
 * Then every event story that still has no article of its own (none with its uuid
 * in `event`, none at journal/<its slug>) gets one made, like the others: the
 * model article's author, date, tags and block layout, with the event's own
 * title, photo and description, a placement_event (20 seats) and `event` pointing
 * back at the story. Without it the card on the home page opened a 404. These are
 * published at once. An article that already exists is never touched.
 *
 * An article is published only if it had nothing waiting to be published; one
 * with an unpublished draft gets the change in its draft only, and is listed at
 * the end so an editor can look at it before publishing.
 *
 * Does nothing to the space unless asked:
 *
 * npm run storyblok:migrate-placements             (dry run: only says what it would do)
 * npm run storyblok:migrate-placements -- --apply
 */
import { api, block } from "./mapi.mjs";

const APPLY = process.argv.includes("--apply");

type Story = {
  id: number;
  uuid: string;
  parent_id: number;
  name: string;
  slug: string;
  full_slug: string;
  published: boolean;
  unpublished_changes: boolean;
  content: Record<string, unknown> & { placements?: { component: string }[] };
};

/** Every story of a kind, with its content: the list leaves content out. */
async function stories(contentType: string): Promise<Story[]> {
  const all: Story[] = [];
  for (let page = 1; ; page++) {
    const { stories: listed } = (await api(
      `/stories?content_type=${contentType}&per_page=100&page=${page}`
    )) as { stories: Story[] };
    for (const { id } of listed) {
      const { story } = (await api(`/stories/${id}`)) as { story: Story };
      // The list's content_type filter is not trusted: keep only the component asked for
      if (story.content?.component === contentType) all.push(story);
    }
    if (listed.length < 100) return all;
  }
}

/** The article's model: it carries the old pointer, so it has the full layout. */
const MODEL_SLUG = "styling-workshop";
const SEATS = 20;

/** Fresh ids on every block, so a copy never shares one with its original. */
const reId = (blocks: unknown[]) =>
  (blocks as Record<string, unknown>[]).map((b) => ({ ...b, _uid: crypto.randomUUID() }));

/** The model's blocks, their texts replaced by the event's own. */
function bodyFrom(model: Story["content"], event: Story["content"]) {
  const text = String(event.description || event.title || "");
  return reId((model.body as unknown[]) ?? []).map((b) => ({
    ...b,
    ...(typeof b.body === "string" ? { body: text } : {}),
    ...(typeof b.subtitle === "string" ? { subtitle: String(event.title ?? "") } : {}),
  }));
}

/** The event story's fields, in the names the placement gives them. */
function placementFrom(event: Story["content"], seats?: number) {
  const photo = event.image as { filename?: string } | undefined;
  return block("placement_event", {
    date: event.date ?? "",
    location: event.location ?? "",
    card_title: event.title ?? "",
    card_description: event.description ?? "",
    cta_label: event.cta_label || "Подробнее",
    card_image: photo?.filename ? photo : undefined,
    signup_enabled: true,
    ...(seats ? { seats } : {}),
  });
}

const events = new Map((await stories("event")).map((e) => [e.uuid, e]));
const articles = await stories("article");

console.log(APPLY ? "ЗАПИСЬ" : "dry-run: ничего не пишется (нужен --apply)");

const drafts: string[] = [];
let changed = 0;

for (const article of articles) {
  const pointer = article.content.event as string | undefined;
  if (!pointer) continue;

  const event = events.get(pointer);
  if (!event) {
    console.log(`нет события  ${article.full_slug}  (uuid ${pointer})`);
    continue;
  }
  if (article.content.placements?.some((p) => p.component === "placement_event")) {
    console.log(`уже сделано  ${article.full_slug}`);
    continue;
  }

  const placement = placementFrom(event.content);
  const publish = article.published && !article.unpublished_changes;
  if (!publish) drafts.push(article.full_slug);

  console.log(
    `${APPLY ? "обновлена" : "обновить"}  ${article.full_slug}  <- ${event.full_slug}` +
      `  ${placement.date}  ${publish ? "и опубликовать" : "только черновик"}`
  );
  changed++;
  if (!APPLY) continue;

  await api(`/stories/${article.id}`, {
    method: "PUT",
    body: JSON.stringify({
      story: {
        content: {
          ...article.content,
          section: "news",
          placements: [...(article.content.placements ?? []), placement],
        },
      },
      ...(publish ? { publish: 1 } : {}),
    }),
  });
}

console.log(`\nстатей ${APPLY ? "изменено" : "к изменению"}: ${changed}`);
if (drafts.length) {
  console.log(`не опубликованы (есть неопубликованный черновик или статья не опубликована):`);
  for (const slug of drafts) console.log(`  ${slug}`);
}

// Events that have no article yet
const taken = new Set(articles.map((a) => a.slug));
const pointed = new Set(articles.map((a) => a.content.event as string | undefined));
const model = articles.find((a) => a.slug === MODEL_SLUG);
let created = 0;
let patched = 0;

for (const event of events.values()) {
  const { content } = event;
  if (pointed.has(event.uuid)) continue;
  if (taken.has(event.slug)) {
    // An article of the same slug stands for the event: give it the placement,
    // leave the rest of its content as it is
    const existing = articles.find((a) => a.slug === event.slug)!;
    if (existing.content.placements?.some((p) => p.component === "placement_event")) {
      console.log(`уже сделано  ${existing.full_slug}`);
      continue;
    }
    const publish = existing.published && !existing.unpublished_changes;
    if (!publish) drafts.push(existing.full_slug);
    console.log(
      `${APPLY ? "обновлена" : "обновить"}  ${existing.full_slug}  <- ${event.full_slug}` +
        `  ${content.date ?? ""}  ${publish ? "и опубликовать" : "только черновик"}`
    );
    patched++;
    if (!APPLY) continue;
    await api(`/stories/${existing.id}`, {
      method: "PUT",
      body: JSON.stringify({
        story: {
          content: {
            ...existing.content,
            section: "news",
            event: event.uuid,
            placements: [...(existing.content.placements ?? []), placementFrom(content, SEATS)],
          },
        },
        ...(publish ? { publish: 1 } : {}),
      }),
    });
    continue;
  }
  if (!model) {
    console.log(`нет образцовой статьи ${MODEL_SLUG} - ${event.full_slug} пропущена`);
    continue;
  }

  console.log(
    `${APPLY ? "создана" : "создать"}  journal/${event.slug}  <- ${event.full_slug}` +
      `  ${content.date ?? ""}  и опубликовать`
  );
  created++;
  if (!APPLY) continue;

  const photo = content.image as { filename?: string } | undefined;
  await api("/stories", {
    method: "POST",
    body: JSON.stringify({
      story: {
        name: event.name,
        slug: event.slug,
        parent_id: model.parent_id,
        content: {
          component: "article",
          section: "news",
          title: content.title ?? event.name,
          excerpt: content.description ?? "",
          hero: photo?.filename ? photo : undefined,
          tags: model.content.tags,
          author: model.content.author,
          published_at: model.content.published_at,
          reading_minutes: model.content.reading_minutes,
          event: event.uuid,
          placements: [placementFrom(content, SEATS)],
          body: bodyFrom(model.content, content),
        },
      },
      publish: 1,
    }),
  });
}

console.log(`статей ${APPLY ? "дополнено" : "к дополнению"} (уже были): ${patched}`);
console.log(`статей ${APPLY ? "создано" : "к созданию"} для событий: ${created}`);
if (drafts.length > 0 && patched > 0) console.log("черновики выше: " + drafts.join(", "));
