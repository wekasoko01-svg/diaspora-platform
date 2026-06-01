# DiasporaLink Design System

Generated: 2026-06-01
Product: Diaspora Operations, Relocation, Verification & Concierge Platform

---

## Pattern

**Hero-Centric + Trust & Authority**

- Conversion: Emotion-driven with trust elements (testimonials, guarantees)
- CTA: Above fold, repeated after services and pricing
- Sections: Hero, Services, How It Works, Testimonials, Pricing, Contact

## Style

**Minimalism + Soft UI Evolution**

- Clean, professional, trustworthy
- Generous whitespace, readable typography
- Subtle shadows on cards, smooth transitions
- Best for: Service businesses, B2C professional services

## Colors

| Token | Light | Usage |
|-------|-------|-------|
| `--primary` | #237155 (green 600) | CTAs, links, accent elements |
| `--primary-foreground` | #ffffff | Text on primary |
| `--navy` | #2f4c73 (navy 600) | Headings, footer bg |
| `--background` | #ffffff | Page background |
| `--foreground` | #1f2d45 | Body text |
| `--muted` | #f1f5f9 | Section backgrounds |
| `--muted-foreground` | #64748b | Secondary text |
| `--border` | #e2e8f0 | Card borders, dividers |
| `--destructive` | #ef4444 | Error states |
| `--accent` | #237155 | Hover states |
| `--radius` | 0.5rem | Border radius |

## Typography

| Role | Font | Size | Weight | Line Height |
|------|------|------|--------|-------------|
| Display (h1) | Inter | 36-60px | 700 | 1.1 |
| Headline (h2) | Inter | 30-36px | 700 | 1.2 |
| Title (h3) | Inter | 20-24px | 600 | 1.3 |
| Body | Inter | 16px | 400 | 1.6 |
| Small | Inter | 14px | 400 | 1.5 |
| Label | Inter | 14px | 500 | 1.4 |

## Spacing Scale

| Token | px | rem | Usage |
|-------|----|-----|-------|
| space-1 | 4px | 0.25rem | Tiny gaps |
| space-2 | 8px | 0.5rem | Button padding, icon gaps |
| space-3 | 12px | 0.75rem | Form field gaps |
| space-4 | 16px | 1rem | Card padding, section spacing |
| space-6 | 24px | 1.5rem | Section padding |
| space-8 | 32px | 2rem | Page sections |
| space-12 | 48px | 3rem | Major page breaks |
| space-16 | 64px | 4rem | Page top padding |

## Breakpoints

- Mobile: 375px
- Tablet: 768px
- Desktop: 1024px
- Wide: 1440px

## Effects

- Card shadow: `0 1px 3px rgba(0,0,0,0.08)` default, `0 4px 12px rgba(0,0,0,0.1)` hover
- Transitions: 200ms ease for all interactive states
- Button hover: opacity 90% primary, background shift for outline
- Focus ring: 2px primary with 2px offset

## Key Components

### Buttons
- Primary: bg-primary, white text, rounded-lg, h-10 px-4
- Outline: border-primary, transparent bg, hover:bg-primary/5
- Ghost: transparent, hover:bg-muted
- Sizes: sm (h-9), md (h-10), lg (h-12)

### Cards
- bg-white, border, rounded-xl, shadow-sm
- Hover: shadow-md, transition-shadow 200ms
- Padding: p-6

### Forms
- Label + Input stack, gap-1.5
- Input: border, rounded-lg, h-10, px-3
- Error: border-destructive, red helper text
- Focus: ring-2 ring-primary

### Navigation
- Header: sticky, blur backdrop, h-16
- Dashboard sidebar: w-64, border-r
- Admin sidebar: w-64, navy bg, white text

## Anti-Patterns to Avoid
- No emoji as icons (use Lucide SVG)
- No horizontal scroll on mobile
- No placeholder-only labels in forms
- No color-only indicators for status
- No instant 0ms transitions
- No edge-to-edge text paragraphs

## Accessibility Requirements
- All form inputs have associated labels
- All icons have aria-label or sr-only text
- Focus states visible on all interactive elements
- Color contrast ≥ 4.5:1 for body text
- Heading hierarchy sequential (h1→h2→h3)
- Touch targets ≥ 44×44px
- `prefers-reduced-motion` respected
- Error messages clear with recovery path
