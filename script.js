// Get The Grid Element
const grid = document.querySelector('main .grid')

// Generate Puzzle
const puzzle = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],

  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],

  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
]

// Instantiate The GUI Class
const UI = new GUI(puzzle, grid)

// Generate Grid on The Screen
UI.generate_grid()
UI.fill_grid(puzzle)

// Instantiate Solver Classes
const sudoku = new Sudoku(UI)
const backtrack = new Backtrack(sudoku)
const genetic = new Genetic(sudoku)
const dlx = new DLX(sudoku)

// Listen To User Events
document.body.addEventListener('keydown', function (event) {
  sudoku.input(event)
})

document.body.addEventListener('click', function (event) {
  if (event.target != document.querySelector('.selected')) {
    let cells = document.querySelectorAll('.grid .row .column.selected')
    cells.forEach(cell => {
      cell.classList.remove('selected')
    })
  }
})