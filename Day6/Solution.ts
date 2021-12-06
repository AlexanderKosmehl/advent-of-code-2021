import { readFileSync } from 'fs'
import { resolve } from 'path'

const numberOfGenerations = 256 // Set number of days to simulate

const input = readFileSync(resolve(__dirname, 'Input.txt')).toString()
const fishPopulation = input.split(',').map((fish) => Number(fish))
const ageGroups = new Array<number>(9)
for (let age = 0; age <= 8; age++) {
  ageGroups[age] = fishPopulation.filter((fishAge) => age === fishAge).length
}

for (let i = 0; i < numberOfGenerations; i++) {
  const numberOfParents = ageGroups.shift() ?? 0
  ageGroups.push(numberOfParents) // Add newborn at the end
  ageGroups[6] += numberOfParents // Add parents back to group 6
}

const fishCount = ageGroups.reduce((prev, curr) => prev + curr, 0)

console.log('Fish Population:', fishCount)
