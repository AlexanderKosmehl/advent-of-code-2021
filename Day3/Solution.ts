import { readFileSync } from 'fs'
import { resolve } from 'path'

/*
  Helper Functions
 */

function getMostCommonBit(listOfArrays: number[][], position: number) {
  let count = 0

  for (const line of listOfArrays) {
    if (line[position] === 1) count++
  }

  return count >= listOfArrays.length / 2 ? 1 : 0
}

/*
  Solution
 */

const input = readFileSync(resolve(__dirname, 'Input.txt')).toString()
const inputLines = input.split('\r\n')
const inputArrays = inputLines.map((line) => line.split(''))
const intArrays = inputArrays.map((line) => line.map((digit) => Number(digit)))

// Part 1
console.log('Part 1')

const gammaRateArray = new Array(intArrays[0].length)

for (let i = 0; i < gammaRateArray.length; i++) {
  gammaRateArray[i] = getMostCommonBit(intArrays, i)
}

const gammaRateString = gammaRateArray.join('')
const gammaRate = parseInt(gammaRateString, 2)

const epsilonRateArray = gammaRateArray.map((digit) => (digit === 1 ? 0 : 1))
const epsilonRateString = epsilonRateArray.join('')
const epsilonRate = parseInt(epsilonRateString, 2)

console.log('Gamma Rating: %s (%d)', gammaRateString, gammaRate)
console.log('Epsilon Rating: %s (%d)', epsilonRateString, epsilonRate)

console.log('Solution:', gammaRate * epsilonRate)

// Part 2
console.log('\nPart 2')

let remainingArrays = intArrays

for (let i = 0; i < intArrays[0].length; i++) {
  const mostCommonBit = getMostCommonBit(remainingArrays, i)

  remainingArrays = remainingArrays.filter(
    (array) => array[i] === mostCommonBit
  )

  if (remainingArrays.length <= 1) break
}

const rawOxygenRating = remainingArrays[0].join('')
const oxygenRating = parseInt(rawOxygenRating, 2)
console.log('Oxygen Rating: %s (%d)', rawOxygenRating, oxygenRating)

remainingArrays = intArrays

for (let i = 0; i < intArrays[0].length; i++) {
  const leastCommonBit = getMostCommonBit(remainingArrays, i) === 1 ? 0 : 1

  remainingArrays = remainingArrays.filter(
    (array) => array[i] === leastCommonBit
  )

  if (remainingArrays.length <= 1) break
}

const rawCO2ScrubbingRating = remainingArrays[0].join('')
const co2ScrubbingRating = parseInt(rawCO2ScrubbingRating, 2)
console.log(
  'CO2 Scrubbing Rating: %s (%d)',
  rawCO2ScrubbingRating,
  co2ScrubbingRating
)

console.log('Solution:', oxygenRating * co2ScrubbingRating)
