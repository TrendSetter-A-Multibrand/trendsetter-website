import { describe, expect, it } from "vitest";
import { COLLAB_TITLE, collabLink, planCollabCards, type CollabCard } from "@/lib/collabCards";

const photo = { filename: "https://a.storyblok.com/x.jpg" };
const three: CollabCard[] = [
  { _uid: "a", title: "PLAYGROUND", body: "p", image: photo },
  { _uid: "b", title: "TOGETHER", body: "t" },
  { _uid: "c", title: "SELECT", body: "s" },
];
let n = 0;
const uid = () => `new-${++n}`;

describe("planCollabCards", () => {
  it("keeps the three, links them to collab-1..3 and adds three more", () => {
    const { cards, changed } = planCollabCards(three, uid);
    expect(changed).toBe(true);
    expect(cards).toHaveLength(6);
    expect(cards.slice(0, 3).map((c) => c.title)).toEqual(["PLAYGROUND", "TOGETHER", "SELECT"]);
    expect(cards.map((c) => c.link?.url)).toEqual(
      [1, 2, 3, 4, 5, 6].map((i) => `company/collaborations/collab-${i}`),
    );
    expect(cards[3]).toMatchObject({ title: COLLAB_TITLE, image: photo, component: "space_card" });
  });

  it("is idempotent: its own result needs no change", () => {
    const first = planCollabCards(three, uid).cards;
    const second = planCollabCards(first, uid);
    expect(second.changed).toBe(false);
    expect(second.cards).toEqual(first);
  });

  it("does not touch an address an editor already set", () => {
    const own = { ...three[0], link: { url: "company/space" } };
    expect(planCollabCards([own, ...three.slice(1)], uid).cards[0].link).toEqual({ url: "company/space" });
  });

  it("reports when there is no photo to copy", () => {
    expect(planCollabCards([{ title: "x" }], uid).noImage).toBe(true);
    expect(collabLink(2).url).toBe("company/collaborations/collab-2");
  });
});
