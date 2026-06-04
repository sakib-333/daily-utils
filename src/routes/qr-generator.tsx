import { useState } from 'react'
import QRCode from 'qrcode'
import {
  Braces,
  Calendar,
  Check,
  ChevronRight,
  Clipboard,
  Download,
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

type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H'

type QrOptions = {
  size: number
  errorCorrectionLevel: ErrorCorrectionLevel
}

const relatedTools: RelatedTool[] = [
  { title: 'JSON Formatter', href: '/json-formater', icon: Braces },
  { title: 'UUID Generator', href: '/uuid-generator', icon: Fingerprint },
  { title: 'Password Generator', href: '/password-generator', icon: KeyRound },
  { title: 'Age Calculator', href: '/age-calculator', icon: Calendar },
  { title: 'QR Generator', href: '/qr-generator', icon: QrCode, isActive: true },
  { title: 'Markdown Previewer', href: '/markdown-previewer', icon: FileText },
]

const defaultOptions: QrOptions = {
  size: 256,
  errorCorrectionLevel: 'M',
}

const errorCorrectionLevels: { value: ErrorCorrectionLevel; label: string; description: string }[] = [
  { value: 'L', label: 'Low (7%)', description: 'Best for simple URLs and short text' },
  { value: 'M', label: 'Medium (15%)', description: 'Balanced default for most use cases' },
  { value: 'Q', label: 'Quartile (25%)', description: 'Better recovery when partially obscured' },
  { value: 'H', label: 'High (30%)', description: 'Maximum durability with logos or damage' },
]

export const Route = createFileRoute('/qr-generator')({
  component: RouteComponent,
})

function RouteComponent() {
  const [content, setContent] = useState('')
  const [options, setOptions] = useState<QrOptions>(defaultOptions)
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const generateQrCode = async () => {
    const trimmedContent = content.trim()

    if (!trimmedContent) {
      setError('Enter text or a URL to encode.')
      setQrDataUrl('')
      return
    }

    try {
      setError('')
      const dataUrl = await QRCode.toDataURL(trimmedContent, {
        width: options.size,
        margin: 2,
        errorCorrectionLevel: options.errorCorrectionLevel,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      })
      setQrDataUrl(dataUrl)
      setCopied(false)
    } catch {
      setError('Unable to generate QR code. Try shorter content or lower the image size.')
      setQrDataUrl('')
    }
  }

  const copyContent = async () => {
    if (!content.trim()) return

    await navigator.clipboard.writeText(content.trim())
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  const downloadQrCode = () => {
    if (!qrDataUrl) return

    const link = document.createElement('a')
    link.href = qrDataUrl
    link.download = 'qrcode.png'
    link.click()
  }

  const clearEditor = () => {
    setContent('')
    setOptions(defaultOptions)
    setQrDataUrl('')
    setError('')
    setCopied(false)
  }

  const updateOption = <Key extends keyof QrOptions>(key: Key, value: QrOptions[Key]) => {
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
        <span className="text-xs font-bold text-primary">QR Generator</span>
      </nav>

      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-normal text-foreground sm:text-4xl">
          QR Generator
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Turn URLs, text, and contact details into scannable QR codes with adjustable size and error correction.
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
                  onClick={() => void generateQrCode()}
                >
                  <Sparkles className="size-3.5" aria-hidden="true" />
                  Generate
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="gap-1.5 font-bold"
                  onClick={downloadQrCode}
                  disabled={!qrDataUrl}
                >
                  <Download className="size-3.5" aria-hidden="true" />
                  Download PNG
                </Button>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => void copyContent()}
                  aria-label="Copy encoded content"
                  disabled={!content.trim()}
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

            {error ? (
              <p className="border-b border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </p>
            ) : null}

            <div className="grid grid-cols-1 divide-y divide-border md:grid-cols-2 md:divide-x md:divide-y-0">
              <div className="flex min-h-0 flex-col">
                <label
                  htmlFor="qrContent"
                  className="px-4 pt-3 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground"
                >
                  Content
                </label>
                <textarea
                  id="qrContent"
                  className="min-h-40 flex-1 resize-none border-0 bg-transparent p-4 pt-3 font-mono text-xs leading-5 text-foreground outline-none placeholder:text-muted-foreground focus:ring-0 md:min-h-0"
                  placeholder="Paste a URL, plain text, email, phone number, or any content to encode..."
                  value={content}
                  onChange={(event) => {
                    setContent(event.target.value)
                    setCopied(false)
                  }}
                  spellCheck={false}
                />

                <div className="space-y-5 border-t border-border p-4">
                  <div>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <label htmlFor="qrSize" className="text-xs font-semibold text-foreground">
                        Image size
                      </label>
                      <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-xs font-bold text-primary">
                        {options.size}px
                      </span>
                    </div>
                    <input
                      id="qrSize"
                      type="range"
                      min={128}
                      max={512}
                      step={32}
                      value={options.size}
                      onChange={(event) => updateOption('size', Number(event.target.value))}
                      className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary"
                    />
                    <div className="mt-1 flex justify-between text-[10px] font-medium text-muted-foreground">
                      <span>128px</span>
                      <span>512px</span>
                    </div>
                  </div>

                  <fieldset className="space-y-2">
                    <legend className="text-xs font-semibold text-foreground">Error correction</legend>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {errorCorrectionLevels.map(({ value, label, description }) => (
                        <label
                          key={value}
                          className={cn(
                            'cursor-pointer rounded-md border px-3 py-2 transition-colors',
                            options.errorCorrectionLevel === value
                              ? 'border-primary bg-primary/5'
                              : 'border-border bg-background hover:bg-muted/50',
                          )}
                        >
                          <input
                            type="radio"
                            name="errorCorrectionLevel"
                            value={value}
                            checked={options.errorCorrectionLevel === value}
                            onChange={() => updateOption('errorCorrectionLevel', value)}
                            className="sr-only"
                          />
                          <span className="block text-xs font-semibold text-foreground">{label}</span>
                          <span className="mt-0.5 block text-[10px] leading-4 text-muted-foreground">
                            {description}
                          </span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                </div>
              </div>

              <div className="flex min-h-80 flex-col bg-card p-4">
                <div className="mb-3 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  QR Preview
                </div>

                <div className="flex min-h-0 flex-1 flex-col items-center justify-center rounded-md border border-dashed border-border bg-muted/30 p-4">
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt="Generated QR code"
                      className="max-w-full rounded-md bg-white p-3 shadow-sm"
                      width={options.size}
                      height={options.size}
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-3 text-center">
                      <div className="flex size-16 items-center justify-center rounded-full bg-muted">
                        <QrCode className="size-7 text-muted-foreground" aria-hidden="true" />
                      </div>
                      <p className="max-w-xs text-sm text-muted-foreground">
                        Enter your content and click Generate to preview the QR code here.
                      </p>
                    </div>
                  )}
                </div>

                <p className="mt-4 text-[11px] leading-5 text-muted-foreground">
                  QR codes are generated locally in your browser. Nothing is uploaded to a server.
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
