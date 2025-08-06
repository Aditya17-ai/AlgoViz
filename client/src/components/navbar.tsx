import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { Moon, Sun, Code, Home, Play } from "lucide-react";

export default function Navbar() {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();

  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <Code className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">
                AlgoViz
              </span>
            </Link>
            <div className="hidden md:flex items-center space-x-6 ml-8">
              <Link
                href="/"
                className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium transition-colors ${
                  location === "/"
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              <Link
                href="/visualizer"
                className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium transition-colors ${
                  location.startsWith("/visualizer")
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Play className="h-4 w-4" />
                <span>Visualizer</span>
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
