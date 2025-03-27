

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  
  return <NextThemesProvider 
  attribute="class"
  defaultTheme="light" // Default to light theme
  enableSystem={true}
  
  
  {...props}>{children}</NextThemesProvider>
}
