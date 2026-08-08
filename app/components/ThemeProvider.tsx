"use client"

import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      /* The swap happens under the veil in app/utils/themeFade.ts, so the
         incidental colour transitions Tailwind's `transition` utilities start
         on every badge, button and card are pure invisible work: measured
         2,963 of them per switch, restarting as next-themes writes the class
         and then colorScheme. Suppressing them costs nothing to look at. */
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}

 