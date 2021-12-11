import { readFileSync } from 'fs'
import { resolve } from 'path'

const numberOfSteps = 300

const octopusArray = readFileSync(resolve(__dirname, 'Input.txt'))
  .toString()
  .split('\r\n')
  .map((line) => line.split('').map((octopus) => Number(octopus)))

/*
  Helper Functions
 */

function getNeighbourPositions(
  x: number,
  y: number,
  maxX: number,
  maxY: number
): { x: number; y: number }[] {
  const neighbours = []

  for (let yPos = y - 1; yPos <= y + 1; yPos++) {
    for (let xPos = x - 1; xPos <= x + 1; xPos++) {
      // Current position
      if (xPos === x && yPos === y) continue

      // Position out of bounds
      if (xPos < 0 || yPos < 0 || xPos >= maxX || yPos >= maxY) continue

      neighbours.push({
        x: xPos,
        y: yPos,
      })
    }
  }

  return neighbours
}

// Part 1

interface Octopus {
  energyLevel: number
  didFlash: boolean
}

let flashCounter = 0

// Convert each octopus into an object to track whether it flashed
const octopusObjectArray: Octopus[][] = octopusArray.map((line) => {
  return line.map((octopus) => {
    return { energyLevel: octopus, didFlash: false }
  })
})

for (let step = 0; step < numberOfSteps; step++) {
  // Increase initial energy level due to next step
  for (let yPos = 0; yPos < octopusObjectArray.length; yPos++) {
    for (let xPos = 0; xPos < octopusObjectArray[yPos].length; xPos++) {
      octopusObjectArray[yPos][xPos].energyLevel += 1
    }
  }

  // Let flashes propergate until nothing changes
  let somethingChanged = false
  do {
    // Reset somethingChanged
    somethingChanged = false
    for (let yPos = 0; yPos < octopusObjectArray.length; yPos++) {
      for (let xPos = 0; xPos < octopusObjectArray[yPos].length; xPos++) {
        // Check current octopus
        const octopus = octopusObjectArray[yPos][xPos]
        if (octopus.energyLevel > 9 && !octopus.didFlash) {
          // Current Octopus flashes

          // Mark current octopus
          octopus.didFlash = true

          // Continue loop
          somethingChanged = true

          // Increase energy of all neighbours
          const neighbours = getNeighbourPositions(
            xPos,
            yPos,
            octopusObjectArray[yPos].length,
            octopusObjectArray.length
          )
          for (const neighbour of neighbours) {
            octopusObjectArray[neighbour.y][neighbour.x].energyLevel += 1
          }
        }
      }
    }
  } while (somethingChanged)

  // Part 2
  let everyoneFlashed = true
  for (let yPos = 0; yPos < octopusObjectArray.length; yPos++) {
    for (let xPos = 0; xPos < octopusObjectArray[yPos].length; xPos++) {
      if (!octopusObjectArray[yPos][xPos].didFlash) everyoneFlashed = false
    }
  }
  if (everyoneFlashed) console.log('Everyone flashed during step ', step + 1)

  // Cleanup for next step
  for (let yPos = 0; yPos < octopusObjectArray.length; yPos++) {
    for (let xPos = 0; xPos < octopusObjectArray[yPos].length; xPos++) {
      const currentOctopus = octopusObjectArray[yPos][xPos]
      if (currentOctopus.didFlash === true) {
        // Reset Octopus
        flashCounter++
        currentOctopus.didFlash = false
        currentOctopus.energyLevel = 0
      }
    }
  }
}

console.log(
  'After %d steps, there have been a total of %d flashes',
  numberOfSteps,
  flashCounter
)
