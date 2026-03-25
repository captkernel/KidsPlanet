# Planet Studio — UI Polish & Content Studio Canvas Editor

**Date:** 2026-03-25
**Status:** Approved
**Scope:** Visual polish across the dashboard + hybrid canvas editor for Content Studio

---

## Overview

Three workstreams:
1. **Sidebar & Navigation** — Collapsible sections, visual polish, better tap targets
2. **Dashboard & Page Polish** — Elevated cards, personalized greeting, better empty/loading states
3. **Content Studio Hybrid Editor** — Template fields + freeform canvas with image import, text, icons, stickers

**Key Principles:**
- Keep existing functionality intact — this is a polish + enhancement, not a rewrite
- Simplicity first — non-tech-savvy users must still find it intuitive
- Mobile-friendly — 44px minimum tap targets, responsive layouts
- Same tech stack — Next.js 16, React 19, TypeScript, Tailwind CSS 4, html-to-image for export

---

## Workstream 1: Sidebar & Navigation

### Changes

**Collapsible sections:**
- Section headers (Academic, Administration, Tools) are clickable toggles
- Clicking collapses/expands the section's nav items with a smooth height transition
- Chevron icon rotates on toggle (right = collapsed, down = expanded)
- Default: all sections expanded
- State persisted in localStorage key `sidebar-collapsed-sections`

**Visual polish:**
- Nav items: 44px height (up from current ~36px), `padding: 10px 12px`
- Active state: left 3px gold accent border (`#c8a84e`) + `bg-white/15` + white text
- Inactive: `text-white/60`, hover → `text-white` + `bg-white/5`
- Transitions: `transition-all duration-200`
- Section headers: `text-white/40` uppercase, 11px, tracking-wide, `cursor-pointer`

**Logo section:**
- School name from auth context (not hardcoded)
- Gold accent badge for the PS/KP logo icon
- Subtle bottom border separator

**User section (bottom):**
- Larger avatar (40px, up from 32px)
- Full name + role badge (small StatusBadge component)
- Sign-out as a small icon button (LogOut icon), not a full-width button

**Mobile:**
- Same collapsible behavior
- Overlay closes when any nav item is tapped
- Hamburger icon: 44px tap target

### Files to modify
- `src/components/Sidebar.tsx` — main changes
- `src/app/globals.css` — add transition utilities if needed

---

## Workstream 2: Dashboard & Page Polish

### Stat Cards
- Tinted background per color (e.g., green stat → `bg-green-50`, blue → `bg-blue-50`)
- Subtle border: `border border-{color}-100`
- Icon in a tinted circle: 40px, `bg-{color}/10`, centered icon
- Number: 28px bold, color-matched
- Label: 13px, `text-text-muted`

### Cards (global)
- Border-radius: 16px (up from 12px)
- Subtle warm border: `border border-[#e8e0d0]`
- Padding: 20px (keep consistent)
- Shadow: `0 2px 12px rgba(0,0,0,0.04)` (lighter than current)

### Buttons (global)
- Min height: 44px
- Border-radius: 10px (up from 8px)
- Hover: gentle `scale(1.02)` + shadow increase
- Active: `scale(0.98)` press effect
- Transition: `transition-all duration-150`

### Dashboard Home
- Greeting: "Good morning/afternoon/evening, {first_name}!" based on time of day (parse first name from `profile.full_name.split(' ')[0]`)
- School name + date as subtitle
- Featured stat (fee collection): gradient green card (`linear-gradient(135deg, #2d5016, #4a7c28)`), white text, larger
- Quick actions: icon + label cards in a 3x2 grid (not plain buttons), white bg, subtle shadow, 44px min height

### Page Headers
- Consistent across all pages: title left-aligned, primary action button right
- Optional subtitle with context (date, count, etc.)
- Divider line below (subtle `border-b border-surface-muted`)

### Empty States
- Simple SVG illustration (inline, not external files) — e.g., a small school building for "No students"
- Friendly message + CTA button
- Centered, generous padding

### Loading States
- Skeleton shimmer effect (gradient animation) instead of plain pulse
- Match the shape of what's loading (cards, rows, avatars)

### Form Inputs
- Height: 44px (match tap target spec)
- Focus: `ring-2 ring-primary/30` glow
- Labels: 14px, `font-medium`, `mb-1.5` spacing above input

### Files to modify
- `src/app/globals.css` — update `.card`, `.btn-primary`, `.btn-secondary`, `.input`, `.stat-card` classes
- `src/components/StatCard.tsx` — updated design
- `src/components/PageHeader.tsx` — add subtitle, action slot
- `src/components/shared/DataTable.tsx` — skeleton shimmer
- `src/components/shared/FormField.tsx` — taller inputs, better focus
- `src/components/shared/Modal.tsx` — updated border-radius
- `src/app/(dashboard)/page.tsx` — greeting, featured stat, quick action cards

---

## Workstream 3: Content Studio — Hybrid Canvas Editor

### Template Gallery Changes
- **Blank Canvas option:** First card in the grid, links to editor with no template loaded
- **Live thumbnails:** Render each template at thumbnail scale (200px wide) instead of gradient placeholder. Use a simple div with `transform: scale()` and `overflow: hidden`.
- Category filter and card structure stays the same

### Editor Architecture

The editor has two modes, toggled via a button in the toolbar:

**Mode 1: Template Fields (default, existing behavior)**
- Left panel shows field groups in an accordion (Content, Images, Styling)
- Changing a field updates the canvas live
- This is the "easy mode" — identical to current but with cleaner accordion UI

**Mode 2: Canvas Edit (new)**
- Activated via "Edit on Canvas" toggle in toolbar
- Canvas elements are ONLY interactive in this mode (not in Template Fields mode)
- Clicking an element on the canvas selects it (shows blue selection border + resize handles)
- **Deselection:** Click empty canvas area OR press Escape to deselect
- **Single selection only** — no multi-select (keeps it simple for non-tech users)
- **Keyboard:** Delete/Backspace removes selected element. Escape deselects.
- Selected element shows a **floating toolbar** above it (flips below if near canvas top edge)
- **Drag:** 3px movement threshold before drag starts (distinguishes click from drag). Cursor: `grab` on hover, `grabbing` during drag. Elements cannot be dragged fully off-canvas (min 20px must remain visible).
- **Resize:** 4 corner handles + 4 edge midpoint handles. Min element size: 20x20px. Images default to locked aspect ratio (Shift to unlock free resize). Text/icons/stickers default to free resize.
- For text blocks: resizing changes container width (text reflows), not font size.

**Mode switching:**
- Switching from Canvas Edit → Template Fields preserves all canvas elements (they remain visible but non-interactive)
- Switching back to Canvas Edit restores interactivity

### Canvas Element Types

**1. Images (imported)**
- "Add Image" button in toolbar opens file picker (accept: image/*)
- Also supports drag-and-drop onto canvas
- Also supports Ctrl+V paste from clipboard (only when NOT editing a text block — if a text block is focused, Ctrl+V pastes text)
- Imported images are read via `FileReader.readAsDataURL()` — MUST use `data:` URLs, never `blob:` URLs (blob URLs fail html-to-image export)
- Max file size: 5MB. Images larger than 50% of canvas dimensions are scaled down to fit 50%, maintaining aspect ratio.
- Imported image appears centered on canvas
- Resizable via corner handles, draggable to reposition
- Floating toolbar for images: crop (future), opacity slider, delete, layer controls

**2. Text Blocks (new)**
- "Add Text" button places a text block at canvas center
- Double-click to enter edit mode (contentEditable). Click outside or press Escape to exit edit mode (saves content).
- Single-click to select (move/resize)
- Min width: 60px. Text overflows vertically (no max height).
- Floating toolbar: font size (12-72), bold, italic, color picker, text alignment (L/C/R), delete

**3. Icons (from Lucide)**
- "Add Icon" button opens a searchable icon picker modal
- Curated set of ~100 education/celebration-relevant Lucide icons (not the full 1000+ set). Loaded as a static list of icon names; icons rendered via `lucide-react` dynamic imports to avoid bundle bloat.
- Pick icon → appears on canvas as SVG, default 48px
- Resizable, draggable
- Floating toolbar: size, color picker, delete

**4. Stickers (SVG packs)**
- "Add Sticker" button opens a sticker picker modal with tabs per pack
- Packs:
  - **School (5):** book, pencil, backpack, graduation-cap, globe
  - **Celebrations (5):** star, trophy, balloon, medal, gift
  - **Animals (5):** lion, butterfly, bird, rabbit, bear
  - **Emoji (5):** heart, thumbs-up, fire, sparkle, rainbow
- 20 stickers total for v1 (expandable later). Stickers stored as inline SVG components in `src/data/stickers.ts`
- Pick sticker → appears on canvas, draggable/resizable
- Floating toolbar: size, delete

### Canvas Data Model

```typescript
interface CanvasElementBase {
  id: string                    // crypto.randomUUID()
  type: 'image' | 'text' | 'icon' | 'sticker'
  x: number                    // px from left
  y: number                    // px from top
  width: number                // px
  height: number               // px
  zIndex: number               // layer order
  locked: boolean              // prevent accidental moves
  visible: boolean             // show/hide toggle
  style: {
    opacity?: number           // 0-1, default 1
  }
}

interface ImageElement extends CanvasElementBase {
  type: 'image'
  content: string              // data: URL (NEVER blob:)
}

interface TextElement extends CanvasElementBase {
  type: 'text'
  content: string              // text content
  style: CanvasElementBase['style'] & {
    fontSize?: number          // 12-72, default 24
    fontWeight?: 'normal' | 'bold'
    fontStyle?: 'normal' | 'italic'
    textAlign?: 'left' | 'center' | 'right'
    color?: string             // hex color, default '#000000'
  }
}

interface IconElement extends CanvasElementBase {
  type: 'icon'
  content: string              // Lucide icon name e.g. 'star'
  style: CanvasElementBase['style'] & {
    color?: string             // hex color
  }
}

interface StickerElement extends CanvasElementBase {
  type: 'sticker'
  content: string              // sticker id e.g. 'school-book'
}

type CanvasElement = ImageElement | TextElement | IconElement | StickerElement
```

State stored in React state as `CanvasElement[]`.

**Undo/redo architecture:** The existing field-snapshot approach (push entire state on change) is replaced with a **unified action history**. Each action (add element, move element, resize, delete, field change) is recorded as a snapshot of `{ fields: Record<string, string>, elements: CanvasElement[] }`. Undo/redo restores the entire snapshot. Drag/resize records ONE entry on mouse-up (not per-pixel). Max 30 history entries (up from 20).

### Layer Panel
- Toggleable drawer (bottom of left panel, or floating)
- Shows all canvas elements as a list (name + type icon)
- **Up/Down arrow buttons** to reorder z-index (simpler than drag-reorder for non-tech users)
- Eye icon: toggle visibility
- Lock icon: toggle locked state
- Click item to select element on canvas
- Selected element is NOT auto-brought-to-front (z-index only changes via explicit layer controls)

### Toolbar Updates

Current toolbar: `[Dimensions] [Undo/Redo] [Zoom] [Copy | Download]`

New toolbar:
```
[Template Fields / Canvas Edit toggle] [Add: Image | Text | Icon | Sticker] | [Undo/Redo] [Zoom] | [Layers toggle] | [Copy | Download ▼ (PNG/JPEG/PDF)]
```

- "Add" is a dropdown menu with 4 options
- "Download" dropdown now includes PNG (1x), PNG HD (2x), JPEG, and PDF
- JPEG: uses html-to-image `toJpeg()` with white background (transparent areas render white, not black)
- PDF: **deferred** — not in v1. Users can use browser print-to-PDF if needed.

### Export
- All canvas elements are absolutely-positioned divs overlaid on the template
- **Before export:** deselect all elements, blur any focused contentEditable, hide selection handles/floating toolbar
- On export: `html-to-image` captures the entire composite (template + overlays) as one image
- This works because everything is DOM-based, no separate canvas API needed
- **Drag performance:** During drag/resize, update element position via `ref.style.transform` directly (no React re-render). Commit to React state only on mouse-up. This ensures 60fps interaction.

### Blank Canvas
- Route: `/content-studio/blank?size=1080x1080` (or `1080x1920`, `794x1123`, `1200x628`)
- The `[templateId]` page checks if `templateId === 'blank'` — if so, reads size from query params
- Size selection: shown as a modal when clicking the Blank Canvas card in gallery (presets: Instagram Post, Story, A4, Facebook Cover, Custom WxH input)
- No template rendered as base layer — plain white background
- All canvas tools available immediately
- Field panel hidden (no template fields)
- Template registry returns `null` for `'blank'` — editor knows to skip template rendering

### Files

**New files:**
- `src/components/studio/CanvasEditor.tsx` — main canvas with element rendering, selection, drag, resize
- `src/components/studio/FloatingToolbar.tsx` — contextual toolbar above selected element
- `src/components/studio/ElementRenderer.tsx` — renders a single CanvasElement as a DOM node
- `src/components/studio/AddMenu.tsx` — dropdown for Add Image/Text/Icon/Sticker
- `src/components/studio/IconPicker.tsx` — searchable Lucide icon grid modal
- `src/components/studio/StickerPicker.tsx` — tabbed sticker pack grid modal
- `src/components/studio/LayerPanel.tsx` — element layer list with drag-reorder
- `src/components/studio/ImageImporter.tsx` — file picker + drag-drop + clipboard paste
- `src/data/stickers.ts` — 20 inline SVG sticker definitions (4 packs x 5)

**Modified files:**
- `src/app/(dashboard)/content-studio/page.tsx` — add Blank Canvas card, live thumbnails
- `src/app/(dashboard)/content-studio/[templateId]/page.tsx` — integrate CanvasEditor, mode toggle, updated toolbar, new undo/redo architecture
- `src/components/studio/EditorToolbar.tsx` — add mode toggle, Add menu, Layers toggle, download dropdown
- `src/components/studio/FieldGroup.tsx` — cleaner accordion styling
- `src/components/studio/CustomizeForm.tsx` — update to use new accordion styling (kept, not replaced)
- `src/components/studio/MediaPicker.tsx` — replaced by ImageImporter.tsx (delete after migration)
- `src/templates/registry.ts` — handle `'blank'` templateId returning null

---

## Implementation Order

1. **Sidebar polish** — quick visual win, independent of other work
2. **Global CSS + component polish** — cards, buttons, inputs, loading states
3. **Dashboard home polish** — greeting, featured stat, quick action cards
4. **Content Studio: Sticker data** — create the 40 SVG stickers
5. **Content Studio: Canvas data model + ElementRenderer** — core canvas element system
6. **Content Studio: CanvasEditor with drag/resize** — the interaction layer
7. **Content Studio: FloatingToolbar** — contextual editing per element type
8. **Content Studio: Image import** — file picker, drag-drop, clipboard
9. **Content Studio: Icon picker + Sticker picker** — modal pickers
10. **Content Studio: Layer panel** — z-order management
11. **Content Studio: Toolbar integration** — mode toggle, Add menu, download options
12. **Content Studio: Gallery updates** — blank canvas, live thumbnails
13. **Content Studio: Export updates** — composite DOM export, JPEG support
