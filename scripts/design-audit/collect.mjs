import { chromium } from "playwright-core";
import fs from "node:fs";

const BASE = process.env.AUDIT_BASE ?? "http://localhost:3000/ru_ru";
const ROUTES = {
  home: "", journal: "/journal", news: "/news", article: "/journal/primer-blokov", events: "/events",
  event: "/events/test-event-13", stores: "/stores", brands: "/brands", about: "/company/about",
  space: "/company/space", collabs: "/company/collaborations", contacts: "/company/contacts",
  careers: "/company/careers", loyalty: "/loyalty", giftcards: "/gift-cards", faq: "/faq",
  search: "/search?q=дом", notfound: "/no-such-page", legal: "/user-agreement",
};
const only = process.argv[2] ? process.argv[2].split(",") : Object.keys(ROUTES);
const out = process.argv[3];

const browser = await chromium.launch({ executablePath: process.env.CHROME ?? "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const result = {};
for (const key of only) {
  for (const [dev, width, height] of [["d", 1440, 900], ["m", 375, 812]]) {
    const ctx = await browser.newContext({ viewport: { width, height }, reducedMotion: "reduce", deviceScaleFactor: 1, isMobile: dev === "m", hasTouch: dev === "m" });
    // Cookie bar is fixed and does not move the page, but keep it from covering anything we read
    const page = await ctx.newPage();
    try {
      await page.goto(BASE + ROUTES[key], { waitUntil: "load", timeout: 60000 });
      await page.waitForTimeout(2500);
      const data = await page.evaluate(() => {
        const SKIP = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "SVG", "PATH"]);
        const norm = (s) => s.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
        const items = [];
        for (const el of document.body.querySelectorAll("*")) {
          if (SKIP.has(el.tagName.toUpperCase())) continue;
          if (el.closest("svg, script, style, noscript")) continue;
          const direct = [...el.childNodes].some((n) => n.nodeType === 3 && n.nodeValue.trim());
          if (!direct) continue;
          const cs = getComputedStyle(el);
          if (cs.visibility === "hidden" || cs.display === "none" || Number(cs.opacity) === 0) continue;
          const range = document.createRange();
          range.selectNodeContents(el);
          const r = range.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) continue;
          items.push({
            t: norm(el.textContent || ""), x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height,
            fs: parseFloat(cs.fontSize), fw: Number(cs.fontWeight), lh: cs.lineHeight === "normal" ? null : parseFloat(cs.lineHeight),
            ff: cs.fontFamily.split(",")[0].replace(/["']/g, ""), tag: el.tagName.toLowerCase(), cls: (el.className && el.className.toString().slice(0, 60)) || "",
          });
        }
        return { w: document.documentElement.scrollWidth, h: document.documentElement.scrollHeight, items };
      });
      result[`${key}-${dev}`] = data;
      console.log(key, dev, data.items.length, data.w + "x" + data.h);
    } catch (e) {
      console.log(key, dev, "ERROR", String(e).slice(0, 100));
    }
    await ctx.close();
  }
}
await browser.close();
fs.writeFileSync(out, JSON.stringify(result));
