import { useState } from 'react'
import {
  Braces,
  Calendar,
  Check,
  ChevronRight,
  Clipboard,
  Code,
  Database,
  FileText,
  Gauge,
  Image as ImageIcon,
  Link as LinkIcon,
  Repeat2,
  Ruler,
  Scale,
  Sparkles,
  Thermometer,
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

type UnitCategory = 'length' | 'mass' | 'temperature' | 'area' | 'volume' | 'speed' | 'data'

type UnitDefinition = {
  id: string
  label: string
  symbol: string
  toBase: (value: number) => number
  fromBase: (value: number) => number
}

type UnitGroup = {
  id: UnitCategory
  label: string
  icon: LucideIcon
  baseUnit: string
  description: string
  units: UnitDefinition[]
}

const relatedTools: RelatedTool[] = [
  { title: 'Age Calculator', href: '/age-calculator', icon: Calendar },
  { title: 'JSON Formatter', href: '/json-formater', icon: Braces },
  { title: 'Markdown Previewer', href: '/markdown-previewer', icon: FileText },
  { title: 'Base64 Converter', href: '/base64-converter', icon: Code },
  { title: 'Text Case Converter', href: '/text-case-converter', icon: WholeWord },
  { title: 'URL Encoder', href: '/url-encoder', icon: LinkIcon },
  { title: 'Image Resizer', href: '/image-resizer', icon: ImageIcon },
  { title: 'Unit Converter', href: '/unit-converter', icon: Ruler, isActive: true },
]

const unitGroups: UnitGroup[] = [
  {
    id: 'length',
    label: 'Length',
    icon: Ruler,
    baseUnit: 'meter',
    description: 'Distance, dimensions, and layout measurements.',
    units: [
      { id: 'millimeter', label: 'Millimeter', symbol: 'mm', toBase: (value) => value / 1000, fromBase: (value) => value * 1000 },
      { id: 'centimeter', label: 'Centimeter', symbol: 'cm', toBase: (value) => value / 100, fromBase: (value) => value * 100 },
      { id: 'meter', label: 'Meter', symbol: 'm', toBase: (value) => value, fromBase: (value) => value },
      { id: 'kilometer', label: 'Kilometer', symbol: 'km', toBase: (value) => value * 1000, fromBase: (value) => value / 1000 },
      { id: 'inch', label: 'Inch', symbol: 'in', toBase: (value) => value * 0.0254, fromBase: (value) => value / 0.0254 },
      { id: 'foot', label: 'Foot', symbol: 'ft', toBase: (value) => value * 0.3048, fromBase: (value) => value / 0.3048 },
      { id: 'yard', label: 'Yard', symbol: 'yd', toBase: (value) => value * 0.9144, fromBase: (value) => value / 0.9144 },
      { id: 'mile', label: 'Mile', symbol: 'mi', toBase: (value) => value * 1609.344, fromBase: (value) => value / 1609.344 },
    ],
  },
  {
    id: 'mass',
    label: 'Weight',
    icon: Scale,
    baseUnit: 'gram',
    description: 'Common metric and imperial weight conversions.',
    units: [
      { id: 'milligram', label: 'Milligram', symbol: 'mg', toBase: (value) => value / 1000, fromBase: (value) => value * 1000 },
      { id: 'gram', label: 'Gram', symbol: 'g', toBase: (value) => value, fromBase: (value) => value },
      { id: 'kilogram', label: 'Kilogram', symbol: 'kg', toBase: (value) => value * 1000, fromBase: (value) => value / 1000 },
      { id: 'ounce', label: 'Ounce', symbol: 'oz', toBase: (value) => value * 28.349523125, fromBase: (value) => value / 28.349523125 },
      { id: 'pound', label: 'Pound', symbol: 'lb', toBase: (value) => value * 453.59237, fromBase: (value) => value / 453.59237 },
      { id: 'stone', label: 'Stone', symbol: 'st', toBase: (value) => value * 6350.29318, fromBase: (value) => value / 6350.29318 },
      { id: 'metric-ton', label: 'Metric Ton', symbol: 't', toBase: (value) => value * 1000000, fromBase: (value) => value / 1000000 },
    ],
  },
  {
    id: 'temperature',
    label: 'Temperature',
    icon: Thermometer,
    baseUnit: 'celsius',
    description: 'Weather, cooking, and scientific temperature scales.',
    units: [
      { id: 'celsius', label: 'Celsius', symbol: 'deg C', toBase: (value) => value, fromBase: (value) => value },
      { id: 'fahrenheit', label: 'Fahrenheit', symbol: 'deg F', toBase: (value) => (value - 32) * (5 / 9), fromBase: (value) => value * (9 / 5) + 32 },
      { id: 'kelvin', label: 'Kelvin', symbol: 'K', toBase: (value) => value - 273.15, fromBase: (value) => value + 273.15 },
    ],
  },
  {
    id: 'area',
    label: 'Area',
    icon: Ruler,
    baseUnit: 'square meter',
    description: 'Rooms, land, surfaces, and design spaces.',
    units: [
      { id: 'square-meter', label: 'Square Meter', symbol: 'm2', toBase: (value) => value, fromBase: (value) => value },
      { id: 'square-kilometer', label: 'Square Kilometer', symbol: 'km2', toBase: (value) => value * 1000000, fromBase: (value) => value / 1000000 },
      { id: 'square-foot', label: 'Square Foot', symbol: 'ft2', toBase: (value) => value * 0.09290304, fromBase: (value) => value / 0.09290304 },
      { id: 'square-yard', label: 'Square Yard', symbol: 'yd2', toBase: (value) => value * 0.83612736, fromBase: (value) => value / 0.83612736 },
      { id: 'acre', label: 'Acre', symbol: 'ac', toBase: (value) => value * 4046.8564224, fromBase: (value) => value / 4046.8564224 },
      { id: 'hectare', label: 'Hectare', symbol: 'ha', toBase: (value) => value * 10000, fromBase: (value) => value / 10000 },
    ],
  },
  {
    id: 'volume',
    label: 'Volume',
    icon: Gauge,
    baseUnit: 'liter',
    description: 'Liquid measures for recipes, shipping, and capacity.',
    units: [
      { id: 'milliliter', label: 'Milliliter', symbol: 'ml', toBase: (value) => value / 1000, fromBase: (value) => value * 1000 },
      { id: 'liter', label: 'Liter', symbol: 'L', toBase: (value) => value, fromBase: (value) => value },
      { id: 'cubic-meter', label: 'Cubic Meter', symbol: 'm3', toBase: (value) => value * 1000, fromBase: (value) => value / 1000 },
      { id: 'teaspoon', label: 'Teaspoon', symbol: 'tsp', toBase: (value) => value * 0.00492892159, fromBase: (value) => value / 0.00492892159 },
      { id: 'tablespoon', label: 'Tablespoon', symbol: 'tbsp', toBase: (value) => value * 0.0147867648, fromBase: (value) => value / 0.0147867648 },
      { id: 'cup-us', label: 'US Cup', symbol: 'cup', toBase: (value) => value * 0.2365882365, fromBase: (value) => value / 0.2365882365 },
      { id: 'fluid-ounce-us', label: 'US Fluid Ounce', symbol: 'fl oz', toBase: (value) => value * 0.0295735296, fromBase: (value) => value / 0.0295735296 },
      { id: 'gallon-us', label: 'US Gallon', symbol: 'gal', toBase: (value) => value * 3.785411784, fromBase: (value) => value / 3.785411784 },
    ],
  },
  {
    id: 'speed',
    label: 'Speed',
    icon: Gauge,
    baseUnit: 'meter per second',
    description: 'Travel, motion, transport, and performance measurements.',
    units: [
      { id: 'meter-per-second', label: 'Meter per Second', symbol: 'm/s', toBase: (value) => value, fromBase: (value) => value },
      { id: 'kilometer-per-hour', label: 'Kilometer per Hour', symbol: 'km/h', toBase: (value) => value / 3.6, fromBase: (value) => value * 3.6 },
      { id: 'mile-per-hour', label: 'Mile per Hour', symbol: 'mph', toBase: (value) => value * 0.44704, fromBase: (value) => value / 0.44704 },
      { id: 'knot', label: 'Knot', symbol: 'kn', toBase: (value) => value * 0.514444444, fromBase: (value) => value / 0.514444444 },
    ],
  },
  {
    id: 'data',
    label: 'Data',
    icon: Database,
    baseUnit: 'byte',
    description: 'Storage, payloads, uploads, and bandwidth estimates.',
    units: [
      { id: 'byte', label: 'Byte', symbol: 'B', toBase: (value) => value, fromBase: (value) => value },
      { id: 'kilobyte', label: 'Kilobyte', symbol: 'KB', toBase: (value) => value * 1024, fromBase: (value) => value / 1024 },
      { id: 'megabyte', label: 'Megabyte', symbol: 'MB', toBase: (value) => value * 1024 ** 2, fromBase: (value) => value / 1024 ** 2 },
      { id: 'gigabyte', label: 'Gigabyte', symbol: 'GB', toBase: (value) => value * 1024 ** 3, fromBase: (value) => value / 1024 ** 3 },
      { id: 'terabyte', label: 'Terabyte', symbol: 'TB', toBase: (value) => value * 1024 ** 4, fromBase: (value) => value / 1024 ** 4 },
      { id: 'bit', label: 'Bit', symbol: 'bit', toBase: (value) => value / 8, fromBase: (value) => value * 8 },
      { id: 'megabit', label: 'Megabit', symbol: 'Mb', toBase: (value) => (value * 1024 ** 2) / 8, fromBase: (value) => (value * 8) / 1024 ** 2 },
    ],
  },
]

const presets: {
  label: string
  category: UnitCategory
  value: string
  fromUnit: string
  toUnit: string
}[] = [
    { label: '5 ft 10 in height', category: 'length', value: '70', fromUnit: 'inch', toUnit: 'centimeter' },
    { label: 'Recipe cups to ml', category: 'volume', value: '2.5', fromUnit: 'cup-us', toUnit: 'milliliter' },
    { label: 'Room size sq ft', category: 'area', value: '240', fromUnit: 'square-foot', toUnit: 'square-meter' },
    { label: 'Upload size MB', category: 'data', value: '25', fromUnit: 'megabyte', toUnit: 'byte' },
  ]

function convertUnit(value: number, fromUnit: UnitDefinition, toUnit: UnitDefinition) {
  return toUnit.fromBase(fromUnit.toBase(value))
}

function formatNumber(value: number) {
  if (!Number.isFinite(value)) {
    return ''
  }

  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: Math.abs(value) >= 1000 ? 2 : 6,
  }).format(value)
}

function getDefaultUnits(group: UnitGroup) {
  return {
    from: group.units[0]?.id ?? '',
    to: group.units[1]?.id ?? group.units[0]?.id ?? '',
  }
}

export const Route = createFileRoute('/unit-converter')({
  component: RouteComponent,
})

function RouteComponent() {
  const [category, setCategory] = useState<UnitCategory>('length')
  const [inputValue, setInputValue] = useState('100')
  const [fromUnitId, setFromUnitId] = useState('centimeter')
  const [toUnitId, setToUnitId] = useState('meter')
  const [copied, setCopied] = useState(false)

  const activeGroup = unitGroups.find(({ id }) => id === category) ?? unitGroups[0]
  const fromUnit = activeGroup.units.find(({ id }) => id === fromUnitId) ?? activeGroup.units[0]
  const toUnit = activeGroup.units.find(({ id }) => id === toUnitId) ?? activeGroup.units[1] ?? activeGroup.units[0]
  const numericValue = Number(inputValue)
  const canConvert = inputValue.trim() !== '' && Number.isFinite(numericValue)
  const convertedValue = canConvert ? convertUnit(numericValue, fromUnit, toUnit) : null
  const formattedResult = convertedValue === null ? '' : formatNumber(convertedValue)
  const formulaPreview = canConvert
    ? `${formatNumber(numericValue)} ${fromUnit.symbol} = ${formattedResult} ${toUnit.symbol}`
    : 'Enter a number to calculate the conversion.'

  const selectCategory = (nextCategory: UnitCategory) => {
    const nextGroup = unitGroups.find(({ id }) => id === nextCategory)

    if (!nextGroup) return

    const defaults = getDefaultUnits(nextGroup)
    setCategory(nextCategory)
    setFromUnitId(defaults.from)
    setToUnitId(defaults.to)
    setCopied(false)
  }

  const swapUnits = () => {
    setFromUnitId(toUnit.id)
    setToUnitId(fromUnit.id)
    setCopied(false)
  }

  const loadPreset = (preset: (typeof presets)[number]) => {
    setCategory(preset.category)
    setInputValue(preset.value)
    setFromUnitId(preset.fromUnit)
    setToUnitId(preset.toUnit)
    setCopied(false)
  }

  const copyResult = async () => {
    if (!formattedResult) return

    await navigator.clipboard.writeText(`${formattedResult} ${toUnit.symbol}`)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  const clearConverter = () => {
    setCategory('length')
    setInputValue('')
    setFromUnitId('centimeter')
    setToUnitId('meter')
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
        <span className="text-xs font-bold text-primary">Unit Converter</span>
      </nav>

      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-normal text-foreground sm:text-4xl">
          Unit Converter
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Convert everyday measurements across length, weight, temperature, area, volume, speed, and digital storage.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_16rem]">
        <div className="min-w-0 flex-1">
          <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
            <div className="flex min-h-16 flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/70 px-4 py-3">
              <div className="flex flex-wrap gap-2">
                {presets.slice(0, 2).map((preset) => (
                  <Button
                    key={preset.label}
                    type="button"
                    size="sm"
                    className="gap-1.5 font-bold"
                    onClick={() => loadPreset(preset)}
                  >
                    <Sparkles className="size-3.5" aria-hidden="true" />
                    {preset.label}
                  </Button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden text-[10px] font-semibold text-muted-foreground sm:block">
                  {activeGroup.label} / base: {activeGroup.baseUnit}
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => void copyResult()}
                    aria-label="Copy converted value"
                    disabled={!formattedResult}
                  >
                    {copied ? <Check aria-hidden="true" /> : <Clipboard aria-hidden="true" />}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={swapUnits}
                    aria-label="Swap units"
                  >
                    <Repeat2 aria-hidden="true" />
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

            <div className="grid grid-cols-1 divide-y divide-border lg:grid-cols-[16rem_minmax(0,1fr)] lg:divide-x lg:divide-y-0">
              <div className="bg-muted/20 p-4">
                <div className="mb-3 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Measurement Type
                </div>
                <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
                  {unitGroups.map(({ id, label, icon: Icon, description }) => (
                    <button
                      key={id}
                      type="button"
                      className={cn(
                        'flex min-h-14 items-center gap-3 rounded-md border px-3 py-2 text-left transition-colors',
                        category === id
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground',
                      )}
                      onClick={() => selectCategory(id)}
                    >
                      <Icon className="size-4 shrink-0" aria-hidden="true" />
                      <span className="min-w-0">
                        <span className="block text-xs font-bold">{label}</span>
                        <span
                          className={cn(
                            'mt-0.5 hidden truncate text-[10px] sm:block',
                            category === id ? 'text-primary-foreground/80' : 'text-muted-foreground',
                          )}
                        >
                          {description}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 divide-y divide-border xl:grid-cols-2 xl:divide-x xl:divide-y-0">
                <div className="flex min-h-96 flex-col p-4">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Convert From
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{activeGroup.description}</p>
                    </div>
                    <activeGroup.icon className="size-5 text-primary" aria-hidden="true" />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="unitValue" className="mb-2 block text-xs font-semibold text-foreground">
                        Value
                      </label>
                      <input
                        id="unitValue"
                        type="number"
                        value={inputValue}
                        onChange={(event) => {
                          setInputValue(event.target.value)
                          setCopied(false)
                        }}
                        placeholder="Enter a number"
                        className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm font-semibold text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_2.5rem_minmax(0,1fr)]">
                      <div>
                        <label htmlFor="fromUnit" className="mb-2 block text-xs font-semibold text-foreground">
                          From
                        </label>
                        <select
                          id="fromUnit"
                          value={fromUnit.id}
                          onChange={(event) => {
                            setFromUnitId(event.target.value)
                            setCopied(false)
                          }}
                          className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
                        >
                          {activeGroup.units.map((unit) => (
                            <option key={unit.id} value={unit.id}>
                              {unit.label} ({unit.symbol})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-end justify-center">
                        <Button
                          type="button"
                          variant="secondary"
                          size="icon-sm"
                          onClick={swapUnits}
                          aria-label="Swap selected units"
                        >
                          <Repeat2 aria-hidden="true" />
                        </Button>
                      </div>

                      <div>
                        <label htmlFor="toUnit" className="mb-2 block text-xs font-semibold text-foreground">
                          To
                        </label>
                        <select
                          id="toUnit"
                          value={toUnit.id}
                          onChange={(event) => {
                            setToUnitId(event.target.value)
                            setCopied(false)
                          }}
                          className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
                        >
                          {activeGroup.units.map((unit) => (
                            <option key={unit.id} value={unit.id}>
                              {unit.label} ({unit.symbol})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="rounded-md border border-border bg-background p-3">
                      <div className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Quick Conversions
                      </div>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {presets.map((preset) => (
                          <button
                            key={preset.label}
                            type="button"
                            className="rounded-md border border-border px-3 py-2 text-left text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            onClick={() => loadPreset(preset)}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex min-h-96 flex-col bg-card p-4">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Converted Result
                    </div>
                    <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                      {activeGroup.label}
                    </span>
                  </div>

                  {formattedResult ? (
                    <div className="flex flex-1 flex-col justify-between gap-5 rounded-md border border-dashed border-border bg-muted/30 p-4">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground">{fromUnit.label} to {toUnit.label}</p>
                        <div className="mt-3 wrap-break-word text-4xl font-bold tracking-normal text-foreground">
                          {formattedResult}
                        </div>
                        <p className="mt-2 text-sm font-semibold text-primary">{toUnit.symbol}</p>
                      </div>

                      <div className="space-y-3">
                        <div className="rounded-md border border-border bg-background px-3 py-2">
                          <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                            Formula
                          </div>
                          <p className="wrap-break-word font-mono text-xs leading-5 text-foreground">{formulaPreview}</p>
                        </div>
                        <Button
                          type="button"
                          className="w-full gap-1.5 font-bold"
                          onClick={() => void copyResult()}
                        >
                          {copied ? <Check className="size-3.5" aria-hidden="true" /> : <Clipboard className="size-3.5" aria-hidden="true" />}
                          Copy Result
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex min-h-80 flex-1 flex-col items-center justify-center gap-3 rounded-md border border-dashed border-border bg-muted/30 p-4 text-center">
                      <div className="flex size-16 items-center justify-center rounded-full bg-muted">
                        <Ruler className="size-7 text-muted-foreground" aria-hidden="true" />
                      </div>
                      <p className="max-w-xs text-sm text-muted-foreground">
                        Enter a value, choose a measurement type, and select the units you want to convert.
                      </p>
                    </div>
                  )}

                  <p className="mt-4 text-[11px] leading-5 text-muted-foreground">
                    Calculations run locally in your browser and use standard metric, imperial, and binary storage factors.
                  </p>
                </div>
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
