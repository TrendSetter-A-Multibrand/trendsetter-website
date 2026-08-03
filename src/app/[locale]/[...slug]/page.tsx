import { notFound } from "next/navigation";

/**
 * Without this, an unknown path under a locale never reaches the segment, so
 * Next falls back to its own bare 404 instead of the designed one.
 */
export default function CatchAll(): never {
  notFound();
}
