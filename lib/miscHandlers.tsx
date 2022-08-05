import {
  ANIMAL_LIST,
  MAP_DATA,
  PREFIX,
  RANDOM_POSITION,
} from '../common/constants'

export function randomFromArray(array: any) {
  return array[Math.floor(Math.random() * array.length)]
}
export function getKeyString(x: string, y: string) {
  return `${x}x${y}`
}

export function createName() {
  const prefix = randomFromArray(PREFIX)
  const animal = randomFromArray(ANIMAL_LIST)
  return `${prefix} ${animal}`
}

export function isSolid(x: any, y: any) {
  const blockedNextSpace = MAP_DATA.blockedSpaces[getKeyString(x, y)]

  return (
    blockedNextSpace ||
    x >= MAP_DATA.maxX ||
    x < MAP_DATA.minX ||
    y >= MAP_DATA.maxY ||
    y < MAP_DATA.minY
  )
}

export function getRandomSafeSpot() {
  //We don't look things up by key here, so just return an x/y
  return randomFromArray(RANDOM_POSITION)
}
