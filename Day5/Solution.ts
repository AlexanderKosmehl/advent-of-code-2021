import { readFileSync } from 'fs'
import { resolve } from 'path'
import { VentMap } from './VentMap'
import { Direction } from './Direction'

const input = readFileSync(resolve(__dirname, 'Input.txt')).toString()
const inputLines = input.split('\r\n') // Split lines

// Transform input lines into direction objects
const directions = inputLines.map((line) => {
  const [fromString, toString] = line.split(' -> ')
  const [fromX, fromY] = fromString.split(',')
  const [toX, toY] = toString.split(',')

  const newDirection: Direction = {
    from: {
      x: Number(fromX),
      y: Number(fromY),
    },
    to: {
      x: Number(toX),
      y: Number(toY),
    },
  }
  return newDirection
})

const maxX = Math.max(
  ...directions.map((direction) => direction.from.x),
  ...directions.map((direction) => direction.to.x)
)
const maxY = Math.max(
  ...directions.map((direction) => direction.from.y),
  ...directions.map((direction) => direction.to.y)
)

// Generate VentMap using max sizes
const ventMap1 = new VentMap(maxX, maxY)

// Part 1

for (const direction of directions) {
  ventMap1.addVentVector(direction, true)
}

let numberOfOverlaps = 0

for (let y = 0; y <= maxY; y++) {
  for (let x = 0; x <= maxX; x++) {
    if (ventMap1.vents[y][x] >= 2) numberOfOverlaps++
  }
}

console.log('Solution Part 1:', numberOfOverlaps)

// Part 2
const ventMap2 = new VentMap(maxX, maxY)

for (const direction of directions) {
  ventMap2.addVentVector(direction, false)
}

numberOfOverlaps = 0

for (let y = 0; y <= maxY; y++) {
  for (let x = 0; x <= maxX; x++) {
    if (ventMap2.vents[y][x] >= 2) numberOfOverlaps++
  }
}

console.log('Solution Part 2:', numberOfOverlaps)
