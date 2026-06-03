import { Bolt, HeartHandshake, Shield, Smartphone, type LucideIcon } from "lucide-react"

type PrecisionFeature = {
    title: string
    description: string
    icon: LucideIcon
}

const precisionFeatures: PrecisionFeature[] = [
    {
        title: "Blazing Speed",
        description: "Optimized client-side processing ensures instant results without server lag.",
        icon: Bolt,
    },
    {
        title: "Forever Free",
        description: 'No subscriptions, no "pro" tiers. All features are available to everyone.',
        icon: HeartHandshake,
    },
    {
        title: "Privacy First",
        description:
            "Your data never leaves your browser. We process everything locally for maximum security.",
        icon: Shield,
    },
    {
        title: "Mobile Ready",
        description: "Fully responsive design allows you to use your favorite tools on any device.",
        icon: Smartphone,
    },
]

const BuildPrecision = () => {
    return (
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-12">
            <h2 className="mb-12 text-center text-3xl font-bold tracking-normal text-foreground sm:text-4xl">
                Built for Precision
            </h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {precisionFeatures.map(({ title, description, icon: Icon }) => (
                    <article
                        key={title}
                        className="rounded-2xl border border-border bg-muted/50 p-6 shadow-sm"
                    >
                        <Icon className="mb-5 size-10 text-primary" aria-hidden="true" />
                        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
                    </article>
                ))}
            </div>
        </section>
    )
}

export default BuildPrecision
