import { describe, expect, it } from "vitest";
import { eventDate } from "@/lib/events";

describe("eventDate", () => {
  it("разбирает то, что Storyblok кладёт в поле даты", () => {
    expect(eventDate("2026-07-27 18:00")).toEqual({
      day: "27",
      month: "июля",
      time: "18:00",
    });
  });

  it("пишет месяц в родительном падеже, как в макете", () => {
    // Intl отдал бы «июль» - это другое слово, и под днём оно читается неверно
    expect(eventDate("2026-01-01 00:00").month).toBe("января");
    expect(eventDate("2026-12-31 23:59").month).toBe("декабря");
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
    expect(eventDate("")).toEqual({ day: "", month: "", time: "" });
  });
});
