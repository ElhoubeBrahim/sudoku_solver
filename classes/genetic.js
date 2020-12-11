/**
 * This Class is Designed to Solve Sudoku Puzzles
 * Using Genetic Algrithm
 */
class Genetic {
  // Sudoku Class
  sudoku
  // Sudoku Grid
  grid
  // Count Generations
  generations = 0
  // Generations Limit
  generations_limit = 100
  // Store Population of The Current Generation
  population = []

  /**
   * Get Sudoku Info After Instantiation
   * 
   * @param {class} sudoku 
   */
  constructor(sudoku) {
    // Get Sudoku Class
    this.sudoku = sudoku
    // Get Sudoku Grid
    this.grid = sudoku.grid
    // Generate Initial Population With 10 Individus
    this.population = this.generate_population(10)
  }

  /**
   * Generate Populations Randomly
   * 
   * @param {number} individus 
   */
  generate_population(individus) {
    // Init Arrays
    let board = []
    let population = []

    // Generate Individus
    for (let _ = 0; _ < individus; _++) {
      // Init Board Array
      board = JSON.parse(JSON.stringify(this.grid))

      // Loop Throgh Rows
      for (let i = 0; i < 9; i++) {
        // Loop Through Columns
        for (let j = 0; j < 9; j++) {
          // If The Current Cell is Empty
          if (board[i][j] == 0) {
            // Fill it With Random Value
            board[i][j] = Math.floor(Math.random() * 9) + 1
          }
        }
      }

      // Add The Individu To The Population
      population.push(board)
    }

    // Return The Generated Population
    return population
  }

  /**
   * Fitness Function: Count The Number Of Errors in The Grid
   * 
   * @param {array} board 
   */
  count_errors(board) {
    // Init Errors
    let errors = 0
    let seen = []

    // Loop Through All Cells in The Grid
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        // Get The Current Grid Value
        let n = board[i][j]
        // Check if There is a Number
        if (n != 0) {
          // Add These Three Sentences in The Seen Array
          seen.push(`${n} seen in row ${i}`)
          seen.push(`${n} seen in column ${j}`)
          seen.push(`${n} seen in section ${Math.floor(i / 3)}-${Math.floor(j / 3)}`)
        }
      }
    }

    // Calculate Errors
    // Error => Number of Duplications
    errors = seen.filter((el, i) => seen.indexOf(el) != i).length
    return errors
  }

  /**
   * Selection Function: Select Two Individus Randomly
   * From The Population
   * 
   * @param {array} population 
   */
  select_parents(population) {
    // Select Random Indexes
    let i = Math.floor(Math.random() * population.length)
    let j = Math.floor(Math.random() * population.length)

    // Return Parents According to The Selected Indexes
    return [population[i], population[j]]
  }

  /**
   * Crossover Two Boards on a Random Point
   * 
   * @param {array} board_1 
   * @param {array} board_2 
   */
  crossover(board_1, board_2) {
    // Init Children Array
    let children = []
    // Get Random Position
    let position = Math.floor(Math.random() * 8) + 1

    // Init Children
    let child_1 = JSON.parse(JSON.stringify(board_1))
    let child_2 = JSON.parse(JSON.stringify(board_2))

    // CrossOver The Children At The Selected Position
    child_1 = board_1.slice(0, position).concat(board_2.slice(position, 9))
    child_2 = board_2.slice(0, position).concat(board_1.slice(position, 9))

    // Get The Elite From Children & Parents
    children = [board_1, board_2, child_1, child_2].sort((a, b) => this.count_errors(a) >= this.count_errors(b))

    // Get The Elite
    return children.slice(0, 2)
  }

  /**
   * Mutate a Board on a Random Cells
   * 
   * @param {array} board 
   */
  mutation(board) {
    // Copy Board Array Values to Muted Array
    let muted = JSON.parse(JSON.stringify(board))

    // Make 10 Random Mutations
    for (let i = 0; i < 10; i++) {
      // If The Random Number Was Great Than .5
      if (Math.random() > 0.5) {
        // Select Two Random Indexes
        let x = Math.floor(Math.random() * 9)
        let y = Math.floor(Math.random() * 9)

        // Do Mutation
        if (this.grid[y][x] == 0) {
          muted[y][x] = Math.floor(Math.random() * 9) + 1
        }
      }
    }

    // If The Mutation Was Not Optimized
    if (this.count_errors(muted) > this.count_errors(board)) {
      // Return The Original Board
      return board
    }

    // Else Return Muted Board
    return muted
  }

  /**
   * Run Evolution Function: Create and Optimize Generations
   */
  run_evolution() {
    // Get Population
    let population = this.population
    // Init The Elite Array
    let elite = []

    // Loop Through Generations
    for (let _ = 0; _ < this.generations_limit; _++) {
      // Init Next Generation Array
      let next_generation = []
      // Sort Current Generation
      population.sort((a, b) => this.count_errors(a) >= this.count_errors(b))
      // Get The Elite Indivitus
      elite = population.slice(0, Math.floor(population.length / 2))

      // If There is a Board With No Errors in The Elite
      if (this.count_errors(elite[0]) == 0) {
        // Get The Final Solution
        sudoku.message = {
          content: `Solved successfully with ${this.generations} generation`,
          type: 'success'
        }
        sudoku.solution = elite[0]
        // Stop The Function
        return
      }

      // Pass The First Two Individus in The Elite To The Next Generation
      next_generation[0] = population[0]
      next_generation[1] = population[1]

      // Loop Through Elite
      for (let j = 0; j < elite.length - 1; j++) {
        // Select Random Parents
        let parents = [...this.select_parents(elite)]

        // Generate Two Children From Selected Parents
        let children = this.crossover(parents[0], parents[1])

        // Apply Optimized Mutations to The Children
        children[0] = this.mutation(children[0])
        children[1] = this.mutation(children[1])

        // Add Children To The Next Generation
        next_generation.push(children[0], children[1])
      }

      // Change Current Generation to The Next Generation
      population = next_generation
      // Count Generations
      this.generations++
    }

    // Sort Final Generation
    population.sort((a, b) => this.count_errors(a) >= this.count_errors(b))

    // Get The Final Solution
    sudoku.message = {
      content: `Ooops! We have reached the maximum number of generations without finding any solution. Please try other algorithms`,
      type: 'danger'
    }
    sudoku.solution = this.population[0]
  }
}
