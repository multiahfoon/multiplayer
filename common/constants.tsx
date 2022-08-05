import { ArrowKeys, Key, tBlockSpaces } from '../types'

const blockedSpaces: tBlockSpaces = {
  '7x4': true,
  '1x11': true,
  '12x10': true,
  '4x7': true,
  '5x7': true,
  '6x7': true,
  '8x6': true,
  '9x6': true,
  '10x6': true,
  '7x9': true,
  '8x9': true,
  '9x9': true,
}

export const ANIMAL_LIST: string[] = [
  'BEAR',
  'BIRD',
  'BOAR',
  'BUG',
  'BULL',
  'CAT',
  'DOG',
  'FOX',
  'GOAT',
  'LAMB',
  'LION',
  'MULE',
  'PUMA',
  'SEAL',
  'VOLE',
]

export const ARROW_KEYS: ArrowKeys = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
}

export const MAP_DATA = {
  minX: 1,
  maxX: 14,
  minY: 4,
  maxY: 12,
  blockedSpaces,
}

export const RANDOM_POSITION: Key[] = [
  { x: 1, y: 4 },
  { x: 2, y: 4 },
  { x: 1, y: 5 },
  { x: 2, y: 6 },
  { x: 2, y: 8 },
  { x: 2, y: 9 },
  { x: 4, y: 8 },
  { x: 5, y: 5 },
  { x: 5, y: 8 },
  { x: 5, y: 10 },
  { x: 5, y: 11 },
  { x: 11, y: 7 },
  { x: 12, y: 7 },
  { x: 13, y: 7 },
  { x: 13, y: 6 },
  { x: 13, y: 8 },
  { x: 7, y: 6 },
  { x: 7, y: 7 },
  { x: 7, y: 8 },
  { x: 8, y: 8 },
  { x: 10, y: 8 },
  { x: 8, y: 8 },
  { x: 11, y: 4 },
]

export const PREFIX: string[] = [
  'BUFF',
  'COOL',
  'COOL',
  'DAMP',
  'DARK',
  'DEAR',
  'DOPE',
  'GOOD',
  'HIP',
  'LONG',
  'RICH',
  'SAFE',
  'SILKY',
  'SMUG',
  'SOFT',
  'SUPER',
  'WARM',
]

export const PLAYER_COLORS: string[] = [
  'blue',
  'red',
  'orange',
  'yellow',
  'green',
  'purple',
]
