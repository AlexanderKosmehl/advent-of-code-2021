import { readFileSync } from 'fs'
import { resolve } from 'path'

const heightMap = readFileSync(resolve(__dirname, 'Input.txt'))
  .toString()
  .split('\r\n')
  .map((line) => line.split('').map((digit) => Number(digit))) // Split into individual numbers

// Part 1

function isLowPoint(x: number, y: number, heightMap: number[][]): boolean {
  const point = heightMap[y][x]

  // Left
  if (x > 0 && heightMap[y][x - 1] <= point) return false

  // Right
  if (x < heightMap[y].length - 1 && heightMap[y][x + 1] <= point) return false

  // Up
  if (y > 0 && heightMap[y - 1][x] <= point) return false

  // Down
  if (y < heightMap.length - 1 && heightMap[y + 1][x] <= point) return false

  return true
}

const riskLevels = []

for (let yPos = 0; yPos < heightMap.length; yPos++) {
  for (let xPos = 0; xPos < heightMap[yPos].length; xPos++) {
    if (isLowPoint(xPos, yPos, heightMap))
      riskLevels.push(heightMap[yPos][xPos] + 1)
  }
}

const riskSum = riskLevels.reduce((prev, curr) => prev + curr, 0)

console.log('Sum of all risk levels:', riskSum)

// Part 2

function getNeighbours(
  x: number,
  y: number,
  heightMap: number[][]
): { x: number; y: number }[] {
  const neighbours = []

  // Left
  if (x > 0)
    neighbours.push({
      x: x - 1,
      y: y,
    })

  // Right
  if (x < heightMap[y].length - 1)
    neighbours.push({
      x: x + 1,
      y: y,
    })

  // Up
  if (y > 0)
    neighbours.push({
      x: x,
      y: y - 1,
    })

  // Down
  if (y < heightMap.length - 1)
    neighbours.push({
      x: x,
      y: y + 1,
    })

  return neighbours
}

function generateNewBasin(
  x: number,
  y: number,
  basinNodes: { x: number; y: number }[] = []
): { x: number; y: number }[] {
  // Base case
  if (basinNodes.some((node) => node.x === x && node.y === y)) return []

  // Iggnore Walls
  if (heightMap[y][x] === 9) return []

  // Recursion
  basinNodes.push({ x, y })

  const newNeighbourNodes = []
  const neighbours = getNeighbours(x, y, heightMap)
  for (const neighbour of neighbours) {
    // Skip since neighbour is already in list
    if (
      !basinNodes.some(
        (node) => node.x === neighbour.x && node.y === neighbour.y
      )
    )
      newNeighbourNodes.push(
        ...generateNewBasin(neighbour.x, neighbour.y, basinNodes)
      )
  }

  return [
    ...basinNodes,
    ...newNeighbourNodes.filter(
      (node) =>
        !basinNodes.some(
          (basinNode) => basinNode.x === node.x && basinNode.y === node.y
        )
    ),
  ]
}

// Solution
const basins: { x: number; y: number }[][] = []

for (let yPos = 0; yPos < heightMap.length; yPos++) {
  for (let xPos = 0; xPos < heightMap[yPos].length; xPos++) {
    // Ignore Basin-Walls
    if (heightMap[yPos][xPos] >= 9) continue

    // Skip location as it is already inside a basin
    if (
      basins.some((basin) =>
        basin.some((node) => node.x === xPos && node.y === yPos)
      )
    )
      continue

    // New basin
    basins.push(generateNewBasin(xPos, yPos))
  }
}

const basinSizes = basins.map((basin) => basin.length)
const sortedBasinSizes = basinSizes.sort((a, b) => b - a)
const result = sortedBasinSizes[0] * sortedBasinSizes[1] * sortedBasinSizes[2]

console.log('Product of three largest basins:', result)
