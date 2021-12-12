import { readFileSync } from 'fs'
import { resolve } from 'path'

// Generate Caves

interface Cave {
  name: string
  connections: string[]
  isLarge: boolean
}

// Adds connection to caves array and creates new caves if required
function addConnection(origin: string, target: string, caves: Cave[]) {
  const originCave = caves.find((cave) => cave.name === origin)
  if (originCave) {
    originCave.connections.push(target)
  } else {
    caves.push({
      name: origin,
      connections: [target],
      isLarge: origin === origin.toUpperCase(),
    })
  }

  const targetCave = caves.find((cave) => cave.name === target)
  if (targetCave) {
    targetCave.connections.push(origin)
  } else {
    caves.push({
      name: target,
      connections: [origin],
      isLarge: target === target.toUpperCase(),
    })
  }
}

const input = readFileSync(resolve(__dirname, 'Input.txt'))
  .toString()
  .split('\r\n')

const caves: Cave[] = []

input.forEach((line) => {
  const [origin, target] = line.split('-')
  addConnection(origin, target, caves)
})

/*
  Part 1
 */

function getNumberOfPathsToEnd(
  currentCave: Cave,
  visitedCaves: string[]
): number {
  // Base
  if (currentCave.name === 'end') {
    return 1
  }

  let subPaths = 0
  for (const connectedCaveName of currentCave.connections) {
    const connectedCave = caves.find((cave) => cave.name === connectedCaveName)
    if (
      connectedCave &&
      (connectedCave.isLarge || !visitedCaves.includes(connectedCave.name))
    ) {
      subPaths += getNumberOfPathsToEnd(connectedCave, [
        ...visitedCaves,
        currentCave.name,
      ])
    }
  }
  return subPaths
}

const startCave = caves.find((cave) => cave.name === 'start')
let numberOfPaths = 0
if (startCave) {
  numberOfPaths += getNumberOfPathsToEnd(startCave, [])
}

console.log('Number of Paths:', numberOfPaths)

/*
  Part 2
*/

function getNumberOfPathsToEndDeluxe(
  currentCave: Cave,
  visitedCaves: string[],
  hasVisitedSmallCaveTwice: boolean
): number {
  // Base
  if (currentCave.name === 'end') {
    return 1
  }

  let subPaths = 0
  for (const connectedCaveName of currentCave.connections) {
    // Get connected Cave from array
    const connectedCave = caves.find((cave) => cave.name === connectedCaveName)
    if (!connectedCave) continue

    // Large Cave -> Always allowed
    if (connectedCave.isLarge) {
      subPaths += getNumberOfPathsToEndDeluxe(
        connectedCave,
        [...visitedCaves, currentCave.name],
        hasVisitedSmallCaveTwice
      )
      // Small cave
    } else {
      // Duplicate Cave
      if (visitedCaves.includes(connectedCave.name)) {
        // Cant enter another small cave -> skip
        if (hasVisitedSmallCaveTwice || connectedCave.name === 'start') continue
        subPaths += getNumberOfPathsToEndDeluxe(
          connectedCave,
          [...visitedCaves, currentCave.name],
          true
        )
        // New Cave
      } else {
        subPaths += getNumberOfPathsToEndDeluxe(
          connectedCave,
          [...visitedCaves, currentCave.name],
          hasVisitedSmallCaveTwice
        )
      }
    }
  }
  return subPaths
}

numberOfPaths = 0
if (startCave) {
  numberOfPaths += getNumberOfPathsToEndDeluxe(startCave, [], false)
}

console.log('Number of Paths with 1 additional visit:', numberOfPaths)
