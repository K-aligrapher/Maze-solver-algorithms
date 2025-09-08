import React, { useState, useEffect, useRef } from 'react';
import MazeGrid from './MazeGrid';
import ControlPanel from './ControlPanel';
import PerformanceMetrics from './PerformanceMetrics';
import AlgorithmSelector from './AlgorithmSelector';
import { generateMaze } from '../utils/mazeGenerator';
import { Cell, CellType, Algorithm, SimulationState, Position } from '../types/maze';
import { runAlgorithm, stopSimulation } from '../utils/simulationRunner';

const MazeSimulation: React.FC = () => {
  const [maze, setMaze] = useState<Cell[][]>([]);
  const [mazeSize, setMazeSize] = useState({ rows: 15, cols: 15 });
  const [startPosition, setStartPosition] = useState<Position>({ row: 1, col: 1 });
  const [endPosition, setEndPosition] = useState<Position>({ row: 13, col: 13 });
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm>(Algorithm.BFS);
  const [simulationState, setSimulationState] = useState<SimulationState>(SimulationState.READY);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(50); // 1-100
  const [metrics, setMetrics] = useState({
    nodesVisited: 0,
    pathLength: 0,
    executionTime: 0,
  });
  
  const simulationRef = useRef<any>(null);
  
  // Initialize maze
  useEffect(() => {
    createNewMaze();
  }, [mazeSize]);
  
  const createNewMaze = () => {
    if (simulationState === SimulationState.RUNNING) {
      stopSimulation(simulationRef);
      setSimulationState(SimulationState.READY);
    }
    
    const newMaze = generateMaze(mazeSize.rows, mazeSize.cols);
    
    // Set start and end positions
    const newStartPos = { row: 1, col: 1 };
    const newEndPos = { 
      row: mazeSize.rows % 2 === 0 ? mazeSize.rows - 2 : mazeSize.rows - 2, 
      col: mazeSize.cols % 2 === 0 ? mazeSize.cols - 2 : mazeSize.cols - 2 
    };
    
    newMaze[newStartPos.row][newStartPos.col].type = CellType.START;
    newMaze[newEndPos.row][newEndPos.col].type = CellType.END;
    
    setStartPosition(newStartPos);
    setEndPosition(newEndPos);
    setMaze(newMaze);
    
    // Reset metrics
    setMetrics({
      nodesVisited: 0,
      pathLength: 0,
      executionTime: 0,
    });
  };
  
  const handleCellClick = (row: number, col: number) => {
    if (simulationState !== SimulationState.READY) return;
    
    const newMaze = [...maze];
    const cell = newMaze[row][col];
    
    // Don't allow changing start or end positions
    if (cell.type === CellType.START || cell.type === CellType.END) return;
    
    // Toggle between path and wall
    if (cell.type === CellType.WALL) {
      cell.type = CellType.EMPTY;
    } else {
      cell.type = CellType.WALL;
    }
    
    setMaze(newMaze);
  };
  
  const startSimulation = () => {
    if (simulationState === SimulationState.RUNNING) return;
    
    // Reset maze cells except walls, start, and end
    const resetMaze = maze.map(row => 
      row.map(cell => {
        if (cell.type !== CellType.WALL && 
            cell.type !== CellType.START && 
            cell.type !== CellType.END) {
          return { ...cell, type: CellType.EMPTY, distance: Infinity, visited: false, parent: null };
        }
        return { ...cell };
      })
    );
    
    setMaze(resetMaze);
    setSimulationState(SimulationState.RUNNING);
    
    const startTime = performance.now();
    
    // Run the selected algorithm
    runAlgorithm({
      algorithm: selectedAlgorithm,
      maze: resetMaze,
      startPosition,
      endPosition,
      speed: 101 - simulationSpeed, // Convert to ms delay (1-100 speed → 100-1 ms)
      onVisit: (row, col) => {
        setMaze(prevMaze => {
          const newMaze = [...prevMaze];
          if (newMaze[row][col].type !== CellType.START && 
              newMaze[row][col].type !== CellType.END) {
            newMaze[row][col].type = CellType.VISITED;
          }
          newMaze[row][col].visited = true;
          return newMaze;
        });
        
        setMetrics(prev => ({
          ...prev,
          nodesVisited: prev.nodesVisited + 1,
        }));
      },
      onExplore: (row, col) => {
        setMaze(prevMaze => {
          const newMaze = [...prevMaze];
          if (newMaze[row][col].type !== CellType.START && 
              newMaze[row][col].type !== CellType.END) {
            newMaze[row][col].type = CellType.CURRENT;
          }
          return newMaze;
        });
      },
      onPathFound: (path) => {
        // Highlight the final path
        path.forEach(({ row, col }) => {
          setMaze(prevMaze => {
            const newMaze = [...prevMaze];
            if (newMaze[row][col].type !== CellType.START && 
                newMaze[row][col].type !== CellType.END) {
              newMaze[row][col].type = CellType.PATH;
            }
            return newMaze;
          });
        });
        
        const endTime = performance.now();
        
        setMetrics(prev => ({
          ...prev,
          pathLength: path.length,
          executionTime: endTime - startTime,
        }));
        
        setSimulationState(SimulationState.FINISHED);
      },
      onNoPathFound: () => {
        const endTime = performance.now();
        
        setMetrics(prev => ({
          ...prev,
          pathLength: 0,
          executionTime: endTime - startTime,
        }));
        
        setSimulationState(SimulationState.FINISHED);
      },
      simulationRef,
    });
  };
  
  const pauseSimulation = () => {
    if (simulationState !== SimulationState.RUNNING) return;
    stopSimulation(simulationRef);
    setSimulationState(SimulationState.PAUSED);
  };
  
  const resumeSimulation = () => {
    if (simulationState !== SimulationState.PAUSED) return;
    // Implementation would continue from where it left off
    setSimulationState(SimulationState.RUNNING);
  };
  
  const stopAndReset = () => {
    stopSimulation(simulationRef);
    setSimulationState(SimulationState.READY);
    
    // Reset only the visualization, keep walls
    const resetMaze = maze.map(row => 
      row.map(cell => {
        if (cell.type !== CellType.WALL && 
            cell.type !== CellType.START && 
            cell.type !== CellType.END) {
          return { ...cell, type: CellType.EMPTY, distance: Infinity, visited: false, parent: null };
        }
        return { ...cell };
      })
    );
    
    setMaze(resetMaze);
    
    // Reset metrics
    setMetrics({
      nodesVisited: 0,
      pathLength: 0,
      executionTime: 0,
    });
  };
  
  const handleSpeedChange = (newSpeed: number) => {
    setSimulationSpeed(newSpeed);
  };
  
  const handleSizeChange = (rows: number, cols: number) => {
    setMazeSize({ rows, cols });
  };
  
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-3/4 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4">
        <MazeGrid 
          maze={maze} 
          onCellClick={handleCellClick} 
        />
      </div>
      
      <div className="w-full lg:w-1/4 space-y-6">
        <AlgorithmSelector
          selectedAlgorithm={selectedAlgorithm}
          onSelectAlgorithm={setSelectedAlgorithm}
        />
        
        <ControlPanel 
          simulationState={simulationState}
          simulationSpeed={simulationSpeed}
          onStart={startSimulation}
          onPause={pauseSimulation}
          onResume={resumeSimulation}
          onReset={stopAndReset}
          onNewMaze={createNewMaze}
          onSpeedChange={handleSpeedChange}
          onSizeChange={handleSizeChange}
          mazeSize={mazeSize}
        />
        
        <PerformanceMetrics metrics={metrics} algorithm={selectedAlgorithm} />
      </div>
    </div>
  );
};

export default MazeSimulation;