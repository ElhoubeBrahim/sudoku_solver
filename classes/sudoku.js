/**
 * This Class is Designed To Manage Relations Between
 * Other Solver Classes and The GUI Class
 */
class Sudoku {
  // Sudoku Grid
  grid = []
  // Is Sudoku Valid
  is_valid = false
  // Sudoku Solution
  solution = []
  // Output Message
  message = {
    content: '',
    type: 'success'
  }
  // GUI Class Instance
  UI
  // Available Algorithms
  algorithms = ['backtrack', 'backtrack_optimized', 'genetic', 'dlx']

  /**
   * Get Sudoku Info After Instantiation
   * 
   * @param {class} UI 
   */
  constructor(UI) {
    // Get The Sudoku Grid
    this.grid = UI.grid
    // Get The GUI Class
    this.UI = UI
  }

  /**
   * Check if a Sudoku Board is Valid
   */
  validate() {
    // Init Seen Array
    let seen = []

    // Loop Through All Cells in The Grid
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        // Get The Current Grid Value
        let n = this.grid[i][j]
        // Check if There is a Number
        if (n != 0) {
          // Create 3 Sentances
          let row = `${n} seen in row ${i}`
          let col = `${n} seen in column ${j}`
          let sec = `${n} seen in section ${Math.floor(i / 3)}-${Math.floor(j / 3)}`

          // If Those Sentences Were in The Seen Array
          if (
            seen.includes(row) ||
            seen.includes(col) ||
            seen.includes(sec)
          ) {
            // Show Error
            UI.show_error(i, j)
          }

          // Add These Three Sentences in The Seen Array
          seen.push(row)
          seen.push(col)
          seen.push(sec)
        }
      }
    }

    // Check if a Number is Seen More Than one Time
    if (seen.filter((el, i) => seen.indexOf(el) != i).length > 0) {
      this.is_valid = false
      return
    }

    // If The Grid is Valid
    this.is_valid = true
    return
  }

  /**
   * Get The Input Sudoku From User
   * 
   * @param {event} e 
   */
  input(e) {
    // Prevent Default Behaviour Of Some Keys
    e.preventDefault()
    // Get The Selected Cell
    let cell = this.UI.selected
    // If There is No Selected Cell, Stop This Function
    if (!cell) return
    // Get The Selected Cell Position
    let i = parseInt(cell.parentElement.dataset.row)
    let j = parseInt(cell.dataset.col)

    // Get The Entered Value
    let key = e.key
    if (key == "Unidentified") {
      key = parseInt(document.getElementById('keyboard').value)
    }
    document.getElementById('keyboard').value = 0

    // If The Entered Value Was Number Between 1 and 9
    if (key >= 1 && key <= 9) {
      // Fill The Selected Cell With The Entered Value
      cell.innerHTML = key
      // Change The Main Sudoku Grid
      this.grid[i][j] = key
    }

    // If The Pressed Key Was Delete Keys
    if (key == 'Backspace' || key == 'Delete') {
      // Empty The Selected Cell
      cell.innerHTML = ''
      // Change The Main Sudoku Grid
      this.grid[i][j] = 0
    }
  }

  /**
   * Check If a Value is Valid in a Cell
   * With (x, y) Coordinates
   * 
   * @param {number} x 
   * @param {number} y 
   * @param {number} n 
   */
  is_possible(x, y, n) {
    // Check if Cell is Not Empty
    if (this.grid[y][x] != 0) return false

    // Check Row & Column
    for (let i = 0; i < 9; i++) {
      if (this.grid[i][x] == n) return false
      if (this.grid[y][i] == n) return false
    }

    // Get The Section Coordonates
    let start_x = Math.floor(x / 3) * 3
    let start_y = Math.floor(y / 3) * 3

    // Check The Section
    for (let i = start_y; i <= start_y + 2; i++) {
      for (let j = start_x; j <= start_x + 2; j++) {
        if (this.grid[i][j] == n) return false
      }
    }

    // Return True If There is No Error
    return true
  }

  /**
   * Get The Section Values
   * 
   * @param {array} grid
   * @param {number} nth
   */
  get_section(grid, nth) {
    // Init Section Array
    let section = []
    // Init Section Borders Indexes
    let start_x = (nth % 3) * 3
    let start_y = Math.floor(nth / 3) * 3

    // Loop Through Section
    for (let i = start_y; i < start_y + 3; i++) {
      for (let j = start_x; j < start_x + 3; j++) {
        // Add Values To The Section Array
        section.push({
          x: j,
          y: i,
          value: grid[i][j]
        })
      }
    }

    // Return Section Values
    return section
  }

  /**
   * This Function is Called When The Generate Button Has Been Clicked
   * It Generates a Grid Randomly, Using The DLX Solver
   * 
   * @param {class} dlx 
   */
  generate(dlx) {
    // Empty The Grid
    this.UI.clear_grid()

    // Make a Grid of 20 Clues
    for (let _ = 0; _ < 20; _++) {
      // Random Colomn
      let x = Math.floor(Math.random() * 9)
      // Random Row
      let y = Math.floor(Math.random() * 9)
      // Random Value
      let n = Math.floor(Math.random() * 9) + 1

      // Check if The Value is Possible
      while (!this.is_possible(x, y, n)) {
        // Regenrate Until is_possible == true
        x = Math.floor(Math.random() * 9)
        y = Math.floor(Math.random() * 9)
        n = Math.floor(Math.random() * 9) + 1
      }

      // Fill The Random Cell With Random Value
      this.grid[y][x] = n
    }

    // Solve The Grid With DLX
    dlx.solve()

    // If There is Solution
    if (this.solution.length == 9) {

      // Empty Cells
      for (let _ = 0; _ < 80; _++) {
        // Get Random Column
        let x = Math.floor(Math.random() * 9)
        // Get Random Row
        let y = Math.floor(Math.random() * 9)

        // Empty The Random Cell
        this.solution[y][x] = 0
      }

      // Fill The HTML Grid
      this.UI.fill_grid(this.solution)
      // Empty Solution Array
      this.solution = []

      // Stop Function
      return
    }

    // If The Generated Grid is Not Solvable, Repeat Again
    this.generate(dlx)
  }

  /**
   * Solve Sudoku Puzzle
   * 
   * @param {class} backtrack 
   * @param {class} genetic 
   * @param {class} dlx 
   */
  solve(backtrack, genetic, dlx) {
    // Close The Prompt
    this.UI.close_prompt()
    // Remove The Solved Class From Columns
    document.querySelectorAll('.grid .row .column').forEach(el => {
      el.className = 'column'
    })
    // Check The Validity Of The Grid
    this.validate()
    if (this.is_valid) {
      // Solve The Sudoku After 10ms
      setTimeout(() => {
        // Get The Choosen Algorithm
        let algorithm = (document.querySelector('input[name=algorithm]:checked') || '').value
        if (!this.algorithms.includes(algorithm)) algorithm = 'backtrack'

        // Solve The Sudoku According to The Choosen Algorithm
        switch (algorithm) {
          case 'backtrack':
            backtrack.solve()
            backtrack.backtracks = 0
            break;

          case 'backtrack_optimized':
            backtrack.solve_opt()
            backtrack.backtracks = 0
            break;

          case 'genetic':
            genetic.run_evolution()
            genetic.generations = 0
            break;

          case 'dlx':
            dlx.solve()
            break;

          default:
            break;
        }

        // Output The Solution on The Screen
        if (this.solution.length == 9) {
          UI.solve_grid(this.solution)
          UI.show_message(this.message.content, this.message.type)
        } else {
          UI.show_message("Ooops! This sudoku puzzle has no solution. Please try other puzzle", 'danger')
        }
      }, 10);
    }
  }
}