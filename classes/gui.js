/**
 * This Class is Designed to Work With The Graphic User
 * Interface
 */
class GUI {
  // Sudoku Grid
  grid
  // HTML Grid Element
  grid_node = null
  // Selected Cell
  selected

  /**
   * Get The Grid Element
   * 
   * @param {object} grid 
   */
  constructor(grid, grid_node) {
    this.grid_node = grid_node
    this.grid = grid
  }

  /**
   * Generate Grid HTML
   */
  generate_grid() {
    // Loop Through Rows
    for (let i = 0; i < 9; i++) {
      // Create The Row Node
      let row = document.createElement('div')
      row.classList.add('row')
      row.setAttribute('data-row', i)

      // Append Created Row To The Grid
      this.grid_node.appendChild(row)

      // Loop Through Columns
      for (let j = 0; j < 9; j++) {
        // Create Column Node
        let column = document.createElement('div')
        column.classList.add('column')
        column.setAttribute('data-col', j)
        column.addEventListener('click', function (event) {
          // Show keyboard for mobile users
          let keyboard = document.getElementById('keyboard')
          keyboard.value = ''
          keyboard.focus()
          // Select target cell
          UI.select_cell(event.target)
        })

        // Append Created Column To The Current Row
        row.appendChild(column)
      }
    }
  }

  /**
   * Empty Grid Cells
   */
  clear_grid() {
    // Loop Through Rows
    for (let i = 0; i < 9; i++) {
      // Loop Through Columns
      for (let j = 0; j < 9; j++) {
        // Clear Cell
        grid.children[i].children[j].className = 'column'
        grid.children[i].children[j].innerHTML = ''
        // Clear Sudoku Matrix
        this.grid[i][j] = 0
      }
    }
  }

  /**
   * Open Choose Algorithm Prompt
   */
  open_prompt() {
    // Get Prompt Element
    let prompt = document.querySelector('.prompt')
    // If it is Defined
    if (prompt) {
      // Show it
      prompt.classList.add('show')
    }
  }

  /**
   * Open Choose Algorithm Prompt
   * 
   * @param {event} e 
   */
  close_prompt(e = {}) {
    // Get The Content Elemetn Inside The Prompt
    let content = document.querySelector('.prompt .algorithms')
    // Get The Clicked Element
    let el = e.target || document.querySelector('.prompt')

    // If The User Clicked Outside The Prompt Content
    if (el != content) {
      // Close The Prompt
      el.classList.remove('show')
    }
  }

  /**
   * Fill Grid With Values
   * 
   * @param {array} board 
   */
  fill_grid(board) {
    // Loop Through Board
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        // Get Current Cell Value
        let c = board[i][j]
        this.grid[i][j] = c
        // If Current Cell is not Empty
        if (c != 0) {
          // Get The Row
          let row = document.querySelector(`.row[data-row='${i}']`)
          // Get The Column
          let col = row.querySelector(`.column[data-col='${j}']`)
          // Fill The Cell With Current Value
          col.innerHTML = c
        }
      }
    }
  }

  /**
   * Select a Cell on The Grid on Click
   * 
   * @param {object} cell 
   */
  select_cell(cell) {
    // Unselect All Selected Cells
    document.querySelectorAll('.grid .row .column').forEach(el => {
      el.className = 'column'
    })
    // Select The Current Cell
    cell.className = 'column selected'
    this.selected = cell
  }

  /**
   * Show The Output Message
   * 
   * @param {string} message 
   * @param {string} type 
   */
  show_message(message, type = 'success') {
    // Get The Correct Message Type
    if (!['danger', 'sucess', 'info'].includes(type)) type = 'success'
    // Get The Main Element
    let main = document.querySelector('main')
    // Create The Message Element
    let msg_node = document.createElement('div')
    msg_node.classList.add('message', type)
    msg_node.innerHTML = message
    // Append The Created Message To The Main Element
    main.appendChild(msg_node)

    // Delete Message After 5 Seconds
    setTimeout(() => {
      msg_node.remove()
    }, 5000);
  }

  /**
   * Show Where is The Error in The Grid
   * After Validation
   * 
   * @param {number} row 
   * @param {number} col 
   */
  show_error(i, j) {
    // Get The Row
    let row = document.querySelector(`.row[data-row='${i}']`)
    // Get The Column
    let col = row.querySelector(`.column[data-col='${j}']`)
    // Add Error Class
    col.className = 'column error'
  }

  /**
   * Output The Solution On The Screen
   * 
   * @param {array} solution 
   */
  solve_grid(solution) {
    // Loop Through Solution Board
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        // Get Current Cell Value
        let s = solution[i][j]
        // If Current Cell is not Empty
        if (s != 0) {
          // Get The Row
          let row = document.querySelector(`.row[data-row='${i}']`)
          // Get The Column
          let col = row.querySelector(`.column[data-col='${j}']`)
          // If Current Column Was Empty
          if (this.grid[i][j] == 0) {
            // Fill The Cell With The Solution
            col.innerHTML = s
            // Append Solved Class To The Current Cell
            col.classList.add('solved')
          }
        }
        this.grid[i][j] = s
      }
    }
  }
}