import {
  Braces,
  Calculator,
  Calendar,
  Code,
  FileText,
  Fingerprint,
  Image,
  KeyRound,
  Link,
  Palette,
  QrCode,
  Ruler,
  Timer,
  WholeWord,
  type LucideIcon,
} from 'lucide-react'
import { Link as TanstackLink } from "@tanstack/react-router"
import { Button } from '@/components/ui/button'
import { createFileRoute } from '@tanstack/react-router'

type Service = {
  id: string
  title: string
  description: string
  icon: LucideIcon
  path: string
}

const services: Service[] = [
  {
    id: 'json-formatter',
    title: 'JSON Formatter',
    description: 'Validate and prettify your JSON data instantly with tree view support.',
    icon: Braces,
    path: '/json-formater',
  },
  {
    id: 'password-generator',
    title: 'Password Generator',
    description: 'Generate secure, randomized passwords with custom complexity rules.',
    icon: KeyRound,
    path: '/password-generator',
  },
  {
    id: 'qr-generator',
    title: 'QR Generator',
    description: 'Create high-quality QR codes for URLs, text, or WiFi credentials.',
    icon: QrCode,
    path: '/qr-generator',
  },
  {
    id: 'uuid-generator',
    title: 'UUID Generator',
    description: 'Generate unique version 4 UUIDs for your databases and applications.',
    icon: Fingerprint,
    path: '/uuid-generator',
  },
  {
    id: 'age-calculator',
    title: 'Age Calculator',
    description: 'Calculate exact ages, date differences, and upcoming milestones quickly.',
    icon: Calendar,
    path: '/age-calculator',
  },
  {
    id: 'markdown-previewer',
    title: 'Markdown Previewer',
    description: 'Preview Markdown documents with clean formatting before you publish.',
    icon: FileText,
    path: '/markdown-previewer',
  },
  {
    id: 'color-picker',
    title: 'Color Picker',
    description: 'Pick, compare, and copy color values across HEX, RGB, and HSL formats.',
    icon: Palette,
    path: '/color-picker',
  },
  {
    id: 'base64-converter',
    title: 'Base64 Converter',
    description: 'Encode and decode Base64 strings for APIs, tokens, and data payloads.',
    icon: Code,
    path: '/base64-converter',
  },
  {
    id: 'text-case-converter',
    title: 'Text Case Converter',
    description: 'Convert text into title case, camel case, snake case, uppercase, and more.',
    icon: WholeWord,
    path: '/text-case-converter',
  },
  {
    id: 'url-encoder',
    title: 'URL Encoder',
    description: 'Encode or decode URLs, query strings, and special characters safely.',
    icon: Link,
    path: '/url-encoder',
  },
  {
    id: 'unit-converter',
    title: 'Unit Converter',
    description: 'Convert common length, weight, temperature, and measurement units.',
    icon: Ruler,
    path: '/unit-converter',
  },
  {
    id: 'math-tools',
    title: 'Math Tools',
    description: 'Run quick calculations and solve everyday math tasks from one place.',
    icon: Calculator,
    path: '/math-tools',
  },
  {
    id: 'stopwatch',
    title: 'Stopwatch',
    description: 'Track elapsed time with a simple stopwatch for focused daily tasks.',
    icon: Timer,
    path: '/stopwatch',
  },
  {
    id: 'image-resizer',
    title: 'Image Resizer',
    description: 'Resize images for uploads, profiles, thumbnails, and social media posts.',
    icon: Image,
    path: '/image-resizer',
  },
]

export const Route = createFileRoute('/services')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <section className="px-4 py-10 sm:px-6 lg:px-12">
      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-normal text-foreground sm:text-4xl">
          Services
        </h1>
        <p className="mt-2 max-w-2xl text-base leading-7 text-muted-foreground">
          Browse the full collection of everyday utilities built for quick, practical work.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        {services.map(({ id, title, description, icon: Icon, path }) => (
          <TanstackLink
            key={id}
            to={path}
          >
            <article
              className="group flex h-64 cursor-pointer flex-col rounded-xl border border-border bg-background p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="mb-5 flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="size-6" aria-hidden="true" />
              </div>

              <h2 className="text-xl font-semibold text-foreground">{title}</h2>
              <p className="mt-2 line-clamp-2 flex-1 text-sm leading-6 text-muted-foreground">{description}</p>

              <Button
                type="button"
                variant="outline"
                className="mt-6 w-full rounded-lg border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                Try Now
              </Button>
            </article>
          </TanstackLink>
        ))}
      </div>
    </section>
  )
}
