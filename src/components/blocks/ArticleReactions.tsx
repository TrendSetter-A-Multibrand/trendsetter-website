"use client";

import { useCallback, useState, useSyncExternalStore } from "react";

const SHARE_TARGETS = [
  { label: "MAX", href: "https://max.ru/share?url=" },
  { label: "VK", href: "https://vk.com/share.php?url=" },
  { label: "Telegram", href: "https://t.me/share/url?url=" },
  { label: "Одноклассники", href: "https://connect.ok.ru/offer?url=" },
];

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
  const [shareOpen, setShareOpen] = useState(false);
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

      <div className="relative">
        <button
          type="button"
          aria-label="Поделиться"
          aria-expanded={shareOpen}
          onClick={() => setShareOpen((open) => !open)}
          className="flex h-[54px] w-[54px] items-center justify-center bg-ink/12 text-ink"
        >
          <ShareIcon />
        </button>

        {shareOpen && (
          <div className="absolute bottom-full right-0 mb-4 w-[264px] bg-white shadow-[0_0_0_1px_rgba(37,33,32,0.15)]">
            <p className="px-6 py-3 font-mono text-sm uppercase tracking-[1px] text-ink">
              [Поделиться]
            </p>
            <button
              type="button"
              onClick={() => navigator.clipboard?.writeText(window.location.href)}
              className="flex h-[43px] w-full items-center border-t border-ink/15 px-6 text-left text-sm text-ink"
            >
              Скопировать ссылку
            </button>
            {SHARE_TARGETS.map((target) => (
              <a
                key={target.label}
                href={target.href}
                target="_blank"
                rel="noreferrer"
                className="flex h-[43px] items-center border-t border-ink/15 px-6 text-sm text-ink"
              >
                {target.label}
              </a>
            ))}
          </div>
        )}
      </div>
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

function ShareIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M19 1 1 8l7 3 3 7 8-17Zm0 0L8 11"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}
