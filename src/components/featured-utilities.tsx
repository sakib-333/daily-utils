import { Braces, ChevronRight, Fingerprint, KeyRound, QrCode, type LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

type Utility = {
    title: string
    description: string
    icon: LucideIcon
}

const featuredUtilities: Utility[] = [
    {
        title: "JSON Formatter",
        description: "Validate and prettify your JSON data instantly with tree view support.",
        icon: Braces,
    },
    {
        title: "Password Generator",
        description: "Generate secure, randomized passwords with custom complexity rules.",
        icon: KeyRound,
    },
    {
        title: "QR Generator",
        description: "Create high-quality QR codes for URLs, text, or WiFi credentials.",
        icon: QrCode,
    },
    {
        title: "UUID Generator",
        description: "Generate unique version 4 UUIDs for your databases and applications.",
        icon: Fingerprint,
    },
]

const FeaturedUtilities = () => {
    return (
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-12">
            <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-normal text-foreground sm:text-4xl">
                        Featured Utilities
                    </h2>
                    <p className="mt-2 text-base text-muted-foreground">
                        Our most used tools by the community
                    </p>
                </div>

                <Button
                    type="button"
                    variant="link"
                    className="h-auto justify-start gap-1 px-0 text-base font-semibold text-primary md:justify-center"
                >
                    View All Categories
                    <ChevronRight className="size-4" aria-hidden="true" />
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
                {featuredUtilities.map(({ title, description, icon: Icon }) => (
                    <article
                        key={title}
                        className="group flex min-h-64 cursor-pointer flex-col rounded-xl border border-border bg-background p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                    >
                        <div className="mb-5 flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                            <Icon className="size-6" aria-hidden="true" />
                        </div>

                        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
                        <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">{description}</p>

                        <Button
                            type="button"
                            variant="outline"
                            className="mt-6 w-full rounded-lg border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                        >
                            Try Now
                        </Button>
                    </article>
                ))}
            </div>
        </section>
    )
}

export default FeaturedUtilities
