import React, { useState, useEffect } from 'react';
import { getScores } from '../utils/api';

const Leaderboard = ({ onBack }) => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const fetchScores = async () => {
      const data = await getScores();
      setScores(data);
    };
    fetchScores();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-4xl mb-4">Leaderboard</h1>
      <table className="table-auto">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((score, index) => (
            <tr key={score._id}>
              <td>{index + 1}</td>
              <td>{score.username}</td>
              <td>{score.time.toFixed(2)} s</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={onBack} className="bg-blue-500 p-4 m-2 rounded">Back</button>
    </div>
  );
};

export default Leaderboard;
