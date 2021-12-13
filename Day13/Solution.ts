import { readFileSync } from 'fs'
import { resolve } from 'path'

const [dotStrings, instructionStrings] = readFileSync(
  resolve(__dirname, 'Input.txt')
)
  .toString()
  .split('\r\n\r\n')

const dots = dotStrings.split('\r\n').map((dotString) => {
  const [x, y] = dotString.split(',')
  return {
    x: Number(x),
    y: Number(y),
  }
})

const instructions = instructionStrings.split('\r\n').map((instruction) => {
  const foldingData = instruction.substring(11)
  const [axis, location] = foldingData.split('=')
  return {
    axis,
    location: Number(location),
  }
})

const xMax = Math.max(...dots.map((dotObject) => dotObject.x))
const yMax = Math.max(...dots.map((dotObject) => dotObject.y))

const paper: string[][] = []
for (let i = 0; i <= yMax; i++) {
  paper.push(new Array(xMax + 1).fill('.'))
}

dots.forEach((dot) => {
  paper[dot.y][dot.x] = '#'
})

// Folding
function foldPaper(
  paper: string[][],
  axis: string,
  location: number
): string[][] {
  const foldedPaper: string[][] = []
  const newMaxX = axis === 'x' ? location : paper[0].length
  const newMaxY = axis === 'y' ? location : paper.length

  // Initialize new Paper
  for (let i = 0; i < newMaxY; i++) {
    foldedPaper.push(new Array(newMaxX).fill('.'))
  }

  if (axis === 'x') {
    for (let yPos = 0; yPos < foldedPaper.length; yPos++) {
      for (let xPos = 0; xPos < foldedPaper[yPos].length; xPos++) {
        // Old Position
        if (paper[yPos][xPos] === '#') {
          foldedPaper[yPos][xPos] = '#'
        }
        // Folded Position
        const foldedX = location + (location - xPos)
        if (foldedX < paper[0].length) {
          if (paper[yPos][foldedX] === '#') {
            foldedPaper[yPos][xPos] = '#'
          }
        }
      }
    }
  } else {
    for (let yPos = 0; yPos < foldedPaper.length; yPos++) {
      for (let xPos = 0; xPos < foldedPaper[yPos].length; xPos++) {
        // Old Position
        if (paper[yPos][xPos] === '#') {
          foldedPaper[yPos][xPos] = '#'
        }
        // Folded Position
        const foldedY = location + (location - yPos)
        if (foldedY < paper.length) {
          if (paper[foldedY][xPos] === '#') {
            foldedPaper[yPos][xPos] = '#'
          }
        }
      }
    }
  }

  return foldedPaper
}

// Part 1
let foldedPaper = paper

foldedPaper = foldPaper(
  foldedPaper,
  instructions[0].axis,
  instructions[0].location
)

let dotCount = 0
for (let y = 0; y < foldedPaper.length; y++) {
  for (let x = 0; x < foldedPaper[0].length; x++) {
    if (foldedPaper[y][x] === '#') dotCount++
  }
}

console.log('%d dots remain after 1 fold', dotCount)

// Part 2
foldedPaper = paper

for (const instruction of instructions) {
  foldedPaper = foldPaper(foldedPaper, instruction.axis, instruction.location)
}

const output = foldedPaper.map(line => line.join('').replace(/\./g, ' '))
console.log('The activation code is: \n')
output.forEach(line => console.log(line))