import React from 'react';
import { Play, Pause, RotateCcw, FilePlus, FastForward, Settings } from 'lucide-react';
import { SimulationState } from '../types/maze';

interface ControlPanelProps {
  simulationState: SimulationState;
  simulationSpeed: number;
  mazeSize: { rows: number; cols: number };
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onNewMaze: () => void;
  onSpeedChange: (speed: number) => void;
  onSizeChange: (rows: number, cols: number) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  simulationState,
  simulationSpeed,
  mazeSize,
  onStart,
  onPause,
  onResume,
  onReset,
  onNewMaze,
  onSpeedChange,
  onSizeChange,
}) => {
  const [showSettings, setShowSettings] = React.useState(false);
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4">
      <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Controls</h2>
      
      <div className="space-y-4">
        <div className="flex space-x-2">
          {simulationState === SimulationState.READY && (
            <button
              onClick={onStart}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Play size={18} />
              <span>Start</span>
            </button>
          )}
          
          {simulationState === SimulationState.RUNNING && (
            <button
              onClick={onPause}
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Pause size={18} />
              <span>Pause</span>
            </button>
          )}
          
          {simulationState === SimulationState.PAUSED && (
            <button
              onClick={onResume}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Play size={18} />
              <span>Resume</span>
            </button>
          )}
          
          <button
            onClick={onReset}
            className="flex-1 bg-slate-500 hover:bg-slate-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
            disabled={simulationState === SimulationState.READY}
          >
            <RotateCcw size={18} />
            <span>Reset</span>
          </button>
        </div>
        
        <button
          onClick={onNewMaze}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <FilePlus size={18} />
          <span>Generate New Maze</span>
        </button>
        
        <div className="pt-2">
          <div className="flex justify-between mb-1">
            <label htmlFor="speed-slider" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Simulation Speed
            </label>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {simulationSpeed}%
            </span>
          </div>
          <input
            id="speed-slider"
            type="range"
            min="1"
            max="100"
            value={simulationSpeed}
            onChange={(e) => onSpeedChange(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700"
          />
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
            <span>Slow</span>
            <span>Fast</span>
          </div>
        </div>
        
        <div className="pt-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="w-full bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Settings size={18} />
            <span>{showSettings ? 'Hide' : 'Show'} Advanced Settings</span>
          </button>
          
          {showSettings && (
            <div className="mt-3 p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
              <div className="mb-3">
                <label htmlFor="maze-size" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Maze Size
                </label>
                <div className="flex gap-2">
                  <select
                    id="maze-size"
                    value={`${mazeSize.rows}x${mazeSize.cols}`}
                    onChange={(e) => {
                      const [rows, cols] = e.target.value.split('x').map(Number);
                      onSizeChange(rows, cols);
                    }}
                    className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg px-3 py-2 w-full"
                  >
                    <option value="11x11">Small (11x11)</option>
                    <option value="15x15">Medium (15x15)</option>
                    <option value="21x21">Large (21x21)</option>
                    <option value="31x31">Extra Large (31x31)</option>
                  </select>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Changes will generate a new maze
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;