"use client";

import { useState } from "react";

/** Puts `text` on the clipboard and says so for a moment. */
export function CopyButton({ text, label }: { text: string; label: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className="border border-ink px-3 py-1 text-sm hover:bg-surface"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setDone(true);
        setTimeout(() => setDone(false), 1500);
      }}
    >
      {done ? "Скопировано" : label}
    </button>
  );
}
