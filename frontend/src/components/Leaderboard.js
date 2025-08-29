import React, { useState, useEffect } from 'react';
import { getScores } from '../utils/api';
import { Trophy, Medal, Award, ArrowLeft, Clock, User, Crown } from 'lucide-react';

const Leaderboard = ({ onBack }) => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      setLoading(true);
      const data = await getScores();
      setScores(data);
      setLoading(false);
    };
    fetchScores();
  }, []);

  const getRankIcon = (rank) => {
    switch(rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Award className="w-6 h-6 text-orange-400" />;
      default: return <Trophy className="w-5 h-5 text-gray-500" />;
    }
  };

  const getRankStyle = (rank) => {
    switch(rank) {
      case 1: return 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-500/50';
      case 2: return 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/50';
      case 3: return 'bg-gradient-to-r from-orange-500/20 to-orange-600/20 border-orange-500/50';
      default: return 'bg-gray-800/30 border-gray-700/50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
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

      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-blue-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Trophy className="w-12 h-12 text-yellow-400 mr-3" />
            <h1 className="text-5xl font-black bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
              LEADERBOARD
            </h1>
            <Trophy className="w-12 h-12 text-yellow-400 ml-3" />
          </div>
          <p className="text-xl text-gray-400">Championship Rankings</p>
        </div>

        {/* Leaderboard Container */}
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-400">Loading results...</p>
            </div>
          ) : (
            <div className="bg-black bg-opacity-50 backdrop-blur-lg border border-gray-600/30 rounded-2xl overflow-hidden">
              {/* Table Header */}
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4 border-b border-gray-700">
                <div className="grid grid-cols-4 gap-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">
                  <div className="flex items-center">
                    <Trophy className="w-4 h-4 mr-2" />
                    Rank
                  </div>
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Driver
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Best Time
                  </div>
                  <div className="flex items-center">
                    <Award className="w-4 h-4 mr-2" />
                    Score
                  </div>
                </div>
              </div>

              {/* Leaderboard Entries */}
              <div className="divide-y divide-gray-700/50">
                {scores.length === 0 ? (
                  <div className="text-center py-12">
                    <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-xl text-gray-500">No records yet</p>
                    <p className="text-gray-600">Be the first to set a record!</p>
                  </div>
                ) : (
                  scores.map((score, index) => {
                    const rank = index + 1;
                    return (
                      <div 
                        key={score._id || index}
                        className={`px-6 py-4 transition-all duration-500 hover:bg-gray-700/30 ${getRankStyle(rank)} border`}
                      >
                        <div className="grid grid-cols-4 gap-4 items-center">
                          {/* Rank */}
                          <div className="flex items-center space-x-3">
                            {getRankIcon(rank)}
                            <span className={`text-2xl font-bold ${rank <= 3 ? 'text-white' : 'text-gray-400'}`}>
                              #{rank}
                            </span>
                          </div>

                          {/* Username */}
                          <div className="font-semibold text-lg text-white">
                            {score.username}
                          </div>

                          {/* Time */}
                          <div className="text-right">
                            <div className="text-xl font-mono text-cyan-400">
                              {score.time.toFixed(2)}s
                            </div>
                          </div>

                          {/* Score/Points */}
                          <div className="text-right">
                            <div className="text-lg font-semibold text-green-400">
                              {Math.max(1000 - Math.floor(score.time * 10), 100)} pts
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <button 
            onClick={onBack} 
            className="flex items-center bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg mx-auto"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;