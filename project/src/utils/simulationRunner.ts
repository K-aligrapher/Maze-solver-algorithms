import { Algorithm, SimulationRunner, Position, CellType, Cell } from '../types/maze';

export const runAlgorithm = (config: SimulationRunner) => {
  const { algorithm, maze, startPosition, endPosition, simulationRef } = config;
  
  // Clone maze to avoid mutating the original during algorithm execution
  const mazeCopy = maze.map(row => [...row]);
  
  // Reset simulation reference
  if (simulationRef.current) {
    clearTimeout(simulationRef.current);
  }
  
  switch (algorithm) {
    case Algorithm.DFS:
      runDFS(config, mazeCopy);
      break;
    case Algorithm.BFS:
      runBFS(config, mazeCopy);
      break;
    case Algorithm.ASTAR:
      runAStar(config, mazeCopy);
      break;
    default:
      console.error('Unknown algorithm');
      break;
  }
};

export const stopSimulation = (simulationRef: React.MutableRefObject<any>) => {
  if (simulationRef.current) {
    clearTimeout(simulationRef.current);
    simulationRef.current = null;
  }
};

// Depth-First Search implementation
const runDFS = (config: SimulationRunner, mazeCopy: Cell[][]) => {
  const { startPosition, endPosition, speed, onVisit, onExplore, onPathFound, onNoPathFound, simulationRef } = config;
  
  const stack: Position[] = [startPosition];
  const visited: Set<string> = new Set();
  const parentMap: Map<string, Position> = new Map();
  
  const totalCells = mazeCopy.length * mazeCopy[0].length;
  let stepCounter = 0;
  
  const dfsStep = () => {
    if (stack.length === 0) {
      onNoPathFound();
      return;
    }
    
    const current = stack.pop()!;
    const { row, col } = current;
    const key = `${row},${col}`;
    
    // Skip if already visited
    if (visited.has(key)) {
      simulationRef.current = setTimeout(dfsStep, speed);
      return;
    }
    
    // Mark as visited
    visited.add(key);
    onVisit(row, col);
    
    // Check if reached the end
    if (row === endPosition.row && col === endPosition.col) {
      // Reconstruct path
      const path: Position[] = [];
      let currentPos: Position | undefined = current;
      
      while (currentPos) {
        path.unshift(currentPos);
        const parentKey = `${currentPos.row},${currentPos.col}`;
        currentPos = parentMap.get(parentKey);
      }
      
      onPathFound(path);
      return;
    }
    
    // Define possible directions: [row, col]
    const directions = [
      [-1, 0], // Up
      [1, 0],  // Down
      [0, -1], // Left
      [0, 1],  // Right
    ];
    
    for (const [dRow, dCol] of directions) {
      const newRow = row + dRow;
      const newCol = col + dCol;
      
      // Check if valid position
      if (
        newRow >= 0 && newRow < mazeCopy.length &&
        newCol >= 0 && newCol < mazeCopy[0].length
      ) {
        const cell = mazeCopy[newRow][newCol];
        const newKey = `${newRow},${newCol}`;
        
        // Check if walkable and not visited
        if (
          (cell.type === CellType.EMPTY || cell.type === CellType.END) && 
          !visited.has(newKey)
        ) {
          stack.push({ row: newRow, col: newCol });
          parentMap.set(newKey, current);
          onExplore(newRow, newCol);
        }
      }
    }
    
    // Safety check to prevent infinite loops
    stepCounter++;
    if (stepCounter > totalCells * 2) {
      onNoPathFound();
      return;
    }
    
    simulationRef.current = setTimeout(dfsStep, speed);
  };
  
  dfsStep();
};

// Breadth-First Search implementation
const runBFS = (config: SimulationRunner, mazeCopy: Cell[][]) => {
  const { startPosition, endPosition, speed, onVisit, onExplore, onPathFound, onNoPathFound, simulationRef } = config;
  
  const queue: Position[] = [startPosition];
  const visited: Set<string> = new Set(`${startPosition.row},${startPosition.col}`);
  const parentMap: Map<string, Position> = new Map();
  
  const bfsStep = () => {
    if (queue.length === 0) {
      onNoPathFound();
      return;
    }
    
    const current = queue.shift()!;
    const { row, col } = current;
    
    // Mark as visited
    onVisit(row, col);
    
    // Check if reached the end
    if (row === endPosition.row && col === endPosition.col) {
      // Reconstruct path
      const path: Position[] = [];
      let currentPos: Position | undefined = current;
      
      while (currentPos) {
        path.unshift(currentPos);
        const parentKey = `${currentPos.row},${currentPos.col}`;
        currentPos = parentMap.get(parentKey);
      }
      
      onPathFound(path);
      return;
    }
    
    // Define possible directions: [row, col]
    const directions = [
      [-1, 0], // Up
      [1, 0],  // Down
      [0, -1], // Left
      [0, 1],  // Right
    ];
    
    for (const [dRow, dCol] of directions) {
      const newRow = row + dRow;
      const newCol = col + dCol;
      const newKey = `${newRow},${newCol}`;
      
      // Check if valid position
      if (
        newRow >= 0 && newRow < mazeCopy.length &&
        newCol >= 0 && newCol < mazeCopy[0].length
      ) {
        const cell = mazeCopy[newRow][newCol];
        
        // Check if walkable and not visited
        if (
          (cell.type === CellType.EMPTY || cell.type === CellType.END) && 
          !visited.has(newKey)
        ) {
          queue.push({ row: newRow, col: newCol });
          visited.add(newKey);
          parentMap.set(newKey, current);
          onExplore(newRow, newCol);
        }
      }
    }
    
    simulationRef.current = setTimeout(bfsStep, speed);
  };
  
  bfsStep();
};

// A* Search implementation
const runAStar = (config: SimulationRunner, mazeCopy: Cell[][]) => {
  const { startPosition, endPosition, speed, onVisit, onExplore, onPathFound, onNoPathFound, simulationRef } = config;
  
  // Initialize open and closed sets
  const openSet: Position[] = [startPosition];
  const closedSet: Set<string> = new Set();
  
  // Initialize g scores (distance from start) and f scores (g score + heuristic)
  const gScore: Map<string, number> = new Map();
  const fScore: Map<string, number> = new Map();
  const parentMap: Map<string, Position> = new Map();
  
  gScore.set(`${startPosition.row},${startPosition.col}`, 0);
  fScore.set(`${startPosition.row},${startPosition.col}`, heuristic(startPosition, endPosition));
  
  const aStarStep = () => {
    if (openSet.length === 0) {
      onNoPathFound();
      return;
    }
    
    // Find the node with lowest f score
    let currentIndex = 0;
    let currentNode = openSet[0];
    const currentKey = `${currentNode.row},${currentNode.col}`;
    let lowestFScore = fScore.get(currentKey) || Infinity;
    
    for (let i = 1; i < openSet.length; i++) {
      const { row, col } = openSet[i];
      const key = `${row},${col}`;
      const score = fScore.get(key) || Infinity;
      
      if (score < lowestFScore) {
        lowestFScore = score;
        currentIndex = i;
        currentNode = openSet[i];
      }
    }
    
    const { row, col } = currentNode;
    const currentNodeKey = `${row},${col}`;
    
    // Check if reached the end
    if (row === endPosition.row && col === endPosition.col) {
      // Reconstruct path
      const path: Position[] = [];
      let current = currentNode;
      
      while (current) {
        path.unshift(current);
        const parentKey = `${current.row},${current.col}`;
        current = parentMap.get(parentKey);
      }
      
      onPathFound(path);
      return;
    }
    
    // Remove current from open set and add to closed set
    openSet.splice(currentIndex, 1);
    closedSet.add(currentNodeKey);
    onVisit(row, col);
    
    // Define possible directions: [row, col]
    const directions = [
      [-1, 0], // Up
      [1, 0],  // Down
      [0, -1], // Left
      [0, 1],  // Right
    ];
    
    // Check neighbors
    for (const [dRow, dCol] of directions) {
      const newRow = row + dRow;
      const newCol = col + dCol;
      const neighborKey = `${newRow},${newCol}`;
      
      // Check if valid position
      if (
        newRow >= 0 && newRow < mazeCopy.length &&
        newCol >= 0 && newCol < mazeCopy[0].length
      ) {
        const cell = mazeCopy[newRow][newCol];
        
        // Skip if in closed set or is a wall
        if (
          closedSet.has(neighborKey) || 
          (cell.type !== CellType.EMPTY && cell.type !== CellType.END)
        ) {
          continue;
        }
        
        // Calculate tentative g score
        const tentativeGScore = (gScore.get(currentNodeKey) || 0) + 1;
        
        // If not in open set, add it
        const inOpenSet = openSet.some(pos => pos.row === newRow && pos.col === newCol);
        if (!inOpenSet) {
          openSet.push({ row: newRow, col: newCol });
          onExplore(newRow, newCol);
        }
        // If already in open set but with worse g score, skip
        else if (tentativeGScore >= (gScore.get(neighborKey) || Infinity)) {
          continue;
        }
        
        // This path is better, record it
        parentMap.set(neighborKey, currentNode);
        gScore.set(neighborKey, tentativeGScore);
        fScore.set(neighborKey, tentativeGScore + heuristic({ row: newRow, col: newCol }, endPosition));
      }
    }
    
    simulationRef.current = setTimeout(aStarStep, speed);
  };
  
  aStarStep();
};

// Manhattan distance heuristic for A* algorithm
const heuristic = (a: Position, b: Position): number => {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
};