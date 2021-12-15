import { readFileSync } from 'fs'
import { resolve } from 'path'

const rawNodes = readFileSync(resolve(__dirname, 'Input.txt'))
  .toString()
  .split('\r\n')
  .map((line) => line.split('').map((node) => Number(node)))

// Helper

function getNeighbourCoordinates(
  currentX: number,
  currentY: number,
  maxX: number,
  maxY: number
): { x: number; y: number }[] {
  const offsets = [
    [0, -1],
    [-1, 0],
    [1, 0],
    [0, 1],
  ]
  const neighbourCoordinates: { x: number; y: number }[] = []

  for (const offset of offsets) {
    const [xOffset, yOffset] = offset
    const xWithOffset = currentX + xOffset
    const yWithOffset = currentY + yOffset

    if (
      xWithOffset >= 0 &&
      xWithOffset < maxX &&
      yWithOffset >= 0 &&
      yWithOffset < maxY
    ) {
      neighbourCoordinates.push({
        x: xWithOffset,
        y: yWithOffset,
      })
    }
  }

  return neighbourCoordinates
}

function getLeastRiskyPath(graph: number[][]): number {
  const size = graph.length * graph[0].length
  const riskMap: number[][] = JSON.parse(JSON.stringify(graph))
  const totalRiskMap: number[][] = riskMap.map((line) =>
    line.map((risk) => Infinity)
  )
  const nodes: { x: number; y: number }[] = []
  riskMap.forEach((line, lineIndex) =>
    line.forEach((risk, riskIndex) => {
      nodes.push({
        x: riskIndex,
        y: lineIndex,
      })
    })
  )

  const endY = riskMap.length - 1
  const endX = riskMap[endY].length - 1

  totalRiskMap[0][0] = 0

  while (totalRiskMap[endX][endY] === Infinity) {
    nodes.sort((a, b) => totalRiskMap[a.y][a.x] - totalRiskMap[b.y][b.x])

    // Get first element and remove it from list of remaining nodes
    const currentNode = nodes.shift()
    console.log('%d / 100', (size - nodes.length) / size)

    // No more nodes remaining
    if (!currentNode) break

    const currentTotalRisk = totalRiskMap[currentNode.y][currentNode.x]

    for (const neighbourCoordinate of getNeighbourCoordinates(
      currentNode.x,
      currentNode.y,
      riskMap[0].length,
      riskMap.length
    )) {
      const neighbourRisk =
        riskMap[neighbourCoordinate.y][neighbourCoordinate.x]
      const neighbourTotalRisk =
        totalRiskMap[neighbourCoordinate.y][neighbourCoordinate.x]

      // Try to improve neighbours
      if (currentTotalRisk + neighbourRisk < neighbourTotalRisk) {
        totalRiskMap[neighbourCoordinate.y][neighbourCoordinate.x] =
          currentTotalRisk + neighbourRisk
      }
    }
  }

  return totalRiskMap[endY][endX]
}

// Part 1
const leastRiskyPath = getLeastRiskyPath(rawNodes)
console.log('Least Risky Path:', leastRiskyPath)

// Part 2
const fullRawNodes: number[][] = []

// Initialize rawNodes
for (let i = 0; i < rawNodes.length * 5; i++) {
  fullRawNodes.push([])
}

for (let y = 0; y < 5; y++) {
  for (let x = 0; x < 5; x++) {
    const distanceFromOriginal = x + y
    const deepCopy: number[][] = JSON.parse(JSON.stringify(rawNodes))

    // Increase riskLevel by distance from original map
    const increasedRiskLevels = deepCopy.map((line) =>
      line.map((rawNode) => {
        const increasedRiskLevel = rawNode + distanceFromOriginal
        return increasedRiskLevel > 9
          ? increasedRiskLevel - 9
          : increasedRiskLevel
      })
    )

    // Append risklevels to full list according to position
    increasedRiskLevels.forEach((line, lineIndex) => {
      const offsetPosition = y * deepCopy.length + lineIndex
      fullRawNodes[offsetPosition].push(...line)
    })
  }
}

const leastRiskyPathFull = getLeastRiskyPath(fullRawNodes)
console.log('Least Risky Path (Full):', leastRiskyPathFull)
