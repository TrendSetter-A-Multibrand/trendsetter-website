import { describe, expect, it } from "vitest";
import { withGuests } from "@/lib/guestDirectory";
import type { Registration } from "@/lib/db/queries/registrations";

const row = (id: number, extra: Partial<Registration> = {}): Registration => ({
  id,
  email: "",
  cardBarcode: "",
  name: "",
  phone: "",
  createdAt: new Date("2026-11-11"),
  attendedAt: null,
  ...extra,
});

describe("withGuests", () => {
  it("fills the rows that carry only a card number, from the loyalty service", async () => {
    const out = await withGuests(
      [row(1, { cardBarcode: "111" }), row(2, { cardBarcode: "222" })],
      async (code) => ({ name: `Гость ${code}`, phone: "+79990000000", email: `${code}@x.ru` }),
    );
    expect(out.map((r) => r.name)).toEqual(["Гость 111", "Гость 222"]);
    expect(out[0].email).toBe("111@x.ru");
  });

  it("leaves older rows and unreadable guests as they are", async () => {
    const older = row(1, { email: "a@b.co", name: "Иван", phone: "+7999", cardBarcode: "" });
    const broken = row(2, { cardBarcode: "999" });
    const out = await withGuests([older, broken], async () => {
      throw new Error("down");
    });
    expect(out[0]).toEqual(older);
    expect(out[1]).toEqual(broken);
  });

  it("asks for each card once, whatever the number of rows", async () => {
    const asked: string[] = [];
    await withGuests(
      Array.from({ length: 20 }, (_, i) => row(i, { cardBarcode: String(i) })),
      async (code) => {
        asked.push(code);
        return null;
      },
    );
    expect(asked).toHaveLength(20);
  });
});
