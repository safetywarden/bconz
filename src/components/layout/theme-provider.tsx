"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = "light" as const;

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return <>{children}</>;
}
