/**
 * This Class is Designed to Solve Sudoku Puzzles
 * Using Backtrack Technic
 */
class Backtrack {
  // Sudoku Class
  sudoku
  // Sudoku Grid
  grid
  // Backtracks Counter
  backtracks = 0

  /**
   * Get The Sudoku Info On Instantiate
   * 
   * @param {class} sudoku 
   */
  constructor(sudoku) {
    // Get Sudoku Class
    this.sudoku = sudoku
    // Get Sudoku Grid
    this.grid = sudoku.grid
  }

  /**
   * Refill The Grid With Sure Values Before Running a Backtrack
   * 
   * @param {number} x 
   * @param {number} y 
   * @param {number} n 
   */
  get_possibilities(x, y, n) {
    // Init The Output Array
    let output = []

    // Set The y-n Cell To The Passed Value
    this.grid[y][x] = n
    // Make First Implication
    output.push({
      x: x,
      y: y,
      n: n
    })

    // Loop Throght Sections
    for (let s = 0; s < 9; s++) {
      // Get Current Section
      let section = sudoku.get_section(sudoku.grid, s)
      // Init Possibilities Array
      let possibilities = []
      // Init Section Possible Values Array
      let values = [1, 2, 3, 4, 5, 6, 7, 8, 9]

      // Loop Trough Non Empty Cells in The Section
      for (let i = 0; i < section.length; i++) {
        // Remove From Values Array All Existing Values in The Section
        if (section[i].value != 0) {
          if (values.indexOf(section[i].value) != -1) {
            values = values.filter(el => el != section[i].value)
          }
        }
      }

      // Loop Trough Empty Cells in The Section
      for (let i = 0; i < section.length; i++) {
        if (section[i].value == 0) {
          possibilities.push({
            x: section[i].x,
            y: section[i].y,
            n: values
          })
        }
      }

      // Loop Through Possibilities Array
      for (let i = 0; i < possibilities.length; i++) {
        // Get Current Possibity Data
        let x = possibilities[i].x
        let y = possibilities[i].y
        let values = possibilities[i].n

        // Clean The Possibilities Array From Non Possible Values
        possibilities[i].n = values.filter(value => {
          return sudoku.is_possible(x, y, value)
        })

        // If There is a Sure Possibility in a Cell
        if (possibilities[i].n.length == 1) {
          // Set The y-n Cell To The Sure Value
          this.grid[y][x] = possibilities[i].n[0]
          output.push({
            x: x,
            y: y,
            n: possibilities[i].n[0]
          })
        }
      }
    }

    // Return Made Implications
    return output
  }

  /**
   * Undo Possibilties if They Didn't Work
   * 
   * @param {array} possibilities 
   */
  undo_possibilities(possibilities) {
    // Loop Through All Done Implications
    for (let i = 0; i < possibilities.length; i++) {
      // Get The Cell Position
      let x = possibilities[i].x
      let y = possibilities[i].y
      // Empty The Cell
      this.grid[y][x] = 0
    }
  }

  /**
   * Solve Sudoku With Simple Backtrack
   */
  solve() {
    // Limit Backtracks
    if (this.backtracks > 99999) {
      // Output The Error Message
      sudoku.message = {
        content: `Ooops! Solving this puzzle with backtracking takes long time. Please try other algorithms`,
        type: 'danger'
      }
      this.sudoku.solution = JSON.parse(JSON.stringify(this.grid))
      // Stop The Function
      return
    }

    // Loop Throgh Rows
    for (let i = 0; i < 9; i++) {
      // Loop Through Columns
      for (let j = 0; j < 9; j++) {
        // If The Current Cell is Empty
        if (this.grid[i][j] == 0) {
          // Loop Through Values - From 1 to 9
          for (let n = 9; n >= 1; n--) {
            // If The Current Value is Possible in The Current Cell
            if (sudoku.is_possible(j, i, n)) {
              // Set The Current Cell To The Current Possible Value
              this.grid[i][j] = n
              // Recursion
              this.solve()
              // Count One Backtrack
              this.backtracks = this.backtracks + 1;
              // Empty The Current Cell Again If There is Solution
              this.grid[i][j] = 0
            }
          }
          // Stop The Function
          return
        }
      }
    }

    // Output The Success Message
    sudoku.message = {
      content: `Solved successfully with ${this.backtracks} backtrack`,
      type: 'success'
    }
    // Output The Found Solution
    this.sudoku.solution = JSON.parse(JSON.stringify(this.grid))
  }

  /**
   * Solve Sudoku With Optimized Backtracking
   * Using Possibilities
   */
  solve_opt() {
    // Limit Backtracks
    if (this.backtracks > 9999) {
      // Output Error Message
      sudoku.message = {
        content: `Ooops! Solving this puzzle with backtracking takes long time. Please try other algorithms`,
        type: 'danger'
      }
      this.sudoku.solution = JSON.parse(JSON.stringify(this.grid))
      // Stop The Function
      return
    }

    // Loop Through Rows
    for (let i = 0; i < 9; i++) {
      // Loop Through Columns
      for (let j = 0; j < 9; j++) {
        // If The Current Cell is Empty
        if (this.grid[i][j] == 0) {
          // Loop Through Values - Frpm 1 To 9
          for (let n = 9; n >= 1; n--) {
            // If The Current Value is Possible in The Current Cell
            if (sudoku.is_possible(j, i, n)) {
              // Make Implications
              let possibilities = this.get_possibilities(j, i, n)
              // Recursion
              this.solve_opt()
              // Count One Backtrack
              this.backtracks = this.backtracks + 1
              // Undo Made Implications If There is No Solution
              this.undo_possibilities(possibilities)
            }
          }
          // Stop The Function
          return
        }
      }
    }

    // Output The Success Message
    sudoku.message = {
      content: `Solved successfully with ${this.backtracks} backtrack`,
      type: 'success'
    }
    // Output The Found Solution
    this.sudoku.solution = JSON.parse(JSON.stringify(this.grid))
  }
}