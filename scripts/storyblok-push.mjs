/**
 * Sends the block schemas in storyblok/components.json to the space.
 *
 * The file is the source of truth, not the space: a block renamed or a field
 * added here is pushed, and a space built from scratch - the corporate account,
 * when it exists - is one run away from being the same as this one.
 *
 * Blocks are matched by name. Anything in the space that is not in the file is
 * left alone: deleting someone's block because it is missing here would take
 * their content with it.
 *
 * node --env-file=.env.local scripts/storyblok-push.mjs
 */
import { readFile } from "node:fs/promises";

const HOSTS = {
  eu: "mapi.storyblok.com",
  us: "api-us.storyblok.com",
  ap: "api-ap.storyblok.com",
  ca: "api-ca.storyblok.com",
};

const space = process.env.STORYBLOK_SPACE_ID;
const token = process.env.STORYBLOK_PERSONAL_TOKEN;
const host = HOSTS[process.env.STORYBLOK_REGION ?? "eu"];

if (!space || !token) {
  console.error("Нужны STORYBLOK_SPACE_ID и STORYBLOK_PERSONAL_TOKEN");
  process.exit(1);
}

const api = async (path, init = {}) => {
  const response = await fetch(`https://${host}/v1/spaces/${space}${path}`, {
    ...init,
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
      ...init.headers,
    },
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`${init.method ?? "GET"} ${path} -> ${response.status}\n${text.slice(0, 400)}`);
  }
  return text ? JSON.parse(text) : null;
};

const wanted = JSON.parse(await readFile("storyblok/components.json", "utf8"));
const { components: existing } = await api("/components");
const byName = new Map(existing.map((c) => [c.name, c]));

for (const component of wanted) {
  const already = byName.get(component.name);
  if (already) {
    await api(`/components/${already.id}`, {
      method: "PUT",
      body: JSON.stringify({ component: { ...component, id: already.id } }),
    });
    console.log(`обновлён  ${component.name}`);
  } else {
    await api("/components", {
      method: "POST",
      body: JSON.stringify({ component }),
    });
    console.log(`создан    ${component.name}`);
  }
}

const untouched = existing
  .filter((c) => !wanted.some((w) => w.name === c.name))
  .map((c) => c.name);
if (untouched.length) console.log(`\nв пространстве есть ещё, не тронуты: ${untouched.join(", ")}`);
