import React from 'react';
import { Algorithm } from '../types/maze';

interface AlgorithmSelectorProps {
  selectedAlgorithm: Algorithm;
  onSelectAlgorithm: (algorithm: Algorithm) => void;
}

const AlgorithmSelector: React.FC<AlgorithmSelectorProps> = ({
  selectedAlgorithm,
  onSelectAlgorithm,
}) => {
  const algorithms = [
    { 
      value: Algorithm.DFS, 
      name: 'Depth-First Search (DFS)',
      description: 'Explores as far as possible along each branch before backtracking.'
    },
    { 
      value: Algorithm.BFS, 
      name: 'Breadth-First Search (BFS)',
      description: 'Explores all neighbor nodes at the present depth before moving to nodes at the next depth level.'
    },
    { 
      value: Algorithm.ASTAR, 
      name: 'A* Search',
      description: 'Uses heuristics to find the shortest path more efficiently than BFS.'
    }
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4">
      <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Algorithm</h2>
      
      <div className="space-y-3">
        {algorithms.map((algorithm) => (
          <div 
            key={algorithm.value}
            className={`
              relative flex items-start p-3 rounded-lg cursor-pointer
              transition-colors duration-200
              ${selectedAlgorithm === algorithm.value 
                ? 'bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-500 dark:border-blue-400' 
                : 'bg-slate-100 dark:bg-slate-700 border-2 border-transparent hover:bg-slate-200 dark:hover:bg-slate-600'}
            `}
            onClick={() => onSelectAlgorithm(algorithm.value)}
          >
            <div className="flex items-center h-5">
              <input
                id={`algorithm-${algorithm.value}`}
                name="algorithm-selector"
                type="radio"
                checked={selectedAlgorithm === algorithm.value}
                onChange={() => onSelectAlgorithm(algorithm.value)}
                className="h-4 w-4 text-blue-600 border-slate-300 focus:ring-blue-500"
              />
            </div>
            <div className="ml-3 text-sm">
              <label 
                htmlFor={`algorithm-${algorithm.value}`} 
                className={`font-medium ${selectedAlgorithm === algorithm.value ? 'text-blue-800 dark:text-blue-300' : 'text-slate-700 dark:text-slate-300'}`}
              >
                {algorithm.name}
              </label>
              <p className={`text-xs mt-1 ${selectedAlgorithm === algorithm.value ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`}>
                {algorithm.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlgorithmSelector;