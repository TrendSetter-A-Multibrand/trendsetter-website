/**
 * Turns the articles that are events into events: an article with a
 * placement_event in its placements becomes a story of its own type, news_event,
 * with the event's fields in the root and no placements. Everything else of the
 * article (title, tags, cover, body, _uid ...) goes back as it was.
 *
 * An article is published only if it had nothing waiting to be published; one
 * with an unpublished draft gets the change in its draft only, and is listed at
 * the end. A story that is already news_event is never touched (only `article`
 * stories are read), so the script can be run twice.
 *
 * Does nothing to the space unless asked:
 *
 * npm run storyblok:convert-events                       (dry run: only says what it would do)
 * npm run storyblok:convert-events -- --apply
 * npm run storyblok:convert-events -- --only <slug>      (just that article)
 * npm run storyblok:convert-events -- --strip <slug>     (take placement_event / placement_space
 *                                                         out of that article and empty its old
 *                                                         event field; the type is not changed;
 *                                                         add --apply to write)
 */
import { api } from "./mapi.mjs";
import {
  buildNewsEventContent,
  hasEventPlacement,
  stripEventContent,
} from "../src/lib/storyblok/convertEvent.ts";

const args = process.argv.slice(2);
const APPLY = args.includes("--apply");
const flag = (name: string) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const ONLY = flag("--only");
const STRIP = flag("--strip");

type Story = {
  id: number;
  name: string;
  slug: string;
  full_slug: string;
  published: boolean;
  unpublished_changes: boolean;
  content: Record<string, unknown>;
};

/** Every article with its content: the list leaves content out. */
async function articles(): Promise<Story[]> {
  const all: Story[] = [];
  for (let page = 1; ; page++) {
    const { stories: listed } = (await api(
      `/stories?content_type=article&per_page=100&page=${page}`
    )) as { stories: Story[] };
    for (const { id } of listed) {
      const { story } = (await api(`/stories/${id}`)) as { story: Story };
      // The list's content_type filter is not trusted: keep only the component asked for
      if (story.content?.component === "article") all.push(story);
    }
    if (listed.length < 100) return all;
  }
}

async function save(story: Story, content: Record<string, unknown>, publish: boolean) {
  await api(`/stories/${story.id}`, {
    method: "PUT",
    body: JSON.stringify({ story: { content }, ...(publish ? { publish: 1 } : {}) }),
  });
}

const all = await articles();
console.log(APPLY ? "ЗАПИСЬ" : "dry-run: ничего не пишется (нужен --apply)");

const drafts: string[] = [];
let changed = 0;

if (STRIP) {
  const story = all.find((s) => s.slug === STRIP);
  if (!story) {
    console.log(`нет статьи ${STRIP}`);
    process.exit(1);
  }
  const publish = story.published && !story.unpublished_changes;
  if (!publish) drafts.push(story.full_slug);
  console.log(
    `${APPLY ? "очищена" : "очистить"}  ${story.full_slug}  ${publish ? "и опубликовать" : "только черновик"}`
  );
  changed++;
  if (APPLY) await save(story, stripEventContent(story.content), publish);
} else {
  for (const story of all) {
    if (ONLY && story.slug !== ONLY) continue;
    if (!hasEventPlacement(story.content)) continue;

    const content = buildNewsEventContent(story.content)!;
    if (!content.date) {
      console.log(`нет даты      ${story.full_slug}  - пропущена`);
      continue;
    }
    const publish = story.published && !story.unpublished_changes;
    if (!publish) drafts.push(story.full_slug);

    console.log(
      `${APPLY ? "превращена" : "превратить"}  ${story.full_slug}  -> news_event` +
        `  ${content.date}  ${publish ? "и опубликовать" : "только черновик"}`
    );
    changed++;
    if (APPLY) await save(story, content, publish);
  }
}

console.log(`\nстатей ${APPLY ? "изменено" : "к изменению"}: ${changed}`);
if (drafts.length) {
  console.log("не опубликованы (есть неопубликованный черновик или статья не опубликована):");
  for (const slug of drafts) console.log(`  ${slug}`);
}

// Left over from the old way: the event field is filled but there is no placement_event
const orphans = all.filter((s) => s.content.event && !hasEventPlacement(s.content));
if (orphans.length) {
  console.log("заполнено старое поле event, но нет placement_event (вручную):");
  for (const s of orphans) console.log(`  ${s.full_slug}`);
}
