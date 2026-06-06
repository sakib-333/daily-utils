import { useEffect, useState } from 'react'
import {
  Braces,
  Calculator,
  Calendar,
  Check,
  ChevronRight,
  Clipboard,
  FileText,
  Flag,
  Pause,
  Play,
  RotateCcw,
  Timer,
  Trash2,
  WholeWord,
  type LucideIcon,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Link, createFileRoute } from '@tanstack/react-router'

type RelatedTool = {
  title: string
  href: string
  icon: LucideIcon
  isActive?: boolean
}

type Lap = {
  id: number
  totalMs: number
  splitMs: number
}

type StopwatchStatus = 'ready' | 'running' | 'paused'

const relatedTools: RelatedTool[] = [
  { title: 'Age Calculator', href: '/age-calculator', icon: Calendar },
  { title: 'Math Tools', href: '/math-tools', icon: Calculator },
  { title: 'JSON Formatter', href: '/json-formater', icon: Braces },
  { title: 'Markdown Previewer', href: '/markdown-previewer', icon: FileText },
  { title: 'Text Case Converter', href: '/text-case-converter', icon: WholeWord },
  { title: 'Stopwatch', href: '/stopwatch', icon: Timer, isActive: true },
]

const statusStyles: Record<
  StopwatchStatus,
  { label: string; badgeClassName: string; dotClassName: string }
> = {
  ready: {
    label: 'Ready',
    badgeClassName: 'bg-muted text-muted-foreground',
    dotClassName: 'bg-muted-foreground',
  },
  running: {
    label: 'Running',
    badgeClassName: 'bg-primary/10 text-primary',
    dotClassName: 'bg-primary animate-pulse',
  },
  paused: {
    label: 'Paused',
    badgeClassName: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    dotClassName: 'bg-amber-500',
  },
}

function formatStopwatchTime(totalMs: number) {
  const milliseconds = Math.floor(totalMs % 1000)
  const totalSeconds = Math.floor(totalMs / 1000)
  const seconds = totalSeconds % 60
  const totalMinutes = Math.floor(totalSeconds / 60)
  const minutes = totalMinutes % 60
  const hours = Math.floor(totalMinutes / 60)

  const pad = (value: number, length = 2) => String(value).padStart(length, '0')

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(milliseconds, 3)}`
  }

  return `${pad(minutes)}:${pad(seconds)}.${pad(milliseconds, 3)}`
}

function formatLapSummary(laps: Lap[]) {
  if (laps.length === 0) {
    return 'No lap times recorded.'
  }

  return laps
    .map(
      ({ id, totalMs, splitMs }) =>
        `Lap ${id}: +${formatStopwatchTime(splitMs)} (Total ${formatStopwatchTime(totalMs)})`,
    )
    .join('\n')
}

export const Route = createFileRoute('/stopwatch')({
  component: RouteComponent,
})

function RouteComponent() {
  const [elapsedMs, setElapsedMs] = useState(0)
  const [displayMs, setDisplayMs] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [startTimestamp, setStartTimestamp] = useState<number | null>(null)
  const [laps, setLaps] = useState<Lap[]>([])
  const [copied, setCopied] = useState(false)

  const status: StopwatchStatus = isRunning ? 'running' : elapsedMs > 0 || laps.length > 0 ? 'paused' : 'ready'
  const statusStyle = statusStyles[status]

  const getCurrentElapsed = () => {
    if (!isRunning || startTimestamp === null) {
      return elapsedMs
    }

    return elapsedMs + Date.now() - startTimestamp
  }

  useEffect(() => {
    if (!isRunning) {
      setDisplayMs(elapsedMs)
      return
    }

    const intervalId = window.setInterval(() => {
      if (startTimestamp === null) return
      setDisplayMs(elapsedMs + Date.now() - startTimestamp)
    }, 10)

    return () => window.clearInterval(intervalId)
  }, [isRunning, elapsedMs, startTimestamp])

  const handleStartPause = () => {
    if (isRunning) {
      setElapsedMs(getCurrentElapsed())
      setIsRunning(false)
      setStartTimestamp(null)
      return
    }

    setStartTimestamp(Date.now())
    setIsRunning(true)
  }

  const handleLap = () => {
    if (!isRunning) return

    const currentElapsed = getCurrentElapsed()
    const lastLapTotal = laps[0]?.totalMs ?? 0

    setLaps((currentLaps) => [
      {
        id: currentLaps.length + 1,
        totalMs: currentElapsed,
        splitMs: currentElapsed - lastLapTotal,
      },
      ...currentLaps,
    ])
  }

  const handleReset = () => {
    setIsRunning(false)
    setElapsedMs(0)
    setDisplayMs(0)
    setStartTimestamp(null)
    setLaps([])
    setCopied(false)
  }

  const copyLaps = async () => {
    const summary = [
      `Elapsed: ${formatStopwatchTime(displayMs)}`,
      formatLapSummary(laps),
    ].join('\n')

    await navigator.clipboard.writeText(summary)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  const fastestLapId =
    laps.length > 1
      ? laps.reduce((fastest, lap) => (lap.splitMs < fastest.splitMs ? lap : fastest)).id
      : null
  const slowestLapId =
    laps.length > 1
      ? laps.reduce((slowest, lap) => (lap.splitMs > slowest.splitMs ? lap : slowest)).id
      : null

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-0">
      <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-2 overflow-x-auto whitespace-nowrap">
        <Link
          to="/"
          className="text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          Home
        </Link>
        <ChevronRight className="size-3 shrink-0 text-muted-foreground" aria-hidden="true" />
        <Link
          to="/services"
          className="text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          Services
        </Link>
        <ChevronRight className="size-3 shrink-0 text-muted-foreground" aria-hidden="true" />
        <span className="text-xs font-bold text-primary">Stopwatch</span>
      </nav>

      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-normal text-foreground sm:text-4xl">
          Stopwatch
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Track elapsed time with lap splits for workouts, tasks, presentations, and focused work sessions.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="min-w-0 flex-1">
          <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
            <div className="flex h-16 flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/70 px-4">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold',
                    statusStyle.badgeClassName,
                  )}
                >
                  <span className={cn('size-2 rounded-full', statusStyle.dotClassName)} aria-hidden="true" />
                  {statusStyle.label}
                </span>
                <span className="text-[10px] font-semibold text-muted-foreground">
                  {laps.length} lap{laps.length === 1 ? '' : 's'}
                </span>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => void copyLaps()}
                  aria-label="Copy stopwatch summary"
                  disabled={displayMs === 0 && laps.length === 0}
                >
                  {copied ? <Check aria-hidden="true" /> : <Clipboard aria-hidden="true" />}
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon-sm"
                  onClick={handleReset}
                  aria-label="Reset stopwatch"
                >
                  <Trash2 aria-hidden="true" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 divide-y divide-border md:grid-cols-2 md:divide-x md:divide-y-0">
              <div className="flex flex-col p-4">
                <div className="mb-4 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Controls
                </div>

                <div className="flex min-h-80 flex-col justify-between gap-6">
                  <div className="rounded-md border border-dashed border-border bg-muted/30 p-6 text-center">
                    <p className="font-mono text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                      {formatStopwatchTime(displayMs)}
                    </p>
                    <p className="mt-3 text-xs text-muted-foreground">
                      Millisecond precision with local browser timing
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    <Button
                      type="button"
                      size="sm"
                      className="gap-1.5 font-bold"
                      onClick={handleStartPause}
                    >
                      {isRunning ? (
                        <>
                          <Pause className="size-3.5" aria-hidden="true" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="size-3.5" aria-hidden="true" />
                          {elapsedMs > 0 ? 'Resume' : 'Start'}
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="gap-1.5 font-bold"
                      onClick={handleLap}
                      disabled={!isRunning}
                    >
                      <Flag className="size-3.5" aria-hidden="true" />
                      Lap
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-1.5 font-bold"
                      onClick={handleReset}
                    >
                      <RotateCcw className="size-3.5" aria-hidden="true" />
                      Reset
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {[
                      ['Elapsed', formatStopwatchTime(displayMs)],
                      ['Laps', String(laps.length)],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-md border border-border bg-background px-3 py-2">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                          {label}
                        </p>
                        <p className="mt-1 font-mono text-xs font-semibold text-foreground">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex min-h-80 flex-col bg-card p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Lap Times
                  </div>
                  {laps.length > 0 ? (
                    <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                      Newest first
                    </span>
                  ) : null}
                </div>

                <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border border-dashed border-border bg-muted/30">
                  {laps.length > 0 ? (
                    <ul className="min-h-0 flex-1 overflow-auto p-2">
                      {laps.map(({ id, totalMs, splitMs }) => (
                        <li
                          key={id}
                          className={cn(
                            'mb-2 rounded-md border border-border bg-background px-3 py-2 last:mb-0',
                            id === fastestLapId && 'border-emerald-500/40 bg-emerald-500/5',
                            id === slowestLapId && 'border-destructive/30 bg-destructive/5',
                          )}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-xs font-semibold text-foreground">Lap {id}</span>
                            <div className="flex items-center gap-2">
                              {id === fastestLapId ? (
                                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                                  Fastest
                                </span>
                              ) : null}
                              {id === slowestLapId ? (
                                <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-semibold text-destructive">
                                  Slowest
                                </span>
                              ) : null}
                            </div>
                          </div>
                          <div className="mt-2 grid grid-cols-2 gap-2">
                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                                Split
                              </p>
                              <p className="mt-0.5 font-mono text-xs font-semibold text-foreground">
                                +{formatStopwatchTime(splitMs)}
                              </p>
                            </div>
                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                                Total
                              </p>
                              <p className="mt-0.5 font-mono text-xs font-semibold text-foreground">
                                {formatStopwatchTime(totalMs)}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
                      <div className="flex size-16 items-center justify-center rounded-full bg-muted">
                        <Timer className="size-7 text-muted-foreground" aria-hidden="true" />
                      </div>
                      <p className="max-w-xs text-sm text-muted-foreground">
                        Start the stopwatch and press Lap to record split times here.
                      </p>
                    </div>
                  )}
                </div>

                <p className="mt-4 text-[11px] leading-5 text-muted-foreground">
                  Timing runs entirely in your browser. Reset clears the elapsed time and all recorded laps.
                </p>
              </div>
            </div>
          </div>
        </div>

        <aside className="w-full shrink-0">
          <div className="sticky top-24 flex flex-col gap-3 rounded-lg bg-muted/70 p-4 shadow-sm">
            <div className="px-1">
              <h2 className="text-sm font-bold text-primary">Related Tools</h2>
              <p className="text-[10px] font-medium text-muted-foreground">Quick access</p>
            </div>

            <nav className="flex flex-col gap-1" aria-label="Related tools">
              {relatedTools.map(({ title, href, icon: Icon, isActive }) => (
                <a
                  key={title}
                  href={href}
                  className={cn(
                    'flex items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-background hover:text-primary',
                  )}
                >
                  <Icon className="size-3.5 shrink-0" aria-hidden="true" />
                  <span>{title}</span>
                </a>
              ))}
            </nav>
          </div>
        </aside>
      </div>
    </section>
  )
}
