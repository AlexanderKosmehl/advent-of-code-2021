import { readFileSync } from 'fs'
import { resolve } from 'path'

class Submarine {
  horizontalPosition = 0
  depth = 0
  aim = 0

  parseCommand(command: string) {
    const [direction, distanceString] = command.split(' ')
    const distance = Number(distanceString)

    return { direction, distance }
  }

  moveSimple(command: string) {
    const { direction, distance } = this.parseCommand(command)

    switch (direction) {
      case 'forward':
        this.horizontalPosition += distance
        break
      case 'down':
        this.depth += distance
        break
      case 'up':
        this.depth -= distance
        break
    }
  }

  moveComplex(command: string) {
    const { direction, distance } = this.parseCommand(command)

    switch (direction) {
      case 'forward':
        this.horizontalPosition += distance
        this.depth += this.aim * distance
        break
      case 'down':
        this.aim += distance
        break
      case 'up':
        this.aim -= distance
        break
    }
  }

  printSolution() {
    console.log('Depth:', this.depth)
    console.log('Horizontal Position', this.horizontalPosition)
    console.log('Result:', this.depth * this.horizontalPosition)
  }
}

const input = readFileSync(resolve(__dirname, 'Input.txt')).toString()
const formattedInput = input.split('\r\n')


// First Task
let submarine = new Submarine()

formattedInput.forEach((line) => {
  submarine.moveSimple(line)
})

submarine.printSolution

// Second Task
submarine = new Submarine()

formattedInput.forEach((line) => {
  submarine.moveComplex(line)
})

submarine.printSolution()
