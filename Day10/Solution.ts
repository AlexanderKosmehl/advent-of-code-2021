import { readFileSync } from 'fs'
import { resolve } from 'path'

const instructions = readFileSync(resolve(__dirname, 'Input.txt'))
  .toString()
  .split('\r\n')

// Part 1

// Helper

function compareBrackets(opening: string, closing: string): boolean {
  const openings = ['(', '{', '[', '<']
  const closings = [')', '}', ']', '>']

  const openingIndex = openings.indexOf(opening)

  return closings[openingIndex] === closing
}

function getInvalidClosingCharacter(line: string): string | undefined {
  const characters = line.split('')
  let hasChanged = false

  do {
    hasChanged = false
    for (let i = characters.length - 2; i >= 0; i--) {
      if (compareBrackets(characters[i], characters[i + 1])) {
        characters.splice(i, 2)
        hasChanged = true
        break
      }
    }
  } while (hasChanged)

  // Only opening brackets
  for (let currentBracket of characters) {
    if (
      [')', ']', '}', '>'].some(
        (closingBracket) => closingBracket === currentBracket
      )
    ) {
      return currentBracket
    }
  }
  return undefined
}

function getScore(illegalCharacter: string): number {
  if (illegalCharacter === ')') return 3
  else if (illegalCharacter === ']') return 57
  else if (illegalCharacter === '}') return 1197
  else if (illegalCharacter === '>') return 25137
  else return 0
}

let errorScore = 0

for (let line of instructions) {
  const invalidChar = getInvalidClosingCharacter(line)
  if (invalidChar) errorScore += getScore(invalidChar)
}

console.log('Final Score:', errorScore)

// Part 2

function getIncompleteLine(line: string): string | undefined {
  const characters = line.split('')
  let hasChanged = false

  do {
    hasChanged = false
    for (let i = characters.length - 2; i >= 0; i--) {
      if (compareBrackets(characters[i], characters[i + 1])) {
        characters.splice(i, 2)
        hasChanged = true
        break
      }
    }
  } while (hasChanged)

  // Only opening brackets
  for (let currentBracket of characters) {
    if (
      [')', ']', '}', '>'].some(
        (closingBracket) => closingBracket === currentBracket
      )
    ) {
      return undefined
    }
  }
  return characters.join('')
}

function getCompletionScore(incompleteLine: string): number {
  const brackets = ['(', '[', '{', '<']
  let score = 0

  incompleteLine = incompleteLine.split('').reverse().join('')

  for (const char of incompleteLine) {
    score *= 5
    score += brackets.indexOf(char) + 1
  }

  return score
}

let completionScores = []

for (let line of instructions) {
  const incompleteLine = getIncompleteLine(line)
  if (incompleteLine) completionScores.push(getCompletionScore(incompleteLine))
}

completionScores = completionScores.sort((a, b) => a - b)

console.log(
  'Completion Score:',
  completionScores[Math.floor(completionScores.length / 2)]
)
