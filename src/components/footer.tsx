import { Megaphone, Network, Send, Users } from "lucide-react"

import { Button } from "@/components/ui/button"

const footerSections = [
    {
        title: "Tools",
        links: ["JSON Formatter", "UUID Generator", "Password Generator", "Age Calculator"],
    },
    {
        title: "Company",
        links: ["About Us", "Contact", "Privacy Policy", "Terms of Service"],
    },
]

const socialLinks = [
    { label: "Announcements", icon: Megaphone },
    { label: "Community", icon: Users },
    { label: "Integrations", icon: Network },
]

const Footer = () => {
    return (
        <footer className="mt-20 w-full border-t border-border bg-muted/70">
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-20 sm:px-6 md:grid-cols-4 lg:px-12">
                <div className="flex flex-col gap-4">
                    <div className="text-xl font-bold text-primary">Daily Utils</div>
                    <p className="text-sm leading-6 text-muted-foreground">
                        High-performance utilities for the modern professional. Privacy-focused and
                        community-driven.
                    </p>
                    <div className="mt-1 flex gap-3">
                        {socialLinks.map(({ label, icon: Icon }) => (
                            <Button
                                key={label}
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                className="text-muted-foreground hover:text-primary"
                                aria-label={label}
                            >
                                <Icon className="size-5" aria-hidden="true" />
                            </Button>
                        ))}
                    </div>
                </div>

                {footerSections.map((section) => (
                    <div key={section.title} className="flex flex-col gap-2">
                        <h4 className="mb-1 text-sm font-bold text-foreground">{section.title}</h4>
                        {section.links.map((link) => (
                            <a
                                key={link}
                                href="#"
                                className="text-sm text-muted-foreground transition-colors hover:text-primary hover:underline"
                            >
                                {link}
                            </a>
                        ))}
                    </div>
                ))}

                <div className="flex flex-col gap-2">
                    <h4 className="mb-1 text-sm font-bold text-foreground">Newsletter</h4>
                    <p className="mb-3 text-sm leading-6 text-muted-foreground">
                        Get notified when we release new tools.
                    </p>
                    <form className="flex gap-2">
                        <label className="sr-only" htmlFor="footer-email">
                            Email address
                        </label>
                        <input
                            id="footer-email"
                            className="min-w-0 flex-1 rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
                            placeholder="Email address"
                            type="email"
                        />
                        <Button type="submit" size="icon" className="rounded-lg" aria-label="Subscribe">
                            <Send className="size-4" aria-hidden="true" />
                        </Button>
                    </form>
                </div>
            </div>

            <div className="mx-auto flex max-w-7xl flex-col gap-3 border-t border-border/60 px-4 py-6 text-sm text-muted-foreground sm:px-6 md:flex-row md:items-center md:justify-between lg:px-12">
                <p>&copy; 2024 Daily Utils. All rights reserved.</p>
                <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
                    <span>v2.4.0</span>
                    <span>System Status: Operational</span>
                </div>
            </div>
        </footer>
    )
}

export default Footer
