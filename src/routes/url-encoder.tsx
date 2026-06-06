import { useMemo, useState } from 'react'
import {
  Braces,
  Check,
  ChevronRight,
  Clipboard,
  Code,
  FileText,
  KeyRound,
  Link as LinkIcon,
  RotateCcw,
  Sparkles,
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

type TransformMode = 'encode' | 'decode'
type TransformScope = 'component' | 'uri'

type QueryParameter = {
  key: string
  value: string
}

const relatedTools: RelatedTool[] = [
  { title: 'JSON Formatter', href: '/json-formater', icon: Braces },
  { title: 'Markdown Previewer', href: '/markdown-previewer', icon: FileText },
  { title: 'Base64 Converter', href: '/base64-converter', icon: Code },
  { title: 'Text Case Converter', href: '/text-case-converter', icon: WholeWord },
  { title: 'Password Generator', href: '/password-generator', icon: KeyRound },
  { title: 'URL Encoder', href: '/url-encoder', icon: LinkIcon, isActive: true },
]

const sampleUrl =
  'https://example.com/search?q=daily utils & tools&redirect=/account/settings?tab=billing&coupon=SAVE 20%'

const transformOptions: { value: TransformScope; label: string; description: string }[] = [
  {
    value: 'component',
    label: 'Component',
    description: 'Encode values for query params, slugs, and form fields.',
  },
  {
    value: 'uri',
    label: 'Full URL',
    description: 'Preserve URL separators such as /, ?, &, and =.',
  },
]

function transformUrl(value: string, mode: TransformMode, scope: TransformScope) {
  if (!value) {
    return { result: '', error: '' }
  }

  try {
    const transformer =
      mode === 'encode'
        ? scope === 'component'
          ? encodeURIComponent
          : encodeURI
        : scope === 'component'
          ? decodeURIComponent
          : decodeURI

    return { result: transformer(value), error: '' }
  } catch {
    return {
      result: '',
      error:
        mode === 'decode'
          ? 'This value contains an invalid percent-encoded sequence.'
          : 'This value could not be transformed.',
    }
  }
}

function getUrlStats(value: string) {
  const encodedCharacters = value.match(/%[0-9a-fA-F]{2}/g)?.length ?? 0

  return {
    characters: value.length,
    encodedCharacters,
    spaces: value.match(/\s/g)?.length ?? 0,
  }
}

function extractQueryParameters(value: string): QueryParameter[] {
  if (!value.trim()) {
    return []
  }

  const queryText = (() => {
    try {
      return new URL(value).search
    } catch {
      const questionMarkIndex = value.indexOf('?')

      if (questionMarkIndex === -1) {
        return value.startsWith('?') ? value : ''
      }

      return value.slice(questionMarkIndex)
    }
  })()

  const trimmedQuery = queryText.replace(/^\?/, '').split('#')[0]

  if (!trimmedQuery) {
    return []
  }

  try {
    return Array.from(new URLSearchParams(trimmedQuery).entries()).map(([key, parameterValue]) => ({
      key,
      value: parameterValue,
    }))
  } catch {
    return []
  }
}

export const Route = createFileRoute('/url-encoder')({
  component: RouteComponent,
})

function RouteComponent() {
  const [inputUrl, setInputUrl] = useState('')
  const [mode, setMode] = useState<TransformMode>('encode')
  const [scope, setScope] = useState<TransformScope>('component')
  const [copied, setCopied] = useState(false)

  const transformedUrl = useMemo(
    () => transformUrl(inputUrl, mode, scope),
    [inputUrl, mode, scope],
  )
  const stats = useMemo(() => getUrlStats(inputUrl), [inputUrl])
  const queryParameters = useMemo(() => extractQueryParameters(inputUrl), [inputUrl])
  const activeScope = transformOptions.find(({ value }) => value === scope)

  const loadSample = () => {
    setInputUrl(sampleUrl)
    setMode('encode')
    setScope('component')
    setCopied(false)
  }

  const swapResultToInput = () => {
    if (!transformedUrl.result) return

    setInputUrl(transformedUrl.result)
    setMode((currentMode) => (currentMode === 'encode' ? 'decode' : 'encode'))
    setCopied(false)
  }

  const copyOutput = async () => {
    if (!transformedUrl.result) return

    await navigator.clipboard.writeText(transformedUrl.result)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  const clearEditor = () => {
    setInputUrl('')
    setMode('encode')
    setScope('component')
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
        <span className="text-xs font-bold text-primary">URL Encoder</span>
      </nav>

      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-normal text-foreground sm:text-4xl">
          URL Encoder
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Encode and decode URLs, query strings, and special characters for browser-safe links and API requests.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="min-w-0 flex-1">
          <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
            <div className="flex min-h-16 flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/70 px-4 py-3">
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  className="gap-1.5 font-bold"
                  onClick={loadSample}
                >
                  <Sparkles className="size-3.5" aria-hidden="true" />
                  Load Sample
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="gap-1.5 font-bold"
                  onClick={swapResultToInput}
                  disabled={!transformedUrl.result}
                >
                  <RotateCcw className="size-3.5" aria-hidden="true" />
                  Swap
                </Button>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden text-[10px] font-semibold text-muted-foreground sm:block">
                  {stats.characters} chars / {stats.encodedCharacters} encoded / {stats.spaces} spaces
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => void copyOutput()}
                    aria-label="Copy transformed URL"
                    disabled={!transformedUrl.result}
                  >
                    {copied ? <Check aria-hidden="true" /> : <Clipboard aria-hidden="true" />}
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon-sm"
                    onClick={clearEditor}
                    aria-label="Clear all"
                  >
                    <Trash2 aria-hidden="true" />
                  </Button>
                </div>
              </div>
            </div>

            {transformedUrl.error ? (
              <p className="border-b border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {transformedUrl.error}
              </p>
            ) : null}

            <div className="grid grid-cols-1 divide-y divide-border md:grid-cols-2 md:divide-x md:divide-y-0">
              <div className="flex min-h-0 flex-col">
                <div className="flex flex-wrap items-center justify-between gap-3 px-4 pt-3">
                  <label
                    htmlFor="urlInput"
                    className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground"
                  >
                    Input
                  </label>

                  <div className="grid grid-cols-2 rounded-md border border-border bg-background p-1">
                    {(['encode', 'decode'] as const).map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={cn(
                          'h-7 rounded px-3 text-xs font-bold capitalize transition-colors',
                          mode === option
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                        )}
                        onClick={() => {
                          setMode(option)
                          setCopied(false)
                        }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  id="urlInput"
                  className="min-h-56 flex-1 resize-none border-0 bg-transparent p-4 pt-3 font-mono text-xs leading-5 text-foreground outline-none placeholder:text-muted-foreground focus:ring-0 md:min-h-0"
                  placeholder="Paste a URL, query string, or text value..."
                  value={inputUrl}
                  onChange={(event) => {
                    setInputUrl(event.target.value)
                    setCopied(false)
                  }}
                  spellCheck={false}
                />

                <div className="space-y-3 border-t border-border p-4">
                  <div className="text-xs font-semibold text-foreground">Encoding scope</div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {transformOptions.map(({ value, label, description }) => (
                      <label
                        key={value}
                        className={cn(
                          'cursor-pointer rounded-md border px-3 py-2 transition-colors',
                          scope === value
                            ? 'border-primary bg-primary/5'
                            : 'border-border bg-background hover:bg-muted/50',
                        )}
                      >
                        <input
                          type="radio"
                          name="transformScope"
                          value={value}
                          checked={scope === value}
                          onChange={() => {
                            setScope(value)
                            setCopied(false)
                          }}
                          className="sr-only"
                        />
                        <span className="block text-xs font-semibold text-foreground">{label}</span>
                        <span className="mt-0.5 block text-[10px] leading-4 text-muted-foreground">
                          {description}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex min-h-96 flex-col bg-card">
                <div className="flex items-center justify-between gap-3 px-4 pt-3">
                  <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Output
                  </div>
                  {activeScope ? (
                    <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                      {mode === 'encode' ? 'Encoded' : 'Decoded'} / {activeScope.label}
                    </span>
                  ) : null}
                </div>

                <div className="flex min-h-0 flex-1 flex-col p-4 pt-3">
                  {transformedUrl.result ? (
                    <pre className="min-h-0 flex-1 overflow-auto whitespace-pre-wrap wrap-break-word rounded-md border border-dashed border-border bg-muted/30 p-4 font-mono text-sm leading-6 text-foreground">
                      {transformedUrl.result}
                    </pre>
                  ) : (
                    <div className="flex min-h-48 flex-1 flex-col items-center justify-center gap-3 rounded-md border border-dashed border-border bg-muted/30 p-4 text-center">
                      <div className="flex size-16 items-center justify-center rounded-full bg-muted">
                        <LinkIcon className="size-7 text-muted-foreground" aria-hidden="true" />
                      </div>
                      <p className="max-w-xs text-sm text-muted-foreground">
                        Add a value and choose an encoding scope to preview the transformed result.
                      </p>
                    </div>
                  )}
                </div>

                <div className="border-t border-border p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Query Parameters
                    </div>
                    <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                      {queryParameters.length}
                    </span>
                  </div>

                  {queryParameters.length > 0 ? (
                    <div className="max-h-44 overflow-auto rounded-md border border-border">
                      {queryParameters.map((parameter, index) => (
                        <div
                          key={`${parameter.key}-${index}`}
                          className="grid grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-3 border-b border-border bg-background px-3 py-2 last:border-b-0"
                        >
                          <span className="truncate font-mono text-xs font-semibold text-foreground">
                            {parameter.key || '(empty key)'}
                          </span>
                          <span className="truncate font-mono text-xs text-muted-foreground">
                            {parameter.value || '(empty value)'}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="rounded-md border border-dashed border-border bg-muted/30 px-3 py-3 text-xs leading-5 text-muted-foreground">
                      Query keys and values appear here when the input includes a search string.
                    </p>
                  )}
                </div>

                <p className="px-4 pb-4 text-[11px] leading-5 text-muted-foreground">
                  URL transformations run locally in your browser, so pasted links and tokens stay on this device.
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
