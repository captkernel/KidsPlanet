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
  content: string
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
  content: string
  style: CanvasElementBase['style'] & {
    color?: string
  }
}

export interface StickerElement extends CanvasElementBase {
  type: 'sticker'
  content: string
}

export type CanvasElement = ImageElement | TextElement | IconElement | StickerElement

export interface EditorSnapshot {
  fields: Record<string, string>
  elements: CanvasElement[]
}
