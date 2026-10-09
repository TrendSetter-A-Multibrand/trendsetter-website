import { describe, expect, it } from "vitest";
import { eventDate, isUpcoming } from "@/lib/events";

describe("eventDate", () => {
  it("разбирает то, что Storyblok кладёт в поле даты", () => {
    expect(eventDate("2026-07-27 18:00")).toEqual({
      day: "27",
      month: "июл",
      monthFull: "июля",
      time: "18:00",
    });
  });

  it("пишет месяц в родительном падеже, как в макете", () => {
    // Intl отдал бы «июль» - это другое слово, и под днём оно читается неверно
    expect(eventDate("2026-01-01 00:00").monthFull).toBe("января");
    expect(eventDate("2026-12-31 23:59").monthFull).toBe("декабря");
  });

  /**
   * Плашка на карточке - 64 с 12 внутренних отступов, месяцу остаётся 40 при
   * 10px и трекинге 3. «СЕНТЯБРЯ» уезжало за края с двух сторон, и увидели это
   * только на сентябрьских событиях: в макете нарисован «июля», он короткий.
   */
  it("на плашку отдаёт три буквы - все двенадцать месяцев", () => {
    const badges = Array.from({ length: 12 }, (_, i) => {
      const month = String(i + 1).padStart(2, "0");
      return eventDate(`2026-${month}-01 12:00`).month;
    });

    expect(badges).toEqual([
      "янв", "фев", "мар", "апр", "мая", "июн",
      "июл", "авг", "сен", "окт", "ноя", "дек",
    ]);
    expect(badges.every((month) => month.length === 3)).toBe(true);
  });

  it("снимает ведущий ноль с числа", () => {
    expect(eventDate("2026-08-03 19:00").day).toBe("3");
  });

  /**
   * Главное, ради чего дата читается текстом: через Date «2026-07-27 18:00»
   * было бы принято за UTC, и в часовом поясе западнее Гринвича мероприятие
   * съехало бы на 26-е.
   */
  it("не зависит от часового пояса читателя", () => {
    const original = process.env.TZ;
    const seen = new Set<string>();
    for (const zone of ["UTC", "America/Los_Angeles", "Asia/Vladivostok"]) {
      process.env.TZ = zone;
      seen.add(JSON.stringify(eventDate("2026-07-27 18:00")));
    }
    process.env.TZ = original;
    expect(seen.size).toBe(1);
  });

  it("на пустом поле не падает", () => {
    expect(eventDate("")).toEqual({
      day: "",
      month: "",
      monthFull: "",
      time: "",
    });
  });
});

describe("isUpcoming", () => {
  // 15:00 UTC is 18:00 in Moscow
  const now = new Date("2026-07-27T15:00:00Z");

  it("reads the editor's date as Moscow wall time", () => {
    expect(isUpcoming({ date: "2026-07-27 18:01" }, now)).toBe(true);
    expect(isUpcoming({ date: "2026-07-27 17:59" }, now)).toBe(false);
    expect(isUpcoming({ date: "2026-07-27 18:00" }, now)).toBe(false);
  });

  it("moves the day with Moscow, not with UTC", () => {
    const late = new Date("2026-07-27T21:30:00Z"); // 00:30 on the 28th in Moscow
    expect(isUpcoming({ date: "2026-07-28 09:00" }, late)).toBe(true);
    expect(isUpcoming({ date: "2026-07-27 23:00" }, late)).toBe(false);
  });

  it("is false without a date", () => {
    expect(isUpcoming({ date: "" }, now)).toBe(false);
  });
});
