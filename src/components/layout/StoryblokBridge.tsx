"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const SRC = "https://app.storyblok.com/f/storyblok-v2-latest.js";

type Bridge = { on: (events: string[], handler: () => void) => void };

declare global {
  interface Window {
    StoryblokBridge?: new (options?: Record<string, unknown>) => Bridge;
  }
}

/**
 * Only mounted while draft mode is on, which is to say only inside Storyblok's
 * own window. It listens for the editor saving or publishing and asks the server
 * for the page again - drafts are never cached, so what comes back is what was
 * just written.
 *
 * Saving rather than typing: the sections are rendered on the server, so there
 * is nothing on this side that could rebuild them from a keystroke. Following
 * every keystroke would mean asking the server on each one.
 */
export function StoryblokBridge() {
  const router = useRouter();

  useEffect(() => {
    function listen() {
      if (!window.StoryblokBridge) return;
      new window.StoryblokBridge().on(
        ["change", "published", "unpublished"],
        () => router.refresh()
      );
    }

    if (window.StoryblokBridge) {
      listen();
      return;
    }

    // One tag however many times this mounts; a second copy of the bridge would
    // answer the same events twice.
    let script = document.querySelector<HTMLScriptElement>(`script[src="${SRC}"]`);
    if (!script) {
      script = document.createElement("script");
      script.src = SRC;
      script.async = true;
      document.head.appendChild(script);
    }
    script.addEventListener("load", listen);
    return () => script?.removeEventListener("load", listen);
  }, [router]);

  return null;
}
