import { describe, expect, it } from "vitest";
import { canSeeEvent, type Staff } from "@/lib/staff/access";

const owner: Staff = { id: 1, login: "o", name: "O", role: "owner", storeUuids: [] };
const store: Staff = {
  id: 2,
  login: "s",
  name: "S",
  role: "store",
  storeUuids: ["store-a", "store-b"],
};

describe("canSeeEvent", () => {
  it("lets an owner see every event, even one with no store", () => {
    expect(canSeeEvent(owner, "store-x")).toBe(true);
    expect(canSeeEvent(owner, "")).toBe(true);
  });

  it("lets a store admin see only the events of their stores", () => {
    expect(canSeeEvent(store, "store-a")).toBe(true);
    expect(canSeeEvent(store, "store-b")).toBe(true);
    expect(canSeeEvent(store, "store-c")).toBe(false);
  });

  it("keeps an event with no store from every store admin", () => {
    expect(canSeeEvent(store, "")).toBe(false);
    expect(canSeeEvent({ ...store, storeUuids: [""] }, "")).toBe(false);
  });
});
