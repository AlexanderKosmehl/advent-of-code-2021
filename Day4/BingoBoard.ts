interface Entry {
  number: number
  isMarked: boolean
}

export class BingoBoard {
  entries: Entry[][]

  constructor(entryList: number[]) {
    // Generate new array
    this.entries = []

    // Prepopulate with empty arrays
    for (let i = 0; i < 5; i++) this.entries.push([])

    // Insert the entries
    entryList.forEach((entry, index) => {
      const line = Math.floor(index / 5)

      this.entries[line].push({
        number: entry,
        isMarked: false,
      })
    })
  }

  call(number: number): void {
    for (let line of this.entries) {
      for (let entry of line) {
        if (entry.number === number) entry.isMarked = true
      }
    }
  }

  checkForWin(): boolean {
    // Line Victory
    if (
      this.entries.some((entryArray) =>
        entryArray.every((entry) => entry.isMarked)
      )
    )
      return true

    // Column Victory
    for (let colIndex = 0; colIndex < 5; colIndex++) {
      if (
        this.entries[0][colIndex].isMarked &&
        this.entries[1][colIndex].isMarked &&
        this.entries[2][colIndex].isMarked &&
        this.entries[3][colIndex].isMarked &&
        this.entries[4][colIndex].isMarked
      )
        return true
    }

    // No Victory
    return false
  }

  getSumOfUnmarkedNumbers(): number {
    let sum = 0

    for (const line of this.entries) {
      for (const entry of line) {
        if (!entry.isMarked) sum += entry.number
      }
    }

    return sum
  }
}
