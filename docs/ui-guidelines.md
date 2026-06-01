# UI Guidelines (Enhanced)

## Design System

See `design-system/MASTER.md` for complete design tokens (colors, typography, spacing, shadows, animations).

## Available Components (`@/components/ui`)

| Component | Props | Description |
|-----------|-------|-------------|
| `Button` | `variant: primary\|secondary\|outline\|ghost\|destructive`, `size: sm\|md\|lg`, `loading: boolean` | Button with loading spinner, disabled state, active scale effect |
| `Label` | `required: boolean` | Form label with optional asterisk |
| `Input` | `label, error, hint: string` | Text input with label, inline error+hint, aria-invalid, aria-describedby |
| `Textarea` | `label, error: string` | Textarea with label and inline error |
| `Select` | `label, error: string`, `options: {value,label}[]` | Native select with label and inline error |
| `Card` | — | Rounded-xl, border, card shadow, hover transition |
| `CardHeader` | — | Card header with padding |
| `CardContent` | — | Card body with padding |
| `Badge` | `variant: default\|success\|warning\|destructive\|outline` | Status badge / tag |
| `Spinner` | `size: sm\|md\|lg` | Loading spinner (lucide Loader2) |
| `Skeleton` | — | Loading skeleton (pulse animation) |
| `EmptyState` | `icon, title, description: string`, `action: ReactNode` | Empty state with icon, title, description, CTA |
| `Toast` | `message, type: success\|error\|info`, `onClose` | Fixed bottom-right notification, auto-dismiss 5s |

## Interaction Patterns

- Form buttons show loading state on submit (`loading` prop)
- Cards have hover shadow transition
- All interactive elements have `focus-visible:ring-2` focus style
- Page sections animate in with `animate-fade-in` on mount
- Form fields show inline validation errors with `AlertCircle` icon
- Empty states use lucide icons with CTA buttons
- Submit buttons use `size="lg" width="full"` on form cards

## Dark Mode

- Toggle via header Moon/Sun button
- Persisted to `localStorage.theme`
- Respects `prefers-color-scheme` on first visit
- Dark variables in `.dark` class override all color tokens

## Accessibility

- Skip-to-content link (first tabstop)
- Header nav: `aria-label="Main navigation"`
- Footer: `role="contentinfo"`, section navs with `aria-label`
- Mobile menu: `aria-expanded` on hamburger button
- Form fields: `aria-invalid`, `aria-describedby` for errors/hints
- Color indicators paired with text labels (never color-only)
- `prefers-reduced-motion` disables all animations
- Touch targets min 44×44px
- Required fields marked with visual `*` + `required` attribute
