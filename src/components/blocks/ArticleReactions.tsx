"use client";

import { useCallback, useSyncExternalStore } from "react";
import { ShareMenu } from "@/components/ui/ShareMenu";

type Reaction = "like" | "dislike";

type ArticleReactionsProps = {
  articleId: string;
  likes: number;
  dislikes: number;
};

const storageKey = (articleId: string) => `trendsetter:reaction:${articleId}`;

// localStorage is an external store, so it is read through useSyncExternalStore
// rather than copied into state inside an effect. Local writes notify through
// `listeners`; `storage` covers the same article open in another tab.
const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

function readVote(key: string): Reaction | null {
  const stored = localStorage.getItem(key);
  return stored === "like" || stored === "dislike" ? stored : null;
}

/**
 * 54px squares, 24px apart. Per the designer: hovering lifts the icon and
 * reveals the count, and clicking keeps it in that raised state.
 *
 * The vote lives in localStorage rather than behind a login - the counts are
 * meant to be aggregate. `likes` / `dislikes` come in as props so they can be
 * served from the API later without touching this component.
 */
export function ArticleReactions({
  articleId,
  likes,
  dislikes,
}: ArticleReactionsProps) {
  const key = storageKey(articleId);

  const voted = useSyncExternalStore(
    subscribe,
    useCallback(() => readVote(key), [key]),
    () => null
  );

  function vote(reaction: Reaction) {
    const next = voted === reaction ? null : reaction;
    if (next) localStorage.setItem(key, next);
    else localStorage.removeItem(key);
    listeners.forEach((notify) => notify());
  }

  return (
    <div className="flex items-center justify-center gap-6 py-12">
      <ReactionButton
        label="Нравится"
        count={likes + (voted === "like" ? 1 : 0)}
        active={voted === "like"}
        onClick={() => vote("like")}
      />
      <ReactionButton
        label="Не нравится"
        count={dislikes + (voted === "dislike" ? 1 : 0)}
        active={voted === "dislike"}
        onClick={() => vote("dislike")}
        flipped
      />
      <ShareMenu />
    </div>
  );
}

function ReactionButton({
  label,
  count,
  active,
  flipped,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  flipped?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={`group relative flex h-[54px] w-[54px] items-center justify-center overflow-hidden ${
        active ? "bg-brand text-white" : "bg-ink/6 text-ink"
      }`}
    >
      <span
        className={`transition-transform duration-200 ${
          active ? "-translate-y-2" : "group-hover:-translate-y-2"
        }`}
      >
        <ThumbIcon flipped={flipped} />
      </span>
      <span
        className={`absolute bottom-1 font-mono text-[10px] leading-none transition-opacity duration-200 ${
          active ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

function ThumbIcon({ flipped }: { flipped?: boolean }) {
  return (
    <svg
      width="19"
      height="18"
      viewBox="0 0 19 18"
      fill="none"
      aria-hidden="true"
      className={flipped ? "rotate-180" : undefined}
    >
      <path
        d="M6 16V7l4-5a2 2 0 0 1 2 2v3h4a2 2 0 0 1 2 2.3l-1 5A2 2 0 0 1 15 16H6Zm0 0H2V7h4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}
