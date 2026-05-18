---
name: Cyber-Luxe Retail
colors:
  surface: '#16121a'
  surface-dim: '#16121a'
  surface-bright: '#3d3741'
  surface-container-lowest: '#110c15'
  surface-container-low: '#1f1a22'
  surface-container: '#231e26'
  surface-container-high: '#2d2831'
  surface-container-highest: '#38333c'
  on-surface: '#eadfec'
  on-surface-variant: '#cfc2d5'
  inverse-surface: '#eadfec'
  inverse-on-surface: '#342e38'
  outline: '#988d9e'
  outline-variant: '#4c4353'
  surface-tint: '#deb7ff'
  primary: '#deb7ff'
  on-primary: '#4a007f'
  primary-container: '#7b2cbf'
  on-primary-container: '#e4c2ff'
  inverse-primary: '#8234c6'
  secondary: '#e0b6ff'
  on-secondary: '#4c007d'
  secondary-container: '#6d11ad'
  on-secondary-container: '#d7a4ff'
  tertiary: '#fdb969'
  on-tertiary: '#482a00'
  tertiary-container: '#7e4d00'
  on-tertiary-container: '#ffc480'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#f1dbff'
  primary-fixed-dim: '#deb7ff'
  on-primary-fixed: '#2d0050'
  on-primary-fixed-variant: '#680eac'
  secondary-fixed: '#f2daff'
  secondary-fixed-dim: '#e0b6ff'
  on-secondary-fixed: '#2e004e'
  on-secondary-fixed-variant: '#6a0baa'
  tertiary-fixed: '#ffddba'
  tertiary-fixed-dim: '#fdb969'
  on-tertiary-fixed: '#2b1700'
  on-tertiary-fixed-variant: '#663e00'
  background: '#16121a'
  on-background: '#eadfec'
  surface-variant: '#38333c'
typography:
  headline-xl:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Space Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Space Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin: 32px
---

## Brand & Style

This design system is built for the high-end gadget enthusiast, positioning "Everything Phones" as the definitive authority in mobile technology. The brand personality is tech-forward, precision-engineered, and premium. It evokes a sense of being ahead of the curve, utilizing a "Neon Noir" aesthetic that balances the mystery of deep space with the vibrant energy of high-speed data.

The UI style blends **Minimalism** with **Glassmorphism**. It relies on high-contrast dark surfaces to make hardware photography pop, while subtle neon accents guide the user's eye to critical actions. Every interaction must feel like operating a piece of high-performance machinery, echoing the brand motto: *'Your Phone, Your Trust, Our Commitment'*.

## Colors

The palette is anchored in a true **Deep Black (#0A0A0A)** to provide infinite depth and eliminate visual noise. **Surface Dark Gray (#1A1A1A)** is used for structural containers to create a discernible hierarchy without breaking the dark-mode immersion.

**Primary Deep Purple (#7B2CBF)** serves as the brand's foundation, representing trust and sophistication. **Secondary Electric Purple (#9D4EDD)** is reserved for interactive elements, hover states, and highlights. To enhance the "high-tech" feel, use an ultra-light purple neon tint for icons and subtle glowing borders to simulate light emission from the gadgets themselves.

## Typography

The design system exclusively utilizes **Space Grotesk** to lean into a technical, futuristic atmosphere. The typeface’s idiosyncratic letterforms—particularly in the headlines—reinforce the "gadget" nature of the store. 

Headlines should be set with tight letter-spacing to appear impactful and architectural. Body text requires generous line-height to ensure legibility against the dark background. Small labels and "spec-sheet" data should be set in uppercase with increased letter-spacing to mimic technical documentation and blueprint aesthetics.

## Layout & Spacing

This design system employs a **12-column fluid grid** for web and a **4-column grid** for mobile. The layout philosophy is centered on "contained expansiveness"—using wide margins and deep gutters to allow high-resolution product photography to breathe.

Spacing is calculated on an **8px base unit**. Component internal padding should be generous to maintain a "sleek" feel. Use `xl` spacing (80px+) between major sections to emphasize the premium, unhurried nature of the shopping experience. All alignment should be strictly geometric, avoiding centered layouts in favor of strong left-aligned grids that feel engineered.

## Elevation & Depth

Depth in this design system is achieved through **Glassmorphism** and **Light Emission** rather than traditional shadows. 

1.  **Base Layer:** Deep Black background.
2.  **Surface Layer:** Dark Gray containers with a 1px border (#FFFFFF with 10% opacity) to define edges.
3.  **Interactive Layer:** Surfaces use a Backdrop Blur (20px) and a subtle 15% opacity purple fill to create a "frosted tech" appearance.
4.  **Glow States:** Active elements do not cast black shadows; instead, they emit a soft **Electric Purple glow** (Box Shadow: 0 8px 32px rgba(157, 78, 221, 0.3)). This simulates a device screen glowing in a dark room.

## Shapes

The shape language reflects the industrial design of modern smartphones. While the digital world often trends towards hyper-rounded "pill" shapes, this design system uses **Soft (0.25rem)** roundedness to maintain a precise, professional, and sophisticated look. 

Buttons and input fields should utilize small corner radii to feel like tactile hardware modules. Large cards or "hero" containers can scale up to **rounded-lg (0.5rem)**, but should never become fully circular unless they are functional icons or status indicators.

## Components

### Buttons
Primary buttons feature a solid **Electric Purple** fill with a subtle "inner-glow" top border. Secondary buttons should be glassmorphic with a 1px border. Hover states must trigger a smooth transition where the glow intensity increases, simulating a power-on sequence.

### Cards
Product cards are the core of the experience. They use a **Surface Dark Gray** background with a subtle gradient (top-left to bottom-right) and a thin "spec-line" border. Images within cards should appear to float, utilizing a very soft purple outer glow.

### Input Fields
Inputs are minimal, featuring only a bottom border in their default state. Upon focus, the border transitions to a neon purple, and a subtle glassmorphic background slides up to fill the field.

### Progress & Status
Use "Loading Bars" that mimic data transfer—fast-moving gradients of purple. Status chips (e.g., "In Stock") should use neon typography with a low-opacity background tint.

### Additional Components
*   **Spec-Grids:** Highly organized, monospaced-style tables for phone specifications.
*   **Tech-Tooltips:** Dark, high-blur glassmorphic popovers with neon-accented icons.