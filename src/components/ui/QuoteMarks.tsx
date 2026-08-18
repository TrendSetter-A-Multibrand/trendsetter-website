/**
 * The pair of marks that open and close a pull quote, straight out of the file:
 * 109x78 of artwork sitting in a 128 square, so it lines up with the 40 of
 * padding around the band.
 */
export function QuoteMarks({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 109 78"
      fill="currentColor"
      aria-hidden="true"
      className={`h-[78px] w-[109px] shrink-0 ${className}`}
    >
      <path d="M0 0H46.8362V46.091L31.1886 77.8119H7.77054L23.5245 46.091H0V0Z" />
      <path d="M62.1639 0H109V46.091L93.3525 77.8119H69.9345L85.6884 46.091H62.1639V0Z" />
    </svg>
  );
}
