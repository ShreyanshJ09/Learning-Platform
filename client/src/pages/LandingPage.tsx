import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/providers/ThemeProvider";

/**
 * Temporary Phase 1 landing shell.
 * Real marketing/landing content lands when public pages are built.
 */
export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        Text-to-Learn
      </h1>
      <p className="text-muted-foreground">
        Application foundation is ready.
      </p>
      <Button
        type="button"
        variant="outline"
        onClick={toggleTheme}
        aria-label={
          theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
        }
      >
        {theme === "dark" ? <Sun /> : <Moon />}
        {theme === "dark" ? "Light mode" : "Dark mode"}
      </Button>
    </main>
  );
}
