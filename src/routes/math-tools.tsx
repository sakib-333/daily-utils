import { useMemo, useState } from 'react'
import {
  Braces,
  Calculator,
  Calendar,
  Check,
  ChevronRight,
  Clipboard,
  Code,
  Delete,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  Percent,
  Ruler,
  Sigma,
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

type ToolMode = 'calculator' | 'percentage' | 'statistics'

type StatSummary = {
  count: number
  sum: number
  average: number
  median: number
  min: number
  max: number
  range: number
}

const relatedTools: RelatedTool[] = [
  { title: 'Unit Converter', href: '/unit-converter', icon: Ruler },
  { title: 'Age Calculator', href: '/age-calculator', icon: Calendar },
  { title: 'JSON Formatter', href: '/json-formater', icon: Braces },
  { title: 'Markdown Previewer', href: '/markdown-previewer', icon: FileText },
  { title: 'Base64 Converter', href: '/base64-converter', icon: Code },
  { title: 'Text Case Converter', href: '/text-case-converter', icon: WholeWord },
  { title: 'URL Encoder', href: '/url-encoder', icon: LinkIcon },
  { title: 'Image Resizer', href: '/image-resizer', icon: ImageIcon },
  { title: 'Math Tools', href: '/math-tools', icon: Calculator, isActive: true },
]

const toolModes: { value: ToolMode; label: string; description: string; icon: LucideIcon }[] = [
  {
    value: 'calculator',
    label: 'Calculator',
    description: 'Run clean arithmetic expressions with parentheses and percentages.',
    icon: Calculator,
  },
  {
    value: 'percentage',
    label: 'Percentages',
    description: 'Calculate percent of, percentage share, and percent change.',
    icon: Percent,
  },
  {
    value: 'statistics',
    label: 'Statistics',
    description: 'Summarize lists of numbers with totals, averages, and ranges.',
    icon: Sigma,
  },
]

const calculatorSample = '(1250 * 0.18) + 49.99'
const statsSample = '42, 55, 61, 61, 74, 88, 93'

function evaluateExpression(expression: string) {
  const trimmedExpression = expression.trim()

  if (!trimmedExpression) {
    return { result: '', error: '' }
  }

  if (!/^[\d+\-*/().\s^%]+$/.test(trimmedExpression)) {
    return {
      result: '',
      error: 'Use numbers, parentheses, and arithmetic operators only.',
    }
  }

  try {
    const normalizedExpression = trimmedExpression
      .replace(/(\d+(?:\.\d+)?)%/g, '($1/100)')
      .replace(/\^/g, '**')

    const value = Function(`"use strict"; return (${normalizedExpression})`)() as unknown

    if (typeof value !== 'number' || !Number.isFinite(value)) {
      throw new Error('Invalid result')
    }

    return { result: formatNumber(value), error: '' }
  } catch {
    return {
      result: '',
      error: 'This expression could not be calculated. Check the operators and parentheses.',
    }
  }
}

function parseNumber(value: string) {
  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

function parseNumberList(value: string) {
  return value
    .split(/[\s,;]+/)
    .map((item) => Number(item.trim()))
    .filter((item) => Number.isFinite(item))
}

function getStatistics(numbers: number[]): StatSummary | null {
  if (numbers.length === 0) {
    return null
  }

  const sortedNumbers = [...numbers].sort((a, b) => a - b)
  const sum = numbers.reduce((total, number) => total + number, 0)
  const middleIndex = Math.floor(sortedNumbers.length / 2)
  const median =
    sortedNumbers.length % 2 === 0
      ? (sortedNumbers[middleIndex - 1] + sortedNumbers[middleIndex]) / 2
      : sortedNumbers[middleIndex]
  const min = sortedNumbers[0]
  const max = sortedNumbers[sortedNumbers.length - 1]

  return {
    count: numbers.length,
    sum,
    average: sum / numbers.length,
    median,
    min,
    max,
    range: max - min,
  }
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: Math.abs(value) >= 1000 ? 2 : 6,
  }).format(value)
}

function buildPercentageResults(percentText: string, baseText: string, startText: string, endText: string) {
  const percent = parseNumber(percentText)
  const base = parseNumber(baseText)
  const start = parseNumber(startText)
  const end = parseNumber(endText)

  return {
    percentOf: percent !== null && base !== null ? (percent / 100) * base : null,
    share: percent !== null && base !== null && base !== 0 ? (percent / base) * 100 : null,
    change: start !== null && end !== null && start !== 0 ? ((end - start) / start) * 100 : null,
    difference: start !== null && end !== null ? end - start : null,
  }
}

export const Route = createFileRoute('/math-tools')({
  component: RouteComponent,
})

function RouteComponent() {
  const [mode, setMode] = useState<ToolMode>('calculator')
  const [expression, setExpression] = useState(calculatorSample)
  const [percentValue, setPercentValue] = useState('18')
  const [baseValue, setBaseValue] = useState('1250')
  const [startValue, setStartValue] = useState('80')
  const [endValue, setEndValue] = useState('104')
  const [numberList, setNumberList] = useState(statsSample)
  const [copied, setCopied] = useState(false)

  const calculatorResult = useMemo(() => evaluateExpression(expression), [expression])
  const parsedNumbers = useMemo(() => parseNumberList(numberList), [numberList])
  const statistics = useMemo(() => getStatistics(parsedNumbers), [parsedNumbers])
  const percentageResults = useMemo(
    () => buildPercentageResults(percentValue, baseValue, startValue, endValue),
    [baseValue, endValue, percentValue, startValue],
  )

  const activeMode = toolModes.find(({ value }) => value === mode) ?? toolModes[0]
  const primaryOutput =
    mode === 'calculator'
      ? calculatorResult.result
      : mode === 'percentage'
        ? percentageResults.percentOf === null
          ? ''
          : formatNumber(percentageResults.percentOf)
        : statistics
          ? formatNumber(statistics.average)
          : ''

  const appendExpression = (value: string) => {
    setExpression((currentExpression) => `${currentExpression}${value}`)
    setCopied(false)
  }

  const backspaceExpression = () => {
    setExpression((currentExpression) => currentExpression.slice(0, -1))
    setCopied(false)
  }

  const loadSample = () => {
    if (mode === 'calculator') {
      setExpression(calculatorSample)
    } else if (mode === 'percentage') {
      setPercentValue('18')
      setBaseValue('1250')
      setStartValue('80')
      setEndValue('104')
    } else {
      setNumberList(statsSample)
    }

    setCopied(false)
  }

  const copyPrimaryOutput = async () => {
    if (!primaryOutput) return

    await navigator.clipboard.writeText(primaryOutput)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  const clearTools = () => {
    setExpression('')
    setPercentValue('')
    setBaseValue('')
    setStartValue('')
    setEndValue('')
    setNumberList('')
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
        <span className="text-xs font-bold text-primary">Math Tools</span>
      </nav>

      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-normal text-foreground sm:text-4xl">
          Math Tools
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Run everyday calculations, percentage checks, and quick number summaries from one focused workspace.
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
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden text-[10px] font-semibold text-muted-foreground sm:block">
                  {activeMode.label} / local calculation
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => void copyPrimaryOutput()}
                    aria-label="Copy primary result"
                    disabled={!primaryOutput}
                  >
                    {copied ? <Check aria-hidden="true" /> : <Clipboard aria-hidden="true" />}
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon-sm"
                    onClick={clearTools}
                    aria-label="Clear math tools"
                  >
                    <Trash2 aria-hidden="true" />
                  </Button>
                </div>
              </div>
            </div>

            {calculatorResult.error && mode === 'calculator' ? (
              <p className="border-b border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {calculatorResult.error}
              </p>
            ) : null}

            <div className="grid grid-cols-1 divide-y divide-border lg:grid-cols-[16rem_minmax(0,1fr)] lg:divide-x lg:divide-y-0">
              <div className="bg-muted/20 p-4">
                <div className="mb-3 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Tool Type
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {toolModes.map(({ value, label, description, icon: Icon }) => (
                    <button
                      key={value}
                      type="button"
                      className={cn(
                        'flex min-h-16 items-center gap-3 rounded-md border px-3 py-2 text-left transition-colors',
                        mode === value
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground',
                      )}
                      onClick={() => {
                        setMode(value)
                        setCopied(false)
                      }}
                    >
                      <Icon className="size-4 shrink-0" aria-hidden="true" />
                      <span className="min-w-0">
                        <span className="block text-xs font-bold">{label}</span>
                        <span
                          className={cn(
                            'mt-0.5 block text-[10px] leading-4',
                            mode === value ? 'text-primary-foreground/80' : 'text-muted-foreground',
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
                        Input
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{activeMode.description}</p>
                    </div>
                    <activeMode.icon className="size-5 text-primary" aria-hidden="true" />
                  </div>

                  {mode === 'calculator' ? (
                    <div className="space-y-4">
                      <textarea
                        className="min-h-24 w-full resize-none rounded-md border border-border bg-background p-3 font-mono text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
                        placeholder="Type an expression, for example: (1250 * 0.18) + 49.99"
                        value={expression}
                        onChange={(event) => {
                          setExpression(event.target.value)
                          setCopied(false)
                        }}
                        spellCheck={false}
                      />

                      <div className="grid grid-cols-4 gap-2">
                        {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '%', '+'].map((key) => (
                          <button
                            key={key}
                            type="button"
                            className="h-10 rounded-md border border-border bg-background text-sm font-bold text-foreground transition-colors hover:bg-muted"
                            onClick={() => appendExpression(key)}
                          >
                            {key}
                          </button>
                        ))}
                        <button
                          type="button"
                          className="h-10 rounded-md border border-border bg-background text-sm font-bold text-foreground transition-colors hover:bg-muted"
                          onClick={() => appendExpression('(')}
                        >
                          (
                        </button>
                        <button
                          type="button"
                          className="h-10 rounded-md border border-border bg-background text-sm font-bold text-foreground transition-colors hover:bg-muted"
                          onClick={() => appendExpression(')')}
                        >
                          )
                        </button>
                        <button
                          type="button"
                          className="h-10 rounded-md border border-border bg-background text-sm font-bold text-foreground transition-colors hover:bg-muted"
                          onClick={() => appendExpression('^')}
                        >
                          ^
                        </button>
                        <button
                          type="button"
                          className="inline-flex h-10 items-center justify-center rounded-md border border-border bg-background text-sm font-bold text-foreground transition-colors hover:bg-muted"
                          onClick={backspaceExpression}
                          aria-label="Remove last character"
                        >
                          <Delete className="size-4" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  ) : null}

                  {mode === 'percentage' ? (
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <label htmlFor="percentValue" className="mb-2 block text-xs font-semibold text-foreground">
                            Percent
                          </label>
                          <input
                            id="percentValue"
                            type="number"
                            value={percentValue}
                            onChange={(event) => {
                              setPercentValue(event.target.value)
                              setCopied(false)
                            }}
                            className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
                          />
                        </div>
                        <div>
                          <label htmlFor="baseValue" className="mb-2 block text-xs font-semibold text-foreground">
                            Value
                          </label>
                          <input
                            id="baseValue"
                            type="number"
                            value={baseValue}
                            onChange={(event) => {
                              setBaseValue(event.target.value)
                              setCopied(false)
                            }}
                            className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
                          />
                        </div>
                      </div>

                      <div className="rounded-md border border-border bg-background p-3">
                        <div className="mb-3 text-xs font-semibold text-foreground">Percent change</div>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div>
                            <label htmlFor="startValue" className="mb-2 block text-xs font-semibold text-muted-foreground">
                              Start value
                            </label>
                            <input
                              id="startValue"
                              type="number"
                              value={startValue}
                              onChange={(event) => {
                                setStartValue(event.target.value)
                                setCopied(false)
                              }}
                              className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
                            />
                          </div>
                          <div>
                            <label htmlFor="endValue" className="mb-2 block text-xs font-semibold text-muted-foreground">
                              End value
                            </label>
                            <input
                              id="endValue"
                              type="number"
                              value={endValue}
                              onChange={(event) => {
                                setEndValue(event.target.value)
                                setCopied(false)
                              }}
                              className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {mode === 'statistics' ? (
                    <div className="space-y-4">
                      <label htmlFor="numberList" className="block text-xs font-semibold text-foreground">
                        Number list
                      </label>
                      <textarea
                        id="numberList"
                        className="min-h-64 w-full resize-none rounded-md border border-border bg-background p-3 font-mono text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
                        placeholder="Paste numbers separated by commas, spaces, or new lines..."
                        value={numberList}
                        onChange={(event) => {
                          setNumberList(event.target.value)
                          setCopied(false)
                        }}
                        spellCheck={false}
                      />
                      <p className="text-[11px] leading-5 text-muted-foreground">
                        Parsed {parsedNumbers.length} valid numbers from the input.
                      </p>
                    </div>
                  ) : null}
                </div>

                <div className="flex min-h-96 flex-col bg-card p-4">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Results
                    </div>
                    <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                      {activeMode.label}
                    </span>
                  </div>

                  {mode === 'calculator' ? (
                    <div className="flex flex-1 flex-col justify-between gap-5 rounded-md border border-dashed border-border bg-muted/30 p-4">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground">Expression result</p>
                        <div className="mt-3 wrap-break-word text-4xl font-bold tracking-normal text-foreground">
                          {calculatorResult.result || '0'}
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="rounded-md border border-border bg-background px-3 py-2">
                          <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                            Supported
                          </div>
                          <p className="font-mono text-xs leading-5 text-foreground">
                            +, -, *, /, ^, %, and parentheses
                          </p>
                        </div>
                        <Button
                          type="button"
                          className="w-full gap-1.5 font-bold"
                          onClick={() => void copyPrimaryOutput()}
                          disabled={!calculatorResult.result}
                        >
                          {copied ? <Check className="size-3.5" aria-hidden="true" /> : <Clipboard className="size-3.5" aria-hidden="true" />}
                          Copy Result
                        </Button>
                      </div>
                    </div>
                  ) : null}

                  {mode === 'percentage' ? (
                    <div className="grid flex-1 grid-cols-1 gap-3">
                      {[
                        ['Percent of value', percentageResults.percentOf],
                        ['Share of value', percentageResults.share, '%'],
                        ['Percent change', percentageResults.change, '%'],
                        ['Difference', percentageResults.difference],
                      ].map(([label, value, suffix]) => (
                        <div key={String(label)} className="rounded-md border border-border bg-background p-3">
                          <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                            {label}
                          </div>
                          <p className="mt-2 wrap-break-word text-2xl font-bold text-foreground">
                            {typeof value === 'number' ? `${formatNumber(value)}${suffix ?? ''}` : '0'}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {mode === 'statistics' ? (
                    statistics ? (
                      <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
                        {[
                          ['Count', statistics.count],
                          ['Sum', statistics.sum],
                          ['Average', statistics.average],
                          ['Median', statistics.median],
                          ['Minimum', statistics.min],
                          ['Maximum', statistics.max],
                          ['Range', statistics.range],
                        ].map(([label, value]) => (
                          <div key={String(label)} className="rounded-md border border-border bg-background p-3">
                            <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                              {label}
                            </div>
                            <p className="mt-2 wrap-break-word text-xl font-bold text-foreground">
                              {typeof value === 'number' ? formatNumber(value) : value}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex min-h-80 flex-1 flex-col items-center justify-center gap-3 rounded-md border border-dashed border-border bg-muted/30 p-4 text-center">
                        <div className="flex size-16 items-center justify-center rounded-full bg-muted">
                          <Sigma className="size-7 text-muted-foreground" aria-hidden="true" />
                        </div>
                        <p className="max-w-xs text-sm text-muted-foreground">
                          Add a list of numbers to generate a statistics summary.
                        </p>
                      </div>
                    )
                  ) : null}

                  <p className="mt-4 text-[11px] leading-5 text-muted-foreground">
                    Math tools run locally in your browser and are intended for everyday calculations, estimates, and quick checks.
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
