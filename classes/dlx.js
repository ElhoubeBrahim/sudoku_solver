/**
 * This Class is Designed to Solve Sudoku Puzzles
 * Using Dancing Links Algorithm
 * 
 * Functions in This Class are Copied From https://anysudokusolver.com Website
 */
class DLX {
  // Sudoku Class
  sudoku
  // Sudoku Grid
  grid

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

  /**
   * Remove Node From The Doubly Circular Linked List
   * 
   * @param {object} c 
   */
  dlx_cover(c) {
    c.right.left = c.left;
    c.left.right = c.right;
    for (var i = c.down; i != c; i = i.down) {
      for (var j = i.right; j != i; j = j.right) {
        j.down.up = j.up;
        j.up.down = j.down;
        j.column.size--;
      }
    }
  }

  /**
   * Add Node To The Doubly Circular Linked List
   *
   * @param {object} c
   */
  dlx_uncover(c) {
    for (var i = c.up; i != c; i = i.up) {
      for (var j = i.left; j != i; j = j.left) {
        j.column.size++;
        j.down.up = j;
        j.up.down = j;
      }
    }
    c.right.left = c;
    c.left.right = c;
  }

  dlx_search(head, solution, k, solutions, maxsolutions) {
    if (head.right == head) {
      solutions.push(solution.slice(0));
      if (solutions.length >= maxsolutions) {
        return solutions;
      }
      return null;
    }
    var c = null;
    var s = 99999;
    for (var j = head.right; j != head; j = j.right) {
      if (j.size == 0) {
        return null;
      }
      if (j.size < s) {
        s = j.size;
        c = j;
      }
    }
    this.dlx_cover(c);
    for (var r = c.down; r != c; r = r.down) {
      solution[k] = r.row;
      for (var j = r.right; j != r; j = j.right) {
        this.dlx_cover(j.column);
      }
      var s = this.dlx_search(head, solution, k + 1, solutions, maxsolutions);
      if (s != null) {
        return s;
      }
      for (var j = r.left; j != r; j = j.left) {
        this.dlx_uncover(j.column);
      }
    }
    this.dlx_uncover(c);
    return null;
  }

  dlx_solve(matrix, skip, maxsolutions) {
    var columns = new Array(matrix[0].length);
    for (var i = 0; i < columns.length; i++) {
      columns[i] = new Object;
    }
    for (var i = 0; i < columns.length; i++) {
      columns[i].index = i;
      columns[i].up = columns[i];
      columns[i].down = columns[i];
      if (i >= skip) {
        if (i - 1 >= skip) {
          columns[i].left = columns[i - 1];
        }
        if (i + 1 < columns.length) {
          columns[i].right = columns[i + 1];
        }
      } else {
        columns[i].left = columns[i];
        columns[i].right = columns[i];
      }
      columns[i].size = 0;
    }
    for (var i = 0; i < matrix.length; i++) {
      var last = null;
      for (var j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j]) {
          var node = new Object;
          node.row = i;
          node.column = columns[j];
          node.up = columns[j].up;
          node.down = columns[j];
          if (last) {
            node.left = last;
            node.right = last.right;
            last.right.left = node;
            last.right = node;
          } else {
            node.left = node;
            node.right = node;
          }
          columns[j].up.down = node;
          columns[j].up = node;
          columns[j].size++;
          last = node;
        }
      }
    }
    var head = new Object;
    head.right = columns[skip];
    head.left = columns[columns.length - 1];
    columns[skip].left = head;
    columns[columns.length - 1].right = head;
    let solutions = [];
    this.dlx_search(head, [], 0, solutions, maxsolutions);
    return solutions;
  }

  /**
   * Solve The Sudoku Puzzle
   */
  solve() {
    let grid = JSON.parse(JSON.stringify(this.grid))
    var cover_matrix = []; // Cover Matrix
    var rinfo = [];
    for (var i = 0; i < 9; i++) {
      for (var j = 0; j < 9; j++) {
        var g = grid[i][j] - 1;
        // If The Cell is Not Empty
        if (g >= 0) {
          var row = new Array(324);
          // Create Constraints
          row[i * 9 + j] = 1;
          row[9 * 9 + i * 9 + g] = 1;
          row[9 * 9 * 2 + j * 9 + g] = 1;
          row[9 * 9 * 3 + (Math.floor(i / 3) * 3 + Math.floor(j / 3)) * 9 + g] = 1;
          cover_matrix.push(row);
          rinfo.push({ 'row': i, 'col': j, 'n': g + 1 });
        } else {
          for (var n = 0; n < 9; n++) {
            var row = new Array(324);
            row[i * 9 + j] = 1;
            row[9 * 9 + i * 9 + n] = 1;
            row[9 * 9 * 2 + j * 9 + n] = 1;
            row[9 * 9 * 3 + (Math.floor(i / 3) * 3 + Math.floor(j / 3)) * 9 + n] = 1;
            cover_matrix.push(row);
            rinfo.push({ 'row': i, 'col': j, 'n': n + 1 });
          }
        }
      }
    }
    // Get Solution
    var solutions = this.dlx_solve(cover_matrix, 0, 2);
    // If There is Solution
    if (solutions.length > 0) {
      // Get Solution Pattern
      var r = solutions[0];
      // Change The Grid Cells
      for (var i = 0; i < r.length; i++) {
        grid[rinfo[r[i]]['row']][rinfo[r[i]]['col']] = rinfo[r[i]]['n'];
      }

      // Get The Solution
      sudoku.message = {
        content: `Sudoku solved successfully with dancing links algorithm`,
        type: 'success'
      }
      sudoku.solution = grid
      return
    }
    // Get Error Message if there is no solution
    sudoku.message = {
      content: `Ooops! We can't solve this puzzle with dlx algorithm. Please try other algorithm`,
      type: 'danger'
    }
  }
}