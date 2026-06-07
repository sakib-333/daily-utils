# Daily Utils

Daily Utils is a React and TypeScript web app that provides free, browser-based utilities for everyday tasks. It includes developer tools, converters, calculators, text helpers, image tools, and productivity utilities behind a clean responsive interface.

## Features

- Home page with featured utilities, service categories, and product positioning.
- Services directory with quick access to every utility route.
- Utility pages for JSON formatting, password generation, QR codes, UUIDs, age calculation, Markdown preview, color picking, Base64 conversion, text case conversion, URL encoding, unit conversion, math tools, stopwatch, and image resizing.
- About and contact pages with polished product content.
- Contact form integration through EmailJS.
- Dark/light theme support with persisted preference.
- Responsive UI built with Tailwind CSS, Base UI, and Lucide icons.
- File-based routing with TanStack Router and automatic route code splitting.

## Tech Stack

- React 19
- TypeScript 6
- Vite 8
- TanStack Router
- Tailwind CSS 4
- Base UI
- Lucide React
- EmailJS
- React Toastify
- React Markdown with remark-gfm
- QRCode

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Run linting:

```bash
npm run lint
```

## Environment Variables

The contact page uses EmailJS. Create a `.env.local` file in the project root and add:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

If these values are missing, the contact form will show a configuration error instead of sending a message.

## Project Structure

```text
src/
  assets/              Static images and visual assets
  components/          Shared layout, marketing, and UI components
  components/ui/       Reusable UI primitives
  lib/                 Shared utility helpers
  routes/              TanStack Router route components
  index.css            Global Tailwind styles and theme tokens
  main.tsx             App entry point
```

## Main Routes

- `/` - Home page
- `/services` - Full utility directory
- `/about` - Product and mission page
- `/contact` - Contact and support form
- `/json-formater` - JSON formatter
- `/password-generator` - Password generator
- `/qr-generator` - QR code generator
- `/uuid-generator` - UUID generator
- `/age-calculator` - Age calculator
- `/markdown-previewer` - Markdown previewer
- `/color-picker` - Color picker
- `/base64-converter` - Base64 converter
- `/text-case-converter` - Text case converter
- `/url-encoder` - URL encoder and decoder
- `/unit-converter` - Unit converter
- `/math-tools` - Math tools
- `/stopwatch` - Stopwatch
- `/image-resizer` - Image resizer

## Notes

Most tools run directly in the browser, keeping common formatting, conversion, generation, and calculation workflows fast and lightweight. The app is private by default where possible, with no account requirement for using the utilities.
