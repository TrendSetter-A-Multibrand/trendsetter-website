"use client";

import { createContext, useContext } from "react";
import { DEFAULT_SETTINGS, type SiteSettings } from "@/lib/siteDefaults";

const SettingsContext = createContext<SiteSettings>(DEFAULT_SETTINGS);

/**
 * The settings the layout read from Storyblok, for the client components that
 * draw part of them (the contact form, the 404). Server components ask
 * getSiteSettings() themselves; a client one cannot, so it is handed them here.
 * Outside a provider it gets the defaults, so a component rendered on its own
 * - in a test, say - still works.
 */
export function SettingsProvider({
  settings,
  children,
}: {
  settings: SiteSettings;
  children: React.ReactNode;
}) {
  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSiteSettings = () => useContext(SettingsContext);
