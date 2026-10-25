/**
 * The file's linear icons, "01 Атомы" page: 24 by 24, a 1.5 line with square
 * caps, drawn in the text colour so a button's own colour carries them. The
 * paths are the file's own, exported from its Icon components.
 */
type IconProps = { size?: number; className?: string };

function Icon({
  d,
  size = 24,
  viewBox = 24,
  className,
}: IconProps & { d: string; viewBox?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${viewBox} ${viewBox}`}
      fill="none"
      aria-hidden="true"
      className={`shrink-0 ${className ?? ""}`}
    >
      <path d={d} stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  );
}

export const SearchIcon = (p: IconProps) => (
  <Icon
    {...p}
    d="M15.5 15.5L20 20M10.5 17C12.2239 17 13.8772 16.3152 15.0962 15.0962C16.3152 13.8772 17 12.2239 17 10.5C17 8.77609 16.3152 7.12279 15.0962 5.90381C13.8772 4.68482 12.2239 4 10.5 4C8.77609 4 7.12279 4.68482 5.90381 5.90381C4.68482 7.12279 4 8.77609 4 10.5C4 12.2239 4.68482 13.8772 5.90381 15.0962C7.12279 16.3152 8.77609 17 10.5 17Z"
  />
);
export const BurgerIcon = (p: IconProps) => <Icon {...p} d="M3 7H21M3 12H21M3 17H21" />;
export const CloseIcon = (p: IconProps) => (
  <Icon {...p} d="M5 5L12 12M12 12L19 19M12 12L19 5M12 12L5 19" />
);
export const ChevronIcon = ({ size = 24, className }: IconProps) =>
  size === 16 ? (
    <Icon size={16} viewBox={16} className={className} d="M4 6L8 10L12 6" />
  ) : (
    <Icon size={size} className={className} d="M6 9L12 15L18 9" />
  );
export const JournalIcon = (p: IconProps) => (
  <Icon {...p} d="M8 9H16M8 13H16M8 17H12M4 4H20V20H4V4Z" />
);
export const CalendarIcon = (p: IconProps) => (
  <Icon
    {...p}
    d="M8 6H4V10M8 6H16M8 6V3M8 6V8M16 6H20V10M16 6V3M16 6V8M20 10V20H4V10M20 10H4"
  />
);
export const PinIcon = (p: IconProps) => (
  <Icon
    {...p}
    d="M12 21C12 21 5.5 15 5.5 10C5.5 8.27609 6.18482 6.62279 7.40381 5.40381C8.62279 4.18482 10.2761 3.5 12 3.5C13.7239 3.5 15.3772 4.18482 16.5962 5.40381C17.8152 6.62279 18.5 8.27609 18.5 10C18.5 15 12 21 12 21ZM12 12.5C12.663 12.5 13.2989 12.2366 13.7678 11.7678C14.2366 11.2989 14.5 10.663 14.5 10C14.5 9.33696 14.2366 8.70107 13.7678 8.23223C13.2989 7.76339 12.663 7.5 12 7.5C11.337 7.5 10.7011 7.76339 10.2322 8.23223C9.76339 8.70107 9.5 9.33696 9.5 10C9.5 10.663 9.76339 11.2989 10.2322 11.7678C10.7011 12.2366 11.337 12.5 12 12.5Z"
  />
);
export const ArrowIcon = (p: IconProps) => <Icon {...p} d="M4 12H20M14 6L20 12L14 18" />;
export const ArrowLeftIcon = (p: IconProps) => <Icon {...p} d="M20 12H4M10 6L4 12L10 18" />;
