import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import HUD from './HUD';

const CarGame = ({ onGameEnd }) => {
  const mountRef = useRef(null);
  const [speed, setSpeed] = React.useState(0);
  const [lap, setLap] = React.useState(1);
  const [time, setTime] = React.useState(0);
  const [position, setPosition] = React.useState(1);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Track (simple loop)
    const trackGeometry = new THREE.TorusGeometry(10, 3, 16, 100);
    const trackMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });
    const track = new THREE.Mesh(trackGeometry, trackMaterial);
    scene.add(track);

    // Player car
    const carGeometry = new THREE.BoxGeometry(1, 0.5, 2);
    const carMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const playerCar = new THREE.Mesh(carGeometry, carMaterial);
    playerCar.position.set(0, 0, 0);
    scene.add(playerCar);

    // Bot cars
    const bots = [];
    for (let i = 0; i < 3; i++) {
      const bot = new THREE.Mesh(carGeometry, new THREE.MeshBasicMaterial({ color: 0x0000ff }));
      bot.position.set(i * 2, 0, 0);
      scene.add(bot);
      bots.push(bot);
    }

    camera.position.set(0, 5, 10);
    camera.lookAt(playerCar.position);

    let velocity = 0;
    const acceleration = 0.1;
    const maxSpeed = 5;
    const keys = {};

    const handleKeyDown = (e) => (keys[e.key] = true);
    const handleKeyUp = (e) => (keys[e.key] = false);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    let startTime = Date.now();
    const maxLaps = 3;

    const animate = () => {
      requestAnimationFrame(animate);

      // Player controls
      if (keys['ArrowUp']) velocity = Math.min(velocity + acceleration, maxSpeed);
      if (keys['ArrowDown']) velocity = Math.max(velocity - acceleration, -maxSpeed / 2);
      if (keys['ArrowLeft']) playerCar.rotation.y += 0.05;
      if (keys['ArrowRight']) playerCar.rotation.y -= 0.05;

      const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(playerCar.quaternion);
      playerCar.position.add(direction.multiplyScalar(velocity * 0.1));

      // Bot AI (simple path following)
      bots.forEach((bot, i) => {
        bot.position.x = 10 * Math.sin(Date.now() / 1000 + i);
        bot.position.z = 10 * Math.cos(Date.now() / 1000 + i);
      });

      // Update HUD
      setSpeed(Math.abs(velocity * 10));
      const elapsed = (Date.now() - startTime) / 1000;
      setTime(elapsed);

      // Check laps (simplified: every 30s a lap)
      if (elapsed > lap * 30) setLap(lap + 1);

      // Position (simplified)
      setPosition(1); // Placeholder

      // End game after 3 laps
      if (lap > maxLaps) {
        onGameEnd(elapsed, position);
        return;
      }

      camera.position.copy(playerCar.position.clone().add(new THREE.Vector3(0, 5, 10)));
      camera.lookAt(playerCar.position);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      mountRef.current.removeChild(renderer.domElement);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onGameEnd, lap, position]);

  return (
    <div ref={mountRef} className="relative">
      <HUD speed={speed} lap={lap} time={time} position={position} />
    </div>
  );
};

export default CarGame;
