import { useMemo, useState } from 'react'
import {
    Braces,
    Calendar,
    Check,
    ChevronRight,
    Clipboard,
    FileText,
    Fingerprint,
    KeyRound,
    Palette,
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

type RgbColor = {
    r: number
    g: number
    b: number
}

type HslColor = {
    h: number
    s: number
    l: number
}

type ColorFormat = 'hex' | 'rgb' | 'hsl'

const relatedTools: RelatedTool[] = [
    { title: 'JSON Formatter', href: '/json-formater', icon: Braces },
    { title: 'UUID Generator', href: '/uuid-generator', icon: Fingerprint },
    { title: 'Password Generator', href: '/password-generator', icon: KeyRound },
    { title: 'Age Calculator', href: '/age-calculator', icon: Calendar },
    { title: 'QR Generator', href: '/qr-generator', icon: QrCode },
    { title: 'Markdown Previewer', href: '/markdown-previewer', icon: FileText },
    { title: 'Color Picker', href: '/color-picker', icon: Palette, isActive: true },
]

const defaultHex = '#3b82f6'

const presetColors = [
    '#ef4444',
    '#f97316',
    '#eab308',
    '#22c55e',
    '#14b8a6',
    '#3b82f6',
    '#8b5cf6',
    '#ec4899',
    '#111827',
    '#f8fafc',
]

function normalizeHex(value: string) {
    const trimmedValue = value.trim().replace(/^#/, '')

    if (/^[0-9a-fA-F]{3}$/.test(trimmedValue)) {
        return `#${trimmedValue.split('').map((character) => character + character).join('')}`.toLowerCase()
    }

    if (/^[0-9a-fA-F]{6}$/.test(trimmedValue)) {
        return `#${trimmedValue}`.toLowerCase()
    }

    return null
}

function hexToRgb(hex: string): RgbColor {
    const normalizedHex = normalizeHex(hex) ?? defaultHex
    const colorValue = Number.parseInt(normalizedHex.slice(1), 16)

    return {
        r: (colorValue >> 16) & 255,
        g: (colorValue >> 8) & 255,
        b: colorValue & 255,
    }
}

function rgbToHex({ r, g, b }: RgbColor) {
    return `#${[r, g, b]
        .map((value) => value.toString(16).padStart(2, '0'))
        .join('')}`
}

function rgbToHsl({ r, g, b }: RgbColor): HslColor {
    const red = r / 255
    const green = g / 255
    const blue = b / 255
    const max = Math.max(red, green, blue)
    const min = Math.min(red, green, blue)
    const lightness = (max + min) / 2

    if (max === min) {
        return { h: 0, s: 0, l: Math.round(lightness * 100) }
    }

    const difference = max - min
    const saturation = lightness > 0.5 ? difference / (2 - max - min) : difference / (max + min)
    let hue: number

    if (max === red) {
        hue = (green - blue) / difference + (green < blue ? 6 : 0)
    } else if (max === green) {
        hue = (blue - red) / difference + 2
    } else {
        hue = (red - green) / difference + 4
    }

    return {
        h: Math.round(hue * 60),
        s: Math.round(saturation * 100),
        l: Math.round(lightness * 100),
    }
}

function formatRgb({ r, g, b }: RgbColor) {
    return `rgb(${r}, ${g}, ${b})`
}

function formatHsl({ h, s, l }: HslColor) {
    return `hsl(${h}, ${s}%, ${l}%)`
}

function mixRgb(color: RgbColor, target: RgbColor, weight: number) {
    return {
        r: Math.round(color.r + (target.r - color.r) * weight),
        g: Math.round(color.g + (target.g - color.g) * weight),
        b: Math.round(color.b + (target.b - color.b) * weight),
    }
}

function getReadableTextColor({ r, g, b }: RgbColor) {
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return luminance > 0.62 ? '#111827' : '#ffffff'
}

export const Route = createFileRoute('/color-picker')({
    component: RouteComponent,
})

function RouteComponent() {
    const [hex, setHex] = useState(defaultHex)
    const [hexInput, setHexInput] = useState(defaultHex)
    const [copiedFormat, setCopiedFormat] = useState<ColorFormat | null>(null)
    const [error, setError] = useState('')

    const rgb = useMemo(() => hexToRgb(hex), [hex])
    const hsl = useMemo(() => rgbToHsl(rgb), [rgb])
    const values = useMemo(
        () => ({
            hex,
            rgb: formatRgb(rgb),
            hsl: formatHsl(hsl),
        }),
        [hex, hsl, rgb],
    )
    const palette = useMemo(
        () => [
            { label: 'Tint 80', hex: rgbToHex(mixRgb(rgb, { r: 255, g: 255, b: 255 }, 0.8)) },
            { label: 'Tint 55', hex: rgbToHex(mixRgb(rgb, { r: 255, g: 255, b: 255 }, 0.55)) },
            { label: 'Base', hex },
            { label: 'Shade 35', hex: rgbToHex(mixRgb(rgb, { r: 0, g: 0, b: 0 }, 0.35)) },
            { label: 'Shade 60', hex: rgbToHex(mixRgb(rgb, { r: 0, g: 0, b: 0 }, 0.6)) },
        ],
        [hex, rgb],
    )

    const applyHex = (nextValue: string) => {
        setHexInput(nextValue)
        const normalizedHex = normalizeHex(nextValue)

        if (normalizedHex === null) {
            setError('Enter a valid 3 or 6 digit HEX color.')
            setCopiedFormat(null)
            return
        }

        setHex(normalizedHex)
        setHexInput(normalizedHex)
        setError('')
        setCopiedFormat(null)
    }

    const applyRgbValue = (channel: keyof RgbColor, value: number) => {
        const nextHex = rgbToHex({ ...rgb, [channel]: value })
        setHex(nextHex)
        setHexInput(nextHex)
        setError('')
        setCopiedFormat(null)
    }

    const copyColorValue = async (format: ColorFormat, value: string) => {
        await navigator.clipboard.writeText(value)
        setCopiedFormat(format)
        window.setTimeout(() => setCopiedFormat(null), 1600)
    }

    const resetColor = () => {
        setHex(defaultHex)
        setHexInput(defaultHex)
        setError('')
        setCopiedFormat(null)
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
                <span className="text-xs font-bold text-primary">Color Picker</span>
            </nav>

            <header className="mb-6">
                <h1 className="text-3xl font-bold tracking-normal text-foreground sm:text-4xl">
                    Color Picker
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                    Pick, tune, compare, and copy colors across HEX, RGB, and HSL formats.
                </p>
            </header>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_16rem]">
                <div className="min-w-0 flex-1">
                    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
                        <div className="flex h-16 flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/70 px-4">
                            <div className="flex flex-wrap gap-2">
                                <Button type="button" size="sm" className="gap-1.5 font-bold" onClick={() => void copyColorValue('hex', values.hex)}>
                                    <Sparkles className="size-3.5" aria-hidden="true" />
                                    Copy HEX
                                </Button>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="sm"
                                    className="gap-1.5 font-bold"
                                    onClick={resetColor}
                                >
                                    <RefreshCw className="size-3.5" aria-hidden="true" />
                                    Reset
                                </Button>
                            </div>

                            <Button
                                type="button"
                                variant="destructive"
                                size="icon-sm"
                                onClick={resetColor}
                                aria-label="Reset color"
                            >
                                <Trash2 aria-hidden="true" />
                            </Button>
                        </div>

                        {error ? (
                            <p className="border-b border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                                {error}
                            </p>
                        ) : null}

                        <div className="grid grid-cols-1 divide-y divide-border md:grid-cols-2 md:divide-x md:divide-y-0">
                            <div className="flex flex-col p-4">
                                <div className="mb-4 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                                    Picker
                                </div>

                                <div
                                    className="mb-5 flex min-h-48 flex-col justify-end rounded-md border border-border p-4 shadow-inner"
                                    style={{ backgroundColor: hex, color: getReadableTextColor(rgb) }}
                                >
                                    <p className="font-mono text-2xl font-bold tracking-normal sm:text-3xl">{hex}</p>
                                    <p className="mt-1 font-mono text-xs font-semibold opacity-85">{values.rgb}</p>
                                </div>

                                <div className="space-y-5">
                                    <div>
                                        <label htmlFor="nativeColorPicker" className="mb-2 block text-xs font-semibold text-foreground">
                                            Color picker
                                        </label>
                                        <input
                                            id="nativeColorPicker"
                                            type="color"
                                            value={hex}
                                            onChange={(event) => applyHex(event.target.value)}
                                            className="h-11 w-full cursor-pointer rounded-md border border-border bg-background p-1"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="hexInput" className="mb-2 block text-xs font-semibold text-foreground">
                                            HEX value
                                        </label>
                                        <input
                                            id="hexInput"
                                            type="text"
                                            value={hexInput}
                                            onChange={(event) => applyHex(event.target.value)}
                                            className="w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm text-foreground outline-none transition-colors focus:border-primary"
                                            placeholder="#3b82f6"
                                            spellCheck={false}
                                        />
                                    </div>

                                    <div className="grid grid-cols-5 gap-2">
                                        {presetColors.map((presetColor) => (
                                            <button
                                                key={presetColor}
                                                type="button"
                                                className={cn(
                                                    'h-9 rounded-md border border-border transition-transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-ring',
                                                    presetColor === hex ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : '',
                                                )}
                                                style={{ backgroundColor: presetColor }}
                                                onClick={() => applyHex(presetColor)}
                                                aria-label={`Use ${presetColor}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex min-h-96 flex-col bg-card p-4">
                                <div className="mb-4 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                                    Values
                                </div>

                                <div className="space-y-3">
                                    {(
                                        [
                                            ['hex', 'HEX', values.hex],
                                            ['rgb', 'RGB', values.rgb],
                                            ['hsl', 'HSL', values.hsl],
                                        ] as const
                                    ).map(([format, label, value]) => (
                                        <div key={format} className="flex items-center gap-2 rounded-md border border-border bg-background p-2">
                                            <div className="min-w-0 flex-1">
                                                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
                                                <p className="truncate font-mono text-xs font-semibold text-foreground">{value}</p>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon-sm"
                                                onClick={() => void copyColorValue(format, value)}
                                                aria-label={`Copy ${label}`}
                                            >
                                                {copiedFormat === format ? <Check aria-hidden="true" /> : <Clipboard aria-hidden="true" />}
                                            </Button>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-5 space-y-4">
                                    {(
                                        [
                                            ['r', 'Red', rgb.r, 'accent-red-500'],
                                            ['g', 'Green', rgb.g, 'accent-emerald-500'],
                                            ['b', 'Blue', rgb.b, 'accent-blue-500'],
                                        ] as const
                                    ).map(([channel, label, value, accentClassName]) => (
                                        <div key={channel}>
                                            <div className="mb-2 flex items-center justify-between gap-3">
                                                <label htmlFor={`${channel}Channel`} className="text-xs font-semibold text-foreground">
                                                    {label}
                                                </label>
                                                <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-xs font-bold text-primary">
                                                    {value}
                                                </span>
                                            </div>
                                            <input
                                                id={`${channel}Channel`}
                                                type="range"
                                                min={0}
                                                max={255}
                                                value={value}
                                                onChange={(event) => applyRgbValue(channel, Number(event.target.value))}
                                                className={cn('h-2 w-full cursor-pointer appearance-none rounded-full bg-muted', accentClassName)}
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6">
                                    <div className="mb-3 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                                        Palette
                                    </div>
                                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-5">
                                        {palette.map((swatch) => (
                                            <button
                                                key={swatch.label}
                                                type="button"
                                                className="overflow-hidden rounded-md border border-border bg-background text-left transition-transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-ring"
                                                onClick={() => applyHex(swatch.hex)}
                                            >
                                                <span className="block h-12" style={{ backgroundColor: swatch.hex }} />
                                                <span className="block px-2 py-1.5">
                                                    <span className="block text-[10px] font-semibold text-muted-foreground">{swatch.label}</span>
                                                    <span className="block font-mono text-[10px] font-bold text-foreground">{swatch.hex}</span>
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <p className="mt-5 text-[11px] leading-5 text-muted-foreground">
                                    Color values are converted locally in your browser and can be copied without sending anything to a server.
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
