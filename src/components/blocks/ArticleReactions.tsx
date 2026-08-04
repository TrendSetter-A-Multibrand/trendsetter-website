"use client";

import { useState } from "react";

const SHARE_TARGETS = [
  { label: "MAX", href: "https://max.ru/share?url=" },
  { label: "VK", href: "https://vk.com/share.php?url=" },
  { label: "Telegram", href: "https://t.me/share/url?url=" },
  { label: "Одноклассники", href: "https://connect.ok.ru/offer?url=" },
];

/** 54px squares, 24px apart. Only the share panel is interactive for now. */
export function ArticleReactions({ likes }: { likes: number }) {
  const [shareOpen, setShareOpen] = useState(false);

  return (
    <div className="relative flex items-center justify-center gap-6 py-12">
      <span className="relative flex h-[54px] w-[54px] items-center justify-center bg-brand text-white">
        <ThumbIcon />
        <span className="absolute bottom-1 font-mono text-[10px]">{likes}</span>
      </span>

      <button
        type="button"
        aria-label="Не понравилось"
        className="flex h-[54px] w-[54px] items-center justify-center bg-ink/6 text-ink"
      >
        <ThumbIcon flipped />
      </button>

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
