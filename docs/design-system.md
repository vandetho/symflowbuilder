# Design System

## Aesthetic Direction

**Dark Glassmorphism.** Depth through translucency. Surfaces float above a rich gradient backdrop — every panel feels like frosted glass catching ambient light.

## Background

```css
body {
    background:
        radial-gradient(ellipse at 20% 50%, #1a1040 0%, transparent 50%),
        radial-gradient(ellipse at 80% 20%, #0d2040 0%, transparent 50%),
        radial-gradient(ellipse at 60% 80%, #1a0d30 0%, transparent 50%), #08080f;
}
```

## Typography

- Display / headings: **Sora** (wght 300-600)
- Code / monospace: **JetBrains Mono** (wght 400-500)
- Body: **Sora** (wght 400)

## Color Tokens

See `app/globals.css` `:root` for the full token set. Key groups:

- `--glass-*` — Surface backgrounds (always with `backdrop-filter`)
- `--text-*` — Text colors (primary, secondary, muted, disabled)
- `--accent` / `--accent-bright` — Electric Violet (#7c6ff7)
- `--success` / `--warning` / `--danger` — Semantic colors

## Glass Utilities

Defined in `globals.css` `@layer utilities`:

- `.glass` — Default surface (`--glass-surface` + `blur(16px)`)
- `.glass-sm` — Subtle surface (`--glass-base` + `blur(8px)`)
- `.glass-strong` — Elevated surface (`--glass-overlay` + `blur(24px)`)

## Component Rules

- Every panel, card, sidebar, modal, and dropdown is a glass surface
- Border radius: `10px` (sm), `14px` (default), `18px` (card/panel), `24px` (modal)
- Borders: always `1px solid var(--glass-border)`
- Box shadows: `0 8px 32px rgba(0, 0, 0, 0.4)` on elevated surfaces
- Font weights: 300 (display), 400 (body), 500 (label), 600 (heading). Never 700+
- Text on glass: always use `--text-primary` or `--text-secondary`
- Buttons: Primary = gradient, Ghost = glass-sm, Danger = danger-dim bg

## Performance

- Max 4-5 blur layers on screen at once
- Editor canvas has NO blur (base layer)
- `will-change: transform` on animated glass elements only
- Disable blur on `prefers-reduced-motion`
