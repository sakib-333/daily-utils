import { useState } from "react"
import { Menu, Moon, Search, Sun, Terminal, X } from "lucide-react"

import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navItems = [
    { label: "Services", href: "#services" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
]

const Navbar = () => {
    const { theme, setTheme } = useTheme()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const isDark =
        theme === "dark" ||
        (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)

    const toggleTheme = () => {
        setTheme(isDark ? "light" : "dark")
    }

    return (
        <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/85 shadow-sm backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-12">
                <a
                    href="#"
                    className="flex min-w-0 items-center gap-2 text-xl font-bold text-primary sm:text-2xl"
                    aria-label="Daily Utils home"
                >
                    <Terminal className="size-6 shrink-0" aria-hidden="true" />
                    <span className="truncate">Daily Utils</span>
                </a>

                <nav className="hidden h-full items-center gap-8 md:flex" aria-label="Main navigation">
                    {navItems.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            className="flex h-full items-center text-sm font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:text-primary active:opacity-80"
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    <label className="relative hidden lg:block">
                        <span className="sr-only">Search tools</span>
                        <input
                            className="h-10 w-64 rounded-full border border-input bg-muted/60 py-2 pl-4 pr-10 text-sm text-foreground outline-none transition focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/15"
                            placeholder="Search tools..."
                            type="search"
                        />
                        <Search
                            className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                            aria-hidden="true"
                        />
                    </label>

                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                    >
                        {isDark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
                    </Button>

                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setIsMenuOpen((open) => !open)}
                        aria-expanded={isMenuOpen}
                        aria-controls="mobile-navigation"
                        aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                    >
                        {isMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
                    </Button>
                </div>
            </div>

            <div
                id="mobile-navigation"
                className={cn(
                    "border-t border-border bg-background px-4 py-4 shadow-sm md:hidden",
                    isMenuOpen ? "block" : "hidden"
                )}
            >
                <label className="relative mb-3 block">
                    <span className="sr-only">Search tools</span>
                    <input
                        className="h-10 w-full rounded-full border border-input bg-muted/60 py-2 pl-4 pr-10 text-sm text-foreground outline-none transition focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/15"
                        placeholder="Search tools..."
                        type="search"
                    />
                    <Search
                        className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                        aria-hidden="true"
                    />
                </label>

                <nav className="flex flex-col" aria-label="Mobile navigation">
                    {navItems.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            className="rounded-md px-2 py-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>
            </div>
        </header>
    )
}

export default Navbar
