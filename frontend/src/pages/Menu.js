import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Menu = ({ onStartRace, onShowLeaderboard, onExit }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
    mountRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const car = new THREE.Mesh(geometry, material);
    scene.add(car);

    camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);
      car.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-800 text-white">
      <h1 className="text-4xl mb-8">Main Menu</h1>
      <div ref={mountRef} className="mb-8" />
      <button onClick={onStartRace} className="bg-blue-500 p-4 m-2 rounded">Start Race</button>
      <button onClick={onShowLeaderboard} className="bg-green-500 p-4 m-2 rounded">Leaderboard</button>
      <button onClick={onExit} className="bg-red-500 p-4 m-2 rounded">Exit</button>
    </div>
  );
};

export default Menu;
