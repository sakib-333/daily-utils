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

type CaseType =
  | 'uppercase'
  | 'lowercase'
  | 'title'
  | 'sentence'
  | 'camel'
  | 'pascal'
  | 'snake'
  | 'kebab'
  | 'constant'
  | 'dot'

const relatedTools: RelatedTool[] = [
  { title: 'JSON Formatter', href: '/json-formater', icon: Braces },
  { title: 'Markdown Previewer', href: '/markdown-previewer', icon: FileText },
  { title: 'Base64 Converter', href: '/base64-converter', icon: Code },
  { title: 'URL Encoder', href: '/url-encoder', icon: LinkIcon },
  { title: 'Password Generator', href: '/password-generator', icon: KeyRound },
  { title: 'Text Case Converter', href: '/text-case-converter', icon: WholeWord, isActive: true },
]

const sampleText = 'Hello world from daily utils'

const caseTypes: { value: CaseType; label: string; example: string }[] = [
  { value: 'uppercase', label: 'UPPERCASE', example: 'HELLO WORLD' },
  { value: 'lowercase', label: 'lowercase', example: 'hello world' },
  { value: 'title', label: 'Title Case', example: 'Hello World' },
  { value: 'sentence', label: 'Sentence case', example: 'Hello world. Another sentence.' },
  { value: 'camel', label: 'camelCase', example: 'helloWorld' },
  { value: 'pascal', label: 'PascalCase', example: 'HelloWorld' },
  { value: 'snake', label: 'snake_case', example: 'hello_world' },
  { value: 'kebab', label: 'kebab-case', example: 'hello-world' },
  { value: 'constant', label: 'CONSTANT_CASE', example: 'HELLO_WORLD' },
  { value: 'dot', label: 'dot.case', example: 'hello.world' },
]

function extractWords(text: string) {
  return text.match(/[A-Za-z0-9]+/g) ?? []
}

function toTitleCase(text: string) {
  return text.replace(/\b\w+/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
}

function toSentenceCase(text: string) {
  const lowercasedText = text.toLowerCase()
  return lowercasedText.replace(/(^\s*[a-z]|[.!?]\s+[a-z])/g, (match) => match.toUpperCase())
}

function toCamelCase(text: string) {
  const words = extractWords(text)

  if (words.length === 0) {
    return ''
  }

  return words
    .map((word, index) =>
      index === 0
        ? word.toLowerCase()
        : `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`,
    )
    .join('')
}

function toPascalCase(text: string) {
  return extractWords(text)
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`)
    .join('')
}

function toSnakeCase(text: string) {
  return extractWords(text).map((word) => word.toLowerCase()).join('_')
}

function toKebabCase(text: string) {
  return extractWords(text).map((word) => word.toLowerCase()).join('-')
}

function toConstantCase(text: string) {
  return toSnakeCase(text).toUpperCase()
}

function toDotCase(text: string) {
  return extractWords(text).map((word) => word.toLowerCase()).join('.')
}

function convertTextCase(text: string, caseType: CaseType) {
  switch (caseType) {
    case 'uppercase':
      return text.toUpperCase()
    case 'lowercase':
      return text.toLowerCase()
    case 'title':
      return toTitleCase(text)
    case 'sentence':
      return toSentenceCase(text)
    case 'camel':
      return toCamelCase(text)
    case 'pascal':
      return toPascalCase(text)
    case 'snake':
      return toSnakeCase(text)
    case 'kebab':
      return toKebabCase(text)
    case 'constant':
      return toConstantCase(text)
    case 'dot':
      return toDotCase(text)
    default:
      return text
  }
}

function getTextStats(text: string) {
  const trimmedText = text.trim()

  return {
    characters: text.length,
    words: trimmedText ? trimmedText.split(/\s+/).length : 0,
    lines: text ? text.split('\n').length : 0,
  }
}

export const Route = createFileRoute('/text-case-converter')({
  component: RouteComponent,
})

function RouteComponent() {
  const [inputText, setInputText] = useState('')
  const [selectedCase, setSelectedCase] = useState<CaseType>('camel')
  const [copied, setCopied] = useState(false)

  const convertedText = useMemo(
    () => convertTextCase(inputText, selectedCase),
    [inputText, selectedCase],
  )
  const stats = useMemo(() => getTextStats(inputText), [inputText])
  const activeCase = caseTypes.find(({ value }) => value === selectedCase)

  const loadSampleText = () => {
    setInputText(sampleText)
    setCopied(false)
  }

  const copyConvertedText = async () => {
    if (!convertedText) return

    await navigator.clipboard.writeText(convertedText)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  const clearEditor = () => {
    setInputText('')
    setSelectedCase('camel')
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
        <span className="text-xs font-bold text-primary">Text Case Converter</span>
      </nav>

      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-normal text-foreground sm:text-4xl">
          Text Case Converter
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Convert text into uppercase, camelCase, snake_case, kebab-case, and other common naming formats instantly.
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
                  onClick={loadSampleText}
                >
                  <Sparkles className="size-3.5" aria-hidden="true" />
                  Load Sample
                </Button>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden text-[10px] font-semibold text-muted-foreground sm:block">
                  {stats.words} words · {stats.characters} chars · {stats.lines} lines
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => void copyConvertedText()}
                    aria-label="Copy converted text"
                    disabled={!convertedText}
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

            <div className="grid grid-cols-1 divide-y divide-border md:grid-cols-2 md:divide-x md:divide-y-0">
              <div className="flex min-h-0 flex-col">
                <label
                  htmlFor="textInput"
                  className="px-4 pt-3 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground"
                >
                  Input Text
                </label>
                <textarea
                  id="textInput"
                  className="min-h-40 flex-1 resize-none border-0 bg-transparent p-4 pt-3 font-mono text-xs leading-5 text-foreground outline-none placeholder:text-muted-foreground focus:ring-0 md:min-h-0"
                  placeholder="Paste or type the text you want to convert..."
                  value={inputText}
                  onChange={(event) => {
                    setInputText(event.target.value)
                    setCopied(false)
                  }}
                  spellCheck={false}
                />

                <div className="space-y-3 border-t border-border p-4">
                  <div className="text-xs font-semibold text-foreground">Case format</div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {caseTypes.map(({ value, label, example }) => (
                      <label
                        key={value}
                        className={cn(
                          'cursor-pointer rounded-md border px-3 py-2 transition-colors',
                          selectedCase === value
                            ? 'border-primary bg-primary/5'
                            : 'border-border bg-background hover:bg-muted/50',
                        )}
                      >
                        <input
                          type="radio"
                          name="caseType"
                          value={value}
                          checked={selectedCase === value}
                          onChange={() => {
                            setSelectedCase(value)
                            setCopied(false)
                          }}
                          className="sr-only"
                        />
                        <span className="block text-xs font-semibold text-foreground">{label}</span>
                        <span className="mt-0.5 block truncate font-mono text-[10px] text-muted-foreground">
                          {example}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex min-h-80 flex-col bg-card">
                <div className="flex items-center justify-between gap-3 px-4 pt-3">
                  <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Converted Output
                  </div>
                  {activeCase ? (
                    <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                      {activeCase.label}
                    </span>
                  ) : null}
                </div>

                <div className="flex min-h-0 flex-1 flex-col p-4 pt-3">
                  {convertedText ? (
                    <pre className="min-h-0 flex-1 overflow-auto whitespace-pre-wrap wrap-break-word rounded-md border border-dashed border-border bg-muted/30 p-4 font-mono text-sm leading-6 text-foreground">
                      {convertedText}
                    </pre>
                  ) : (
                    <div className="flex min-h-48 flex-1 flex-col items-center justify-center gap-3 rounded-md border border-dashed border-border bg-muted/30 p-4 text-center">
                      <div className="flex size-16 items-center justify-center rounded-full bg-muted">
                        <WholeWord className="size-7 text-muted-foreground" aria-hidden="true" />
                      </div>
                      <p className="max-w-xs text-sm text-muted-foreground">
                        Enter text and choose a case format to see the converted result here.
                      </p>
                    </div>
                  )}
                </div>

                <p className="px-4 pb-4 text-[11px] leading-5 text-muted-foreground">
                  Conversions run locally in your browser and update instantly as you edit the input.
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
