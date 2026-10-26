import { Wordmark } from "@/components/ui/Wordmark";

/** A statement longer than this is a paragraph, not a headline, and is set as one. */
const HEADLINE_MAX = 160;

/**
 * The file's Red band: the wordmark in White across the whole measure, then the
 * label in brackets, an H2 of up to 900 and a Body L line, all centred, 48 of
 * Red round it. Under it may run the strip of value cards on the same red, which
 * is why it has no air of its own below. Without them it closes with 96.
 *
 * The block has one text field, so its first paragraph is the headline and the
 * one after it the line under it; a lone paragraph too long for a headline is
 * set as Body L instead of as forty-pixel type.
 */
export function MissionBand({
  heading = "Наша миссия",
  body,
  closing = true,
}: {
  heading?: string;
  body: string;
  /** Nothing follows on the red, so the band gives 96 under it rather than 48. */
  closing?: boolean;
}) {
  const [first, ...rest] = body
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const headline = first && first.length <= HEADLINE_MAX ? first : undefined;
  const lines = headline ? rest : first ? [first, ...rest] : [];

  return (
    <section
      className={`on-dark bg-brand px-4 pt-12 text-white md:px-10 ${closing ? "pb-12 md:pb-24" : "pb-12"}`}
    >
      <Wordmark className="text-white" />

      <div className="mx-auto mt-12 flex flex-col items-center gap-4 text-center">
        <p className="type-label uppercase">[{heading}]</p>
        {headline && <h2 className="type-h2 max-w-[900px]">{headline}</h2>}
        {lines.map((line, i) => (
          <p key={i} className="type-body-l max-w-[900px]">
            {line}
          </p>
        ))}
      </div>
    </section>
  );
}
