import { useState, type FormEvent } from 'react'
import emailjs from '@emailjs/browser'
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Lightbulb,
  Mail,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Link, createFileRoute } from '@tanstack/react-router'
import { toast } from 'react-toastify'

type ContactForm = {
  name: string
  email: string
  topic: string
  message: string
}

const initialContactForm: ContactForm = {
  name: '',
  email: '',
  topic: '',
  message: '',
}

const emailServiceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
const emailTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const emailPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

const contactOptions = [
  {
    title: 'Product Support',
    description: 'Report bugs, broken tools, calculation issues, or unexpected behavior.',
    detail: 'support@dailyutils.app',
    icon: ShieldCheck,
  },
  {
    title: 'Feature Requests',
    description: 'Suggest a new utility, improvement, workflow, or format we should support.',
    detail: 'ideas@dailyutils.app',
    icon: Lightbulb,
  },
  {
    title: 'Partnerships',
    description: 'Start a conversation about integrations, educational use, or team workflows.',
    detail: 'hello@dailyutils.app',
    icon: MessageSquareText,
  },
]

const responseDetails = [
  'Typical reply within 1-2 business days.',
  'Critical tool issues are reviewed first.',
  'No account data or files are required for support.',
]

const messageChecklist = [
  'The tool or page you were using',
  'What you expected to happen',
  'What happened instead',
  'Browser, device, or screenshot if useful',
]

export const Route = createFileRoute('/contact')({
  component: RouteComponent,
})

function RouteComponent() {
  const [formData, setFormData] = useState<ContactForm>(initialContactForm)
  const [isSending, setIsSending] = useState(false)

  const updateField = (field: keyof ContactForm, value: string) => {
    setFormData((currentFormData) => ({
      ...currentFormData,
      [field]: value,
    }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!emailServiceId || !emailTemplateId || !emailPublicKey) {
      toast.error('Email service is not configured yet.')
      return
    }

    if (!formData.name.trim() || !formData.email.trim() || !formData.topic || !formData.message.trim()) {
      toast.error('Please complete all fields before sending.')
      return
    }

    setIsSending(true)

    try {
      await emailjs.send(
        emailServiceId,
        emailTemplateId,
        {
          from_name: formData.name.trim(),
          from_email: formData.email.trim(),
          reply_to: formData.email.trim(),
          topic: formData.topic,
          message: formData.message.trim(),
        },
        {
          publicKey: emailPublicKey,
        },
      )

      toast.success('Message sent successfully. We will get back to you soon.')
      setFormData(initialContactForm)
    } catch {
      toast.error('Message could not be sent. Please try again later.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-12">
      <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-2 overflow-x-auto whitespace-nowrap">
        <Link
          to="/"
          className="text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          Home
        </Link>
        <ChevronRight className="size-3 shrink-0 text-muted-foreground" aria-hidden="true" />
        <span className="text-xs font-bold text-primary">Contact</span>
      </nav>

      <div className="mb-10 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
        <header>
          <div className="mb-4 inline-flex items-center gap-2 rounded-md border border-border bg-muted/60 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="size-3.5" aria-hidden="true" />
            We are here to help
          </div>
          <h1 className="max-w-3xl text-3xl font-bold tracking-normal text-foreground sm:text-4xl">
            Contact Daily Utils
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
            Questions, bug reports, feature ideas, and collaboration requests are welcome. Send a clear message and we will route it to the right place.
          </p>
        </header>

        <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Clock3 className="size-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">Support Hours</h2>
              <p className="text-sm text-muted-foreground">Monday-Friday, 9:00-18:00</p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {responseDetails.map((detail) => (
              <div key={detail} className="flex gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                <span>{detail}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
          {contactOptions.map(({ title, description, detail, icon: Icon }) => (
            <article key={title} className="rounded-lg border border-border bg-card p-5 shadow-sm">
              <div className="mb-4 flex size-11 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </div>
              <h2 className="text-lg font-bold text-foreground">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
              <a
                href={`mailto:${detail}`}
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80 hover:underline"
              >
                {detail}
                <ArrowRight className="size-4" aria-hidden="true" />
              </a>
            </article>
          ))}

          <div className="rounded-lg border border-border bg-muted/60 p-5 md:col-span-3 lg:col-span-1 xl:col-span-3">
            <h2 className="text-lg font-bold text-foreground">Before you send a message</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              A few details help us understand the request faster and reply with something useful.
            </p>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {messageChecklist.map((item) => (
                <div key={item} className="flex min-h-11 items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="size-4 shrink-0 text-primary" aria-hidden="true" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-foreground">Quick Message</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Use this as a starting point for a clear support request.
              </p>
            </div>
            <Mail className="size-5 shrink-0 text-primary" aria-hidden="true" />
          </div>

          <form className="space-y-4" onSubmit={(event) => void handleSubmit(event)}>
            <div>
              <label htmlFor="contact-name" className="mb-2 block text-xs font-semibold text-foreground">
                Name
              </label>
              <input
                id="contact-name"
                type="text"
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
                placeholder="Your name"
                value={formData.name}
                onChange={(event) => updateField('name', event.target.value)}
                disabled={isSending}
              />
            </div>

            <div>
              <label htmlFor="contact-email" className="mb-2 block text-xs font-semibold text-foreground">
                Email
              </label>
              <input
                id="contact-email"
                type="email"
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(event) => updateField('email', event.target.value)}
                disabled={isSending}
              />
            </div>

            <div>
              <label htmlFor="contact-topic" className="mb-2 block text-xs font-semibold text-foreground">
                Topic
              </label>
              <select
                id="contact-topic"
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
                value={formData.topic}
                onChange={(event) => updateField('topic', event.target.value)}
                disabled={isSending}
              >
                <option value="" disabled>
                  Select a topic
                </option>
                <option>Product support</option>
                <option>Feature request</option>
                <option>Partnership</option>
                <option>General question</option>
              </select>
            </div>

            <div>
              <label htmlFor="contact-message" className="mb-2 block text-xs font-semibold text-foreground">
                Message
              </label>
              <textarea
                id="contact-message"
                className="min-h-32 w-full resize-none rounded-md border border-border bg-background p-3 text-sm leading-6 text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/15"
                placeholder="Tell us what you need help with..."
                value={formData.message}
                onChange={(event) => updateField('message', event.target.value)}
                disabled={isSending}
              />
            </div>

            <Button type="submit" className="w-full gap-1.5 font-bold" disabled={isSending}>
              <Mail className="size-4" aria-hidden="true" />
              {isSending ? 'Sending...' : 'Send Message'}
            </Button>
          </form>

          <p className="mt-4 text-xs leading-5 text-muted-foreground">
            Your message is sent securely through EmailJS. You can also use the email links for direct contact.
          </p>
        </aside>
      </div>
    </section>
  )
}
