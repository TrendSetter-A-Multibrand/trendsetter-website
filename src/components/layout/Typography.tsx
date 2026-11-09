"use client";

import { useEffect } from "react";
import { bindShortWords } from "@/lib/typography";

/** Where the text is not prose: code, fields, the page's own title. */
const SKIP = "script, style, noscript, textarea, input, select, code, pre, title, [contenteditable], [data-no-nbsp]";

function tidy(root: Node) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const parent = node.parentElement;
    if (!parent || parent.closest(SKIP)) continue;
    const value = node.nodeValue ?? "";
    const next = bindShortWords(value);
    // Only a real change is written: an equal text writes nothing, so no mutation, no loop
    if (next !== value) node.nodeValue = next;
  }
}

/**
 * Hanging prepositions and conjunctions, over the whole site (`lib/typography`).
 * The text comes from everywhere - the components, the editor's fields in
 * Storyblok, the articles - so it is tied up where it ends, in the page, rather
 * than at each of the places it is written.
 *
 * It waits for the page to settle before the first pass, so a part of the page
 * React has yet to hydrate is not changed under it, and then keeps up with what
 * comes in afterwards: a new page, a list that is filtered, a sheet that opens.
 */
export function Typography() {
  useEffect(() => {
    let frame = 0;
    const pending = new Set<Node>();

    function flush() {
      frame = 0;
      for (const node of pending) if (node.isConnected) tidy(node);
      pending.clear();
    }
    const watcher = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "characterData") pending.add(mutation.target);
        else mutation.addedNodes.forEach((added) => pending.add(added));
      }
      if (!frame) frame = window.requestAnimationFrame(flush);
    });

    const start = () => {
      tidy(document.body);
      watcher.observe(document.body, { childList: true, subtree: true, characterData: true });
    };
    // A second after the page is loaded: hydration has long been done
    let timer = 0;
    const onLoad = () => {
      timer = window.setTimeout(start, 600);
    };
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });

    return () => {
      window.removeEventListener("load", onLoad);
      window.clearTimeout(timer);
      if (frame) window.cancelAnimationFrame(frame);
      watcher.disconnect();
    };
  }, []);

  return null;
}
