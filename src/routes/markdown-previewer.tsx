import { useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
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
  { title: 'JSON Formatter', href: '/json-formater', icon: Braces },
  { title: 'UUID Generator', href: '/uuid-generator', icon: Fingerprint },
  { title: 'Password Generator', href: '/password-generator', icon: KeyRound },
  { title: 'Age Calculator', href: '/age-calculator', icon: Calendar },
  { title: 'QR Generator', href: '/qr-generator', icon: QrCode },
  { title: 'Markdown Previewer', href: '/markdown-previewer', icon: FileText, isActive: true },
]

const sampleMarkdown = `# Markdown Previewer

Write **bold**, *italic*, and \`inline code\` with ease.

## Features

- Live preview as you type
- GitHub-flavored Markdown support
- Tables, task lists, and blockquotes

### Code block

\`\`\`js
const greeting = 'Hello, world!'
console.log(greeting)
\`\`\`

| Tool | Status |
| --- | --- |
| Preview | Ready |
| Export | Local |

- [x] Headings and lists
- [x] Links and images
- [ ] Custom themes

> Preview updates instantly in your browser.

[Visit Daily Utils](/services)
`

function getMarkdownStats(markdown: string) {
  const trimmedMarkdown = markdown.trim()

  return {
    characters: markdown.length,
    words: trimmedMarkdown ? trimmedMarkdown.split(/\s+/).length : 0,
    lines: markdown ? markdown.split('\n').length : 0,
  }
}

export const Route = createFileRoute('/markdown-previewer')({
  component: RouteComponent,
})

function RouteComponent() {
  const [markdownInput, setMarkdownInput] = useState('')
  const [copied, setCopied] = useState(false)

  const stats = useMemo(() => getMarkdownStats(markdownInput), [markdownInput])

  const loadSampleMarkdown = () => {
    setMarkdownInput(sampleMarkdown)
    setCopied(false)
  }

  const copyMarkdown = async () => {
    if (!markdownInput) return

    await navigator.clipboard.writeText(markdownInput)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  const clearEditor = () => {
    setMarkdownInput('')
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
        <span className="text-xs font-bold text-primary">Markdown Previewer</span>
      </nav>

      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-normal text-foreground sm:text-4xl">
          Markdown Previewer
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Write Markdown on the left and see a live rendered preview on the right with GitHub-flavored syntax support.
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
                  onClick={loadSampleMarkdown}
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
                    onClick={() => void copyMarkdown()}
                    aria-label="Copy markdown"
                    disabled={!markdownInput}
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

            <div className="grid h-150 grid-cols-1 divide-y divide-border md:grid-cols-2 md:divide-x md:divide-y-0">
              <div className="flex min-h-0 flex-col">
                <label
                  htmlFor="markdownInput"
                  className="px-4 pt-3 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground"
                >
                  Markdown Input
                </label>
                <textarea
                  id="markdownInput"
                  className="min-h-0 flex-1 resize-none border-0 bg-transparent p-4 pt-3 font-mono text-xs leading-5 text-foreground outline-none placeholder:text-muted-foreground focus:ring-0"
                  placeholder="Write your Markdown here..."
                  value={markdownInput}
                  onChange={(event) => {
                    setMarkdownInput(event.target.value)
                    setCopied(false)
                  }}
                  spellCheck={false}
                />
              </div>

              <div className="flex min-h-0 flex-col bg-card">
                <div className="flex items-center justify-between gap-3 px-4 pt-3">
                  <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Live Preview
                  </div>
                  <div className="text-[10px] font-semibold text-muted-foreground sm:hidden">
                    {stats.words} words · {stats.characters} chars
                  </div>
                </div>

                <div
                  className={cn(
                    'min-h-0 flex-1 overflow-auto p-4 pt-3 text-sm leading-6 text-foreground',
                    '[&_h1]:mb-4 [&_h1]:text-2xl [&_h1]:font-bold',
                    '[&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:text-xl [&_h2]:font-bold',
                    '[&_h3]:mb-2 [&_h3]:mt-5 [&_h3]:text-lg [&_h3]:font-semibold',
                    '[&_p]:mb-3',
                    '[&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2',
                    '[&_strong]:font-semibold [&_em]:italic',
                    '[&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-xs',
                    '[&_pre]:mb-4 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-muted [&_pre]:p-3',
                    '[&_pre_code]:bg-transparent [&_pre_code]:p-0',
                    '[&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5',
                    '[&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5',
                    '[&_li]:mb-1',
                    '[&_blockquote]:mb-4 [&_blockquote]:border-l-4 [&_blockquote]:border-primary/30 [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground',
                    '[&_hr]:my-6 [&_hr]:border-border',
                    '[&_table]:mb-4 [&_table]:w-full [&_table]:border-collapse [&_table]:text-left',
                    '[&_th]:border [&_th]:border-border [&_th]:bg-muted/70 [&_th]:px-3 [&_th]:py-2 [&_th]:text-xs [&_th]:font-semibold',
                    '[&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2 [&_td]:text-xs',
                    '[&_input]:mr-2',
                  )}
                >
                  {markdownInput ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdownInput}</ReactMarkdown>
                  ) : (
                    <div className="flex h-full min-h-48 flex-col items-center justify-center gap-3 text-center">
                      <div className="flex size-16 items-center justify-center rounded-full bg-muted">
                        <FileText className="size-7 text-muted-foreground" aria-hidden="true" />
                      </div>
                      <p className="max-w-xs text-sm text-muted-foreground">
                        Start writing Markdown or load the sample to see a live preview here.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <p className="border-t border-border px-4 py-3 text-[11px] leading-5 text-muted-foreground">
              Supports headings, lists, links, code blocks, tables, task lists, and blockquotes. Rendering happens locally in your browser.
            </p>
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
