/**
 * The file's Tag. Bracket - a rubric in square brackets, [ДОМ], 12px mono caps;
 * the brackets are part of the text, not decoration. Filled - a caption on a Sage
 * plate with 8 and 4 of padding, for the figures' captions in onboarding.
 */
export function Tag({
  children,
  style = "bracket",
}: {
  children: React.ReactNode;
  style?: "bracket" | "filled";
}) {
  return (
    <span
      className={`type-caption inline-flex items-center ${
        style === "filled" ? "bg-ink px-2 py-1 text-white" : "text-ink"
      }`}
    >
      {style === "bracket" ? <>[{children}]</> : children}
    </span>
  );
}
