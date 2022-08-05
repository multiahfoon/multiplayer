import { ANIMAL_LIST, MAP_DATA, PREFIX } from '../common/constants'

export function randomFromArray(array) {
  return array[Math.floor(Math.random() * array.length)]
}
export function getKeyString(x, y) {
  return `${x}x${y}`
}

export function createName() {
  const prefix = randomFromArray(PREFIX)
  const animal = randomFromArray(ANIMAL_LIST)
  return `${prefix} ${animal}`
}

export function isSolid(x, y) {
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
  return randomFromArray([
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
  ])
}
