import { Cell, CellType } from '../types/maze';

export const generateMaze = (rows: number, cols: number): Cell[][] => {
  // Ensure odd dimensions for proper maze generation
  rows = rows % 2 === 0 ? rows + 1 : rows;
  cols = cols % 2 === 0 ? cols + 1 : cols;
  
  // Initialize maze with walls
  const maze: Cell[][] = Array(rows).fill(0).map((_, row) => 
    Array(cols).fill(0).map((_, col) => ({
      row,
      col,
      type: CellType.WALL,
      visited: false,
      distance: Infinity,
      parent: null,
    }))
  );
  
  // Use recursive backtracking to generate the maze
  recursiveBacktracking(maze, 1, 1);
  
  return maze;
};

const recursiveBacktracking = (maze: Cell[][], row: number, col: number) => {
  const rows = maze.length;
  const cols = maze[0].length;
  
  // Mark current cell as path
  maze[row][col].type = CellType.EMPTY;
  maze[row][col].visited = true;
  
  // Define possible directions: [row, col]
  const directions = [
    [-2, 0], // Up
    [2, 0],  // Down
    [0, -2], // Left
    [0, 2],  // Right
  ];
  
  // Shuffle directions for randomness
  shuffleArray(directions);
  
  // Try each direction
  for (const [dRow, dCol] of directions) {
    const newRow = row + dRow;
    const newCol = col + dCol;
    
    // Check if neighbor is valid and unvisited
    if (
      newRow > 0 && newRow < rows - 1 && 
      newCol > 0 && newCol < cols - 1 && 
      maze[newRow][newCol].type === CellType.WALL
    ) {
      // Carve path between current cell and neighbor
      maze[row + dRow/2][col + dCol/2].type = CellType.EMPTY;
      
      // Recursively visit neighbor
      recursiveBacktracking(maze, newRow, newCol);
    }
  }
};

// Fisher-Yates shuffle algorithm
const shuffleArray = <T>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};