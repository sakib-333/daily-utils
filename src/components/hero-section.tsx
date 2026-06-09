import { ArrowRight, Sparkles } from "lucide-react"

import heroImage from "@/assets/hero.png"
import { Button } from "@/components/ui/button"
import VisitorCounter from "@/components/visitor-counter"

const HeroSection = () => {
    return (
        <section className="relative mx-auto flex min-h-153.5 max-w-7xl flex-col items-center justify-center overflow-hidden px-4 py-20 text-center sm:px-6 lg:px-12">
            <div
                className="absolute -right-24 -top-24 -z-10 size-96 rounded-full bg-primary/5 blur-3xl"
                aria-hidden="true"
            />
            <div
                className="absolute -bottom-24 -left-24 -z-10 size-96 rounded-full bg-secondary/50 blur-3xl"
                aria-hidden="true"
            />

            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-primary shadow-sm">
                <Sparkles className="size-4" aria-hidden="true" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                    New tools added weekly
                </span>
            </div>

            <h1 className="mt-6 max-w-4xl text-balance text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
                Free Online Utilities for Everyday Tasks
            </h1>

            <p className="mt-5 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground">
                A streamlined collection of open-source tools designed for developers, students, and
                professionals. No tracking, no fees, just utility.
            </p>

            <div className="mt-10 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
                <Button
                    type="button"
                    size="lg"
                    className="h-12 gap-2 rounded-xl px-7 text-base shadow-sm hover:shadow-md"
                >
                    Explore Tools
                    <ArrowRight className="size-4" aria-hidden="true" />
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="h-12 rounded-xl px-7 text-base"
                >
                    Learn How It Works
                </Button>
            </div>

            <div className="mt-16 w-full max-w-5xl overflow-hidden rounded-2xl border border-border bg-background p-2 shadow-xl">
                <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-muted">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,var(--primary)_0,transparent_34%),linear-gradient(135deg,var(--background),var(--secondary))] opacity-20" />
                    <img
                        src={heroImage}
                        alt="Layered dashboard preview for Daily Utils"
                        className="relative h-[72%] w-auto object-contain drop-shadow-2xl"
                    />
                    <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
                        <VisitorCounter />
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-2 sm:bottom-6 sm:left-6 sm:right-6 sm:gap-3">
                        {["JSON", "Text", "Image"].map((tool) => (
                            <div
                                key={tool}
                                className="rounded-lg border border-border/70 bg-background/80 px-3 py-2 text-left shadow-sm backdrop-blur"
                            >
                                <div className="h-1.5 w-10 rounded-full bg-primary/70" />
                                <p className="mt-2 truncate text-xs font-semibold text-foreground sm:text-sm">
                                    {tool} tools
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HeroSection
