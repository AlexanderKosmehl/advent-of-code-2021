import { readFileSync } from 'fs'
import { resolve } from 'path'

/*
  Helper Functions
*/

function getNumberOfIncrements(measurements: number[]): number {
  let increments = 0
  let lastMeasurement: number | undefined = undefined

  for (const measurement of measurements) {
    // LastIncrement still undefined
    if (!lastMeasurement) {
      lastMeasurement = measurement
      continue
    }

    // Depth increased -> increase number of increments
    if (measurement > lastMeasurement) {
      lastMeasurement = measurement
      increments++
      continue
    }

    // Depth didnt increase
    lastMeasurement = measurement
  }

  return increments
}

/*
  Solution
*/

const input = readFileSync(resolve(__dirname, 'Input.txt')).toString()
const formattedInput = input.split('\r\n').map((entry) => Number(entry))

const increments = getNumberOfIncrements(formattedInput)

const windowInput: number[] = []
formattedInput.forEach((value, index, array) => {
  if (index <= array.length - 2)
    windowInput.push(array[index] + array[index + 1] + array[index + 2])
})

const windowIncrements = getNumberOfIncrements(windowInput)

console.log('Number of Increments:', increments)
console.log('Number of Window Increments:', windowIncrements)
