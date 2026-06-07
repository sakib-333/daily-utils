import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Code2,
  Gauge,
  HeartHandshake,
  Layers3,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  Users,
  Wand2,
  type LucideIcon,
} from 'lucide-react'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Link, createFileRoute } from '@tanstack/react-router'

type Principle = {
  title: string
  description: string
  icon: LucideIcon
}

type Audience = {
  title: string
  description: string
}

type Metric = {
  value: string
  label: string
}

const principles: Principle[] = [
  {
    title: 'Fast by default',
    description: 'Every tool is designed to open quickly, respond instantly, and stay focused on the task in front of you.',
    icon: Gauge,
  },
  {
    title: 'Private workflows',
    description: 'Daily utilities should feel safe to use with real work. We favor browser-side processing whenever possible.',
    icon: LockKeyhole,
  },
  {
    title: 'Practical accuracy',
    description: 'Outputs should be clear, predictable, and easy to verify, whether you are formatting JSON or generating IDs.',
    icon: ShieldCheck,
  },
  {
    title: 'No unnecessary friction',
    description: 'The experience avoids paywalls, account gates, and distracting setup so useful work can start immediately.',
    icon: HeartHandshake,
  },
]

const audiences: Audience[] = [
  {
    title: 'Developers',
    description: 'Format data, encode URLs, generate secure values, inspect text, and move through everyday engineering tasks faster.',
  },
  {
    title: 'Students',
    description: 'Use lightweight calculators, converters, writing helpers, and study utilities without installing extra software.',
  },
  {
    title: 'Professionals',
    description: 'Handle quick operations for documents, links, images, dates, measurements, and routine office workflows.',
  },
]

const metrics: Metric[] = [
  { value: '10+', label: 'Utility categories' },
  { value: '24/7', label: 'Browser access' },
  { value: '0', label: 'Required accounts' },
]

const commitments = [
  'Keep tools simple enough for first-time users and dependable enough for repeat work.',
  'Improve based on real usage, support requests, and practical feature suggestions.',
  'Prefer transparent behavior over hidden automation that is hard to inspect or trust.',
]

export const Route = createFileRoute('/about')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <section className="px-4 py-10 sm:px-6 lg:px-12">
      <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-2 overflow-x-auto whitespace-nowrap">
        <Link
          to="/"
          className="text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          Home
        </Link>
        <ChevronRight className="size-3 shrink-0 text-muted-foreground" aria-hidden="true" />
        <span className="text-xs font-bold text-primary">About</span>
      </nav>

      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-end">
          <header>
            <div className="mb-4 inline-flex items-center gap-2 rounded-md border border-border bg-muted/60 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="size-3.5" aria-hidden="true" />
              Built for everyday productivity
            </div>
            <h1 className="max-w-4xl text-3xl font-bold tracking-normal text-foreground sm:text-4xl lg:text-5xl">
              About Daily Utils
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Daily Utils is a focused collection of free online tools for the small but important tasks
              that show up throughout the day. It helps developers, students, and professionals format,
              convert, generate, calculate, and check information without leaving the browser.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/services"
                className={cn(buttonVariants({ size: 'lg' }), 'h-12 gap-2 rounded-lg px-6 font-bold')}
              >
                Explore Tools
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                to="/contact"
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'lg' }),
                  'h-12 rounded-lg px-6 font-bold',
                )}
              >
                Suggest a Tool
              </Link>
            </div>
          </header>

          <aside className="rounded-lg border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Layers3 className="size-5" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-foreground">What we build</h2>
                <p className="text-sm text-muted-foreground">Simple tools for practical work</p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3">
              {metrics.map(({ value, label }) => (
                <div key={label} className="rounded-md border border-border bg-background p-3">
                  <div className="text-xl font-bold text-primary">{value}</div>
                  <div className="mt-1 text-xs leading-5 text-muted-foreground">{label}</div>
                </div>
              ))}
            </div>
          </aside>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-[24rem_minmax(0,1fr)]">
          <section className="rounded-lg border border-border bg-muted/60 p-6">
            <div className="mb-5 flex size-12 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Wand2 className="size-6" aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Our mission</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              We believe everyday utilities should be quick, trustworthy, and available to everyone. Daily
              Utils exists to remove the repeated friction from common digital tasks so you can get back to
              the work that actually needs your attention.
            </p>
            <div className="mt-6 space-y-3">
              {commitments.map((commitment) => (
                <div key={commitment} className="flex gap-2 text-sm leading-6 text-muted-foreground">
                  <CheckCircle2 className="mt-1 size-4 shrink-0 text-primary" aria-hidden="true" />
                  <span>{commitment}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-normal text-foreground">Product principles</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Every feature is shaped around clarity, speed, privacy, and the kind of reliability people expect from a daily workspace.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {principles.map(({ title, description, icon: Icon }) => (
                <article key={title} className="rounded-lg border border-border bg-card p-5 shadow-sm">
                  <div className="mb-4 flex size-11 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon className="size-5" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
                </article>
              ))}
            </div>
          </section>
        </div>

        <section className="mt-14">
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-normal text-foreground">Who Daily Utils is for</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                The toolset is intentionally broad because useful work rarely fits into one role or category.
              </p>
            </div>
            <Users className="hidden size-8 text-primary md:block" aria-hidden="true" />
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {audiences.map(({ title, description }) => (
              <article key={title} className="rounded-lg border border-border bg-card p-5 shadow-sm">
                <div className="mb-4 flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Code2 className="size-5" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold text-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Help shape the next utility</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Daily Utils grows around practical problems. If a tool would save you time every week,
                share the idea and we will consider it for the roadmap.
              </p>
            </div>
            <Link
              to="/contact"
              className={cn(buttonVariants(), 'h-11 gap-2 rounded-lg font-bold')}
            >
              Contact Us
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </div>
    </section>
  )
}
