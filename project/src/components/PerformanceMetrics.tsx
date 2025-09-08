import React from 'react';
import { Algorithm } from '../types/maze';

interface PerformanceMetricsProps {
  metrics: {
    nodesVisited: number;
    pathLength: number;
    executionTime: number;
  };
  algorithm: Algorithm;
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ metrics, algorithm }) => {
  const getAlgorithmName = (alg: Algorithm) => {
    switch (alg) {
      case Algorithm.DFS:
        return 'DFS';
      case Algorithm.BFS:
        return 'BFS';
      case Algorithm.ASTAR:
        return 'A*';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4">
      <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">
        Performance Metrics
      </h2>
      
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-lg">
          <div className="text-sm text-slate-500 dark:text-slate-400">Algorithm</div>
          <div className="text-lg font-semibold text-slate-800 dark:text-white">
            {getAlgorithmName(algorithm)}
          </div>
        </div>
        
        <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-lg">
          <div className="text-sm text-slate-500 dark:text-slate-400">Nodes Visited</div>
          <div className="text-lg font-semibold text-slate-800 dark:text-white">
            {metrics.nodesVisited}
          </div>
        </div>
        
        <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-lg">
          <div className="text-sm text-slate-500 dark:text-slate-400">Path Length</div>
          <div className="text-lg font-semibold text-slate-800 dark:text-white">
            {metrics.pathLength > 0 ? metrics.pathLength : 'No path found'}
          </div>
        </div>
        
        <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-lg">
          <div className="text-sm text-slate-500 dark:text-slate-400">Execution Time</div>
          <div className="text-lg font-semibold text-slate-800 dark:text-white">
            {metrics.executionTime > 0 
              ? `${metrics.executionTime.toFixed(2)} ms` 
              : '0 ms'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;