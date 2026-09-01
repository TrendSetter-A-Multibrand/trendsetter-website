import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ALL, StoryblokError, storyblokFetch, storyTag } from "@/lib/storyblok/client";

const answer = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status });

describe("storyblokFetch", () => {
  const env = { ...process.env };

  beforeEach(() => {
    process.env.STORYBLOK_TOKEN = "секрет";
    process.env.STORYBLOK_REGION = "eu";
    vi.useFakeTimers();
  });

  afterEach(() => {
    process.env = { ...env };
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  /** Читается в момент запроса, а не при импорте - иначе сервер падал бы на старте */
  it("без токена говорит, чего не хватает", async () => {
    delete process.env.STORYBLOK_TOKEN;
    await expect(storyblokFetch("stories")).rejects.toThrow("STORYBLOK_TOKEN");
  });

  it("на незнакомом регионе называет его", async () => {
    process.env.STORYBLOK_REGION = "mars";
    await expect(storyblokFetch("stories")).rejects.toThrow("mars");
  });

  it("просит опубликованное и вешает оба тега", async () => {
    const fetcher = vi.fn().mockResolvedValue(answer({ ok: true }));
    vi.stubGlobal("fetch", fetcher);

    await storyblokFetch("stories/home", { tags: [storyTag("home")] });

    const [url, options] = fetcher.mock.calls[0];
    expect(String(url)).toContain("https://api.storyblok.com/v2/cdn/stories/home");
    expect(String(url)).toContain("version=published");
    expect(options.cache).toBe("force-cache");
    expect(options.next.tags).toEqual([ALL, "storyblok:home"]);
  });

  it("черновик не кеширует вовсе", async () => {
    const fetcher = vi.fn().mockResolvedValue(answer({ ok: true }));
    vi.stubGlobal("fetch", fetcher);

    await storyblokFetch("stories/home", { draft: true });

    const [url, options] = fetcher.mock.calls[0];
    expect(String(url)).toContain("version=draft");
    expect(options.cache).toBe("no-store");
    expect(options.next).toBeUndefined();
  });

  /**
   * Из-за этого падала сборка: 26 воркеров разом упираются в лимит Storyblok,
   * и один отказ ронял весь деплой.
   */
  it("пережидает отказ за частые запросы и спрашивает снова", async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(answer({ error: "rate limit" }, 429))
      .mockResolvedValueOnce(answer({ story: { id: 1 } }));
    vi.stubGlobal("fetch", fetcher);

    const pending = storyblokFetch<{ story: { id: number } }>("stories/home");
    await vi.advanceTimersByTimeAsync(1000);

    expect(await pending).toEqual({ story: { id: 1 } });
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it("сдаётся после трёх попыток, а не бесконечно", async () => {
    const fetcher = vi.fn().mockResolvedValue(answer({ error: "rate" }, 429));
    vi.stubGlobal("fetch", fetcher);

    const pending = storyblokFetch("stories/home");
    const caught = expect(pending).rejects.toBeInstanceOf(StoryblokError);
    await vi.advanceTimersByTimeAsync(5000);
    await caught;

    expect(fetcher).toHaveBeenCalledTimes(3);
  });

  it("на 404 отдаёт ошибку с кодом, чтобы её можно было отличить", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(answer({}, 404)));

    await expect(storyblokFetch("stories/nope")).rejects.toMatchObject({
      status: 404,
    });
  });
});
