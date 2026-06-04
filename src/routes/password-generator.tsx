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

type PasswordOptions = {
  length: number
  lowercase: boolean
  uppercase: boolean
  numbers: boolean
  symbols: boolean
}

type PasswordStrength = 'weak' | 'fair' | 'strong'

const relatedTools: RelatedTool[] = [
  { title: 'JSON Formatter', href: '/json-formater', icon: Braces },
  { title: 'UUID Generator', href: '/uuid-generator', icon: Fingerprint },
  { title: 'Password Generator', href: '/password-generator', icon: KeyRound, isActive: true },
  { title: 'Age Calculator', href: '/age-calculator', icon: Calendar },
  { title: 'QR Generator', href: '/qr-generator', icon: QrCode },
  { title: 'Markdown Previewer', href: '/markdown-previewer', icon: FileText },
]

const CHARSETS = {
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
} as const

const defaultOptions: PasswordOptions = {
  length: 16,
  lowercase: true,
  uppercase: true,
  numbers: true,
  symbols: true,
}

function randomIndex(max: number) {
  const values = new Uint32Array(1)
  crypto.getRandomValues(values)
  return values[0] % max
}

function shuffleCharacters(characters: string[]) {
  const shuffled = [...characters]

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = randomIndex(index + 1)
    ;[shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]]
  }

  return shuffled
}

function generatePassword(options: PasswordOptions) {
  const pools: string[] = []
  const requiredCharacters: string[] = []

  if (options.lowercase) {
    pools.push(CHARSETS.lowercase)
    requiredCharacters.push(CHARSETS.lowercase[randomIndex(CHARSETS.lowercase.length)])
  }

  if (options.uppercase) {
    pools.push(CHARSETS.uppercase)
    requiredCharacters.push(CHARSETS.uppercase[randomIndex(CHARSETS.uppercase.length)])
  }

  if (options.numbers) {
    pools.push(CHARSETS.numbers)
    requiredCharacters.push(CHARSETS.numbers[randomIndex(CHARSETS.numbers.length)])
  }

  if (options.symbols) {
    pools.push(CHARSETS.symbols)
    requiredCharacters.push(CHARSETS.symbols[randomIndex(CHARSETS.symbols.length)])
  }

  if (pools.length === 0) {
    return null
  }

  const allCharacters = pools.join('')

  while (requiredCharacters.length < options.length) {
    requiredCharacters.push(allCharacters[randomIndex(allCharacters.length)])
  }

  return shuffleCharacters(requiredCharacters).join('')
}

function getPasswordStrength(options: PasswordOptions): PasswordStrength {
  const enabledTypes = [
    options.lowercase,
    options.uppercase,
    options.numbers,
    options.symbols,
  ].filter(Boolean).length

  if (options.length >= 16 && enabledTypes >= 4) {
    return 'strong'
  }

  if (options.length >= 12 && enabledTypes >= 3) {
    return 'fair'
  }

  return 'weak'
}

const strengthStyles: Record<
  PasswordStrength,
  { label: string; barClassName: string; textClassName: string; width: string }
> = {
  weak: {
    label: 'Weak',
    barClassName: 'bg-destructive',
    textClassName: 'text-destructive',
    width: 'w-1/3',
  },
  fair: {
    label: 'Fair',
    barClassName: 'bg-amber-500',
    textClassName: 'text-amber-600 dark:text-amber-400',
    width: 'w-2/3',
  },
  strong: {
    label: 'Strong',
    barClassName: 'bg-emerald-500',
    textClassName: 'text-emerald-600 dark:text-emerald-400',
    width: 'w-full',
  },
}

export const Route = createFileRoute('/password-generator')({
  component: RouteComponent,
})

function RouteComponent() {
  const [options, setOptions] = useState<PasswordOptions>(defaultOptions)
  const [password, setPassword] = useState(() => generatePassword(defaultOptions) ?? '')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const strength = getPasswordStrength(options)
  const strengthStyle = strengthStyles[strength]

  const generateNewPassword = () => {
    const nextPassword = generatePassword(options)

    if (nextPassword === null) {
      setError('Select at least one character type.')
      setPassword('')
      return
    }

    setError('')
    setPassword(nextPassword)
    setCopied(false)
  }

  const copyToClipboard = async () => {
    if (!password) return

    await navigator.clipboard.writeText(password)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  const resetOptions = () => {
    setOptions(defaultOptions)
    setPassword(generatePassword(defaultOptions) ?? '')
    setError('')
    setCopied(false)
  }

  const updateOption = <Key extends keyof PasswordOptions>(
    key: Key,
    value: PasswordOptions[Key],
  ) => {
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
        <span className="text-xs font-bold text-primary">Password Generator</span>
      </nav>

      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-normal text-foreground sm:text-4xl">
          Password Generator
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Create secure, random passwords with customizable length and character sets.
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
                  onClick={generateNewPassword}
                >
                  <Sparkles className="size-3.5" aria-hidden="true" />
                  Generate
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="gap-1.5 font-bold"
                  onClick={generateNewPassword}
                >
                  <RefreshCw className="size-3.5" aria-hidden="true" />
                  Regenerate
                </Button>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={copyToClipboard}
                  aria-label="Copy password to clipboard"
                  disabled={!password}
                >
                  {copied ? <Check aria-hidden="true" /> : <Clipboard aria-hidden="true" />}
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon-sm"
                  onClick={resetOptions}
                  aria-label="Reset options"
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
                  Options
                </div>

                <div className="space-y-5">
                  <div>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <label htmlFor="passwordLength" className="text-xs font-semibold text-foreground">
                        Password length
                      </label>
                      <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-xs font-bold text-primary">
                        {options.length}
                      </span>
                    </div>
                    <input
                      id="passwordLength"
                      type="range"
                      min={8}
                      max={64}
                      value={options.length}
                      onChange={(event) => updateOption('length', Number(event.target.value))}
                      className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary"
                    />
                    <div className="mt-1 flex justify-between text-[10px] font-medium text-muted-foreground">
                      <span>8</span>
                      <span>64</span>
                    </div>
                  </div>

                  <fieldset className="space-y-3">
                    <legend className="text-xs font-semibold text-foreground">Character types</legend>

                    {(
                      [
                        ['lowercase', 'Lowercase (a-z)'],
                        ['uppercase', 'Uppercase (A-Z)'],
                        ['numbers', 'Numbers (0-9)'],
                        ['symbols', 'Symbols (!@#$...)'],
                      ] as const
                    ).map(([key, label]) => (
                      <label
                        key={key}
                        className="flex cursor-pointer items-center gap-3 rounded-md border border-border bg-background px-3 py-2 transition-colors hover:bg-muted/50"
                      >
                        <input
                          type="checkbox"
                          checked={options[key]}
                          onChange={(event) => updateOption(key, event.target.checked)}
                          className="size-4 rounded border-border accent-primary"
                        />
                        <span className="text-xs font-medium text-foreground">{label}</span>
                      </label>
                    ))}
                  </fieldset>

                  <div>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className="text-xs font-semibold text-foreground">Estimated strength</span>
                      <span className={cn('text-xs font-bold', strengthStyle.textClassName)}>
                        {strengthStyle.label}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn('h-full rounded-full transition-all', strengthStyle.barClassName, strengthStyle.width)}
                        role="presentation"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex min-h-64 flex-col bg-card p-4">
                <div className="mb-3 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Generated Password
                </div>

                <div className="flex min-h-0 flex-1 flex-col justify-center rounded-md border border-dashed border-border bg-muted/30 p-4">
                  {password ? (
                    <p className="break-all font-mono text-lg leading-7 text-foreground sm:text-xl">
                      {password}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Choose your options and click Generate to create a password.
                    </p>
                  )}
                </div>

                <p className="mt-4 text-[11px] leading-5 text-muted-foreground">
                  Passwords are generated locally in your browser using cryptographically secure random values.
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
