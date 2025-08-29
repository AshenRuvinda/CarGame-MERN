import React, { useEffect, useState } from 'react';
import { saveScore } from '../utils/api';
import { Trophy, Clock, Award, Home, BarChart3, Star } from 'lucide-react';

const Results = ({ time, rank, onBackToMenu, onShowLeaderboard }) => {
  const [isAnimated, setIsAnimated] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const username = prompt('Enter your username:') || 'Anonymous';
    saveScore(username, time);
    
    // Trigger animations
    setTimeout(() => setIsAnimated(true), 100);
    if (rank <= 3) {
      setTimeout(() => setShowConfetti(true), 500);
    }
  }, [time, rank]);

  const getRankColor = () => {
    switch(rank) {
      case 1: return 'from-yellow-400 to-yellow-600';
      case 2: return 'from-gray-300 to-gray-500';
      case 3: return 'from-orange-400 to-orange-600';
      default: return 'from-blue-400 to-blue-600';
    }
  };

  const getRankIcon = () => {
    if (rank <= 3) return <Trophy className="w-16 h-16" />;
    return <Award className="w-16 h-16" />;
  };

  const getPerformanceMessage = () => {
    if (rank === 1) return "CHAMPION!";
    if (rank === 2) return "EXCELLENT!";
    if (rank === 3) return "GREAT JOB!";
    return "GOOD RACE!";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white relative overflow-hidden">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: '3s'
              }}
            ></div>
          ))}
        </div>
      )}

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} className="w-full h-full"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        {/* Header */}
        <div className={`text-center mb-8 transform transition-all duration-1000 ${isAnimated ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <h1 className="text-5xl font-black mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            RACE COMPLETE
          </h1>
          <p className="text-xl text-gray-400">Results Summary</p>
        </div>

        {/* Main Results Card */}
        <div className={`bg-black bg-opacity-50 backdrop-blur-lg border border-gray-600/30 rounded-2xl p-8 mb-8 transform transition-all duration-1000 delay-300 ${isAnimated ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
          {/* Rank Display */}
          <div className="text-center mb-6">
            <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br ${getRankColor()} mb-4 transform transition-all duration-500 ${isAnimated ? 'rotate-0' : 'rotate-180'}`}>
              <div className="text-white">
                {getRankIcon()}
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">{getPerformanceMessage()}</h2>
            <p className="text-lg text-gray-300">You finished in position #{rank}</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Race Time */}
            <div className="text-center p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
              <Clock className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{time.toFixed(2)}</div>
              <div className="text-sm text-gray-400 uppercase tracking-wide">Race Time</div>
            </div>

            {/* Final Position */}
            <div className="text-center p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
              <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">#{rank}</div>
              <div className="text-sm text-gray-400 uppercase tracking-wide">Final Position</div>
            </div>
          </div>

          {/* Performance Rating */}
          <div className="text-center mb-6">
            <div className="flex justify-center space-x-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i}
                  className={`w-6 h-6 ${i < (6 - rank) ? 'text-yellow-400 fill-current' : 'text-gray-600'}`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-400">Performance Rating</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={`flex space-x-4 transform transition-all duration-1000 delay-500 ${isAnimated ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <button 
            onClick={onBackToMenu} 
            className="flex items-center bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Menu
          </button>
          
          <button 
            onClick={onShowLeaderboard} 
            className="flex items-center bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
          >
            <BarChart3 className="w-5 h-5 mr-2" />
            View Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;