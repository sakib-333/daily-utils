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

type AgeBreakdown = {
  years: number
  months: number
  days: number
}

type AgeResult = {
  breakdown: AgeBreakdown
  totalDays: number
  totalWeeks: number
  totalHours: number
  nextBirthday: Date
  daysUntilBirthday: number
  birthWeekday: string
  zodiacSign: string
}

const relatedTools: RelatedTool[] = [
  { title: 'JSON Formatter', href: '/json-formater', icon: Braces },
  { title: 'UUID Generator', href: '/uuid-generator', icon: Fingerprint },
  { title: 'Password Generator', href: '/password-generator', icon: KeyRound },
  { title: 'Age Calculator', href: '/age-calculator', icon: Calendar, isActive: true },
  { title: 'QR Generator', href: '/qr-generator', icon: QrCode },
  { title: 'Markdown Previewer', href: '/markdown-previewer', icon: FileText },
]

const zodiacSigns = [
  { sign: 'Capricorn', start: [12, 22], end: [1, 19] },
  { sign: 'Aquarius', start: [1, 20], end: [2, 18] },
  { sign: 'Pisces', start: [2, 19], end: [3, 20] },
  { sign: 'Aries', start: [3, 21], end: [4, 19] },
  { sign: 'Taurus', start: [4, 20], end: [5, 20] },
  { sign: 'Gemini', start: [5, 21], end: [6, 20] },
  { sign: 'Cancer', start: [6, 21], end: [7, 22] },
  { sign: 'Leo', start: [7, 23], end: [8, 22] },
  { sign: 'Virgo', start: [8, 23], end: [9, 22] },
  { sign: 'Libra', start: [9, 23], end: [10, 22] },
  { sign: 'Scorpio', start: [10, 23], end: [11, 21] },
  { sign: 'Sagittarius', start: [11, 22], end: [12, 21] },
] as const

function formatDateInput(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function parseDateInput(value: string) {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function isValidDateInput(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false
  }

  const parsedDate = parseDateInput(value)
  return formatDateInput(parsedDate) === value
}

function calculateAgeBreakdown(birthDate: Date, referenceDate: Date): AgeBreakdown {
  let years = referenceDate.getFullYear() - birthDate.getFullYear()
  let months = referenceDate.getMonth() - birthDate.getMonth()
  let days = referenceDate.getDate() - birthDate.getDate()

  if (days < 0) {
    months -= 1
    const daysInPreviousMonth = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 0).getDate()
    days += daysInPreviousMonth
  }

  if (months < 0) {
    years -= 1
    months += 12
  }

  return { years, months, days }
}

function getZodiacSign(date: Date) {
  const month = date.getMonth() + 1
  const day = date.getDate()

  for (const { sign, start, end } of zodiacSigns) {
    const [startMonth, startDay] = start
    const [endMonth, endDay] = end

    if (startMonth > endMonth) {
      if ((month === startMonth && day >= startDay) || (month === endMonth && day <= endDay) || month > startMonth || month < endMonth) {
        return sign
      }
      continue
    }

    if (
      (month === startMonth && day >= startDay) ||
      (month === endMonth && day <= endDay) ||
      (month > startMonth && month < endMonth)
    ) {
      return sign
    }
  }

  return 'Capricorn'
}

function getNextBirthday(birthDate: Date, referenceDate: Date) {
  const birthMonth = birthDate.getMonth()
  const birthDay = birthDate.getDate()

  let nextBirthday = new Date(referenceDate.getFullYear(), birthMonth, birthDay)

  if (nextBirthday.getTime() <= referenceDate.getTime()) {
    nextBirthday = new Date(referenceDate.getFullYear() + 1, birthMonth, birthDay)
  }

  const daysUntilBirthday = Math.round(
    (nextBirthday.getTime() - referenceDate.getTime()) / (1000 * 60 * 60 * 24),
  )

  return { nextBirthday, daysUntilBirthday }
}

function calculateAge(birthDateValue: string, referenceDateValue: string): AgeResult | null {
  if (!isValidDateInput(birthDateValue) || !isValidDateInput(referenceDateValue)) {
    return null
  }

  const birthDate = parseDateInput(birthDateValue)
  const referenceDate = parseDateInput(referenceDateValue)

  if (birthDate.getTime() > referenceDate.getTime()) {
    return null
  }

  const breakdown = calculateAgeBreakdown(birthDate, referenceDate)
  const totalDays = Math.floor((referenceDate.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24))
  const { nextBirthday, daysUntilBirthday } = getNextBirthday(birthDate, referenceDate)

  return {
    breakdown,
    totalDays,
    totalWeeks: Math.floor(totalDays / 7),
    totalHours: totalDays * 24,
    nextBirthday,
    daysUntilBirthday,
    birthWeekday: birthDate.toLocaleDateString('en-US', { weekday: 'long' }),
    zodiacSign: getZodiacSign(birthDate),
  }
}

function formatLongDate(date: Date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function formatResultSummary(result: AgeResult) {
  const { breakdown, totalDays, daysUntilBirthday, nextBirthday, birthWeekday, zodiacSign } = result

  return [
    `Age: ${breakdown.years} years, ${breakdown.months} months, ${breakdown.days} days`,
    `Total days lived: ${totalDays.toLocaleString()}`,
    `Born on: ${birthWeekday}`,
    `Zodiac sign: ${zodiacSign}`,
    `Next birthday: ${formatLongDate(nextBirthday)} (${daysUntilBirthday} days away)`,
  ].join('\n')
}

export const Route = createFileRoute('/age-calculator')({
  component: RouteComponent,
})

function RouteComponent() {
  const today = formatDateInput(new Date())
  const [birthDate, setBirthDate] = useState('')
  const [referenceDate, setReferenceDate] = useState(today)
  const [result, setResult] = useState<AgeResult | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const calculateAgeResult = () => {
    if (!birthDate) {
      setError('Select your date of birth to calculate age.')
      setResult(null)
      return
    }

    if (!isValidDateInput(birthDate) || !isValidDateInput(referenceDate)) {
      setError('Enter valid dates in YYYY-MM-DD format.')
      setResult(null)
      return
    }

    const birth = parseDateInput(birthDate)
    const reference = parseDateInput(referenceDate)

    if (birth.getTime() > reference.getTime()) {
      setError('Date of birth cannot be later than the reference date.')
      setResult(null)
      return
    }

    const ageResult = calculateAge(birthDate, referenceDate)

    if (ageResult === null) {
      setError('Unable to calculate age with the selected dates.')
      setResult(null)
      return
    }

    setError('')
    setResult(ageResult)
    setCopied(false)
  }

  const copyToClipboard = async () => {
    if (!result) return

    await navigator.clipboard.writeText(formatResultSummary(result))
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  const clearCalculator = () => {
    setBirthDate('')
    setReferenceDate(today)
    setResult(null)
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
        <span className="text-xs font-bold text-primary">Age Calculator</span>
      </nav>

      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-normal text-foreground sm:text-4xl">
          Age Calculator
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Calculate exact age in years, months, and days from your birth date with helpful lifetime stats.
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
                  onClick={calculateAgeResult}
                >
                  <Sparkles className="size-3.5" aria-hidden="true" />
                  Calculate
                </Button>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => void copyToClipboard()}
                  aria-label="Copy age summary"
                  disabled={!result}
                >
                  {copied ? <Check aria-hidden="true" /> : <Clipboard aria-hidden="true" />}
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon-sm"
                  onClick={clearCalculator}
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
              <div className="flex flex-col p-4">
                <div className="mb-4 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Input
                </div>

                <div className="space-y-5">
                  <div>
                    <label htmlFor="birthDate" className="mb-2 block text-xs font-semibold text-foreground">
                      Date of birth
                    </label>
                    <input
                      id="birthDate"
                      type="date"
                      value={birthDate}
                      max={referenceDate}
                      onChange={(event) => {
                        setBirthDate(event.target.value)
                        setCopied(false)
                      }}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary"
                    />
                  </div>

                  <div>
                    <label htmlFor="referenceDate" className="mb-2 block text-xs font-semibold text-foreground">
                      Calculate age as of
                    </label>
                    <input
                      id="referenceDate"
                      type="date"
                      value={referenceDate}
                      onChange={(event) => {
                        setReferenceDate(event.target.value)
                        setCopied(false)
                      }}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary"
                    />
                    <p className="mt-2 text-[11px] leading-5 text-muted-foreground">
                      Defaults to today. Change this to calculate age on a past or future date.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex min-h-80 flex-col bg-card p-4">
                <div className="mb-3 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Age Result
                </div>

                <div className="flex min-h-0 flex-1 flex-col justify-center rounded-md border border-dashed border-border bg-muted/30 p-4">
                  {result ? (
                    <div className="space-y-5">
                      <div className="text-center">
                        <p className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                          {result.breakdown.years}
                          <span className="ml-1 text-base font-semibold text-muted-foreground">years</span>
                        </p>
                        <p className="mt-1 text-lg font-semibold text-foreground">
                          {result.breakdown.months} months, {result.breakdown.days} days
                        </p>
                      </div>

                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {[
                          ['Total days', result.totalDays.toLocaleString()],
                          ['Total weeks', result.totalWeeks.toLocaleString()],
                          ['Born on', result.birthWeekday],
                          ['Zodiac sign', result.zodiacSign],
                          ['Next birthday', formatLongDate(result.nextBirthday)],
                          ['Days until birthday', result.daysUntilBirthday.toLocaleString()],
                        ].map(([label, value]) => (
                          <div
                            key={label}
                            className="rounded-md border border-border bg-background px-3 py-2"
                          >
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                              {label}
                            </p>
                            <p className="mt-1 text-xs font-semibold text-foreground">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3 text-center">
                      <div className="flex size-16 items-center justify-center rounded-full bg-muted">
                        <Calendar className="size-7 text-muted-foreground" aria-hidden="true" />
                      </div>
                      <p className="max-w-xs text-sm text-muted-foreground">
                        Enter your birth date and click Calculate to see your exact age and lifetime stats.
                      </p>
                    </div>
                  )}
                </div>

                <p className="mt-4 text-[11px] leading-5 text-muted-foreground">
                  All calculations run locally in your browser using your selected dates.
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
