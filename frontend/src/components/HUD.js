import React from 'react';

const HUD = ({ speed, lap, time, position }) => {
  return (
    <div className="absolute top-0 left-0 p-4 text-white bg-black bg-opacity-50">
      <p>Speed: {speed.toFixed(0)} km/h</p>
      <p>Lap: {lap}/3</p>
      <p>Time: {time.toFixed(2)} s</p>
      <p>Position: {position}</p>
    </div>
  );
};

export default HUD;
