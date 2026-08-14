import { NotFoundHero } from "@/components/blocks/NotFoundHero";
import { NewsGrid } from "@/components/blocks/NewsGrid";

// Renders inside the locale layout, so it keeps the header and footer.
export default function NotFound() {
  return (
    <>
      <NotFoundHero />
      {/* The home page ends on the newsletter, which sits flush on the footer.
          Here the row is last, so it has to carry the air itself. */}
      <div className="pb-16">
        <NewsGrid />
      </div>
    </>
  );
}
