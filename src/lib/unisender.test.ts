import { describe, expect, it, vi } from "vitest";
import { NewsletterFailed, NewsletterNotConfigured, subscribe, unsubscribe } from "@/lib/unisender";

const env = { UNISENDER_API_KEY: "secret", UNISENDER_LIST_ID: "2" };

function answer(body: unknown, status = 200) {
  return vi.fn(async () => new Response(JSON.stringify(body), { status }));
}

describe("subscribe", () => {
  it("кладёт адрес в список с подтверждением и пометкой дня согласия", async () => {
    const doFetch = answer({ result: { person_id: 1 } });
    await subscribe("anna@example.ru", { env, doFetch, today: new Date("2026-11-12T10:00:00Z") });
    const [url, init] = doFetch.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://api.unisender.com/ru/api/subscribe?format=json");
    const sent = new URLSearchParams(String(init.body));
    expect(sent.get("api_key")).toBe("secret");
    expect(sent.get("list_ids")).toBe("2");
    expect(sent.get("fields[email]")).toBe("anna@example.ru");
    expect(sent.get("double_optin")).toBe("0");
    expect(sent.get("tags")).toBe("сайт,согласие 2026-11-12");
  });

  it("без письма-подтверждения, если так задано", async () => {
    const doFetch = answer({ result: { person_id: 1 } });
    await subscribe("anna@example.ru", { env: { ...env, UNISENDER_DOUBLE_OPTIN: "3" }, doFetch });
    const [, init] = doFetch.mock.calls[0] as unknown as [string, RequestInit];
    expect(new URLSearchParams(String(init.body)).get("double_optin")).toBe("3");
  });

  it("отказ сервиса — ошибка", async () => {
    await expect(subscribe("a@b.ru", { env, doFetch: answer({ error: "bad", code: "x" }) })).rejects.toBeInstanceOf(
      NewsletterFailed,
    );
  });

  it("без ключа или списка — «не настроено»", async () => {
    await expect(subscribe("a@b.ru", { env: {}, doFetch: answer({}) })).rejects.toBeInstanceOf(NewsletterNotConfigured);
  });
});

describe("unsubscribe", () => {
  it("отписывает адрес от списка сайта", async () => {
    const doFetch = answer({ result: {} });
    await unsubscribe("anna@example.ru", { env, doFetch });
    const [url, init] = doFetch.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toContain("/unsubscribe");
    const sent = new URLSearchParams(String(init.body));
    expect([sent.get("contact"), sent.get("contact_type"), sent.get("list_ids")]).toEqual(["anna@example.ru", "email", "2"]);
  });

  it("адрес, которого нет в списке, не считается ошибкой", async () => {
    const doFetch = answer({ error: 'Contact "x@y.ru" not found', code: "unspecified" });
    await expect(unsubscribe("x@y.ru", { env, doFetch })).resolves.toBeUndefined();
  });

  it("ответ «Invalid contact» для адреса вне списка тоже не ошибка", async () => {
    const doFetch = answer({ error: "Error ID:1. [Invalid contact]", code: "invalid_arg" });
    await expect(unsubscribe("x@y.ru", { env, doFetch })).resolves.toBeUndefined();
  });

  it("другая ошибка остаётся ошибкой", async () => {
    await expect(unsubscribe("x@y.ru", { env, doFetch: answer({ error: "boom" }, 500) })).rejects.toBeInstanceOf(
      NewsletterFailed,
    );
  });
});
