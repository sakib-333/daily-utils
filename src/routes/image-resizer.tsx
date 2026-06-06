import { useMemo, useState } from 'react'
import {
  Braces,
  Calendar,
  Check,
  ChevronRight,
  Clipboard,
  Download,
  ExternalLink,
  FileText,
  Fingerprint,
  Image as ImageIcon,
  KeyRound,
  Palette,
  QrCode,
  RefreshCw,
  SlidersHorizontal,
  Trash2,
  Upload,
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

type UploadedImage = {
  publicId: string
  secureUrl: string
  width: number
  height: number
  format: string
  bytes: number
  originalFilename: string
}

type ResizeFit = 'fill' | 'fit' | 'scale' | 'crop' | 'limit'
type OutputFormat = 'auto' | 'jpg' | 'png' | 'webp'

type CloudinaryUploadResponse = {
  public_id?: string
  secure_url?: string
  width?: number
  height?: number
  format?: string
  bytes?: number
  original_filename?: string
  error?: {
    message?: string
  }
  message?: string
}

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

const relatedTools: RelatedTool[] = [
  { title: 'JSON Formatter', href: '/json-formater', icon: Braces },
  { title: 'UUID Generator', href: '/uuid-generator', icon: Fingerprint },
  { title: 'Password Generator', href: '/password-generator', icon: KeyRound },
  { title: 'Age Calculator', href: '/age-calculator', icon: Calendar },
  { title: 'QR Generator', href: '/qr-generator', icon: QrCode },
  { title: 'Markdown Previewer', href: '/markdown-previewer', icon: FileText },
  { title: 'Color Picker', href: '/color-picker', icon: Palette },
  { title: 'Image Resizer', href: '/image-resizer', icon: ImageIcon, isActive: true },
]

const fitOptions: { value: ResizeFit; label: string }[] = [
  { value: 'fill', label: 'Fill' },
  { value: 'fit', label: 'Fit' },
  { value: 'scale', label: 'Scale' },
  { value: 'crop', label: 'Crop' },
  { value: 'limit', label: 'Limit' },
]

const outputFormats: { value: OutputFormat; label: string }[] = [
  { value: 'auto', label: 'Auto' },
  { value: 'jpg', label: 'JPG' },
  { value: 'png', label: 'PNG' },
  { value: 'webp', label: 'WebP' },
]

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

function buildTransformationUrl(
  image: UploadedImage | null,
  width: number,
  height: number,
  fit: ResizeFit,
  quality: number,
  format: OutputFormat,
) {
  if (!image) {
    return ''
  }

  const transformation = [`c_${fit}`, `w_${width}`, `h_${height}`, `q_${quality}`, `f_${format}`].join(',')
  return image.secureUrl.replace('/upload/', `/upload/${transformation}/`)
}

export const Route = createFileRoute('/image-resizer')({
  component: RouteComponent,
})

function RouteComponent() {
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null)
  const [targetWidth, setTargetWidth] = useState(1200)
  const [targetHeight, setTargetHeight] = useState(800)
  const [fit, setFit] = useState<ResizeFit>('fit')
  const [format, setFormat] = useState<OutputFormat>('auto')
  const [quality, setQuality] = useState(85)
  const [preserveRatio, setPreserveRatio] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [copied, setCopied] = useState(false)

  const resizedUrl = useMemo(
    () => buildTransformationUrl(uploadedImage, targetWidth, targetHeight, fit, quality, format),
    [fit, format, quality, targetHeight, targetWidth, uploadedImage],
  )

  const aspectRatio = uploadedImage ? uploadedImage.width / uploadedImage.height : 1.5

  const updateWidth = (nextWidth: number) => {
    const safeWidth = Math.max(1, nextWidth)
    setTargetWidth(safeWidth)

    if (preserveRatio) {
      setTargetHeight(Math.max(1, Math.round(safeWidth / aspectRatio)))
    }

    setCopied(false)
  }

  const updateHeight = (nextHeight: number) => {
    const safeHeight = Math.max(1, nextHeight)
    setTargetHeight(safeHeight)

    if (preserveRatio) {
      setTargetWidth(Math.max(1, Math.round(safeHeight * aspectRatio)))
    }

    setCopied(false)
  }

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) return

    if (!cloudName || !uploadPreset) {
      setUploadedImage(null)
      setErrorMessage('Cloudinary is not configured. Add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET to your .env.local file.')
      return
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', uploadPreset)

    try {
      setIsUploading(true)
      setErrorMessage('')
      setCopied(false)

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      })

      const data = (await response.json()) as CloudinaryUploadResponse

      if (!response.ok) {
        throw new Error(data.error?.message ?? data.message ?? 'Image upload failed.')
      }

      if (!data.public_id || !data.secure_url || !data.width || !data.height) {
        throw new Error('Cloudinary returned an incomplete image response.')
      }

      const nextImage = {
        publicId: data.public_id,
        secureUrl: data.secure_url,
        width: data.width,
        height: data.height,
        format: data.format ?? file.type.replace('image/', '').toUpperCase(),
        bytes: data.bytes ?? file.size,
        originalFilename: data.original_filename ?? file.name,
      }

      setUploadedImage(nextImage)
      setTargetWidth(data.width)
      setTargetHeight(data.height)
    } catch (error) {
      console.error(error)
      setUploadedImage(null)
      setErrorMessage(error instanceof Error ? error.message : 'Image upload failed.')
    } finally {
      setIsUploading(false)
      event.target.value = ''
    }
  }

  const copyResizedUrl = async () => {
    if (!resizedUrl) return

    await navigator.clipboard.writeText(resizedUrl)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  const resetSettings = () => {
    if (uploadedImage) {
      setTargetWidth(uploadedImage.width)
      setTargetHeight(uploadedImage.height)
    } else {
      setTargetWidth(1200)
      setTargetHeight(800)
    }

    setFit('fit')
    setFormat('auto')
    setQuality(85)
    setPreserveRatio(true)
    setCopied(false)
  }

  const clearImage = () => {
    setUploadedImage(null)
    setErrorMessage('')
    setIsUploading(false)
    setCopied(false)
    resetSettings()
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
        <span className="text-xs font-bold text-primary">Image Resizer</span>
      </nav>

      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-normal text-foreground sm:text-4xl">
          Image Resizer
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Upload an image, resize it to exact dimensions, adjust quality, and export an optimized delivery URL.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="min-w-0 flex-1">
          <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
            <div className="flex min-h-16 flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/70 px-4 py-3">
              <div className="flex flex-wrap gap-2">
                <label className="inline-flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-md bg-primary px-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/80">
                  <Upload className="size-3.5" aria-hidden="true" />
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => void handleUpload(event)}
                    className="sr-only"
                  />
                </label>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="gap-1.5 font-bold"
                  onClick={resetSettings}
                >
                  <RefreshCw className="size-3.5" aria-hidden="true" />
                  Reset
                </Button>
              </div>

              <div className="flex items-center gap-3">
                {uploadedImage ? (
                  <div className="hidden text-[10px] font-semibold text-muted-foreground sm:block">
                    {uploadedImage.width} x {uploadedImage.height} / {formatFileSize(uploadedImage.bytes)}
                  </div>
                ) : null}

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => void copyResizedUrl()}
                    aria-label="Copy resized image URL"
                    disabled={!resizedUrl}
                  >
                    {copied ? <Check aria-hidden="true" /> : <Clipboard aria-hidden="true" />}
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon-sm"
                    onClick={clearImage}
                    aria-label="Clear image"
                  >
                    <Trash2 aria-hidden="true" />
                  </Button>
                </div>
              </div>
            </div>

            {errorMessage ? (
              <p className="border-b border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {errorMessage}
              </p>
            ) : null}

            <div className="grid grid-cols-1 divide-y divide-border md:grid-cols-2 md:divide-x md:divide-y-0">
              <div className="flex min-h-0 flex-col p-4">
                <div className="mb-4 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Preview
                </div>

                <div className="flex min-h-96 flex-1 items-center justify-center rounded-md border border-dashed border-border bg-muted/30 p-4">
                  {isUploading ? (
                    <div className="flex flex-col items-center gap-3 text-center">
                      <div className="flex size-16 items-center justify-center rounded-full bg-muted">
                        <Upload className="size-7 text-muted-foreground" aria-hidden="true" />
                      </div>
                      <p className="text-sm font-semibold text-foreground">Uploading image...</p>
                    </div>
                  ) : uploadedImage ? (
                    <img
                      src={resizedUrl || uploadedImage.secureUrl}
                      alt={uploadedImage.originalFilename}
                      className="max-h-112 max-w-full rounded-md object-contain shadow-sm"
                    />
                  ) : (
                    <label className="flex cursor-pointer flex-col items-center gap-3 text-center">
                      <div className="flex size-16 items-center justify-center rounded-full bg-muted">
                        <ImageIcon className="size-7 text-muted-foreground" aria-hidden="true" />
                      </div>
                      <span className="max-w-xs text-sm text-muted-foreground">
                        Choose an image to upload, preview, resize, and export.
                      </span>
                      <span className="rounded-md bg-primary px-3 py-2 text-xs font-bold text-primary-foreground">
                        Select image
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(event) => void handleUpload(event)}
                        className="sr-only"
                      />
                    </label>
                  )}
                </div>

                {uploadedImage ? (
                  <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                    {[
                      ['Original', `${uploadedImage.width} x ${uploadedImage.height}`],
                      ['Format', uploadedImage.format.toUpperCase()],
                      ['Size', formatFileSize(uploadedImage.bytes)],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-md border border-border bg-background px-3 py-2">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                          {label}
                        </p>
                        <p className="mt-1 truncate text-xs font-semibold text-foreground">{value}</p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="flex min-h-96 flex-col bg-card p-4">
                <div className="mb-4 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  <SlidersHorizontal className="size-3.5" aria-hidden="true" />
                  Resize Settings
                </div>

                <div className="space-y-5">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label htmlFor="targetWidth" className="mb-2 block text-xs font-semibold text-foreground">
                        Width
                      </label>
                      <input
                        id="targetWidth"
                        type="number"
                        min={1}
                        value={targetWidth}
                        onChange={(event) => updateWidth(Number(event.target.value))}
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary"
                      />
                    </div>

                    <div>
                      <label htmlFor="targetHeight" className="mb-2 block text-xs font-semibold text-foreground">
                        Height
                      </label>
                      <input
                        id="targetHeight"
                        type="number"
                        min={1}
                        value={targetHeight}
                        onChange={(event) => updateHeight(Number(event.target.value))}
                        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary"
                      />
                    </div>
                  </div>

                  <label className="flex cursor-pointer items-center justify-between gap-3 rounded-md border border-border bg-background px-3 py-2">
                    <span>
                      <span className="block text-xs font-semibold text-foreground">Preserve aspect ratio</span>
                      <span className="block text-[10px] text-muted-foreground">Keep width and height proportional.</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={preserveRatio}
                      onChange={(event) => setPreserveRatio(event.target.checked)}
                      className="size-4 accent-primary"
                    />
                  </label>

                  <div>
                    <label htmlFor="quality" className="mb-2 flex items-center justify-between gap-3 text-xs font-semibold text-foreground">
                      <span>Quality</span>
                      <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-xs font-bold text-primary">
                        {quality}
                      </span>
                    </label>
                    <input
                      id="quality"
                      type="range"
                      min={10}
                      max={100}
                      value={quality}
                      onChange={(event) => {
                        setQuality(Number(event.target.value))
                        setCopied(false)
                      }}
                      className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary"
                    />
                  </div>

                  <div>
                    <div className="mb-2 text-xs font-semibold text-foreground">Fit mode</div>
                    <div className="grid grid-cols-3 gap-2">
                      {fitOptions.map(({ value, label }) => (
                        <button
                          key={value}
                          type="button"
                          className={cn(
                            'h-9 rounded-md border px-2 text-xs font-bold transition-colors',
                            fit === value
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground',
                          )}
                          onClick={() => {
                            setFit(value)
                            setCopied(false)
                          }}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 text-xs font-semibold text-foreground">Output format</div>
                    <div className="grid grid-cols-4 gap-2">
                      {outputFormats.map(({ value, label }) => (
                        <button
                          key={value}
                          type="button"
                          className={cn(
                            'h-9 rounded-md border px-2 text-xs font-bold transition-colors',
                            format === value
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground',
                          )}
                          onClick={() => {
                            setFormat(value)
                            setCopied(false)
                          }}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-md border border-border bg-background p-3">
                  <div className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Export
                  </div>
                  {resizedUrl ? (
                    <div className="space-y-3">
                      <p className="truncate font-mono text-xs font-semibold text-foreground">
                        {resizedUrl}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          size="sm"
                          className="gap-1.5 font-bold"
                          onClick={() => void copyResizedUrl()}
                        >
                          {copied ? <Check className="size-3.5" aria-hidden="true" /> : <Clipboard className="size-3.5" aria-hidden="true" />}
                          Copy URL
                        </Button>
                        <a
                          href={resizedUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-md border border-border bg-background px-2.5 text-sm font-bold text-foreground transition-colors hover:bg-muted"
                        >
                          <ExternalLink className="size-3.5" aria-hidden="true" />
                          Open
                        </a>
                        <a
                          href={resizedUrl}
                          download
                          className="inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-md bg-secondary px-2.5 text-sm font-bold text-secondary-foreground transition-colors hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)]"
                        >
                          <Download className="size-3.5" aria-hidden="true" />
                          Download
                        </a>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs leading-5 text-muted-foreground">
                      Upload an image to generate an optimized resize URL.
                    </p>
                  )}
                </div>

                <p className="mt-4 text-[11px] leading-5 text-muted-foreground">
                  Images upload to your configured Cloudinary account. Resize settings are applied through delivery transformations.
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
