import { describe, expect, it } from "vitest";
import { guestConfirmation, mapLink, type GuestMail } from "@/lib/eventMail";

const base: GuestMail = {
  title: "Мастер-класс",
  when: "12 ноября, 15:00",
  place: "ТРЦ «Мозаика»",
  address: "Москва, ул. Тестовая, 1",
  mapUrl: "https://yandex.ru/maps/?text=x",
  guestName: "Иван Петров",
  cancelUrl: "https://example.ru/events/cancel?t=abc",
  signature: "Команда TRENDSETTER",
};

describe("mapLink", () => {
  it("pins the coordinates when the store has them", () => {
    expect(mapLink({ lat: 55.8, lon: 37.6 })).toBe(
      "https://yandex.ru/maps/?pt=37.6,55.8,pm2rdm&z=17&l=map",
    );
  });
  it("falls back to a search by address, then to nothing", () => {
    expect(mapLink({ address: "ул. Ленина, 1" })).toBe(
      `https://yandex.ru/maps/?text=${encodeURIComponent("ул. Ленина, 1")}`,
    );
    expect(mapLink({})).toBe("");
    expect(mapLink(null)).toBe("");
  });
});

describe("guestConfirmation", () => {
  it("names the event, the time, the place, the map and the cancel link", () => {
    const { subject, text, html } = guestConfirmation(base);
    expect(subject).toContain("Мастер-класс");
    for (const part of ["12 ноября, 15:00", "ТРЦ «Мозаика», Москва, ул. Тестовая, 1", base.mapUrl, base.cancelUrl, "Команда TRENDSETTER", "Иван Петров"]) {
      expect(text).toContain(part);
    }
    expect(html).toContain(`href="${base.cancelUrl}"`);
    expect(html).toContain(`href="${base.mapUrl}"`);
  });

  it("leaves out what the event does not have", () => {
    const { text, html } = guestConfirmation({ ...base, when: "", address: "", place: "", mapUrl: "" });
    expect(text).not.toMatch(/Когда|Где|Карта/);
    expect(html).not.toContain("ОТКРЫТЬ НА КАРТЕ");
  });

  it("does not let a name or title inject markup", () => {
    const { html } = guestConfirmation({ ...base, title: "<b>x</b>", guestName: '"><script>1</script>' });
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("<b>x</b>");
  });
});
