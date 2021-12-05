import { Direction } from './Direction'

export class VentMap {
  vents: number[][]

  constructor(xSize: number, ySize: number) {
    this.vents = []

    for (let lineIndex = 0; lineIndex <= ySize; lineIndex++) {
      this.vents.push(new Array(xSize + 1).fill(0))
    }
  }

  addVentVector(direction: Direction, ignoreDiagonal: boolean) {
    const [xStart, xEnd] = [direction.from.x, direction.to.x].sort(
      (a, b) => a - b
    )
    const [yStart, yEnd] = [direction.from.y, direction.to.y].sort(
      (a, b) => a - b
    )

    // Diagonal
    if (!ignoreDiagonal && xStart !== xEnd && yStart !== yEnd) {
      const distance = xEnd - xStart
      const isInverted =
        (yStart === direction.from.y && xEnd === direction.from.x) ||
        (yStart === direction.to.y && xEnd === direction.to.x)
          ? true
          : false

      for (let offset = 0; offset <= distance; offset++) {
        if (isInverted) {
          this.vents[yEnd - offset][xStart + offset]++
        } else {
          this.vents[yStart + offset][xStart + offset]++
        }
      }
    }

    // Horizontal
    if (yStart === yEnd) {
      for (let xPos = xStart; xPos <= xEnd; xPos++) {
        this.vents[yStart][xPos]++
      }
      return
    }

    // Vertical
    if (xStart === xEnd) {
      for (let yPos = yStart; yPos <= yEnd; yPos++) {
        this.vents[yPos][xStart]++
      }
      return
    }
  }
}
