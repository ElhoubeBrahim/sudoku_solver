// Get The Grid Element
const grid = document.querySelector('main .grid')

// Init Puzzle
const puzzle = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],

  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],

  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9],
]

// Instantiate The GUI Class
const UI = new GUI(puzzle, grid)

// Generate Grid on The Screen
UI.generate_grid() // HTML Grid
UI.fill_grid(puzzle)

// Instantiate Solver Classes
const sudoku = new Sudoku(UI)
const backtrack = new Backtrack(sudoku)
const genetic = new Genetic(sudoku)
const dlx = new DLX(sudoku)

// Listen To User Events
document.body.addEventListener('keyup', function (event) {
  sudoku.input(event)
})

document.body.addEventListener('click', function (event) {
  // Unselect All Cells When User Clicked Outside The Grid
  if (event.target != document.querySelector('.selected')) {
    let cells = document.querySelectorAll('.grid .row .column.selected')
    cells.forEach(cell => {
      cell.classList.remove('selected')
    })
  }
})