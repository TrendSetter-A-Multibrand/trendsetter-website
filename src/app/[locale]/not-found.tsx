import { NotFoundHero } from "@/components/blocks/NotFoundHero";
import { NewsGrid } from "@/components/blocks/NewsGrid";

// Renders inside the locale layout, so it keeps the header and footer.
export default function NotFound() {
  return (
    <>
      <NotFoundHero />
      <NewsGrid />
    </>
  );
}
