import React, { useEffect } from 'react';
import { saveScore } from '../utils/api';

const Results = ({ time, rank, onBackToMenu, onShowLeaderboard }) => {
  useEffect(() => {
    const username = prompt('Enter your username:') || 'Anonymous';
    saveScore(username, time);
  }, [time]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-4xl mb-4">Race Results</h1>
      <p className="text-2xl">Your Time: {time.toFixed(2)} seconds</p>
      <p className="text-2xl">Your Rank: {rank}</p>
      <button onClick={onBackToMenu} className="bg-blue-500 p-4 m-2 rounded">Back to Menu</button>
      <button onClick={onShowLeaderboard} className="bg-green-500 p-4 m-2 rounded">View Leaderboard</button>
    </div>
  );
};

export default Results;
