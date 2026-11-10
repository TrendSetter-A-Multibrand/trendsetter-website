import NextLink from "next/link";
import type { ComponentProps } from "react";
import { publicPath } from "@/lib/i18n/locales";

/**
 * next/link with the address a visitor should see: the places that build a link
 * as `/${locale}/...` need not know that the default market's prefix is hidden.
 */
export default function Link({ href, ...props }: ComponentProps<typeof NextLink>) {
  const shown =
    typeof href === "string"
      ? publicPath(href)
      : href.pathname
        ? { ...href, pathname: publicPath(href.pathname) }
        : href;
  return <NextLink href={shown} {...props} />;
}
