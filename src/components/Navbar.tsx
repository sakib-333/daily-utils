import { type ChangeEvent, type FormEvent, useMemo, useState } from "react"
import { Menu, Moon, Search, Sun, Terminal, X } from "lucide-react"

import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { services } from "@/routes/services"
import { Link, useNavigate } from "@tanstack/react-router"

const navItems = [
    { label: "Services", href: "/services" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
]

const Navbar = () => {
    const { theme, setTheme } = useTheme()
    const navigate = useNavigate()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const isDark =
        theme === "dark" ||
        (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)

    const trimmedSearchQuery = searchQuery.trim().toLowerCase()
    const filteredServices = useMemo(() => {
        if (!trimmedSearchQuery) {
            return []
        }

        return services
            .filter(({ title, description }) => {
                const searchableText = `${title} ${description}`.toLowerCase()
                return searchableText.includes(trimmedSearchQuery)
            })
            .slice(0, 6)
    }, [trimmedSearchQuery])

    const toggleTheme = () => {
        setTheme(isDark ? "light" : "dark")
    }

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value)
        setIsSearchOpen(true)
    }

    const closeSearch = () => {
        setIsSearchOpen(false)
    }

    const clearSearch = () => {
        setSearchQuery("")
        closeSearch()
        setIsMenuOpen(false)
    }

    const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!filteredServices.length) {
            setIsSearchOpen(Boolean(trimmedSearchQuery))
            return
        }

        void navigate({ to: filteredServices[0].path })
        clearSearch()
    }

    const searchResults = isSearchOpen && Boolean(trimmedSearchQuery)

    return (
        <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/85 shadow-sm backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-12">
                <Link
                    to="/"
                    className="flex min-w-0 items-center gap-2 text-xl font-bold text-primary sm:text-2xl"
                    aria-label="Daily Utils home"
                >
                    <Terminal className="size-6 shrink-0 border-2 border-primary" aria-hidden="true" />
                    <span className="truncate">Daily Utils</span>
                </Link>

                <nav className="hidden h-full items-center gap-8 md:flex" aria-label="Main navigation">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            to={item.href}
                            className="flex h-full items-center text-sm font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:text-primary active:opacity-80"
                            activeProps={{
                                className: "text-primary"
                            }}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    <form className="relative hidden lg:block" onSubmit={handleSearchSubmit}>
                        <label>
                            <span className="sr-only">Search tools</span>
                            <input
                                className="h-10 w-64 rounded-full border border-input bg-muted/60 py-2 pl-4 pr-10 text-sm text-foreground outline-none transition focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/15"
                                placeholder="Search tools..."
                                type="search"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onFocus={() => setIsSearchOpen(true)}
                                onKeyDown={(event) => {
                                    if (event.key === "Escape") {
                                        closeSearch()
                                    }
                                }}
                                aria-expanded={searchResults}
                                aria-controls="desktop-search-results"
                                autoComplete="off"
                            />
                        </label>
                        <Search
                            className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                            aria-hidden="true"
                        />

                        {searchResults && (
                            <div
                                id="desktop-search-results"
                                className="absolute right-0 top-12 w-80 overflow-hidden rounded-lg border border-border bg-background py-2 shadow-lg"
                            >
                                {filteredServices.length ? (
                                    filteredServices.map(({ id, title, description, path }) => (
                                        <Link
                                            key={id}
                                            to={path}
                                            className="block px-4 py-3 text-left transition-colors hover:bg-muted focus:bg-muted focus:outline-none"
                                            onClick={clearSearch}
                                        >
                                            <span className="block text-sm font-semibold text-foreground">{title}</span>
                                            <span className="mt-0.5 line-clamp-1 block text-xs text-muted-foreground">
                                                {description}
                                            </span>
                                        </Link>
                                    ))
                                ) : (
                                    <p className="px-4 py-3 text-sm text-muted-foreground">No tools found.</p>
                                )}
                            </div>
                        )}
                    </form>

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
                <form className="relative mb-3" onSubmit={handleSearchSubmit}>
                    <label className="block">
                        <span className="sr-only">Search tools</span>
                        <input
                            className="h-10 w-full rounded-full border border-input bg-muted/60 py-2 pl-4 pr-10 text-sm text-foreground outline-none transition focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/15"
                            placeholder="Search tools..."
                            type="search"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            onFocus={() => setIsSearchOpen(true)}
                            onKeyDown={(event) => {
                                if (event.key === "Escape") {
                                    closeSearch()
                                }
                            }}
                            aria-expanded={searchResults}
                            aria-controls="mobile-search-results"
                            autoComplete="off"
                        />
                    </label>
                    <Search
                        className="absolute right-3 top-5 size-4 -translate-y-1/2 text-muted-foreground"
                        aria-hidden="true"
                    />

                    {searchResults && (
                        <div
                            id="mobile-search-results"
                            className="mt-2 overflow-hidden rounded-lg border border-border bg-background py-2 shadow-sm"
                        >
                            {filteredServices.length ? (
                                filteredServices.map(({ id, title, description, path }) => (
                                    <Link
                                        key={id}
                                        to={path}
                                        className="block px-4 py-3 transition-colors hover:bg-muted focus:bg-muted focus:outline-none"
                                        onClick={clearSearch}
                                    >
                                        <span className="block text-sm font-semibold text-foreground">{title}</span>
                                        <span className="mt-0.5 line-clamp-1 block text-xs text-muted-foreground">
                                            {description}
                                        </span>
                                    </Link>
                                ))
                            ) : (
                                <p className="px-4 py-3 text-sm text-muted-foreground">No tools found.</p>
                            )}
                        </div>
                    )}
                </form>

                <nav className="flex flex-col" aria-label="Mobile navigation">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            to={item.href}
                            className="rounded-md px-2 py-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
                            onClick={() => setIsMenuOpen(false)}
                            activeProps={{
                                className: "text-primary"
                            }}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    )
}

export default Navbar
