# UI Polish & Content Studio Canvas Editor — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Polish the dashboard UI (sidebar, cards, buttons, loading states) and upgrade the Content Studio from a field-only editor to a hybrid canvas editor with image import, text blocks, icons, and stickers.

**Architecture:** Three sequential workstreams. Workstreams 1-2 (polish) modify existing CSS and components. Workstream 3 (canvas editor) adds new components overlaid on the existing template preview system — canvas elements are absolutely-positioned DOM nodes rendered on top of the template, exported together via html-to-image.

**Tech Stack:** Next.js 16.2.1, React 19, TypeScript, Tailwind CSS 4, html-to-image, Lucide React icons.

**Spec:** `docs/superpowers/specs/2026-03-25-planet-studio-ui-polish-content-editor-design.md`

**Existing Codebase:**
- Dashboard at `dashboard/` (Next.js app, gitignored at root — use `git add -f`)
- Sidebar: `src/components/Sidebar.tsx` (125 lines)
- Theme: `src/app/globals.css` (45 lines)
- Content Studio editor: `src/app/(dashboard)/content-studio/[templateId]/page.tsx`
- Editor toolbar: `src/components/studio/EditorToolbar.tsx` (157 lines)
- Template data: `src/data/templates.ts`, registry: `src/templates/registry.ts`
- Nav config: `src/lib/constants.ts` (NAV_ITEMS with roles, SECTIONS)
- Shared components: `src/components/shared/` (DataTable, FormField, StatusBadge, Modal, etc.)

---

## File Map

### New Files

```
dashboard/src/
  components/
    studio/
      CanvasEditor.tsx          — Main canvas: renders elements, handles select/drag/resize
      FloatingToolbar.tsx       — Contextual toolbar above selected element
      ElementRenderer.tsx       — Renders a single CanvasElement as a positioned DOM node
      AddMenu.tsx               — Dropdown for Add Image/Text/Icon/Sticker
      IconPicker.tsx            — Modal with searchable curated Lucide icon grid
      StickerPicker.tsx         — Modal with tabbed sticker packs
      LayerPanel.tsx            — Element list with z-order controls
      ImageImporter.tsx         — File picker + drag-drop + clipboard paste handler
  data/
    stickers.ts                 — 20 inline SVG sticker definitions (4 packs × 5)
    curated-icons.ts            — List of ~100 education-relevant Lucide icon names
  lib/
    types/
      canvas.ts                 — CanvasElement discriminated union types
```

### Modified Files

```
dashboard/src/
  app/globals.css                                      — Updated card, button, input styles
  components/Sidebar.tsx                               — Collapsible sections, visual polish
  components/StatCard.tsx                              — Tinted backgrounds, icon circles
  components/PageHeader.tsx                            — Subtitle, divider line
  components/shared/FormField.tsx                      — 44px height, better focus
  components/shared/Modal.tsx                          — 16px border-radius
  components/shared/DataTable.tsx                      — Shimmer skeleton
  app/(dashboard)/page.tsx                             — Greeting, featured stat, action cards
  app/(dashboard)/content-studio/page.tsx              — Blank Canvas card, live thumbnails
  app/(dashboard)/content-studio/[templateId]/page.tsx — Canvas integration, new undo system
  components/studio/EditorToolbar.tsx                  — Mode toggle, Add menu, download options
  components/studio/FieldGroup.tsx                     — Cleaner accordion
  templates/registry.ts                                — Handle 'blank' templateId
  lib/constants.ts                                     — No changes needed (already has all nav items)
```

---

## Task 1: Global CSS Polish

**Files:**
- Modify: `dashboard/src/app/globals.css`

- [ ] **Step 1: Read the existing globals.css**

Read `D:/Karan/KidsPlanet/dashboard/src/app/globals.css` to see current styles.

- [ ] **Step 2: Update the component utility classes**

Replace the component classes section (`.card`, `.btn-primary`, etc.) with polished versions:

```css
/* Cards */
.card {
  background: var(--color-surface);
  border: 1px solid #e8e0d0;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

/* Buttons */
.btn-primary {
  background: var(--color-primary);
  color: white;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 150ms ease;
  cursor: pointer;
  border: none;
}
.btn-primary:hover {
  background: var(--color-primary-light);
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(45, 80, 22, 0.3);
}
.btn-primary:active { transform: scale(0.98); }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

.btn-secondary {
  background: transparent;
  color: var(--color-primary);
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1.5px solid var(--color-primary);
  transition: all 150ms ease;
  cursor: pointer;
}
.btn-secondary:hover {
  background: var(--color-primary);
  color: white;
  transform: scale(1.02);
}
.btn-secondary:active { transform: scale(0.98); }

.btn-danger {
  background: var(--color-danger);
  color: white;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  transition: all 150ms ease;
  cursor: pointer;
}
.btn-danger:hover { opacity: 0.9; transform: scale(1.02); }
.btn-danger:active { transform: scale(0.98); }

/* Inputs */
.input {
  width: 100%;
  padding: 10px 14px;
  min-height: 44px;
  border: 1.5px solid #d0c8b8;
  border-radius: 10px;
  font-size: 14px;
  background: white;
  transition: all 150ms ease;
  outline: none;
}
.input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(45, 80, 22, 0.15);
}

.label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-primary-dark);
  margin-bottom: 6px;
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 10px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
}

/* Skeleton shimmer animation */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.skeleton {
  background: linear-gradient(90deg, #f0ebe3 25%, #f8f5ef 50%, #f0ebe3 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 10px;
}
```

- [ ] **Step 3: Commit**

```bash
cd /d/Karan/KidsPlanet && git add -f dashboard/src/app/globals.css
git commit -m "style: polish global CSS — rounder cards, 44px buttons, shimmer skeleton"
```

---

## Task 2: Sidebar Collapsible Sections

**Files:**
- Modify: `dashboard/src/components/Sidebar.tsx`

- [ ] **Step 1: Read the existing Sidebar.tsx**

Read `D:/Karan/KidsPlanet/dashboard/src/components/Sidebar.tsx` completely.

- [ ] **Step 2: Rewrite Sidebar with collapsible sections**

Rewrite the entire Sidebar component with these features:
- Import `ChevronDown` icon from lucide-react
- Add state: `const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})` initialized from `localStorage.getItem('sidebar-collapsed')`
- Toggle function: flips the section key in collapsed state, persists to localStorage
- Section headers: clickable div with section label + ChevronDown icon (rotates when collapsed)
- Nav items within a collapsed section get `max-height: 0; overflow: hidden` with transition
- Nav items: 44px height (`h-11`), left gold border on active (`border-l-3 border-accent`)
- User section: 40px avatar (`w-10 h-10`), sign-out as icon button only
- Logo: show school name from `useAuth().school?.name` with gold PS badge
- Keep all existing: mobile hamburger, overlay, role-based filtering, route highlighting

- [ ] **Step 3: Verify sidebar renders correctly**

```bash
cd /d/Karan/KidsPlanet/dashboard && npm run build
```

- [ ] **Step 4: Commit**

```bash
cd /d/Karan/KidsPlanet && git add -f dashboard/src/components/Sidebar.tsx
git commit -m "feat: collapsible sidebar sections with visual polish"
```

---

## Task 3: StatCard & PageHeader Polish

**Files:**
- Modify: `dashboard/src/components/StatCard.tsx`
- Modify: `dashboard/src/components/PageHeader.tsx`

- [ ] **Step 1: Read both files**

Read `StatCard.tsx` and `PageHeader.tsx`.

- [ ] **Step 2: Rewrite StatCard with tinted backgrounds**

New StatCard design:
- Tinted background per color (green → `bg-green-50`, blue → `bg-blue-50`, etc.)
- Subtle border: `border border-green-100` (matching color)
- Icon in a 40px tinted circle: `w-10 h-10 rounded-xl bg-{color}/10`
- Value: 28px bold, color-matched to the stat color
- Label: 13px, text-muted
- 16px border-radius on the card
- Keep existing props interface, just enhance the visual output

Color map:
```typescript
const colorMap = {
  primary: { bg: 'bg-green-50', border: 'border-green-100', icon: 'bg-green-100', text: 'text-green-700' },
  accent: { bg: 'bg-amber-50', border: 'border-amber-100', icon: 'bg-amber-100', text: 'text-amber-700' },
  danger: { bg: 'bg-red-50', border: 'border-red-100', icon: 'bg-red-100', text: 'text-red-700' },
  success: { bg: 'bg-emerald-50', border: 'border-emerald-100', icon: 'bg-emerald-100', text: 'text-emerald-700' },
  warning: { bg: 'bg-orange-50', border: 'border-orange-100', icon: 'bg-orange-100', text: 'text-orange-700' },
  info: { bg: 'bg-blue-50', border: 'border-blue-100', icon: 'bg-blue-100', text: 'text-blue-700' },
}
```

- [ ] **Step 3: Update PageHeader with subtitle and divider**

Add to PageHeader:
- Optional `subtitle` prop (string)
- Optional `divider` prop (boolean, default true) — renders `border-b border-surface-muted pb-4 mb-6` on the wrapper
- Subtitle renders below title as `text-sm text-text-muted`

- [ ] **Step 4: Commit**

```bash
cd /d/Karan/KidsPlanet && git add -f dashboard/src/components/StatCard.tsx dashboard/src/components/PageHeader.tsx
git commit -m "style: polish StatCard with tinted backgrounds and PageHeader with subtitle"
```

---

## Task 4: Dashboard Home Polish

**Files:**
- Modify: `dashboard/src/app/(dashboard)/page.tsx`

- [ ] **Step 1: Read the existing dashboard page**

Read `D:/Karan/KidsPlanet/dashboard/src/app/(dashboard)/page.tsx`.

- [ ] **Step 2: Rewrite with greeting, featured stat, action cards**

Changes:
- **Greeting:** Replace "Welcome back" with time-based greeting:
  ```typescript
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const firstName = profile?.full_name?.split(' ')[0] ?? ''
  ```
  Header: `{greeting}, {firstName}!` with subtitle: `{school?.name} — {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}`

- **Featured stat card:** Fee collection shown as a gradient green card:
  ```
  background: linear-gradient(135deg, #2d5016, #4a7c28)
  color: white, border-radius: 16px, padding: 20px
  Shows: "Fee Collection" label, formatted amount, "X% of target" subtitle
  ```
  This replaces one of the 4 equal stat cards — now it's 3 regular + 1 featured.

- **Quick actions:** Replace plain link buttons with icon+label cards:
  ```
  Each action: white card with shadow, icon (24px, colored), label below
  Grid: 3 columns on desktop, 2 on mobile
  Min height: 80px per card (generous tap target)
  Hover: subtle shadow increase + scale(1.02)
  ```

- [ ] **Step 3: Verify build**

```bash
cd /d/Karan/KidsPlanet/dashboard && npm run build
```

- [ ] **Step 4: Commit**

```bash
cd /d/Karan/KidsPlanet && git add -f "dashboard/src/app/(dashboard)/page.tsx"
git commit -m "feat: polished dashboard with greeting, featured stat, and action cards"
```

---

## Task 5: Shared Component Polish

**Files:**
- Modify: `dashboard/src/components/shared/FormField.tsx`
- Modify: `dashboard/src/components/shared/Modal.tsx`
- Modify: `dashboard/src/components/shared/DataTable.tsx`

- [ ] **Step 1: Read all three files**

- [ ] **Step 2: Update FormField**

- Input min-height: 44px (add `min-h-[44px]` to input/select/textarea)
- Better focus: already handled by globals.css update
- Label spacing: `mb-1.5` (6px gap above input)

- [ ] **Step 3: Update Modal**

- Border-radius: `rounded-2xl` (16px, already present — verify)
- Close button: ensure `w-11 h-11` (44px)

- [ ] **Step 4: Update DataTable skeleton**

Replace the `animate-pulse` loading skeleton with the new `.skeleton` class:
```html
<div className="skeleton h-12" />  <!-- instead of bg-surface-muted animate-pulse -->
```

- [ ] **Step 5: Commit**

```bash
cd /d/Karan/KidsPlanet && git add -f dashboard/src/components/shared/
git commit -m "style: polish shared components — 44px inputs, shimmer skeleton, rounded modals"
```

---

## Task 6: Canvas Types & Sticker Data

**Files:**
- Create: `dashboard/src/lib/types/canvas.ts`
- Create: `dashboard/src/data/stickers.ts`
- Create: `dashboard/src/data/curated-icons.ts`

- [ ] **Step 1: Create canvas types**

Create `dashboard/src/lib/types/canvas.ts`:
```typescript
export interface CanvasElementBase {
  id: string
  type: 'image' | 'text' | 'icon' | 'sticker'
  x: number
  y: number
  width: number
  height: number
  zIndex: number
  locked: boolean
  visible: boolean
  style: {
    opacity?: number
  }
}

export interface ImageElement extends CanvasElementBase {
  type: 'image'
  content: string // data: URL only
}

export interface TextElement extends CanvasElementBase {
  type: 'text'
  content: string
  style: CanvasElementBase['style'] & {
    fontSize?: number
    fontWeight?: 'normal' | 'bold'
    fontStyle?: 'normal' | 'italic'
    textAlign?: 'left' | 'center' | 'right'
    color?: string
  }
}

export interface IconElement extends CanvasElementBase {
  type: 'icon'
  content: string // lucide icon name
  style: CanvasElementBase['style'] & {
    color?: string
  }
}

export interface StickerElement extends CanvasElementBase {
  type: 'sticker'
  content: string // sticker id
}

export type CanvasElement = ImageElement | TextElement | IconElement | StickerElement

export interface EditorSnapshot {
  fields: Record<string, string>
  elements: CanvasElement[]
}
```

- [ ] **Step 2: Create curated icons list**

Create `dashboard/src/data/curated-icons.ts`:

A list of ~100 Lucide icon names relevant to education, celebration, school life. Examples: `'apple', 'award', 'baby', 'backpack', 'badge-check', 'balloon', 'bell', 'bike', 'book', 'book-open', 'bookmark', 'brain', 'brush', 'bus', 'cake', 'calculator', 'calendar', 'camera', 'check-circle', 'clock', 'cloud', 'crown', 'diamond', 'drum', 'flag', 'flower', 'gamepad', 'gift', 'globe', 'graduation-cap', 'guitar', 'hand-heart', 'heart', 'home', 'ice-cream', 'image', 'lamp', 'leaf', 'library', 'lightbulb', 'medal', 'megaphone', 'mic', 'moon', 'mountain', 'music', 'notebook', 'palette', 'paw-print', 'pen', 'pencil', 'phone', 'pizza', 'plane', 'puzzle', 'rainbow', 'rocket', 'ruler', 'school', 'scissors', 'shield', 'smile', 'snowflake', 'sparkle', 'sparkles', 'speaker', 'star', 'sticker', 'sun', 'target', 'tent', 'thumbs-up', 'ticket', 'timer', 'tree', 'trophy', 'truck', 'umbrella', 'video', 'volleyball', 'wand', 'zap'`

Export as `export const CURATED_ICONS: string[] = [...]`

- [ ] **Step 3: Create sticker data**

Create `dashboard/src/data/stickers.ts`:

Define 20 stickers as inline SVG strings organized by pack. Each sticker has: `id`, `name`, `pack`, `svg` (inline SVG string).

Packs:
- **School (5):** book, pencil, backpack, graduation-cap, globe
- **Celebrations (5):** star, trophy, balloon, medal, gift
- **Animals (5):** lion, butterfly, bird, rabbit, bear
- **Emoji (5):** heart, thumbs-up, fire, sparkle, rainbow

Each SVG should be a simple, colorful, friendly illustration at 64x64 viewBox. Use bold colors and simple shapes suitable for a preschool context.

Export as:
```typescript
export interface Sticker { id: string; name: string; pack: string; svg: string }
export const STICKER_PACKS = ['School', 'Celebrations', 'Animals', 'Emoji'] as const
export const STICKERS: Sticker[] = [...]
```

- [ ] **Step 4: Commit**

```bash
cd /d/Karan/KidsPlanet && git add -f dashboard/src/lib/types/canvas.ts dashboard/src/data/stickers.ts dashboard/src/data/curated-icons.ts
git commit -m "feat: add canvas element types, sticker data, and curated icon list"
```

---

## Task 7: ElementRenderer & ImageImporter

**Files:**
- Create: `dashboard/src/components/studio/ElementRenderer.tsx`
- Create: `dashboard/src/components/studio/ImageImporter.tsx`

- [ ] **Step 1: Create ElementRenderer**

Create `dashboard/src/components/studio/ElementRenderer.tsx`:

Renders a single `CanvasElement` as an absolutely-positioned div. Based on `type`:
- **image:** `<img src={content} />` with `object-fit: contain`, full width/height
- **text:** `<div contentEditable={isEditing}>` with font styles applied. Double-click sets editing mode.
- **icon:** Dynamically import and render the Lucide icon by name. Use `lazy()` or a mapping object for the curated 100 icons.
- **sticker:** Look up SVG from `STICKERS` data, render with `dangerouslySetInnerHTML`

All elements wrapped in a div with:
```
position: absolute
left: {x}px, top: {y}px
width: {width}px, height: {height}px
z-index: {zIndex}
opacity: {style.opacity ?? 1}
display: {visible ? 'block' : 'none'}
pointer-events: {locked ? 'none' : 'auto'}
```

Props: `element: CanvasElement, selected: boolean, editing: boolean, onSelect: () => void, onDoubleClick: () => void, scale: number`

When `selected`: blue border (`2px solid #3b82f6`), 8 resize handles (4 corners + 4 midpoints) as small white squares with blue border.

- [ ] **Step 2: Create ImageImporter**

Create `dashboard/src/components/studio/ImageImporter.tsx`:

A component/hook that handles 3 import methods:
1. **File picker:** `<input type="file" accept="image/*">` triggered by button. Max 5MB check.
2. **Drag-drop:** `onDragOver` + `onDrop` handlers on the canvas wrapper. Shows "Drop image here" overlay.
3. **Clipboard paste:** `document.addEventListener('paste', ...)` — only fires when no contentEditable is focused.

All methods: read file via `FileReader.readAsDataURL()`, compute default size (fit within 50% of canvas), return `{ dataUrl: string, width: number, height: number }`.

Export as a hook: `useImageImporter(canvasWidth, canvasHeight)` returning `{ importFromFile, importFromDrop, handlePaste, fileInputRef }`.

- [ ] **Step 3: Commit**

```bash
cd /d/Karan/KidsPlanet && git add -f dashboard/src/components/studio/ElementRenderer.tsx dashboard/src/components/studio/ImageImporter.tsx
git commit -m "feat: add ElementRenderer and ImageImporter for canvas editor"
```

---

## Task 8: CanvasEditor — Core Drag & Resize

**Files:**
- Create: `dashboard/src/components/studio/CanvasEditor.tsx`

- [ ] **Step 1: Create CanvasEditor**

Create `dashboard/src/components/studio/CanvasEditor.tsx`:

This is the main canvas component. It renders all `CanvasElement[]` using `ElementRenderer`, and handles:

**Selection:**
- Click element → select (set `selectedId` state)
- Click empty canvas → deselect (`selectedId = null`)
- Escape key → deselect
- Delete/Backspace → remove selected element (if not editing text)

**Coordinate translation (CRITICAL):**
- The canvas is displayed at `transform: scale(scale)`. All mouse events must be translated: `const canvasX = (clientX - canvasRect.left) / scale`
- Store element positions in unscaled canvas coordinates. Only apply scale for display.

**Dragging:**
- Mouse down on selected element (not on a resize handle) starts drag tracking
- 3px movement threshold before drag actually begins (using translated coordinates)
- During drag: update element position via `ref.style.transform` (no React re-render)
- On mouse up: commit new x,y to React state, fire `onElementsChange` callback
- Boundary enforcement: at least 20px of element must remain within canvas

**Pointer events for inactive mode:**
- When `active={false}`, the entire CanvasEditor overlay should have `pointer-events: none` so clicks pass through to the template below. Canvas elements still render visually but are non-interactive.

**Resizing:**
- 8 handles: 4 corners (nw, ne, sw, se) + 4 midpoints (n, s, e, w)
- Mouse down on handle starts resize tracking
- Corner handles: resize width+height. Images: maintain aspect ratio by default (Shift to unlock). Others: free resize.
- Edge handles: resize one dimension only
- Minimum size: 20x20px
- During resize: update via ref style (no re-render)
- On mouse up: commit new width, height, x, y to state

**Cursor management:**
- Default on canvas: `default`
- Hover over element: `grab`
- During drag: `grabbing`
- Hover over resize handle: appropriate resize cursor (`nw-resize`, `n-resize`, etc.)

Props:
```typescript
interface CanvasEditorProps {
  elements: CanvasElement[]
  onElementsChange: (elements: CanvasElement[]) => void
  canvasWidth: number
  canvasHeight: number
  scale: number
  active: boolean  // false when in Template Fields mode
}
```

The canvas wrapper div has: `position: relative`, dimensions = canvasWidth × canvasHeight, `transform: scale(scale)`.

- [ ] **Step 2: Verify build**

```bash
cd /d/Karan/KidsPlanet/dashboard && npm run build
```

- [ ] **Step 3: Commit**

```bash
cd /d/Karan/KidsPlanet && git add -f dashboard/src/components/studio/CanvasEditor.tsx
git commit -m "feat: CanvasEditor with drag, resize, select, and boundary enforcement"
```

---

## Task 9: FloatingToolbar & LayerPanel

**Files:**
- Create: `dashboard/src/components/studio/FloatingToolbar.tsx`
- Create: `dashboard/src/components/studio/LayerPanel.tsx`

- [ ] **Step 1: Create FloatingToolbar**

Create `dashboard/src/components/studio/FloatingToolbar.tsx`:

Positioned absolutely above the selected element. Flips below if element is near canvas top.

Shows contextual controls based on element type:
- **All types:** delete button, opacity slider (0-100%), bring forward / send backward buttons
- **Text:** font size (number input 12-72), bold toggle, italic toggle, color picker, alignment (L/C/R)
- **Icon:** color picker, size (number input)
- **Image:** opacity only (crop deferred)
- **Sticker:** no extra controls (just common ones)

Compact horizontal bar: white bg, rounded-xl, shadow-lg, `min-h-[44px]`, gap-1 between buttons.
Each control button: `w-9 h-9` (36px — these are secondary controls within the 44px bar).

Props: `element: CanvasElement, onUpdate: (updates: Partial<CanvasElement>) => void, onDelete: () => void, position: { x: number, y: number }, flipped: boolean`

- [ ] **Step 2: Create LayerPanel**

Create `dashboard/src/components/studio/LayerPanel.tsx`:

Toggleable panel (slides in from left when active).

Shows a list of all canvas elements, bottom-to-top z-order:
- Each row: type icon (Image/Type/Sparkle/Sticker from lucide), element name (e.g., "Text Block", "Imported Image"), up/down arrows, eye icon (toggle visibility), lock icon (toggle locked)
- Click row → select that element on canvas
- Selected row has a blue highlight

Props: `elements: CanvasElement[], selectedId: string | null, onSelect: (id: string) => void, onReorder: (id: string, direction: 'up' | 'down') => void, onToggleVisible: (id: string) => void, onToggleLock: (id: string) => void`

- [ ] **Step 3: Commit**

```bash
cd /d/Karan/KidsPlanet && git add -f dashboard/src/components/studio/FloatingToolbar.tsx dashboard/src/components/studio/LayerPanel.tsx
git commit -m "feat: add FloatingToolbar and LayerPanel for canvas editor"
```

---

## Task 10: IconPicker & StickerPicker Modals

**Files:**
- Create: `dashboard/src/components/studio/IconPicker.tsx`
- Create: `dashboard/src/components/studio/StickerPicker.tsx`
- Create: `dashboard/src/components/studio/AddMenu.tsx`

- [ ] **Step 1: Create IconPicker**

Create `dashboard/src/components/studio/IconPicker.tsx`:

Modal (uses `Modal` from shared) with:
- Search input at top
- Grid of icons (8 columns) from `CURATED_ICONS`
- Each icon rendered via dynamic import from lucide-react: `import { icons } from 'lucide-react'` then `icons[pascalCase(iconName)]`
- Click icon → calls `onSelect(iconName)` → closes modal
- Icons render at 24px in a 48px tap target

Props: `open: boolean, onClose: () => void, onSelect: (iconName: string) => void`

- [ ] **Step 2: Create StickerPicker**

Create `dashboard/src/components/studio/StickerPicker.tsx`:

Modal with tabs per pack (School / Celebrations / Animals / Emoji):
- Tab bar at top
- Grid of stickers (4-5 columns) for the active pack
- Each sticker rendered with `dangerouslySetInnerHTML` from `STICKERS` data at 64px
- Click sticker → calls `onSelect(stickerId)` → closes modal

Props: `open: boolean, onClose: () => void, onSelect: (stickerId: string) => void`

- [ ] **Step 3: Create AddMenu**

Create `dashboard/src/components/studio/AddMenu.tsx`:

Dropdown menu triggered by an "Add" button in the toolbar:
- 4 options: Image, Text, Icon, Sticker
- Each with a lucide icon and label
- Click option → triggers callback or opens the appropriate picker modal

Props: `onAddImage: () => void, onAddText: () => void, onOpenIconPicker: () => void, onOpenStickerPicker: () => void`

- [ ] **Step 4: Commit**

```bash
cd /d/Karan/KidsPlanet && git add -f dashboard/src/components/studio/IconPicker.tsx dashboard/src/components/studio/StickerPicker.tsx dashboard/src/components/studio/AddMenu.tsx
git commit -m "feat: add IconPicker, StickerPicker, and AddMenu for canvas editor"
```

---

## Task 11a: Editor State Management — New Undo/Redo & Canvas State

**Files:**
- Modify: `dashboard/src/app/(dashboard)/content-studio/[templateId]/page.tsx`
- Modify: `dashboard/src/data/templates.ts`
- Modify: `dashboard/src/templates/registry.ts`

- [ ] **Step 1: Read existing files**

Read the editor page, `data/templates.ts` (specifically the `getTemplate` function), and `templates/registry.ts` completely.

- [ ] **Step 2: Handle 'blank' templateId in BOTH data files**

**CRITICAL:** The editor calls `getTemplate(templateId)` from `data/templates.ts` — if it returns `undefined`, the page shows "Template Not Found". BOTH files need the blank guard:

In `dashboard/src/data/templates.ts`, update `getTemplate`:
```typescript
export function getTemplate(id: string) {
  if (id === 'blank') return null  // blank canvas — no template
  return templates.find(t => t.id === id)
}
```

In `dashboard/src/templates/registry.ts`, update `getTemplateComponent`:
```typescript
export function getTemplateComponent(id: string) {
  if (id === 'blank') return null
  return registry[id] ?? PlaceholderTemplate
}
```

- [ ] **Step 3: Add canvas state and new undo system to editor page**

Update `[templateId]/page.tsx` with new state:
```typescript
import { CanvasElement, EditorSnapshot } from '@/lib/types/canvas'

const [elements, setElements] = useState<CanvasElement[]>([])
const [canvasMode, setCanvasMode] = useState(false)
const [selectedElementId, setSelectedElementId] = useState<string | null>(null)
const [showLayers, setShowLayers] = useState(false)
const [showIconPicker, setShowIconPicker] = useState(false)
const [showStickerPicker, setShowStickerPicker] = useState(false)
```

Replace the existing field-only history with unified `EditorSnapshot` history:
```typescript
const MAX_HISTORY = 30
const [history, setHistory] = useState<EditorSnapshot[]>([{ fields: defaults, elements: [] }])
const [historyIndex, setHistoryIndex] = useState(0)
```

Update `pushHistory` to capture both fields and elements. Update `undo`/`redo` to restore both.

Add keyboard handler: Delete/Backspace removes selected element (when not editing text), Escape deselects. These coexist with existing Ctrl+S/Ctrl+Z/Ctrl+Shift+Z handlers.

For blank canvas: check `templateId === 'blank'`, read `size` from `useSearchParams()`, parse width/height. Skip rendering `TemplateComponent`, render a white background div at the specified size instead. Hide the field panel.

- [ ] **Step 4: Commit**

```bash
cd /d/Karan/KidsPlanet && git add -f "dashboard/src/app/(dashboard)/content-studio/" dashboard/src/data/templates.ts dashboard/src/templates/registry.ts
git commit -m "feat: add canvas state, unified undo/redo, and blank canvas support"
```

---

## Task 11b: Wire CanvasEditor Overlay Into Preview

**Files:**
- Modify: `dashboard/src/app/(dashboard)/content-studio/[templateId]/page.tsx`

- [ ] **Step 1: Read the editor page (after Task 11a changes)**

- [ ] **Step 2: Add CanvasEditor overlay to the preview area**

**CRITICAL — previewRef placement:** The existing `previewRef` wraps only `<TemplateComponent>`. It MUST be moved to wrap the entire composite (template + canvas overlay) so that `html-to-image` captures everything on export.

Change the preview area from:
```html
<div ref={previewRef} style={{ width, height }}>
  <TemplateComponent fields={fieldValues} />
</div>
```
To:
```html
<div ref={previewRef} style={{ position: 'relative', width, height }}>
  {templateId !== 'blank' && TemplateComp && <TemplateComp fields={fieldValues} />}
  {templateId === 'blank' && <div style={{ width: '100%', height: '100%', background: 'white' }} />}
  <CanvasEditor
    elements={elements}
    onElementsChange={(newElements) => { setElements(newElements); pushHistory(fieldValues, newElements) }}
    canvasWidth={width}
    canvasHeight={height}
    scale={zoom}
    active={canvasMode}
  />
</div>
```

The outer container with `overflow: hidden` should be changed to `overflow: visible` to prevent clipping of floating toolbar. The FloatingToolbar should use a React portal (`createPortal`) if clipping is still an issue.

- [ ] **Step 3: Add element creation handlers**

```typescript
const addImage = (dataUrl: string, imgWidth: number, imgHeight: number) => {
  const el: ImageElement = {
    id: crypto.randomUUID(), type: 'image', content: dataUrl,
    x: (width - imgWidth) / 2, y: (height - imgHeight) / 2,
    width: imgWidth, height: imgHeight, zIndex: elements.length + 1,
    locked: false, visible: true, style: { opacity: 1 }
  }
  const newElements = [...elements, el]
  setElements(newElements)
  pushHistory(fieldValues, newElements)
}
// Similar for addText (200x50, centered), addIcon (48x48), addSticker (80x80)
```

Wire `useImageImporter` hook for image import (file picker, drag-drop, clipboard paste).

- [ ] **Step 4: Add export cleanup**

Before `toPng`/`toJpeg` calls: set `selectedElementId` to null, blur `document.activeElement`, wait one frame (`await new Promise(r => requestAnimationFrame(r))`), then capture. Restore selection after.

Add `toJpeg` import from `html-to-image` for JPEG export. For JPEG: pass `{ backgroundColor: '#ffffff' }` to `toJpeg()` to handle transparency.

- [ ] **Step 5: Commit**

```bash
cd /d/Karan/KidsPlanet && git add -f "dashboard/src/app/(dashboard)/content-studio/"
git commit -m "feat: wire CanvasEditor overlay with element creation and export cleanup"
```

---

## Task 11c: Update EditorToolbar

**Files:**
- Modify: `dashboard/src/components/studio/EditorToolbar.tsx`

- [ ] **Step 1: Read the existing EditorToolbar**

- [ ] **Step 2: Add mode toggle, AddMenu, layers, and download dropdown**

New toolbar layout:
```
[Mode Toggle: Fields|Canvas] [Add ▼ (canvas mode only)] | [Undo/Redo] [Zoom] | [Layers toggle] | [Copy | Download ▼]
```

- **Mode toggle:** Two-segment button ("Fields" / "Canvas"). Active segment has `bg-primary text-white`, inactive has `bg-surface-muted`.
- **Add menu:** Import and render `<AddMenu>` component. Only visible when `canvasMode === true`.
- **Layers toggle:** Button with `Layers` icon, toggles `showLayers` prop.
- **Download dropdown:** Replace single download button with a dropdown:
  - PNG (1x) — existing `toPng` behavior
  - PNG HD (2x) — existing HD behavior
  - JPEG — calls `onDownloadJpeg` prop

New props to add: `canvasMode, onToggleMode, onAddImage, onAddText, onOpenIconPicker, onOpenStickerPicker, showLayers, onToggleLayers, onDownloadJpeg`

- [ ] **Step 3: Commit**

```bash
cd /d/Karan/KidsPlanet && git add -f dashboard/src/components/studio/EditorToolbar.tsx
git commit -m "feat: update EditorToolbar with mode toggle, Add menu, and download options"
```

---

## Task 12: Gallery Updates — Blank Canvas & Live Thumbnails

**Files:**
- Modify: `dashboard/src/app/(dashboard)/content-studio/page.tsx`

- [ ] **Step 1: Read the gallery page**

Read the current content-studio/page.tsx.

- [ ] **Step 2: Add Blank Canvas card**

Add as the first card in the grid (before template cards):
- White card with a large "+" icon and "Blank Canvas" label
- On click: show a size selection modal with presets:
  - Instagram Post (1080×1080)
  - Instagram Story (1080×1920)
  - A4 Print (794×1123)
  - Facebook Cover (1200×628)
  - Custom (width × height number inputs)
- On select: navigate to `/content-studio/blank?size={w}x{h}`

- [ ] **Step 3: Add live thumbnails**

For each template card, instead of the gradient placeholder, render the actual template component at thumbnail scale:
- Wrap in a div with `overflow: hidden`, fixed height (200px)
- Apply `transform: scale(0.2)` (or appropriate ratio) and `transform-origin: top left`
- Set the wrapper to the scaled dimensions

This gives a real preview of each template in the gallery.

- [ ] **Step 4: Commit**

```bash
cd /d/Karan/KidsPlanet && git add -f "dashboard/src/app/(dashboard)/content-studio/page.tsx"
git commit -m "feat: add Blank Canvas option and live template thumbnails to gallery"
```

---

## Task 13: Final Build Verification & Cleanup

- [ ] **Step 1: Full build test**

```bash
cd /d/Karan/KidsPlanet/dashboard && npm run build
```

Fix any TypeScript errors or build failures.

- [ ] **Step 2: Manual smoke test checklist**

Run `npm run dev` and verify:
- [ ] Sidebar: sections collapse/expand, state persists on refresh
- [ ] Sidebar: gold active indicator on current page
- [ ] Sidebar: mobile hamburger works, overlay closes on tap
- [ ] Dashboard: time-based greeting shows
- [ ] Dashboard: stat cards have tinted backgrounds
- [ ] Dashboard: quick actions are icon+label cards
- [ ] Cards everywhere: 16px radius, warm border
- [ ] Buttons: 44px height, hover scale effect
- [ ] Inputs: 44px height, focus glow
- [ ] Content Studio gallery: Blank Canvas card appears first
- [ ] Content Studio gallery: live template thumbnails render
- [ ] Content Studio editor: "Template Fields" mode works as before
- [ ] Content Studio editor: "Canvas Edit" toggle works
- [ ] Content Studio editor: Add Text → text block appears, draggable, editable
- [ ] Content Studio editor: Add Image → file picker, image appears, resizable
- [ ] Content Studio editor: Add Icon → picker modal, icon appears
- [ ] Content Studio editor: Add Sticker → picker modal, sticker appears
- [ ] Content Studio editor: Undo/redo works across field and canvas changes
- [ ] Content Studio editor: Download PNG includes canvas elements
- [ ] Content Studio editor: Layers panel shows elements, up/down works

- [ ] **Step 3: Commit any fixes**

```bash
cd /d/Karan/KidsPlanet && git add -f dashboard/src/
git commit -m "chore: fix build issues and polish final integration"
```

---

## Summary

| Task | Description | Workstream |
|------|-------------|------------|
| 1 | Global CSS polish (cards, buttons, inputs, skeleton) | W1: Polish |
| 2 | Sidebar collapsible sections | W1: Sidebar |
| 3 | StatCard & PageHeader polish | W2: Pages |
| 4 | Dashboard home polish (greeting, featured stat, actions) | W2: Pages |
| 5 | Shared component polish (FormField, Modal, DataTable) | W2: Pages |
| 6 | Canvas types, sticker data, curated icons | W3: Editor |
| 7 | ElementRenderer & ImageImporter | W3: Editor |
| 8 | CanvasEditor (drag, resize, select, coordinate translation) | W3: Editor |
| 9 | FloatingToolbar & LayerPanel | W3: Editor |
| 10 | IconPicker, StickerPicker, AddMenu | W3: Editor |
| 11a | Editor state management (undo/redo, canvas state, blank canvas) | W3: Editor |
| 11b | Wire CanvasEditor overlay + element creation + export | W3: Editor |
| 11c | Update EditorToolbar (mode toggle, Add menu, downloads) | W3: Editor |
| 12 | Gallery updates (Blank Canvas, live thumbnails) | W3: Editor |
| 13 | Final build verification & cleanup | All |
