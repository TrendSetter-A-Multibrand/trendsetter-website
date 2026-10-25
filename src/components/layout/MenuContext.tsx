"use client";

import { createContext, useContext, useMemo, useState } from "react";

type MenuState = { open: boolean; setOpen: (open: boolean) => void };

const MenuContext = createContext<MenuState>({ open: false, setOpen: () => {} });

/**
 * Whether the full-screen menu is open. The burger in the header and the
 * "Меню" tab of the tab bar both open it, and the tab bar hides while it is
 * open - so the state lives above both rather than in either.
 */
export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const value = useMemo(() => ({ open, setOpen }), [open]);
  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

export const useMenu = () => useContext(MenuContext);
