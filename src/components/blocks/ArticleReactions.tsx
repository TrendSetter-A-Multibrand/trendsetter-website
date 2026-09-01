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
 * 52px squares, 24 apart, the library's own four states: not voted is Pagination
 * Primary - #eeeeee going to #f7f7f7 under the pointer - and voted is Icon
 * Primary, brand red going to its hover. The icon and the count are 24 over 20
 * and both are always in sight; only the ground changes.
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
  // 24 of icon over 20 of counter comes to 44 of the square's 52
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={`flex size-[52px] flex-col items-center justify-center font-mono text-base/5 font-medium transition-colors ${
        active
          ? "bg-brand text-white hover:bg-brand-hover"
          : "bg-surface-active text-ink hover:bg-surface"
      }`}
    >
      <ThumbIcon flipped={flipped} />
      {count}
    </button>
  );
}

/**
 * The file's own thumb, 2 thick in a 24 box - the cuff is a line of its own so
 * the hand reads at this size. Turned over for the other vote.
 *
 * Only the pressed state of the library button carries it: the resting one was
 * left with the icon set's Telegram glyph, which is not a thumb at all.
 */
function ThumbIcon({ flipped }: { flipped?: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={flipped ? "rotate-180" : undefined}
    >
      <path
        d="M19 20H4V10H9L13 4H16L15 10H21L19 20Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M8 10V20" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
