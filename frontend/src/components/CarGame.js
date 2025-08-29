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
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb); // Sky blue background
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    // Enhanced Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 50, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Enhanced Track
    const trackGeometry = new THREE.TorusGeometry(15, 4, 16, 100);
    const trackMaterial = new THREE.MeshLambertMaterial({ color: 0x2c2c2c });
    const track = new THREE.Mesh(trackGeometry, trackMaterial);
    track.rotation.x = -Math.PI / 2;
    track.receiveShadow = true;
    scene.add(track);

    // Track borders
    const innerBorderGeometry = new THREE.TorusGeometry(11, 0.2, 8, 100);
    const outerBorderGeometry = new THREE.TorusGeometry(19, 0.2, 8, 100);
    const borderMaterial = new THREE.MeshBasicMaterial({ color: 0xff4444 });
    
    const innerBorder = new THREE.Mesh(innerBorderGeometry, borderMaterial);
    const outerBorder = new THREE.Mesh(outerBorderGeometry, borderMaterial);
    innerBorder.rotation.x = outerBorder.rotation.x = -Math.PI / 2;
    scene.add(innerBorder);
    scene.add(outerBorder);

    // Ground plane
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x228b22 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.5;
    ground.receiveShadow = true;
    scene.add(ground);

    // Enhanced Player car
    const carGroup = new THREE.Group();
    
    // Car body
    const carGeometry = new THREE.BoxGeometry(1.2, 0.6, 2.5);
    const carMaterial = new THREE.MeshLambertMaterial({ color: 0xff1a1a });
    const playerCar = new THREE.Mesh(carGeometry, carMaterial);
    playerCar.position.y = 0.3;
    playerCar.castShadow = true;
    carGroup.add(playerCar);

    // Car roof
    const roofGeometry = new THREE.BoxGeometry(0.8, 0.4, 1.5);
    const roofMaterial = new THREE.MeshLambertMaterial({ color: 0xcc0000 });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = 0.8;
    roof.castShadow = true;
    carGroup.add(roof);

    // Wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 12);
    const wheelMaterial = new THREE.MeshLambertMaterial({ color: 0x1a1a1a });
    
    const wheelPositions = [
      { x: -0.6, y: 0.3, z: 0.8 },
      { x: 0.6, y: 0.3, z: 0.8 },
      { x: -0.6, y: 0.3, z: -0.8 },
      { x: 0.6, y: 0.3, z: -0.8 }
    ];
    
    wheelPositions.forEach(pos => {
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
      wheel.position.set(pos.x, pos.y, pos.z);
      wheel.rotation.z = Math.PI / 2;
      wheel.castShadow = true;
      carGroup.add(wheel);
    });

    carGroup.position.set(15, 0, 0);
    scene.add(carGroup);

    // Enhanced Bot cars
    const bots = [];
    const botColors = [0x0066ff, 0x00ff66, 0xff6600];
    for (let i = 0; i < 3; i++) {
      const botGroup = new THREE.Group();
      
      const botBody = new THREE.Mesh(carGeometry, new THREE.MeshLambertMaterial({ color: botColors[i] }));
      botBody.position.y = 0.3;
      botBody.castShadow = true;
      botGroup.add(botBody);
      
      const botRoof = new THREE.Mesh(roofGeometry, new THREE.MeshLambertMaterial({ color: botColors[i] * 0.8 }));
      botRoof.position.y = 0.8;
      botRoof.castShadow = true;
      botGroup.add(botRoof);
      
      wheelPositions.forEach(pos => {
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.position.set(pos.x, pos.y, pos.z);
        wheel.rotation.z = Math.PI / 2;
        wheel.castShadow = true;
        botGroup.add(wheel);
      });

      botGroup.position.set(15, 0, (i + 1) * 2);
      scene.add(botGroup);
      bots.push({ group: botGroup, angle: (i + 1) * Math.PI / 2 });
    }

    // Camera setup
    camera.position.set(0, 8, 15);
    camera.lookAt(carGroup.position);

    let velocity = 0;
    let angle = 0;
    const acceleration = 0.1;
    const maxSpeed = 8;
    const keys = {};

    const handleKeyDown = (e) => (keys[e.key] = true);
    const handleKeyUp = (e) => (keys[e.key] = false);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    let startTime = Date.now();
    const maxLaps = 3;
    let lastAngle = 0;

    const animate = () => {
      requestAnimationFrame(animate);

      // Enhanced player controls
      if (keys['ArrowUp'] || keys['w']) velocity = Math.min(velocity + acceleration, maxSpeed);
      if (keys['ArrowDown'] || keys['s']) velocity = Math.max(velocity - acceleration * 2, -maxSpeed / 2);
      if (!keys['ArrowUp'] && !keys['w'] && !keys['ArrowDown'] && !keys['s']) {
        velocity *= 0.95; // Natural deceleration
      }
      
      if (keys['ArrowLeft'] || keys['a']) angle += 0.03 * (velocity / maxSpeed);
      if (keys['ArrowRight'] || keys['d']) angle -= 0.03 * (velocity / maxSpeed);

      // Update car position on circular track
      const radius = 15;
      carGroup.position.x = Math.cos(angle) * radius;
      carGroup.position.z = Math.sin(angle) * radius;
      carGroup.rotation.y = -angle + Math.PI / 2;

      // Enhanced bot movement
      bots.forEach((bot, i) => {
        bot.angle += 0.015 + (i * 0.002);
        bot.group.position.x = Math.cos(bot.angle) * radius;
        bot.group.position.z = Math.sin(bot.angle) * radius;
        bot.group.rotation.y = -bot.angle + Math.PI / 2;
      });

      // Lap detection
      if (angle > lastAngle + Math.PI * 2) {
        setLap(prev => prev + 1);
        lastAngle = angle;
      }

      // Update camera to follow car smoothly
      const cameraOffset = new THREE.Vector3(
        Math.cos(angle + Math.PI) * 12,
        6,
        Math.sin(angle + Math.PI) * 12
      );
      camera.position.copy(carGroup.position.clone().add(cameraOffset));
      camera.lookAt(carGroup.position);

      // Update HUD values
      setSpeed(Math.abs(velocity * 15));
      const elapsed = (Date.now() - startTime) / 1000;
      setTime(elapsed);

      // Calculate position based on lap progress
      const lapProgress = (angle % (Math.PI * 2)) / (Math.PI * 2);
      let currentPosition = 1;
      bots.forEach(bot => {
        const botProgress = (bot.angle % (Math.PI * 2)) / (Math.PI * 2);
        if (botProgress > lapProgress) currentPosition++;
      });
      setPosition(currentPosition);

      // End game after 3 laps
      if (lap > maxLaps) {
        onGameEnd(elapsed, position);
        return;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [onGameEnd, lap, position]);

  return (
    <div ref={mountRef} className="relative">
      <HUD speed={speed} lap={lap} time={time} position={position} />
    </div>
  );
};

export default CarGame;