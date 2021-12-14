import { readFileSync } from 'fs'
import { resolve } from 'path'

const numberOfSteps = 40

const [polymerTemplate, insertionRuleString] = readFileSync(
  resolve(__dirname, 'Input.txt')
)
  .toString()
  .split('\r\n\r\n')

interface InsertionRule {
  existingPair: string
  insertedPolymer: string
}

const insertionRules = insertionRuleString.split('\r\n').map((line) => {
  const [existingPair, insertedPolymer] = line.split(' -> ')
  return {
    existingPair,
    insertedPolymer,
  }
})

const charCounts: { [key: string]: number } = {}
for (const char of polymerTemplate) {
  charCounts[char] = (charCounts[char] || 0) + 1
}

const polymerDistribution: { [key: string]: number } = {}
for (let i = 0; i < polymerTemplate.length - 1; i++) {
  const pair = polymerTemplate.substring(i, i + 2)

  polymerDistribution[pair] = (polymerDistribution[pair] || 0) + 1
}

function applyInsertionRules(
  polymerDistribution: any,
  insertionRules: InsertionRule[]
): any {
  let newDistribution: { [key: string]: number } = {}

  for (const polymer in polymerDistribution) {
    const applicableRule = insertionRules.find(
      (rule) => rule.existingPair === polymer
    )

    // No such rule exists
    if (!applicableRule) continue

    const newPolymers = [
      polymer[0] + applicableRule.insertedPolymer,
      applicableRule.insertedPolymer + polymer[1],
    ]

    for (const newPolymer of newPolymers) {
      newDistribution[newPolymer] = (newDistribution[newPolymer] || 0) + polymerDistribution[polymer]
    }

    charCounts[applicableRule.insertedPolymer] =
      (charCounts[applicableRule.insertedPolymer] || 0) + polymerDistribution[polymer]
  }

  return newDistribution
}

let currentPolymerDistribution = polymerDistribution

for (let step = 0; step < numberOfSteps; step++) {
  currentPolymerDistribution = applyInsertionRules(
    currentPolymerDistribution,
    insertionRules
  )
}

const counts: number[] = Object.values(charCounts)
counts.sort((a, b) => b - a)

const maxCount = counts[0]
const minCount = counts[counts.length - 1]

console.log('Solution after %d steps: %d', numberOfSteps, maxCount - minCount)
