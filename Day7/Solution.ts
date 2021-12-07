import { readFileSync } from 'fs'
import { resolve } from 'path'

const input = readFileSync(resolve(__dirname, 'Input.txt')).toString()
const crabPositions = input.split(',').map((pos) => Number(pos))
const crabMax = Math.max(...crabPositions)

/*
  Hilfsfunktionen
 */
function calculateFuelCost(targetPos: number, crabPositions: number[]): number {
  return crabPositions
    .map((position) => Math.abs(position - targetPos))
    .reduce((prev, curr) => prev + curr, 0)
}

function calculateExpensiveFuelCost(
  targetPos: number,
  crabPositions: number[]
): number {
  return crabPositions
    .map((position) => Math.abs(position - targetPos))
    .map((distance) => (distance * (distance + 1)) / 2) // Famous Gauss sum
    .reduce((prev, curr) => prev + curr)
}

// Part 1
let fuelMinimum: number | undefined = undefined

for (let currentPos = 0; currentPos <= crabMax; currentPos++) {
  const currentFuelCost = calculateFuelCost(currentPos, crabPositions)

  if (!fuelMinimum || currentFuelCost < fuelMinimum) {
    fuelMinimum = currentFuelCost
  }
}

console.log('Minimum Fuel Cost (Part 1):', fuelMinimum)

// Part 2
fuelMinimum = undefined

for (let currentPos = 0; currentPos <= crabMax; currentPos++) {
  const currentFuelCost = calculateExpensiveFuelCost(currentPos, crabPositions)

  if (!fuelMinimum || currentFuelCost < fuelMinimum) {
    fuelMinimum = currentFuelCost
  }
}

console.log('Minimum Fuel Cost (Part 2):', fuelMinimum)

// Pseudo-"Einzeiler" #Denzi
console.log(
  'Part 1 Alternativ:',
  Math.min(
    ...Array.from(new Array(crabMax).keys()).map((currentPos) =>
      readFileSync(resolve(__dirname, 'Input.txt'))
        .toString()
        .split(',')
        .map((value) => Number(value))
        .map((crabPosition) => Math.abs(currentPos - crabPosition))
        .reduce((prev, curr) => prev + curr, 0)
    )
  )
)
