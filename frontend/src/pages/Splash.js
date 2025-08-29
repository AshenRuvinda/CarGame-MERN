import React, { useEffect } from 'react';

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
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
      <h1 className="text-6xl font-bold animate-bounce">Car Racing Game</h1>
      <p className="mt-4 text-xl">Press Any Key to Continue</p>
    </div>
  );
};

export default Splash;
