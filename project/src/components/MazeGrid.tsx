import React from 'react';
import { Cell, CellType } from '../types/maze';

interface MazeGridProps {
  maze: Cell[][];
  onCellClick: (row: number, col: number) => void;
}

const MazeGrid: React.FC<MazeGridProps> = ({ maze, onCellClick }) => {
  // Calculate cell size based on maze dimensions
  const gridSize = Math.min(600, window.innerWidth - 40); // Max 600px or window width - padding
  const rows = maze.length;
  const cols = maze[0]?.length || 0;
  const cellSize = gridSize / Math.max(rows, cols);
  
  const getCellColor = (cell: Cell) => {
    switch (cell.type) {
      case CellType.WALL:
        return 'bg-slate-800 dark:bg-slate-900';
      case CellType.START:
        return 'bg-emerald-500 dark:bg-emerald-600';
      case CellType.END:
        return 'bg-red-500 dark:bg-red-600';
      case CellType.VISITED:
        return 'bg-blue-200 dark:bg-blue-800';
      case CellType.CURRENT:
        return 'bg-yellow-300 dark:bg-yellow-500';
      case CellType.PATH:
        return 'bg-purple-400 dark:bg-purple-600';
      case CellType.EMPTY:
      default:
        return 'bg-white dark:bg-slate-700';
    }
  };

  const getAnimation = (cell: Cell) => {
    switch (cell.type) {
      case CellType.VISITED:
        return 'animate-pulse-once';
      case CellType.CURRENT:
        return 'animate-pulse';
      case CellType.PATH:
        return 'animate-fade-in';
      default:
        return '';
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div 
        className="grid gap-[1px] bg-slate-300 dark:bg-slate-600 p-[1px] rounded-lg m-auto" 
        style={{ 
          gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
          gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
        }}
      >
        {maze.map((row, rowIndex) => 
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`
                ${getCellColor(cell)} 
                ${getAnimation(cell)}
                cursor-pointer transition-colors duration-150 ease-in-out
                flex items-center justify-center text-xs
                hover:opacity-80
              `}
              onClick={() => onCellClick(rowIndex, colIndex)}
              title={`Row: ${rowIndex}, Column: ${colIndex}`}
            >
              {cell.type === CellType.START && (
                <span className="text-white font-bold">S</span>
              )}
              {cell.type === CellType.END && (
                <span className="text-white font-bold">E</span>
              )}
            </div>
          ))
        )}
      </div>
      
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-4 text-sm">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-white dark:bg-slate-700 mr-2"></div>
          <span className="text-slate-700 dark:text-slate-300">Empty</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-slate-800 dark:bg-slate-900 mr-2"></div>
          <span className="text-slate-700 dark:text-slate-300">Wall</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-emerald-500 dark:bg-emerald-600 mr-2"></div>
          <span className="text-slate-700 dark:text-slate-300">Start</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 dark:bg-red-600 mr-2"></div>
          <span className="text-slate-700 dark:text-slate-300">End</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-200 dark:bg-blue-800 mr-2"></div>
          <span className="text-slate-700 dark:text-slate-300">Visited</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-yellow-300 dark:bg-yellow-500 mr-2"></div>
          <span className="text-slate-700 dark:text-slate-300">Current</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-purple-400 dark:bg-purple-600 mr-2"></div>
          <span className="text-slate-700 dark:text-slate-300">Path</span>
        </div>
      </div>
    </div>
  );
};

export default MazeGrid;