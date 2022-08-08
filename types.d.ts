import { Attributes } from 'react'

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

export interface Player {
  [key: string]: Attributes.key
  [coins: string]: number
  [color: string]: string
  [direction: string]: string
  [id: string]: string
  [name: string]: string
  [x: string]: number
  [y: string]: number
}
