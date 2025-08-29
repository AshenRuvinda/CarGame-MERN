import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Play, Trophy, LogOut, Gauge } from 'lucide-react';

const Menu = ({ onStartRace, onShowLeaderboard, onExit }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 400 / 300, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(400, 300);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Create a sleek car model
    const carGroup = new THREE.Group();
    
    // Car body
    const bodyGeometry = new THREE.BoxGeometry(2, 0.8, 4);
    const bodyMaterial = new THREE.MeshBasicMaterial({ color: 0xff6b00 });
    const carBody = new THREE.Mesh(bodyGeometry, bodyMaterial);
    carBody.position.y = 0.4;
    carGroup.add(carBody);
    
    // Car roof
    const roofGeometry = new THREE.BoxGeometry(1.5, 0.6, 2);
    const roofMaterial = new THREE.MeshBasicMaterial({ color: 0xff4500 });
    const carRoof = new THREE.Mesh(roofGeometry, roofMaterial);
    carRoof.position.y = 1;
    carGroup.add(carRoof);
    
    // Wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16);
    const wheelMaterial = new THREE.MeshBasicMaterial({ color: 0x333333 });
    
    const wheels = [
      { x: -0.8, y: 0.3, z: 1.2 },
      { x: 0.8, y: 0.3, z: 1.2 },
      { x: -0.8, y: 0.3, z: -1.2 },
      { x: 0.8, y: 0.3, z: -1.2 }
    ];
    
    wheels.forEach(pos => {
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
      wheel.position.set(pos.x, pos.y, pos.z);
      wheel.rotation.z = Math.PI / 2;
      carGroup.add(wheel);
    });

    scene.add(carGroup);
    camera.position.set(3, 3, 6);
    camera.lookAt(carGroup.position);

    const animate = () => {
      requestAnimationFrame(animate);
      carGroup.rotation.y += 0.008;
      carGroup.position.y = Math.sin(Date.now() * 0.002) * 0.2;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-8 gap-4 h-full p-8">
          {[...Array(64)].map((_, i) => (
            <div 
              key={i} 
              className="bg-cyan-400 rounded animate-pulse" 
              style={{ 
                animationDelay: `${i * 50}ms`,
                animationDuration: '2s'
              }}
            ></div>
          ))}
        </div>
      </div>
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Gauge className="w-12 h-12 text-orange-400 mr-3" />
            <h1 className="text-6xl font-black bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
              VELOCITY
            </h1>
            <Gauge className="w-12 h-12 text-orange-400 ml-3" />
          </div>
          <p className="text-xl text-gray-300 tracking-wider">CHAMPIONSHIP EDITION</p>
        </div>

        {/* 3D Car Model */}
        <div className="mb-8 p-4 bg-black bg-opacity-30 rounded-2xl border border-gray-700 shadow-2xl">
          <div ref={mountRef} className="rounded-xl overflow-hidden" />
        </div>

        {/* Menu Buttons */}
        <div className="space-y-4 w-80">
          <button 
            onClick={onStartRace} 
            className="w-full flex items-center justify-center bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/25"
          >
            <Play className="w-6 h-6 mr-3" />
            START RACE
          </button>
          
          <button 
            onClick={onShowLeaderboard} 
            className="w-full flex items-center justify-center bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-yellow-500/25"
          >
            <Trophy className="w-6 h-6 mr-3" />
            LEADERBOARD
          </button>
          
          <button 
            onClick={onExit} 
            className="w-full flex items-center justify-center bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/25"
          >
            <LogOut className="w-6 h-6 mr-3" />
            EXIT
          </button>
        </div>

        {/* Version info */}
        <div className="absolute bottom-4 right-4 text-gray-500 text-sm">
          Version 1.0
        </div>
      </div>
    </div>
  );
};

export default Menu;