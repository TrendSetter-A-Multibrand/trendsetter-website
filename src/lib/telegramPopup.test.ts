import { describe, expect, it } from "vitest";
import { SNOOZE_MS, atTheFoot, planFor, snoozeUntil } from "./telegramPopup";

const NOW = 1_000_000;

describe("Telegram-попап: когда показывать", () => {
  it("на первом визите — через 5 секунд после открытия", () => {
    expect(planFor({}, null, NOW)).toBe("entry");
  });

  it("после «Подписаться» больше никогда", () => {
    expect(planFor({ never: true }, null, NOW)).toBe("none");
    expect(planFor({ never: true }, "entry-closed", NOW)).toBe("none");
  });

  it("крестик откладывает на 7 дней, с следующего визита", () => {
    const memory = { until: snoozeUntil(NOW) };
    expect(memory.until - NOW).toBe(SNOOZE_MS);
    expect(planFor(memory, null, NOW + 1000)).toBe("none");
    expect(planFor(memory, null, NOW + SNOOZE_MS + 1)).toBe("entry");
  });

  it("в этом же визите после закрытия первого — один раз в конце страницы", () => {
    expect(planFor({ until: snoozeUntil(NOW) }, "entry-closed", NOW)).toBe("end");
    expect(planFor({ until: snoozeUntil(NOW) }, "done", NOW)).toBe("none");
  });
});

describe("конец страницы", () => {
  it("считается концом за 160 px до низа", () => {
    expect(atTheFoot(0, 800, 3000)).toBe(false);
    expect(atTheFoot(2100, 800, 3000)).toBe(true);
  });
});
