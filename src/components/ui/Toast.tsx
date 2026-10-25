/**
 * The file's Toast: a Sage plate with a white caption, "Ссылка скопирована".
 * Centred at the foot of the screen - 32 up from the bottom on a desktop, above
 * the tab bar on a phone - and it rises 16 with a fade in 250 ms. `show` keeps it
 * mounted so the transition can run both ways.
 */
export function Toast({
  show,
  children,
}: {
  show: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`type-caption pointer-events-none fixed bottom-[calc(var(--tabbar-h)+16px)] left-1/2 z-50 -translate-x-1/2 bg-ink px-4 py-3 text-white transition-[opacity,translate] duration-[250ms] ease-out md:bottom-8 ${
        show ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      {children}
    </div>
  );
}
