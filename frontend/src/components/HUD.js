import React from 'react';
import { Gauge, Clock, Trophy, Zap } from 'lucide-react';

const HUD = ({ speed, lap, time, position }) => {
  const speedPercentage = Math.min((speed / 200) * 100, 100);
  
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top HUD Bar */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
        {/* Left Panel - Speed & Position */}
        <div className="bg-black bg-opacity-80 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-4 space-y-3">
          {/* Speedometer */}
          <div className="flex items-center space-x-3">
            <Gauge className="w-8 h-8 text-cyan-400" />
            <div>
              <div className="text-3xl font-bold text-white">{speed.toFixed(0)}</div>
              <div className="text-xs text-cyan-300 uppercase tracking-wider">KM/H</div>
            </div>
          </div>
          
          {/* Speed Bar */}
          <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 transition-all duration-200 ease-out"
              style={{ width: `${speedPercentage}%` }}
            ></div>
          </div>
          
          {/* Position */}
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="text-lg font-semibold text-white">#{position}</span>
          </div>
        </div>

        {/* Right Panel - Lap & Time */}
        <div className="bg-black bg-opacity-80 backdrop-blur-sm border border-orange-500/30 rounded-xl p-4 space-y-3">
          {/* Lap Counter */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <Zap className="w-5 h-5 text-orange-400" />
              <span className="text-sm text-orange-300 uppercase tracking-wider">Lap</span>
            </div>
            <div className="text-2xl font-bold text-white">{lap}/3</div>
          </div>
          
          {/* Lap Progress */}
          <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden mx-auto">
            <div 
              className="h-full bg-gradient-to-r from-orange-400 to-red-500 transition-all duration-300"
              style={{ width: `${((lap - 1) / 3) * 100}%` }}
            ></div>
          </div>
          
          {/* Race Time */}
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-green-400" />
            <span className="text-lg font-mono text-white">{time.toFixed(2)}s</span>
          </div>
        </div>
      </div>

      {/* Bottom Controls Hint */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="bg-black bg-opacity-80 backdrop-blur-sm border border-gray-600/30 rounded-lg px-6 py-3">
          <div className="flex items-center space-x-6 text-sm text-gray-300">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-6 bg-gray-700 rounded text-center text-xs flex items-center justify-center">↑</div>
              <span>Accelerate</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-6 bg-gray-700 rounded text-center text-xs flex items-center justify-center">↓</div>
              <span>Brake</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-6 bg-gray-700 rounded text-center text-xs flex items-center justify-center">←→</div>
              <span>Steer</span>
            </div>
          </div>
        </div>
      </div>

      {/* Racing line indicators */}
      <div className="absolute top-1/2 left-8 transform -translate-y-1/2">
        <div className="flex flex-col space-y-2">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i}
              className="w-1 h-8 bg-gradient-to-b from-cyan-500 to-transparent animate-pulse"
              style={{ animationDelay: `${i * 200}ms` }}
            ></div>
          ))}
        </div>
      </div>
      
      <div className="absolute top-1/2 right-8 transform -translate-y-1/2">
        <div className="flex flex-col space-y-2">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i}
              className="w-1 h-8 bg-gradient-to-b from-orange-500 to-transparent animate-pulse"
              style={{ animationDelay: `${i * 200}ms` }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HUD;