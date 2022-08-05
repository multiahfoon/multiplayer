export type tBlockSpaces = {
  [key: string]: boolean
}

export interface Key {
  x: number
  y: number
}

export interface ArrowKeys {
  [ArrowUp: string]: Key
  [ArrowDown: string]: Key
  [ArrowLeft: string]: Key
  [ArrowRight: string]: Key
}
