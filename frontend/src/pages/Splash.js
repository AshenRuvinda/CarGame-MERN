import React, { useEffect } from 'react';
import { Zap, Play } from 'lucide-react';

const Splash = ({ onContinue }) => {
  useEffect(() => {
    const handleKeyPress = () => onContinue();
    window.addEventListener('keydown', handleKeyPress);
    const timer = setTimeout(onContinue, 5000); // Auto continue after 5s
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      clearTimeout(timer);
    };
  }, [onContinue]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-600 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-cyan-500 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      {/* Main content */}
      <div className="relative z-10 text-center">
        <div className="flex items-center justify-center mb-6">
          <Zap className="w-16 h-16 text-yellow-400 mr-4 animate-spin" />
          <h1 className="text-7xl font-black bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
            VELOCITY
          </h1>
          <Zap className="w-16 h-16 text-yellow-400 ml-4 animate-spin" />
        </div>
        
        <div className="text-2xl font-light text-cyan-300 mb-8 tracking-widest">
          RACING CHAMPIONSHIP
        </div>
        
        <div className="flex items-center justify-center text-lg text-gray-300 animate-bounce">
          <Play className="w-6 h-6 mr-2" />
          Press Any Key to Continue
        </div>
        
        {/* Racing stripes decoration */}
        <div className="absolute -top-4 -left-4 w-2 h-32 bg-gradient-to-b from-yellow-400 to-red-500 rotate-12 opacity-70"></div>
        <div className="absolute -top-2 -right-8 w-2 h-28 bg-gradient-to-b from-cyan-400 to-blue-500 -rotate-12 opacity-70"></div>
      </div>
      
      {/* Bottom decorative elements */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        <div className="w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
        <div className="w-3 h-3 bg-orange-500 rounded-full animate-ping delay-200"></div>
        <div className="w-3 h-3 bg-red-500 rounded-full animate-ping delay-400"></div>
      </div>
    </div>
  );
};

export default Splash;