import React, { useState } from 'react';
import Splash from './pages/Splash';
import Menu from './pages/Menu';
import Game from './pages/Game';
import Results from './pages/Results';
import Leaderboard from './components/Leaderboard';

const App = () => {
  const [currentPage, setCurrentPage] = useState('splash');
  const [raceTime, setRaceTime] = useState(0);
  const [rank, setRank] = useState(1);

  const handleStartRace = () => setCurrentPage('game');
  const handleShowLeaderboard = () => setCurrentPage('leaderboard');
  const handleExit = () => alert('Game Exited');
  const handleGameEnd = (time, playerRank) => {
    setRaceTime(time);
    setRank(playerRank);
    setCurrentPage('results');
  };
  const handleBackToMenu = () => setCurrentPage('menu');

  switch (currentPage) {
    case 'splash':
      return <Splash onContinue={() => setCurrentPage('menu')} />;
    case 'menu':
      return (
        <Menu
          onStartRace={handleStartRace}
          onShowLeaderboard={handleShowLeaderboard}
          onExit={handleExit}
        />
      );
    case 'game':
      return <Game onGameEnd={handleGameEnd} />;
    case 'results':
      return (
        <Results
          time={raceTime}
          rank={rank}
          onBackToMenu={handleBackToMenu}
          onShowLeaderboard={handleShowLeaderboard}
        />
      );
    case 'leaderboard':
      return <Leaderboard onBack={handleBackToMenu} />;
    default:
      return <Splash onContinue={() => setCurrentPage('menu')} />;
  }
};

export default App;
