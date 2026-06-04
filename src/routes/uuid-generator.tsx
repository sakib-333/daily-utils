import { useState } from 'react'
import {
  Braces,
  Calendar,
  Check,
  ChevronRight,
  Clipboard,
  FileText,
  Fingerprint,
  KeyRound,
  QrCode,
  RefreshCw,
  Sparkles,
  Trash2,
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

type UuidFormat = 'standard' | 'uppercase' | 'compact'

type UuidOptions = {
  count: number
  format: UuidFormat
}

const relatedTools: RelatedTool[] = [
  { title: 'JSON Formatter', href: '/json-formater', icon: Braces },
  { title: 'UUID Generator', href: '/uuid-generator', icon: Fingerprint, isActive: true },
  { title: 'Password Generator', href: '/password-generator', icon: KeyRound },
  { title: 'Age Calculator', href: '/age-calculator', icon: Calendar },
  { title: 'QR Generator', href: '/qr-generator', icon: QrCode },
  { title: 'Markdown Previewer', href: '/markdown-previewer', icon: FileText },
]

const defaultOptions: UuidOptions = {
  count: 1,
  format: 'standard',
}

const formatOptions: { value: UuidFormat; label: string; example: string }[] = [
  { value: 'standard', label: 'Standard', example: '550e8400-e29b-41d4-a716-446655440000' },
  { value: 'uppercase', label: 'Uppercase', example: '550E8400-E29B-41D4-A716-446655440000' },
  { value: 'compact', label: 'No hyphens', example: '550e8400e29b41d4a716446655440000' },
]

function formatUuid(uuid: string, format: UuidFormat) {
  if (format === 'uppercase') {
    return uuid.toUpperCase()
  }

  if (format === 'compact') {
    return uuid.replace(/-/g, '')
  }

  return uuid
}

function generateUuids(options: UuidOptions) {
  return Array.from({ length: options.count }, () => formatUuid(crypto.randomUUID(), options.format))
}

export const Route = createFileRoute('/uuid-generator')({
  component: RouteComponent,
})

function RouteComponent() {
  const [options, setOptions] = useState<UuidOptions>(defaultOptions)
  const [uuids, setUuids] = useState(() => generateUuids(defaultOptions))
  const [copied, setCopied] = useState(false)

  const generateNewUuids = () => {
    setUuids(generateUuids(options))
    setCopied(false)
  }

  const copyToClipboard = async () => {
    if (uuids.length === 0) return

    await navigator.clipboard.writeText(uuids.join('\n'))
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  const resetOptions = () => {
    setOptions(defaultOptions)
    setUuids(generateUuids(defaultOptions))
    setCopied(false)
  }

  const updateOption = <Key extends keyof UuidOptions>(key: Key, value: UuidOptions[Key]) => {
    setOptions((currentOptions) => ({ ...currentOptions, [key]: value }))
    setCopied(false)
  }

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
        <span className="text-xs font-bold text-primary">UUID Generator</span>
      </nav>

      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-normal text-foreground sm:text-4xl">
          UUID Generator
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Generate RFC 4122 version 4 UUIDs instantly for databases, APIs, and application identifiers.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="min-w-0 flex-1">
          <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
            <div className="flex h-16 flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/70 px-4">
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  className="gap-1.5 font-bold"
                  onClick={generateNewUuids}
                >
                  <Sparkles className="size-3.5" aria-hidden="true" />
                  Generate
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="gap-1.5 font-bold"
                  onClick={generateNewUuids}
                >
                  <RefreshCw className="size-3.5" aria-hidden="true" />
                  Regenerate
                </Button>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => void copyToClipboard()}
                  aria-label="Copy UUIDs to clipboard"
                  disabled={uuids.length === 0}
                >
                  {copied ? <Check aria-hidden="true" /> : <Clipboard aria-hidden="true" />}
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon-sm"
                  onClick={resetOptions}
                  aria-label="Reset options"
                >
                  <Trash2 aria-hidden="true" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 divide-y divide-border md:grid-cols-2 md:divide-x md:divide-y-0">
              <div className="flex flex-col p-4">
                <div className="mb-4 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Options
                </div>

                <div className="space-y-5">
                  <div>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <label htmlFor="uuidCount" className="text-xs font-semibold text-foreground">
                        Number of UUIDs
                      </label>
                      <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-xs font-bold text-primary">
                        {options.count}
                      </span>
                    </div>
                    <input
                      id="uuidCount"
                      type="range"
                      min={1}
                      max={20}
                      value={options.count}
                      onChange={(event) => updateOption('count', Number(event.target.value))}
                      className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary"
                    />
                    <div className="mt-1 flex justify-between text-[10px] font-medium text-muted-foreground">
                      <span>1</span>
                      <span>20</span>
                    </div>
                  </div>

                  <fieldset className="space-y-2">
                    <legend className="text-xs font-semibold text-foreground">Output format</legend>
                    <div className="grid grid-cols-1 gap-2">
                      {formatOptions.map(({ value, label, example }) => (
                        <label
                          key={value}
                          className={cn(
                            'cursor-pointer rounded-md border px-3 py-2 transition-colors',
                            options.format === value
                              ? 'border-primary bg-primary/5'
                              : 'border-border bg-background hover:bg-muted/50',
                          )}
                        >
                          <input
                            type="radio"
                            name="uuidFormat"
                            value={value}
                            checked={options.format === value}
                            onChange={() => updateOption('format', value)}
                            className="sr-only"
                          />
                          <span className="block text-xs font-semibold text-foreground">{label}</span>
                          <span className="mt-0.5 block truncate font-mono text-[10px] text-muted-foreground">
                            {example}
                          </span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <div className="rounded-md border border-border bg-muted/30 px-3 py-2">
                    <p className="text-xs font-semibold text-foreground">Version 4 (random)</p>
                    <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
                      Uses cryptographically secure random values via the Web Crypto API.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex min-h-64 flex-col bg-card p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Generated UUID{options.count > 1 ? 's' : ''}
                  </div>
                  {uuids.length > 1 ? (
                    <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                      {uuids.length} items
                    </span>
                  ) : null}
                </div>

                <div className="flex min-h-0 flex-1 flex-col justify-center overflow-auto rounded-md border border-dashed border-border bg-muted/30 p-4">
                  {uuids.length === 1 ? (
                    <p className="break-all font-mono text-lg leading-7 text-foreground sm:text-xl">
                      {uuids[0]}
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {uuids.map((uuid, index) => (
                        <li
                          key={`${uuid}-${index}`}
                          className="break-all rounded-md border border-border bg-background px-3 py-2 font-mono text-xs leading-5 text-foreground"
                        >
                          {uuid}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <p className="mt-4 text-[11px] leading-5 text-muted-foreground">
                  UUIDs are generated locally in your browser. Nothing is sent to a server.
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
