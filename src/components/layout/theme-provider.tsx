"use client";

import type { PropsWithChildren } from "react";
import { useEffect, useState } from "react";

export function ThemeProvider({ children }: PropsWithChildren<{}>) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    setTheme("light");
  }, []);

  return <>{children}</>;
}
