"use client";

import { useState } from "react";
import { buttonClass } from "@/components/ui/Button";

/** Puts `text` on the clipboard and says so for a moment. */
export function CopyButton({ text, label }: { text: string; label: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className={buttonClass("outline", "S")}
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
