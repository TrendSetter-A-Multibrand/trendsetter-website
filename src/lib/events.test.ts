import { describe, expect, it } from "vitest";
import { eventDate } from "@/lib/events";

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
