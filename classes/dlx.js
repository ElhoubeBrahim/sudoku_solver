/**
 * This Class is Designed to Solve Sudoku Puzzles
 * Using Dancing Links Algorithm
 */
class DLX {
  // Sudoku Class
  sudoku
  // Sudoku Grid
  grid
  // Doubly Circular Linked List Columns
  columns = []
  // Sudoku Cover Matrix
  matrix = []

  /**
   * Get The Sudoku Info After Instantiation
   * 
   * @param {class} sudoku
   */
  constructor(sudoku) {
    // Get Sudoku Class
    this.sudoku = sudoku
    // Get Sudoku Grid
    this.grid = sudoku.grid
  }

  create_cover_matrix() {
    // Init Cover Matrix
    let cover_matrix = []
    // Init Reference Array To Store Conversion Info
    let reference = []
    // Get The Grid
    let grid = JSON.parse(JSON.stringify(this.grid))

    // Loop Throgh Grid
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        // Get Current Value
        let n = grid[i][j]
        // If Current Cell is Empty
        if (n != 0) {
          // Init an Array of 324 Zero
          let row = new Array(324).fill(0)
          // Fill The Row
          row[i * 9 + j] = 1 // Cell Constraint
          row[81 + i * 9 + n - 1] = 1  // Row Constraint
          row[162 + j * 9 + n - 1] = 1 // Column Constraint
          row[243 + (Math.floor(i / 3) * 3 + Math.floor(j / 3)) * 9 + n - 1] = 1 // Section Constraint
          // Add a Row to The Cover Matrix
          cover_matrix.push(row)
          // Add New Info to The Reference Array
          reference.push({ row: i, col: j, val: n })
        } else {
          // Loop Through Candidates - Possible Values 1 to 9
          for (let v = 0; v < 9; v++) {
            // Init an Array of 324 Zero
            let row = new Array(324).fill(0)
            // Fill The Row
            row[i * 9 + j] = 1 // Cell Constraint
            row[9 * 9 + i * 9 + v] = 1  // Row Constraint
            row[162 + j * 9 + v] = 1 // Column Constraint
            row[243 + (Math.floor(i / 3) * 3 + Math.floor(j / 3)) * 9 + v] = 1 // Section Constraint
            // Add a Row to The Cover Matrix
            cover_matrix.push(row)
            // Add New Info to The Reference Array
            reference.push({ row: i, col: j, val: v + 1 })
          }
        }
      }
    }

    // Return The Covered Matrix
    return { cover_matrix, reference }
  }

  /**
   * Create Doubly Circular Linked List Columns Nodes
   * 
   * @param {array} matrix 
   */
  create_columns(matrix) {
    // Init Columns Array
    let columns = []
    // Init First Column
    columns[0] = {}
    // Loop Through Matrix Elements Length
    for (let i = 0; i < matrix[0].length; i++) {
      // Fill Current Column
      columns[i].index = i
      columns[i].up = columns[i]
      columns[i].down = columns[i]

      // Get Current Column's Left
      if (i - 1 >= 0) {
        columns[i].left = columns[i - 1]
      }
      // Get Current Column's Right
      if (i + 1 < matrix[0].length) {
        // Init Next Column
        columns[i + 1] = {}
        // Get Current Column's Right
        columns[i].right = columns[i + 1]
      } else {
        columns[i].right = columns[0]
      }

      // Init Current Column Size
      columns[i].size = 0
    }
    columns[0].left = columns[matrix[0].length - 1]

    // Return Created Columns
    return columns
  }

  /**
   * Create Doubly Circular Linked List Nodes
   * 
   * @param {array} matrix 
   * @param {array} columns 
   */
  create_nodes(matrix, columns) {
    // Loop Throgh Matrix Rows
    for (let i = 0; i < matrix.length; i++) {
      // Init Last Node Variable
      let lastNode = null
      // Loop Throght Matrix Columns
      for (let j = 0; j < matrix[0].length; j++) {
        // If Current Cell Contains 1
        if (matrix[i][j] == 1) {
          // Create New Node
          let node = {}
          // Mark The Node
          node.index = `${i}${j}`
          // Fill The Node Info
          node.row = i
          node.column = columns[j]

          // Set The Node Up & Down Directions
          node.down = columns[j]
          node.up = columns[j].up

          // Set The Node Left & Right Directions
          if (lastNode) {
            node.right = lastNode.right
            node.left = lastNode
            lastNode.right.left = node
            lastNode.right = node
          } else {
            node.left = node
            node.right = node
          }

          // Update The Node's Column Up & Down Directions
          columns[j].up.down = node
          columns[j].up = node

          // Increase Current Node's Column Size
          columns[j].size++

          // Update Last Node Variable
          lastNode = node
        }
      }
    }

    // Return The New List
    return columns
  }

  /**
   * Create The Doubly Circular Linked List Head Entry
   * 
   * @param {array} columns 
   */
  create_head(columns) {
    // Get The Last Index of Columns
    let l = columns.length - 1
    // Init Head Object
    let head = {}
    head.index = 'HEAD'
    // Fill Head Object Directions
    head.right = columns[0]
    head.left = columns[l]
    columns[0].left = head
    columns[l].right = head
    // Return Columns
    return { head, columns }
  }

  /**
   * Choose The Column with Less Items on it
   * 
   * @param {object} head 
   */
  choose_column(head) {
    // Init Variables
    var chosen = null
    var min = 99999

    // Init Current Column Variable
    let col = head.right
    // While The Tour Was Not Finished
    while (col != head) {
      // If a Column is Empty
      if (col.size == 0) {
        // Return Null
        return null
      }

      // If The Current Column is The Smallest
      if (col.size < min) {
        // Change The Chosen Column
        min = col.size
        chosen = col
      }

      // Move to The Right
      col = col.right
    }

    // Return Final Chosen Column
    return chosen
  }

  /**
   * Remove Column From The List
   * 
   * @param {Node} column
   */
  cover(column) {
    // Remove The Column
    column.right.left = column.left
    column.left.right = column.right
    // Move To The Column's Down Row
    let row = column.down
    // While The Loop is Not Reaching The Column From Top
    while (row != column) {
      // Get The Next Node in The Row
      let node = row.right
      while (node != row) {
        // Remove The Node
        node.down.up = node.up
        node.up.down = node.down
        // Decrease The Size Of This Node's Column
        node.column.size--
        // Move To The Next Node in The Right
        node = node.right
      }
      // Move Down To The Next Row in The Covered Column
      row = row.down
    }
  }

  /**
   * Restaure Covered Column
   * 
   * @param {Node} column 
   */
  uncover(column) {
    // Move To The Column's Last Row
    let row = column.up
    // While The Loop is Not Reaching The Column From Bottom
    while (row != column) {
      // Get The Next Node in The Row
      let node = row.left
      while (node != row) {
        // Restaure The Node
        node.down.up = node
        node.up.down = node
        // Increase The Size Of This Node's Column
        node.column.size++
        // Move To The Next Node in The Left
        node = node.left
      }
      // Move Up To The Top Row in The Covered Column
      row = row.up
    }
    // Restaure The Column Back to The List
    column.right.left = column
    column.left.right = column
  }

  /**
   * This Function Will Look For a Soution
   * Using The Knuth's Algorithm With DLX
   * 
   * @param {object} head 
   * @param {numbre} depth 
   * @param {array} solution 
   */
  search(head, depth = 0, solution = []) {
    // If The Cover Matrix is Empty
    if (head.right == head) {
      // Return The Solution
      return solution
    }

    // Choose a Column
    let col = this.choose_column(head)
    // If There is No Valid Column To Choose
    if (col == null) {
      return null
    }
    // Remove The Chosen Col
    this.cover(col)
    // Explore Nodes in The Chosen Column
    for (let node = col.down; node != col; node = node.down) {
      // Push The Current Node's Row to The Solutions
      solution.push(node.row)
      // Explore The Current Node's Row
      for (let next = node.right; next != node; next = next.right) {
        // Remove The Current Node's Column
        this.cover(next.column)
      }
      // Re-search The Solution Again With Reduces Cover Matrix
      let s = this.search(head, depth + 1, solution)
      // If There is Solution
      if (s != null) {
        // Return it
        return s
      }
      // If There is No Solution With Current Row
      // Remove The Current Row From Solutions
      solution.pop()
      // Undo All Covered Nodes
      for (let prev = node.left; prev != node; prev = prev.left) {
        // Remove The Current Node's Column
        this.uncover(prev.column)
      }
    }

    // Restaure Choosen Column if There is No Solution
    this.uncover(col)

    // Return Null
    return null
  }

  /**
   * Prepare The Problem to Solve it With Knuth's Algorithm
   */
  solve() {
    // Create The Sudoku Cover Matrix
    let { cover_matrix, reference } = this.create_cover_matrix()
    this.matrix = cover_matrix
    // Create Columns
    this.columns = this.create_columns(this.matrix)
    // Create Grid Nodes
    this.columns = this.create_nodes(this.matrix, this.columns)
    // Create Head Node
    let { columns, head } = this.create_head(this.columns)
    // Update Columns With The Head
    this.columns = columns
    // Run The Search Solution Function & Return The Solution
    let rows = this.search(head, 0, [])
    // If There is Solution
    if (rows != null) {
      // Get The Sudoku Puzzle
      let grid = JSON.parse(JSON.stringify(this.grid))
      // Loop Through Solution's Rows
      for (let i = 0; i < rows.length; i++) {
        // Get The Cell Credentials
        let x = reference[rows[i]].row
        let y = reference[rows[i]].col
        let n = reference[rows[i]].val
        // Update The Cell With Correct Value
        grid[x][y] = n
      }
      // Output a Success Message
      this.sudoku.message = {
        content: `Sudoku solved successfully with dancing links algorithm`,
        type: 'success'
      }
      // Output The Solution
      this.sudoku.solution = grid
      // Stop Function
      return
    }
    // Get Error Message if there is no solution
    this.sudoku.message = {
      content: `Ooops! We can't solve this puzzle with dlx algorithm. Please try other algorithm`,
      type: 'danger'
    }
  }
}