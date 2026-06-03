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
  Sparkles,
  Trash2,
  WrapText,
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

const relatedTools: RelatedTool[] = [
  { title: 'JSON Formatter', href: '/json-formater', icon: Braces, isActive: true },
  { title: 'UUID Generator', href: '/uuid-generator', icon: Fingerprint },
  { title: 'Password Generator', href: '/password-generator', icon: KeyRound },
  { title: 'Age Calculator', href: '/age-calculator', icon: Calendar },
  { title: 'QR Generator', href: '/qr-generator', icon: QrCode },
  { title: 'Markdown Previewer', href: '/markdown-previewer', icon: FileText },
]

export const Route = createFileRoute('/json-formater')({
  component: RouteComponent,
})

function RouteComponent() {
  const [jsonInput, setJsonInput] = useState('')
  const [jsonOutput, setJsonOutput] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const parseJson = () => {
    try {
      setError('')
      return { value: JSON.parse(jsonInput) }
    } catch (parseError) {
      const message = parseError instanceof Error ? parseError.message : 'Invalid JSON'
      setError(message)
      return null
    }
  }

  const formatJson = () => {
    const parsedJson = parseJson()

    if (parsedJson === null) {
      setJsonOutput('')
      return
    }

    setJsonOutput(JSON.stringify(parsedJson.value, null, 2))
  }

  const minifyJson = () => {
    const parsedJson = parseJson()

    if (parsedJson === null) {
      setJsonOutput('')
      return
    }

    setJsonOutput(JSON.stringify(parsedJson.value))
  }

  const copyToClipboard = async () => {
    const textToCopy = jsonOutput || jsonInput

    if (!textToCopy) return

    await navigator.clipboard.writeText(textToCopy)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  const clearEditors = () => {
    setJsonInput('')
    setJsonOutput('')
    setError('')
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
        <span className="text-xs font-bold text-primary">JSON Formatter</span>
      </nav>

      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-normal text-foreground sm:text-4xl">
          JSON Formatter
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Validate and prettify your JSON data instantly with tree view support.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="min-w-0 flex-1">
          <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
            <div className="flex h-16 flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/70 px-4">
              <div className="flex flex-wrap gap-2">
                <Button type="button" size="sm" className="gap-1.5 font-bold" onClick={formatJson}>
                  <Sparkles className="size-3.5" aria-hidden="true" />
                  Format
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="gap-1.5 font-bold"
                  onClick={minifyJson}
                >
                  <WrapText className="size-3.5" aria-hidden="true" />
                  Minify
                </Button>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={copyToClipboard}
                  aria-label="Copy to clipboard"
                >
                  {copied ? <Check aria-hidden="true" /> : <Clipboard aria-hidden="true" />}
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon-sm"
                  onClick={clearEditors}
                  aria-label="Clear all"
                >
                  <Trash2 aria-hidden="true" />
                </Button>
              </div>
            </div>

            {error ? (
              <p className="border-b border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </p>
            ) : null}

            <div className="grid h-150 grid-cols-1 divide-y divide-border md:grid-cols-2 md:divide-x md:divide-y-0">
              <div className="flex min-h-0 flex-col">
                <label
                  htmlFor="jsonInput"
                  className="px-4 pt-3 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground"
                >
                  Input
                </label>
                <textarea
                  id="jsonInput"
                  className="min-h-0 flex-1 resize-none border-0 bg-transparent p-4 pt-3 font-mono text-xs leading-5 text-foreground outline-none placeholder:text-muted-foreground focus:ring-0"
                  placeholder="Paste your raw JSON here..."
                  value={jsonInput}
                  onChange={(event) => setJsonInput(event.target.value)}
                  spellCheck={false}
                />
              </div>

              <div className="flex min-h-0 flex-col bg-card">
                <div className="px-4 pt-3 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Formatted Output
                </div>
                <pre className="min-h-0 flex-1 overflow-auto whitespace-pre-wrap wrap-break-word p-4 pt-3 font-mono text-xs leading-5 text-foreground">{jsonOutput}</pre>
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
                      : 'text-muted-foreground hover:bg-background hover:text-primary'
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
