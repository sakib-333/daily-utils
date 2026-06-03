import {
    Calculator,
    Calendar,
    Code,
    FileText,
    Image,
    Link,
    Palette,
    Ruler,
    Timer,
    WholeWord,
    type LucideIcon,
} from "lucide-react"

type Service = {
    name: string
    icon: LucideIcon
}

const services: Service[] = [
    { name: "Age Calculator", icon: Calendar },
    { name: "Markdown Previewer", icon: FileText },
    { name: "Color Picker", icon: Palette },
    { name: "Base64 Converter", icon: Code },
    { name: "Text Case", icon: WholeWord },
    { name: "URL Encoder", icon: Link },
    { name: "Unit Converter", icon: Ruler },
    { name: "Math Tools", icon: Calculator },
    { name: "Stopwatch", icon: Timer },
    { name: "Image Resizer", icon: Image },
]

const ServicesGrid = () => {
    return (
        <section id="services" className="bg-background px-4 py-20 sm:px-6 lg:px-12">
            <div className="mx-auto max-w-7xl">
                <div className="mb-12 text-center">
                    <h2 className="text-3xl font-bold tracking-normal text-foreground sm:text-4xl">
                        Full Tool Suite
                    </h2>
                    <p className="mx-auto mt-2 max-w-2xl text-base leading-7 text-muted-foreground">
                        Browse our comprehensive directory of technical and administrative utilities.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    {services.map(({ name, icon: Icon }) => (
                        <button
                            key={name}
                            type="button"
                            className="flex min-h-16 items-center gap-4 rounded-lg border border-transparent bg-muted/60 p-4 text-left font-semibold text-foreground transition-colors hover:border-border hover:bg-muted focus-visible:border-ring focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20"
                        >
                            <Icon className="size-5 shrink-0 text-primary" aria-hidden="true" />
                            <span className="text-sm sm:text-base">{name}</span>
                        </button>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default ServicesGrid
