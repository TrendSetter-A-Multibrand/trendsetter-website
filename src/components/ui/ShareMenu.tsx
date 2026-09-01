"use client";

import { useState } from "react";

type ShareTarget = {
  label: string;
  icon: string;
  /** Absent on "copy link", which uses the clipboard instead. */
  href?: (url: string) => string;
};

const TARGETS: ShareTarget[] = [
  { label: "Скопировать ссылку", icon: "/images/share/link.svg" },
  {
    label: "MAX",
    icon: "/images/share/max.svg",
    href: (url) => `https://max.ru/share?url=${url}`,
  },
  {
    label: "VK",
    icon: "/images/share/vk.svg",
    href: (url) => `https://vk.com/share.php?url=${url}`,
  },
  {
    label: "Telegram",
    icon: "/images/share/telegram.svg",
    href: (url) => `https://t.me/share/url?url=${url}`,
  },
  {
    label: "Одноклассники",
    icon: "/images/share/ok.svg",
    href: (url) => `https://connect.ok.ru/offer?url=${url}`,
  },
];

/** Drawn as a CSS mask so the glyph takes the colour of its row. */
function Glyph({ src }: { src: string }) {
  return (
    <span
      className="block h-6 w-6 shrink-0 bg-current"
      style={{
        maskImage: `url(${src})`,
        maskSize: "contain",
        maskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskImage: `url(${src})`,
        WebkitMaskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
      }}
    />
  );
}

const ROW =
  "flex h-[43px] w-full items-center gap-[17px] border-t border-ink/15 px-[17px] text-left text-sm tracking-[1.5px] text-ink";

/** 264px panel, 43px rows, hanging above the share button. */
export function ShareMenu() {
  const [open, setOpen] = useState(false);

  function copyLink() {
    navigator.clipboard?.writeText(window.location.href);
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Поделиться"
        aria-expanded={open}
        onClick={() => setOpen((wasOpen) => !wasOpen)}
        className="flex size-[52px] items-center justify-center text-ink transition-colors hover:text-muted"
      >
        <ShareIcon />
      </button>

      {open && (
        <>
          {/* Catches the click that dismisses the panel */}
          <button
            type="button"
            aria-label="Закрыть"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-10 cursor-default"
          />

          <div className="absolute bottom-full right-0 z-20 mb-4 w-[264px] border border-ink/15 bg-white py-2 backdrop-blur-[6px]">
            <p className="flex h-[35px] items-center justify-center font-mono text-xl uppercase tracking-[1px] text-ink">
              [Поделиться]
            </p>

            {TARGETS.map((target) =>
              target.href ? (
                <a
                  key={target.label}
                  href={target.href(
                    typeof window === "undefined" ? "" : encodeURIComponent(window.location.href)
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className={ROW}
                >
                  <Glyph src={target.icon} />
                  {target.label}
                </a>
              ) : (
                <button key={target.label} type="button" onClick={copyLink} className={ROW}>
                  <Glyph src={target.icon} />
                  {target.label}
                </button>
              )
            )}
          </div>
        </>
      )}
    </div>
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
