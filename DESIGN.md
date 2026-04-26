---
version: alpha
name: Polka
description: >
  Visual identity for "Polka" — an urban literary exchange platform that combines
  editorial warmth, civic trust, and a premium reading-room atmosphere.
colors:
  primary: "#0C0907"
  secondary: "#6F655A"
  tertiary: "#F0B35B"
  neutral: "#FFF7E8"
  surface: "#140F0B"
  surface-soft: "#1B150F"
  line: "#3A2F25"
  support-green: "#78D5A4"
  support-blue: "#8BBCFF"
  support-violet: "#C6A7FF"
  support-orange: "#FFB487"
typography:
  h1:
    fontFamily: Prata
    fontSize: 64px
    fontWeight: 400
    lineHeight: 0.9
    letterSpacing: -0.05em
  h2:
    fontFamily: Prata
    fontSize: 48px
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: -0.05em
  h3:
    fontFamily: Prata
    fontSize: 32px
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: -0.04em
  body-md:
    fontFamily: Manrope
    fontSize: 17px
    fontWeight: 500
    lineHeight: 1.6
    letterSpacing: 0em
  body-lg:
    fontFamily: Manrope
    fontSize: 22px
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: 0em
  label-caps:
    fontFamily: IBM Plex Mono
    fontSize: 12px
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: 0.14em
rounded:
  xs: 12px
  sm: 18px
  md: 24px
  lg: 34px
  xl: 46px
  full: 999px
spacing:
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 34px
  2xl: 54px
components:
  button-primary:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.primary}"
    rounded: "{rounded.full}"
    typography: "{typography.label-caps}"
    padding: 16px
  button-ghost:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.neutral}"
    rounded: "{rounded.full}"
    typography: "{typography.label-caps}"
    padding: 16px
  card-surface:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.neutral}"
    rounded: "{rounded.lg}"
    padding: 24px
  pill-status:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.tertiary}"
    rounded: "{rounded.full}"
    typography: "{typography.label-caps}"
    padding: 12px
  heading-editorial:
    textColor: "{colors.neutral}"
    typography: "{typography.h1}"
  meta-copy:
    textColor: "{colors.secondary}"
    typography: "{typography.body-md}"
  divider-subtle:
    backgroundColor: "{colors.line}"
    height: 1px
  signal-available:
    backgroundColor: "{colors.support-green}"
    textColor: "{colors.primary}"
    rounded: "{rounded.full}"
    typography: "{typography.label-caps}"
    padding: 12px
  signal-review:
    backgroundColor: "{colors.support-blue}"
    textColor: "{colors.primary}"
    rounded: "{rounded.full}"
    typography: "{typography.label-caps}"
    padding: 12px
  signal-collection:
    backgroundColor: "{colors.support-violet}"
    textColor: "{colors.primary}"
    rounded: "{rounded.full}"
    typography: "{typography.label-caps}"
    padding: 12px
  signal-author:
    backgroundColor: "{colors.support-orange}"
    textColor: "{colors.primary}"
    rounded: "{rounded.full}"
    typography: "{typography.label-caps}"
    padding: 12px
---

## Overview

Polka should feel like a premium urban literary ecosystem, not a generic startup landing page.
The interface combines three emotional references at once:

- A warm independent reading room.
- A well-designed city cultural service.
- A personal notebook where real readers leave traces of taste, memory, and response.

The mission of the product is to stimulate cultural development by creating a cozy space that immerses people in the world of literature.

The values must be visible in the UI, not hidden in copy alone:

- **Second life:** books do not collect dust, they travel.
- **Accessibility:** book machines should feel close, convenient, and embedded in the city.
- **Community:** readers recommend, discuss, and find each other.
- **Transparency:** real books, real reviews, real people.
- **Inspiration:** books should lead naturally into writing, publishing, and authorship.

Overall tone: tactile, editorial, trustworthy, intimate, and slightly cinematic.
The product should feel curated and human, never synthetic or corporate.

## Colors

The palette is built around dark literary surfaces, warm paper tones, and one civic-gold accent.

- **Primary (`#0C0907`):** deep ink-black for foundations, dark surfaces, and high-contrast moments.
- **Secondary (`#6F655A`):** softened metadata tone for support copy, dividers, and quiet utility.
- **Tertiary (`#F0B35B`):** the main interactive driver; use it for primary actions and narrative emphasis.
- **Neutral (`#FFF7E8`):** warm paper used for core text and light editorial surfaces.
- **Support Green (`#78D5A4`):** signals circulation, availability, movement, and live map activity.
- **Support Blue (`#8BBCFF`):** supports reviews, interface intelligence, and route clarity.
- **Support Violet (`#C6A7FF`):** marks collections, taste, and social discovery.
- **Support Orange (`#FFB487`):** marks authorship, inspiration, and publication.

Color should shift with the story journey, but the base atmosphere must remain warm and grounded.
Avoid sterile white backgrounds and avoid cold, default SaaS blues as the dominant tone.

## Typography

Typography should behave like a literary publication with a strong editorial hierarchy:

- **Prata** is the display voice: calm, serious, cultured, and premium.
- **Manrope** is the interface body: readable, modern, and clean without feeling generic.
- **IBM Plex Mono** is reserved for metadata, labels, status lines, and product signals.

Headlines should feel composed, not shouty.
Body copy should breathe.
Labels should feel like precise annotations in a printed system.

## Layout

Polka uses a cinematic long-scroll structure with alternating rhythm:

- Large editorial statement.
- Story chapter.
- Functional interaction block.
- Community or authoring proof point.

Sections should feel generous in spacing and intentional in grouping.
Copy and visual stages should often sit in tension: one side meaning, one side motion or artifact.
Avoid dense dashboard-like compression unless the section explicitly represents a tool or product surface.

The "mission and values" block is a structural anchor near the top of the page and should remain visually substantial.

## Elevation & Depth

Depth should come from layered surfaces, blurred glass, matte cards, and soft atmospheric gradients.

- Shadows should be deep but diffused.
- Cards should feel stacked and tangible.
- Hover states should lift rather than flash.
- Motion should reveal hierarchy, not decorate emptiness.

Use animated light, slow drift, and stage transitions to support the narrative of books moving through the city.
Never rely on tiny generic microinteractions as the main source of delight.

## Shapes

The system mixes two geometries:

- **Rounded capsules and pills** for actions, status, filters, and navigation.
- **Soft book-like rectangles** for cards, modals, covers, and panels.

Corners should feel generous and confident.
Avoid sharp enterprise-style rectangles unless there is a very specific reason.

## Components

### Buttons

Primary buttons are warm, luminous, and clearly valuable.
Ghost buttons are quieter, but still premium and tactile.
Buttons should feel pressable and substantial, not flat.

### Narrative Cards

Hero cards, manifesto cards, quote panels, and author surfaces should each feel like collectible artifacts inside one family.
They may vary in tone, but not in quality.

### Catalog

The catalog is not an e-commerce grid.
It is a live literary selection.
Sorting, filters, and quick picks should feel curated, not transactional.

### Map and Movement

Map surfaces represent urban availability and movement.
Markers, signals, and status surfaces should feel alive, but never noisy.
Support colors are reserved for these semantic signals, not for random decoration.

### Modal Surfaces

Modals should feel like opening a refined card or reading note.
They should be intimate, centered, and calm.

## Do's and Don'ts

### Do

- Treat every section like part of one literary world.
- Use accent color with intent, not everywhere.
- Keep strong editorial hierarchy between display, body, and metadata.
- Make motion reinforce the story of circulation, discovery, and authorship.
- Let the product feel warm, civic, and human at the same time.

### Don't

- Do not collapse the design into generic startup patterns.
- Do not use flat backgrounds with no atmosphere.
- Do not overload sections with equally weighted cards.
- Do not introduce random iconography or illustration styles that break the tone.
- Do not use bright, synthetic colors as the dominant visual language.
