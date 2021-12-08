import { readFileSync } from 'fs'
import { resolve } from 'path'

const inputLines = readFileSync(resolve(__dirname, 'Input.txt'))
  .toString()
  .split('\r\n')

const segmentDataArray = inputLines.map((line) => {
  const [signalPatternString, outputValueString] = line.split(' | ')
  const signalPatterns = signalPatternString.split(' ')
  const outputValues = outputValueString.split(' ')
  return {
    signalPatterns: signalPatterns,
    outputValues: outputValues,
  }
})

// Part 1
let count = 0
for (const segmentData of segmentDataArray) {
  const outputLengths = segmentData.outputValues.map((output) => output.length)
  count += outputLengths.filter(
    (outputLength) =>
      outputLength === 2 ||
      outputLength === 4 ||
      outputLength === 3 ||
      outputLength === 7
  ).length
}

console.log('The digits 1, 4, 7 or 8 appear %d times!', count)

// Part 2

// Returns string containing all letters unique to A (removes B from A)
function stringDifference(a: string, b: string): string {
  return a
    .split('') // Get Chars
    .filter((char) => !b.includes(char)) // Remove all that are included in b
    .join('') // Return string
}

// Returns all letters of both strings (Adds A and B together)
function stringSum(a: string, b: string): string {
  return ['a', 'b', 'c', 'd', 'e', 'f', 'g']
    .filter((char) => a.includes(char) || b.includes(char))
    .join('')
}

function decodeOutputValue(
  outputValues: string[],
  numberStrings: string[]
): number {
  return Number(
    outputValues
      .map((outputValue) => numberStrings.indexOf(outputValue))
      .join('')
  )
}

function decodeSegmentData(
  signalPatterns: string[],
  outputValues: string[]
): number {
  // Sort all strings to remove radomness from ordering
  signalPatterns = signalPatterns.map((signalString) =>
    signalString.split('').sort().join('')
  )
  outputValues = outputValues.map((outputString) =>
    outputString.split('').sort().join('')
  )

  // Initialize Numberstrings
  const numberStrings = new Array(7).fill('')

  // Add all trivial strings
  numberStrings[1] = signalPatterns.filter((pattern) => pattern.length === 2)[0]
  numberStrings[4] = signalPatterns.filter((pattern) => pattern.length === 4)[0]
  numberStrings[7] = signalPatterns.filter((pattern) => pattern.length === 3)[0]
  numberStrings[8] = signalPatterns.filter((pattern) => pattern.length === 7)[0]

  // Logical Patterns
  numberStrings[9] = signalPatterns.filter(
    (pattern) =>
      pattern.length === 6 &&
      stringDifference(
        stringDifference(
          numberStrings[8],
          stringSum(numberStrings[4], numberStrings[7])
        ),
        pattern
      ).length === 1
  )[0]

  numberStrings[2] = signalPatterns.filter(
    (pattern) =>
      pattern.length === 5 &&
      stringDifference(pattern, numberStrings[9]).length === 1
  )[0]

  numberStrings[5] = signalPatterns.filter(
    (pattern) =>
      pattern.length === 5 &&
      stringDifference(pattern, numberStrings[2]).length === 2
  )[0]

  numberStrings[3] = signalPatterns.filter(
    (pattern) =>
      pattern.length === 5 &&
      stringDifference(pattern, numberStrings[2]).length === 1
  )[0]

  numberStrings[6] = signalPatterns.filter(
    (pattern) =>
      pattern.length === 6 &&
      numberStrings[1].includes(stringDifference(numberStrings[8], pattern)[0])
  )[0]

  numberStrings[0] = signalPatterns.filter(
    (pattern) =>
      pattern.length === 6 &&
      !numberStrings[1].includes(stringDifference(numberStrings[8], pattern)[0]) &&
      pattern !== numberStrings[9]
  )[0]

  return decodeOutputValue(outputValues, numberStrings)
}

const outputSum = segmentDataArray
  .map((segmentData) =>
    decodeSegmentData(segmentData.signalPatterns, segmentData.outputValues)
  )
  .reduce((prev, curr) => prev + curr)

console.log('Sum of all output Values:', outputSum)
