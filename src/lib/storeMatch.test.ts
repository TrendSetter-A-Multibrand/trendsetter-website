import { describe, expect, it } from "vitest";
import { placeKey, storeOfEvent } from "@/lib/storeMatch";

const stores = [
  { uuid: "vegas", name: "ТРК «Вегас» Каширское" },
  { uuid: "mozaika", name: "ТРЦ «Мозаика»" },
  { uuid: "avenue", name: "ТРЦ «Авеню Север»" },
];

describe("placeKey", () => {
  it("takes the word in the quotes, whichever quotes they are", () => {
    expect(placeKey('ТЦ "Мозаика"')).toBe("мозаика");
    expect(placeKey("ТРЦ «Мозаика»")).toBe("мозаика");
    expect(placeKey("ТРК «Вегас» Каширское")).toBe("вегас");
  });

  it("drops the kind of building when there are no quotes", () => {
    expect(placeKey("ТЦ Мозаика")).toBe("мозаика");
    expect(placeKey("Мозаика")).toBe("мозаика");
  });

  it("reads ё as е", () => {
    expect(placeKey("ТЦ «Берёзка»")).toBe("березка");
  });
});

describe("storeOfEvent", () => {
  it("takes the store the editor chose, even when the place says another", () => {
    const store = storeOfEvent({ store: "vegas", location: 'ТЦ "Мозаика"' }, stores);
    expect(store?.uuid).toBe("vegas");
  });

  it("finds the store by the place when none is chosen", () => {
    expect(storeOfEvent({ store: "", location: 'ТЦ "Мозаика"' }, stores)?.uuid).toBe("mozaika");
    expect(storeOfEvent({ store: "", location: "ТРЦ Авеню Север" }, stores)?.uuid).toBe("avenue");
    expect(storeOfEvent({ store: "", location: "ТРК «Вегас»" }, stores)?.uuid).toBe("vegas");
  });

  it("has no store for a place that is not one of ours, or for no place", () => {
    expect(storeOfEvent({ store: "", location: "ТЦ «Атриум»" }, stores)).toBeNull();
    expect(storeOfEvent({ store: "", location: "" }, stores)).toBeNull();
  });

  it("keeps a chosen store the list no longer has", () => {
    expect(storeOfEvent({ store: "gone", location: "" }, stores)).toEqual({ uuid: "gone", name: "" });
  });
});
