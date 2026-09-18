# Hail Mary — Admissions Atlas Design Language

## Visual thesis

Hail Mary is a calm admissions atlas: warm paper, ink-like typography, thin editorial rules, and one terracotta signal color. It should feel closer to a well-edited academic magazine than a generic education dashboard.

## Atmosphere

Editorial, humane, trustworthy, and quietly optimistic. The interface uses generous whitespace, short text blocks, strong typographic hierarchy, and deliberate asymmetry. Photography is used as a narrative anchor on the landing page; product surfaces stay mostly cardless so the user can scan a journey rather than a grid of widgets.

## Color palette

- **Warm paper** `#F7F3EA` — primary page background and modal surface.
- **Paper shadow** `#ECE4D5` — footer and secondary surface background.
- **Ink green-black** `#1F2420` — headings, primary actions, and high-emphasis text.
- **Quiet graphite** `#6D6D63` — supporting copy, metadata, and helper text.
- **Rule beige** `#D8D0C1` — dividers, table rules, form borders, and progress tracks.
- **Terracotta signal** `#D6552E` — calls to action, active progress, selected choices, and focus rings.
- **Soft sage** `#DFE8DF` — geography / exploration section background.

## Typography

The bundled Liter font is the project’s single type family. Use it with contrast through scale, weight, uppercase metadata, and line length rather than adding a second external font. Display headings are large, tight, and editorial; body copy remains 16px or larger on mobile with 1.6–1.75 line height.

## Geometry and depth

Prefer sharp or subtly rounded edges (`2–6px`) for editorial surfaces. Reserve pill shapes for status or compact controls. Elevation is quiet: soft shadows on the questionnaire panel and map overlay, no floating dashboard-card treatment. Dividers and background changes carry more hierarchy than borders around every element.

## Composition rules

- Landing hero: split-studio logic — photographic field plus a narrow typographic column, with a compact three-part ledger as the memorable anchor.
- Questionnaire: one long paper sheet with a visible progress rule, dense but breathable fields, and terracotta selection states.
- Recommendations: left-hand university index, right-hand narrative detail, comparison table, then chronological roadmap.
- Mobile: preserve reading order, keep interactive targets at least 44px, allow tables to scroll intentionally, and never depend on hover.

## Motion

Motion is sparse and purposeful: 180–300ms color/transform transitions for actions, smooth section navigation, and a reduced-motion fallback. Avoid decorative animation that competes with the user’s decision-making.

## Avoid

Generic SaaS gradients, purple-on-white palettes, card mosaics, heavy shadows, emoji icons, unverified claims presented as facts, and decorative UI that does not clarify the next step.
