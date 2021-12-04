import { readFileSync } from 'fs'
import { resolve } from 'path'
import { BingoBoard } from './BingoBoard'

/*
  Solution
 */

const input = readFileSync(resolve(__dirname, 'Input.txt')).toString()
const [generatedNumbersString, ...bingoBoardStrings] = input.split('\r\n\r\n')

const generatedNumbers = generatedNumbersString
  .split(',')
  .map((numberString) => Number(numberString))

const bingoBoardEntryArrays = bingoBoardStrings.map((board) => {
  return board
    .replace(/\r\n/g, ' ') // Block line breaks
    .trim() // Removes leading whitespace
    .split(/\s+/g) // Splits on whitespace
    .map((entry) => Number(entry)) // Convert entries to numbers
})

const bingoBoards = bingoBoardEntryArrays.map(
  (entryArray) => new BingoBoard(entryArray)
)


// Part 1
let hasVictor = false

for (const number of generatedNumbers) {
  for (const bingoBoard of bingoBoards) {
    bingoBoard.call(number)

    if (bingoBoard.checkForWin()) {
      const unmarkedSum = bingoBoard.getSumOfUnmarkedNumbers()

      hasVictor = true

      console.log('Part 1 Solution:', number * unmarkedSum)
    }

    if (hasVictor) break
  }

  if (hasVictor) break
}

let currentWorstScore: number | undefined = undefined
let currentWorstIndex = 0

// Part 2
for (const board of bingoBoards) {
  let boardHasWon = false

  for (const number of generatedNumbers) {
    board.call(number)
    
    if (!board.checkForWin()) continue
    else boardHasWon = true

    // New worst currentNumber
    const indexOfNumber = generatedNumbers.indexOf(number)
    if (indexOfNumber > currentWorstIndex) {
      currentWorstScore = number * board.getSumOfUnmarkedNumbers()
      currentWorstIndex = indexOfNumber
    }

    if (boardHasWon) break
  }
}

console.log('Part 2 Solution: %d (Index: %d)', currentWorstScore, currentWorstIndex)