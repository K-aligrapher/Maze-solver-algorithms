export enum CellType {
  EMPTY = 'empty',
  WALL = 'wall',
  START = 'start',
  END = 'end',
  VISITED = 'visited',
  CURRENT = 'current',
  PATH = 'path',
}

export enum Algorithm {
  DFS = 'dfs',
  BFS = 'bfs',
  ASTAR = 'astar',
}

export enum SimulationState {
  READY = 'ready',
  RUNNING = 'running',
  PAUSED = 'paused',
  FINISHED = 'finished',
}

export interface Position {
  row: number;
  col: number;
}

export interface Cell {
  row: number;
  col: number;
  type: CellType;
  visited: boolean;
  distance: number;
  fScore?: number; // For A* algorithm
  gScore?: number; // For A* algorithm
  parent: Position | null;
}

export interface SimulationRunner {
  algorithm: Algorithm;
  maze: Cell[][];
  startPosition: Position;
  endPosition: Position;
  speed: number;
  onVisit: (row: number, col: number) => void;
  onExplore: (row: number, col: number) => void;
  onPathFound: (path: Position[]) => void;
  onNoPathFound: () => void;
  simulationRef: React.MutableRefObject<any>;
}