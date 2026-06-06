import { useMemo, useState, type ChangeEvent } from 'react'
import {
  Braces,
  Check,
  ChevronRight,
  Clipboard,
  Code,
  Download,
  FileText,
  Image as ImageIcon,
  KeyRound,
  Link as LinkIcon,
  Sparkles,
  Trash2,
  Upload,
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

type ConvertMode = 'encode' | 'decode'
type InputSource = 'text' | 'image'

type UploadedAsset = {
  name: string
  type: string
  size: number
  dataUrl: string
  base64: string
}

const relatedTools: RelatedTool[] = [
  { title: 'JSON Formatter', href: '/json-formater', icon: Braces },
  { title: 'Markdown Previewer', href: '/markdown-previewer', icon: FileText },
  { title: 'URL Encoder', href: '/url-encoder', icon: LinkIcon },
  { title: 'Text Case Converter', href: '/text-case-converter', icon: WholeWord },
  { title: 'Password Generator', href: '/password-generator', icon: KeyRound },
  { title: 'Base64 Converter', href: '/base64-converter', icon: Code, isActive: true },
]

const sampleText = 'Daily Utils turns everyday developer tasks into fast, focused browser tools.'

function encodeBase64(value: string) {
  return btoa(
    encodeURIComponent(value).replace(/%([0-9A-F]{2})/g, (_, byte: string) =>
      String.fromCharCode(Number.parseInt(byte, 16)),
    ),
  )
}

function decodeBase64(value: string) {
  const binary = atob(value.trim())
  const bytes = Array.from(binary, (character) =>
    `%${character.charCodeAt(0).toString(16).padStart(2, '0')}`,
  ).join('')

  return decodeURIComponent(bytes)
}

function transformBase64(value: string, mode: ConvertMode) {
  if (!value) {
    return { result: '', error: '' }
  }

  try {
    return {
      result: mode === 'encode' ? encodeBase64(value) : decodeBase64(value),
      error: '',
    }
  } catch {
    return {
      result: '',
      error:
        mode === 'decode'
          ? 'This input is not valid Base64 text, or it contains bytes that cannot be decoded as UTF-8.'
          : 'This text could not be converted to Base64.',
    }
  }
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`
  }

  const units = ['KB', 'MB', 'GB']
  let size = bytes / 1024
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex += 1
  }

  return `${size.toFixed(size >= 10 ? 0 : 1)} ${units[unitIndex]}`
}

function getTextStats(value: string) {
  return {
    characters: value.length,
    lines: value ? value.split('\n').length : 0,
    bytes: new Blob([value]).size,
  }
}

function downloadText(filename: string, content: string, type = 'text/plain') {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')

  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

export const Route = createFileRoute('/base64-converter')({
  component: RouteComponent,
})

function RouteComponent() {
  const [inputText, setInputText] = useState('')
  const [mode, setMode] = useState<ConvertMode>('encode')
  const [source, setSource] = useState<InputSource>('text')
  const [uploadedAsset, setUploadedAsset] = useState<UploadedAsset | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [copied, setCopied] = useState(false)

  const transformedText = useMemo(() => transformBase64(inputText, mode), [inputText, mode])
  const textStats = useMemo(() => getTextStats(inputText), [inputText])
  const outputValue = source === 'image' ? (uploadedAsset?.dataUrl ?? '') : transformedText.result
  const rawBase64 = source === 'image' ? (uploadedAsset?.base64 ?? '') : transformedText.result

  const loadSample = () => {
    setSource('text')
    setMode('encode')
    setInputText(sampleText)
    setUploadedAsset(null)
    setErrorMessage('')
    setCopied(false)
  }

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
      setUploadedAsset(null)
      setErrorMessage('Please upload a valid image file.')
      event.target.value = ''
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      const dataUrl = String(reader.result ?? '')
      const [, base64 = ''] = dataUrl.split(',')

      setSource('image')
      setUploadedAsset({
        name: file.name,
        type: file.type,
        size: file.size,
        dataUrl,
        base64,
      })
      setErrorMessage('')
      setCopied(false)
      event.target.value = ''
    }

    reader.onerror = () => {
      setUploadedAsset(null)
      setErrorMessage('The image could not be read. Please try another file.')
      event.target.value = ''
    }

    reader.readAsDataURL(file)
  }

  const copyOutput = async () => {
    if (!outputValue) return

    await navigator.clipboard.writeText(outputValue)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  const downloadOutput = () => {
    if (!outputValue) return

    const filename = source === 'image' ? `${uploadedAsset?.name ?? 'image'}.base64.txt` : 'base64-output.txt'
    downloadText(filename, outputValue)
  }

  const clearConverter = () => {
    setInputText('')
    setMode('encode')
    setSource('text')
    setUploadedAsset(null)
    setErrorMessage('')
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
        <span className="text-xs font-bold text-primary">Base64 Converter</span>
      </nav>

      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-normal text-foreground sm:text-4xl">
          Base64 Converter
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Encode and decode Base64 text, or upload an image to generate a browser-ready Base64 data URL.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="min-w-0 flex-1">
          <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
            <div className="flex min-h-16 flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/70 px-4 py-3">
              <div className="flex flex-wrap gap-2">
                <Button type="button" size="sm" className="gap-1.5 font-bold" onClick={loadSample}>
                  <Sparkles className="size-3.5" aria-hidden="true" />
                  Load Sample
                </Button>
                <label className="inline-flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-md bg-secondary px-2.5 text-sm font-bold text-secondary-foreground transition-colors hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)]">
                  <Upload className="size-3.5" aria-hidden="true" />
                  Upload Image
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="sr-only" />
                </label>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden text-[10px] font-semibold text-muted-foreground sm:block">
                  {source === 'image' && uploadedAsset
                    ? `${uploadedAsset.type} / ${formatFileSize(uploadedAsset.size)}`
                    : `${textStats.characters} chars / ${formatFileSize(textStats.bytes)} / ${textStats.lines} lines`}
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => void copyOutput()}
                    aria-label="Copy Base64 output"
                    disabled={!outputValue}
                  >
                    {copied ? <Check aria-hidden="true" /> : <Clipboard aria-hidden="true" />}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={downloadOutput}
                    aria-label="Download Base64 output"
                    disabled={!outputValue}
                  >
                    <Download aria-hidden="true" />
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon-sm"
                    onClick={clearConverter}
                    aria-label="Clear converter"
                  >
                    <Trash2 aria-hidden="true" />
                  </Button>
                </div>
              </div>
            </div>

            {errorMessage || transformedText.error ? (
              <p className="border-b border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {errorMessage || transformedText.error}
              </p>
            ) : null}

            <div className="grid grid-cols-1 divide-y divide-border md:grid-cols-2 md:divide-x md:divide-y-0">
              <div className="flex min-h-0 flex-col">
                <div className="flex flex-wrap items-center justify-between gap-3 px-4 pt-3">
                  <div className="grid grid-cols-2 rounded-md border border-border bg-background p-1">
                    {(['text', 'image'] as const).map((option) => (
                      <button
                        key={option}
                        type="button"
                        className={cn(
                          'h-7 rounded px-3 text-xs font-bold capitalize transition-colors',
                          source === option
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                        )}
                        onClick={() => {
                          setSource(option)
                          setErrorMessage('')
                          setCopied(false)
                        }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>

                  {source === 'text' ? (
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
                  ) : null}
                </div>

                {source === 'text' ? (
                  <>
                    <label
                      htmlFor="base64Input"
                      className="px-4 pt-3 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground"
                    >
                      {mode === 'encode' ? 'Plain Text' : 'Base64 Input'}
                    </label>
                    <textarea
                      id="base64Input"
                      className="min-h-72 flex-1 resize-none border-0 bg-transparent p-4 pt-3 font-mono text-xs leading-5 text-foreground outline-none placeholder:text-muted-foreground focus:ring-0 md:min-h-0"
                      placeholder={
                        mode === 'encode'
                          ? 'Paste or type text to encode...'
                          : 'Paste Base64 text to decode...'
                      }
                      value={inputText}
                      onChange={(event) => {
                        setInputText(event.target.value)
                        setErrorMessage('')
                        setCopied(false)
                      }}
                      spellCheck={false}
                    />
                  </>
                ) : (
                  <div className="flex min-h-96 flex-1 flex-col p-4 pt-3">
                    <div className="mb-3 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Image Upload
                    </div>
                    {uploadedAsset ? (
                      <div className="flex flex-1 flex-col gap-4">
                        <div className="flex min-h-64 items-center justify-center rounded-md border border-dashed border-border bg-muted/30 p-4">
                          <img
                            src={uploadedAsset.dataUrl}
                            alt={uploadedAsset.name}
                            className="max-h-80 max-w-full rounded-md object-contain shadow-sm"
                          />
                        </div>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                          {[
                            ['File', uploadedAsset.name],
                            ['Type', uploadedAsset.type],
                            ['Size', formatFileSize(uploadedAsset.size)],
                          ].map(([label, value]) => (
                            <div key={label} className="rounded-md border border-border bg-background px-3 py-2">
                              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                                {label}
                              </p>
                              <p className="mt-1 truncate text-xs font-semibold text-foreground">{value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <label className="flex min-h-80 cursor-pointer flex-col items-center justify-center gap-3 rounded-md border border-dashed border-border bg-muted/30 p-4 text-center">
                        <div className="flex size-16 items-center justify-center rounded-full bg-muted">
                          <ImageIcon className="size-7 text-muted-foreground" aria-hidden="true" />
                        </div>
                        <span className="max-w-xs text-sm text-muted-foreground">
                          Choose an image to convert it into a Base64 data URL for HTML, CSS, JSON, or API payloads.
                        </span>
                        <span className="rounded-md bg-primary px-3 py-2 text-xs font-bold text-primary-foreground">
                          Select image
                        </span>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="sr-only" />
                      </label>
                    )}
                  </div>
                )}
              </div>

              <div className="flex min-h-96 flex-col bg-card">
                <div className="flex items-center justify-between gap-3 px-4 pt-3">
                  <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Output
                  </div>
                  <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                    {source === 'image' ? 'Data URL' : mode === 'encode' ? 'Encoded' : 'Decoded'}
                  </span>
                </div>

                <div className="flex min-h-0 flex-1 flex-col p-4 pt-3">
                  {outputValue ? (
                    <pre className="min-h-0 flex-1 overflow-auto whitespace-pre-wrap wrap-break-word rounded-md border border-dashed border-border bg-muted/30 p-4 font-mono text-sm leading-6 text-foreground">
                      {outputValue}
                    </pre>
                  ) : (
                    <div className="flex min-h-48 flex-1 flex-col items-center justify-center gap-3 rounded-md border border-dashed border-border bg-muted/30 p-4 text-center">
                      <div className="flex size-16 items-center justify-center rounded-full bg-muted">
                        <Code className="size-7 text-muted-foreground" aria-hidden="true" />
                      </div>
                      <p className="max-w-xs text-sm text-muted-foreground">
                        Add text or upload an image to generate Base64 output here.
                      </p>
                    </div>
                  )}
                </div>

                {source === 'image' && rawBase64 ? (
                  <div className="border-t border-border p-4">
                    <div className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Raw Base64
                    </div>
                    <p className="truncate rounded-md border border-border bg-background px-3 py-2 font-mono text-xs text-muted-foreground">
                      {rawBase64}
                    </p>
                  </div>
                ) : null}

                <p className="px-4 pb-4 text-[11px] leading-5 text-muted-foreground">
                  Base64 conversion runs locally in your browser. Uploaded images are read on this device and are not sent to a server.
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
