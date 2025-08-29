import React from 'react';
import CarGame from '../components/CarGame';

const Game = ({ onGameEnd }) => {
  return <CarGame onGameEnd={onGameEnd} />;
};

export default Game;
