---
name: Academic Ledger System
colors:
  surface: '#fbf8fb'
  surface-dim: '#dcd9dc'
  surface-bright: '#fbf8fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f5'
  surface-container: '#f0edf0'
  surface-container-high: '#eae7ea'
  surface-container-highest: '#e4e2e4'
  on-surface: '#1b1b1d'
  on-surface-variant: '#45464d'
  inverse-surface: '#303032'
  inverse-on-surface: '#f3f0f2'
  outline: '#76777e'
  outline-variant: '#c6c6ce'
  surface-tint: '#535e7a'
  primary: '#020b24'
  on-primary: '#ffffff'
  primary-container: '#17223b'
  on-primary-container: '#7f89a8'
  inverse-primary: '#bbc6e7'
  secondary: '#805600'
  on-secondary: '#ffffff'
  secondary-container: '#fdc265'
  on-secondary-container: '#754e00'
  tertiary: '#000f0c'
  on-tertiary: '#ffffff'
  tertiary-container: '#002822'
  on-tertiary-container: '#549589'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d9e2ff'
  primary-fixed-dim: '#bbc6e7'
  on-primary-fixed: '#101b34'
  on-primary-fixed-variant: '#3c4661'
  secondary-fixed: '#ffddaf'
  secondary-fixed-dim: '#f7bc60'
  on-secondary-fixed: '#281800'
  on-secondary-fixed-variant: '#614000'
  tertiary-fixed: '#adefe1'
  tertiary-fixed-dim: '#91d3c5'
  on-tertiary-fixed: '#00201b'
  on-tertiary-fixed-variant: '#005046'
  background: '#fbf8fb'
  on-background: '#1b1b1d'
  surface-variant: '#e4e2e4'
typography:
  display-lg:
    fontFamily: Source Serif 4
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Source Serif 4
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Source Serif 4
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-md:
    fontFamily: Libre Franklin
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Libre Franklin
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  stats-lg:
    fontFamily: JetBrains Mono
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 24px
  stats-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-caps:
    fontFamily: Libre Franklin
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
  container-max: 1280px
---

## Brand & Style

The design system is built upon the visual language of traditional academic ledgers and study planners, translated into a modern digital interface. It evokes a sense of organized scholarship, reliability, and studious focus. The aesthetic is strictly flat, utilizing hairline borders and a tactile, paper-like color palette to create depth through structure rather than decoration. 

The target audience includes students, teachers, and parents within an academic ecosystem, requiring a UI that feels both authoritative and accessible. The emotional response is one of "ordered calm"—minimizing cognitive load through clear categorization and a grounded, archival atmosphere.

## Colors

The palette is inspired by vintage stationery and institutional archives. 
- **Base:** The primary background (#EAEDE2) is a faded greenish cream that reduces eye strain compared to pure white. 
- **Surface:** Cards and content containers use Ivory White (#FBFAF5) to simulate physical pages laid upon a desk.
- **Ink:** Dark Navy (#17223B) serves as the primary "ink" for high-contrast legibility in text and borders.
- **Role Accents:** 
  - **Siswa (Student):** Gold (#B9862F) denotes active learning and achievement.
  - **Guru (Teacher):** Deep Green (#2B6E63) represents guidance and institutional authority.
  - **Orang Tua (Parent):** Reddish Brown (#A65C4B) provides a warm, grounded tone for domestic oversight.

## Typography

This design system employs a tri-font typographic hierarchy to reinforce its ledger identity:
- **Serif (Source Serif 4):** Used for titles, section headers, and "editorial" moments. It provides the authoritative, academic weight.
- **Sans-Serif (Libre Franklin):** Used for all body copy and UI controls. It is highly legible, clean, and professional.
- **Monospace (JetBrains Mono):** Specifically reserved for numeric data, grades, timestamps, and statistics. This mimics the precision of technical ledgers and data entry.

Use `label-caps` for small metadata or section eyebrows to maintain an organized, tabulated feel.

## Layout & Spacing

The layout follows a **fixed-grid** philosophy on desktop and a fluid-stack on mobile, mirroring the structure of a physical binder. 

- **Grid:** A 12-column system is used for desktop layouts.
- **Rhythm:** Spacing is strictly based on a 4px baseline grid. 
- **Margins:** 16px for mobile viewports, increasing to 32px for tablet and desktop to emphasize the "paper on a surface" effect.
- **Structural Lines:** Content areas are separated by 1px hairline borders in Dark Navy (at 15-20% opacity) to create columns and rows without using heavy shadows or color blocks.

## Elevation & Depth

This system rejects shadows in favor of **Tonal Layering** and **Hairline Outlines**. 
- **Level 0 (Background):** The Cream base (#EAEDE2).
- **Level 1 (The Ledger):** Ivory White (#FBFAF5) cards with 1px Dark Navy borders. These cards represent the "pages."
- **Level 2 (Overlays/Popovers):** Higher-priority surfaces use a slightly thicker 2px border or a subtle 4px offset "hard shadow" (no blur, 100% opacity, same color as the border) to simulate stacked paper.
- **Interaction:** No glow or blur effects are allowed. Hover states are indicated by a 10% fill of the primary color or a slight shift in the border weight.

## Shapes

The shape language combines functional rigidity with approachable corners. 
- **Cards/Containers:** Use a 12px or 16px radius (`rounded-lg` or `rounded-xl`) to soften the ledger feel and make the app feel modern.
- **Navigation Tabs:** Top navigation items use a "Folder Binder" shape—rounded on the top corners with a flat bottom, directly connecting to the content frame below.
- **Interactive Elements:** Buttons and input fields use a consistent 8px (`rounded-md`) corner to maintain a professional, structured appearance.

## Components

- **Navigation (Binder Tabs):** Top-level navigation must resemble file folder tabs. When active, the tab color matches the role accent (e.g., Gold for Student) and merges seamlessly with the container border.
- **Buttons:**
  - **Primary:** Solid Dark Navy with White text. No gradients.
  - **Role-Specific:** Solid Role Accent color with White text for primary actions within specific dashboards (e.g., "Tambah Tugas" uses Deep Green for Teachers).
  - **Secondary:** Transparent background with a 1px Dark Navy border.
- **Cards:** Ivory white base with a 1px #17223B border (20% opacity). Use JetBrains Mono for all numeric data displayed within cards.
- **Lists:** Table-style lists with horizontal hairline separators. Alternating row colors (Zebra striping) should use a very faint version of the role accent or the background cream.
- **Input Fields:** Rectangular with 1px borders. Use Source Serif 4 for field labels to maintain the academic aesthetic.
- **Chips/Badges:** Use Role Accents at 10% opacity for backgrounds with 100% opacity text for status indicators (e.g., "Hadir", "Terlambat").