import React from 'react';
import MazeSimulation from './components/MazeSimulation';

function App() {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col items-center">
      <header className="w-full py-6 px-4 text-center bg-white dark:bg-slate-800 shadow-md">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
          Maze Algorithm Visualizer
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Compare DFS, BFS, and A* Search algorithms in real-time
        </p>
      </header>
      
      <main className="flex-1 w-full max-w-7xl p-4 md:p-6">
        <MazeSimulation />
      </main>
      
      <footer className="w-full py-4 px-4 text-center text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 shadow-inner">
        <p>Algorithm Visualization Tool &copy; 2025</p>
      </footer>
    </div>
  );
}

export default App;