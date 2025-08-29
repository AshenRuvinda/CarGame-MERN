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
    scene.fog = new THREE.Fog(0x87CEEB, 100, 300); // Sky blue fog for distance
    scene.background = new THREE.Color(0x87CEEB); // Sky blue
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    // Background Music
    const startBackgroundMusic = () => {
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        
        // Create a simple racing beat
        const playBeat = (time) => {
          const freq = 220 + Math.sin(time * 0.5) * 50;
          oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
        };
        
        let beatTime = 0;
        const beatInterval = setInterval(() => {
          beatTime += 0.1;
          playBeat(beatTime);
        }, 100);
        
        oscillator.start();
        
        return () => {
          clearInterval(beatInterval);
          oscillator.stop();
        };
      } catch (e) {
        console.log('Audio not supported');
        return () => {};
      }
    };
    
    const stopMusic = startBackgroundMusic();

    // Realistic Lighting
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.4); // Natural white light
    scene.add(ambientLight);
    
    const sunLight = new THREE.DirectionalLight(0xFDB813, 0.8); // Warm sunlight
    sunLight.position.set(100, 100, 50);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.left = -100;
    sunLight.shadow.camera.right = 100;
    sunLight.shadow.camera.top = 100;
    sunLight.shadow.camera.bottom = -100;
    scene.add(sunLight);

    // Unlimited Straight Road
    const roadSegments = [];
    const segmentLength = 100;
    
    const createRoadSegment = (zPos) => {
      const roadGroup = new THREE.Group();
      
      // Asphalt road
      const roadGeometry = new THREE.PlaneGeometry(16, segmentLength);
      const roadMaterial = new THREE.MeshLambertMaterial({ color: 0x2F2F2F }); // Dark gray asphalt
      const road = new THREE.Mesh(roadGeometry, roadMaterial);
      road.rotation.x = -Math.PI / 2;
      road.position.z = zPos;
      road.receiveShadow = true;
      roadGroup.add(road);
      
      // Yellow center lines
      for (let z = -segmentLength/2; z < segmentLength/2; z += 8) {
        const lineGeometry = new THREE.PlaneGeometry(0.3, 4);
        const lineMaterial = new THREE.MeshBasicMaterial({ color: 0xFFD700 }); // Gold yellow
        const line = new THREE.Mesh(lineGeometry, lineMaterial);
        line.rotation.x = -Math.PI / 2;
        line.position.set(0, 0.01, zPos + z);
        roadGroup.add(line);
      }
      
      // White side lines
      [-8, 8].forEach(x => {
        const sideLineGeometry = new THREE.PlaneGeometry(0.2, segmentLength);
        const sideLineMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
        const sideLine = new THREE.Mesh(sideLineGeometry, sideLineMaterial);
        sideLine.rotation.x = -Math.PI / 2;
        sideLine.position.set(x, 0.01, zPos);
        roadGroup.add(sideLine);
      });
      
      return roadGroup;
    };

    // Create initial road segments
    for (let i = -2; i <= 5; i++) {
      const segment = createRoadSegment(i * segmentLength);
      roadSegments.push({ mesh: segment, zPos: i * segmentLength });
      scene.add(segment);
    }

    // Realistic Ground
    const grassGeometry = new THREE.PlaneGeometry(400, 1000);
    const grassMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 }); // Forest green
    const grass = new THREE.Mesh(grassGeometry, grassMaterial);
    grass.rotation.x = -Math.PI / 2;
    grass.position.y = -0.1;
    grass.receiveShadow = true;
    scene.add(grass);

    // Car creation function
    const createRealisticCar = (bodyColor, roofColor) => {
      const carGroup = new THREE.Group();
      
      // Main body
      const bodyGeometry = new THREE.BoxGeometry(1.8, 0.6, 4);
      const bodyMaterial = new THREE.MeshLambertMaterial({ color: bodyColor });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.position.y = 0.7;
      body.castShadow = true;
      carGroup.add(body);
      
      // Roof
      const roofGeometry = new THREE.BoxGeometry(1.6, 0.5, 2.2);
      const roofMaterial = new THREE.MeshLambertMaterial({ color: roofColor });
      const roof = new THREE.Mesh(roofGeometry, roofMaterial);
      roof.position.y = 1.2;
      roof.position.z = 0.2;
      roof.castShadow = true;
      carGroup.add(roof);
      
      // Windshield and windows
      const windowGeometry = new THREE.PlaneGeometry(1.4, 0.4);
      const windowMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x4169E1, 
        opacity: 0.3, 
        transparent: true 
      });
      
      // Front windshield
      const frontWindow = new THREE.Mesh(windowGeometry, windowMaterial);
      frontWindow.position.set(0, 1.3, 1.3);
      frontWindow.rotation.x = -0.2;
      carGroup.add(frontWindow);
      
      // Wheels
      const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 12);
      const tireGeometry = new THREE.CylinderGeometry(0.35, 0.35, 0.35, 12);
      const wheelMaterial = new THREE.MeshLambertMaterial({ color: 0x2F4F4F }); // Dark slate gray
      const tireMaterial = new THREE.MeshLambertMaterial({ color: 0x1C1C1C }); // Almost black
      
      const wheelPositions = [
        { x: -0.9, y: 0.4, z: 1.3 },
        { x: 0.9, y: 0.4, z: 1.3 },
        { x: -0.9, y: 0.4, z: -1.3 },
        { x: 0.9, y: 0.4, z: -1.3 }
      ];
      
      wheelPositions.forEach(pos => {
        // Rim
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.position.set(pos.x, pos.y, pos.z);
        wheel.rotation.z = Math.PI / 2;
        wheel.castShadow = true;
        carGroup.add(wheel);
        
        // Tire
        const tire = new THREE.Mesh(tireGeometry, tireMaterial);
        tire.position.set(pos.x, pos.y, pos.z);
        tire.rotation.z = Math.PI / 2;
        tire.castShadow = true;
        carGroup.add(tire);
      });
      
      return carGroup;
    };

    // Player car
    const playerCar = createRealisticCar(0xDC143C, 0x8B0000); // Crimson and dark red
    playerCar.position.set(0, 0, 0);
    scene.add(playerCar);

    // Bot cars array
    const bots = [];
    
    // Function to spawn random bot car
    const spawnBotCar = () => {
      if (bots.length >= 8) return; // Limit number of bots
      
      const colors = [
        { body: 0x000080, roof: 0x000060 }, // Navy blue
        { body: 0x008000, roof: 0x006400 }, // Green
        { body: 0x800080, roof: 0x4B0082 }, // Purple
        { body: 0xFF4500, roof: 0xCD4F39 }, // Orange red
        { body: 0x2F4F4F, roof: 0x708090 }, // Dark slate gray
        { body: 0x8B4513, roof: 0x654321 }, // Saddle brown
        { body: 0x4682B4, roof: 0x1E90FF }  // Steel blue
      ];
      
      const colorSet = colors[Math.floor(Math.random() * colors.length)];
      const botCar = createRealisticCar(colorSet.body, colorSet.roof);
      
      const lanes = [-6, -3, 0, 3, 6];
      const lane = lanes[Math.floor(Math.random() * lanes.length)];
      
      botCar.position.set(
        lane, 
        0, 
        playerCar.position.z + 50 + Math.random() * 100
      );
      
      const bot = {
        car: botCar,
        lane: lane,
        baseSpeed: 0.12 + Math.random() * 0.08,
        targetLane: lane,
        laneChangeTime: 0
      };
      
      bots.push(bot);
      scene.add(botCar);
    };

    // Realistic Environment
    const environmentObjects = [];
    
    // Create realistic tree
    const createTree = () => {
      const tree = new THREE.Group();
      
      // Brown trunk
      const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.5, 5);
      const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 }); // Saddle brown
      const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
      trunk.position.y = 2.5;
      trunk.castShadow = true;
      tree.add(trunk);
      
      // Green leaves
      const leavesGeometry = new THREE.SphereGeometry(2.8, 8, 8);
      const leavesMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 }); // Forest green
      const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
      leaves.position.y = 6;
      leaves.castShadow = true;
      tree.add(leaves);
      
      // Random scale variation
      const scale = 0.8 + Math.random() * 0.6;
      tree.scale.set(scale, scale, scale);
      
      return tree;
    };

    // Create realistic building
    const createBuilding = () => {
      const building = new THREE.Group();
      
      const height = 12 + Math.random() * 25;
      const width = 8 + Math.random() * 8;
      const depth = 8 + Math.random() * 8;
      
      // Building colors - realistic concrete/brick
      const buildingColors = [0x696969, 0x708090, 0xA0522D, 0x8B4513, 0x556B2F];
      const buildingColor = buildingColors[Math.floor(Math.random() * buildingColors.length)];
      
      const buildingGeometry = new THREE.BoxGeometry(width, height, depth);
      const buildingMaterial = new THREE.MeshLambertMaterial({ color: buildingColor });
      const buildingMesh = new THREE.Mesh(buildingGeometry, buildingMaterial);
      buildingMesh.position.y = height / 2;
      buildingMesh.castShadow = true;
      building.add(buildingMesh);
      
      // Windows with realistic spacing
      const windowsPerFloor = Math.floor(width / 2);
      const floors = Math.floor(height / 3);
      
      for (let floor = 1; floor < floors; floor++) {
        for (let w = 0; w < windowsPerFloor; w++) {
          const windowGeometry = new THREE.PlaneGeometry(0.8, 1.2);
          const isLit = Math.random() > 0.6;
          const windowMaterial = new THREE.MeshBasicMaterial({ 
            color: isLit ? 0xFFFFAA : 0x404040 // Warm light or dark
          });
          
          const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
          windowMesh.position.set(
            -width/2 + (w + 0.5) * (width / windowsPerFloor),
            floor * 3,
            depth/2 + 0.02
          );
          building.add(windowMesh);
        }
      }
      
      return building;
    };

    // Create street lamp
    const createStreetLamp = () => {
      const lamp = new THREE.Group();
      
      // Pole
      const poleGeometry = new THREE.CylinderGeometry(0.1, 0.12, 8);
      const poleMaterial = new THREE.MeshLambertMaterial({ color: 0x2F2F2F }); // Dark gray
      const pole = new THREE.Mesh(poleGeometry, poleMaterial);
      pole.position.y = 4;
      pole.castShadow = true;
      lamp.add(pole);
      
      // Light
      const lightGeometry = new THREE.SphereGeometry(0.3, 8, 8);
      const lightMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFAA }); // Warm white
      const light = new THREE.Mesh(lightGeometry, lightMaterial);
      light.position.y = 7.5;
      lamp.add(light);
      
      return lamp;
    };

    // Create car creation function
    const createCar = (bodyColor, roofColor) => {
      const carGroup = new THREE.Group();
      
      // Main body
      const bodyGeometry = new THREE.BoxGeometry(1.8, 0.7, 4.2);
      const bodyMaterial = new THREE.MeshLambertMaterial({ color: bodyColor });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.position.y = 0.8;
      body.castShadow = true;
      carGroup.add(body);
      
      // Roof
      const roofGeometry = new THREE.BoxGeometry(1.6, 0.5, 2.5);
      const roofMaterial = new THREE.MeshLambertMaterial({ color: roofColor });
      const roof = new THREE.Mesh(roofGeometry, roofMaterial);
      roof.position.y = 1.4;
      roof.position.z = 0.3;
      roof.castShadow = true;
      carGroup.add(roof);
      
      // Windshield
      const windshieldGeometry = new THREE.PlaneGeometry(1.4, 0.4);
      const windshieldMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x87CEEB, 
        opacity: 0.4, 
        transparent: true 
      });
      const windshield = new THREE.Mesh(windshieldGeometry, windshieldMaterial);
      windshield.position.set(0, 1.5, 1.4);
      windshield.rotation.x = -0.3;
      carGroup.add(windshield);
      
      // Wheels
      const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 16);
      const wheelMaterial = new THREE.MeshLambertMaterial({ color: 0x2F2F2F });
      
      const tireGeometry = new THREE.TorusGeometry(0.4, 0.15, 8, 16);
      const tireMaterial = new THREE.MeshLambertMaterial({ color: 0x1C1C1C });
      
      const wheelPositions = [
        { x: -0.9, y: 0.4, z: 1.4 },
        { x: 0.9, y: 0.4, z: 1.4 },
        { x: -0.9, y: 0.4, z: -1.4 },
        { x: 0.9, y: 0.4, z: -1.4 }
      ];
      
      wheelPositions.forEach(pos => {
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.position.set(pos.x, pos.y, pos.z);
        wheel.rotation.z = Math.PI / 2;
        wheel.castShadow = true;
        carGroup.add(wheel);
        
        const tire = new THREE.Mesh(tireGeometry, tireMaterial);
        tire.position.set(pos.x, pos.y, pos.z);
        tire.rotation.y = Math.PI / 2;
        tire.castShadow = true;
        carGroup.add(tire);
      });
      
      // Bounding box for collision detection
      const box = new THREE.Box3().setFromObject(carGroup);
      carGroup.userData.boundingBox = box;
      
      return carGroup;
    };

    // Player car
    const playerCar = createCar(0xFF0000, 0x8B0000); // Red car
    playerCar.position.set(0, 0, 0);
    scene.add(playerCar);

    // Game variables
    let gameEnded = false;
    let playerSpeed = 0;
    let playerX = 0;
    let playerZ = 0;
    let totalDistance = 0;
    const maxSpeed = 1.2;
    const acceleration = 0.012;
    const keys = {};
    let startTime = Date.now();
    let lastBotSpawn = 0;
    let environmentSpawnZ = 0;

    const handleKeyDown = (e) => (keys[e.key] = true);
    const handleKeyUp = (e) => (keys[e.key] = false);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Collision detection
    const checkCollisions = () => {
      const playerBox = new THREE.Box3().setFromObject(playerCar);
      
      return bots.some(bot => {
        const botBox = new THREE.Box3().setFromObject(bot.car);
        return playerBox.intersectsBox(botBox);
      });
    };

    // Bot spawning
    const spawnRandomBot = () => {
      if (Date.now() - lastBotSpawn < 2000 + Math.random() * 3000) return;
      
      const carColors = [
        { body: 0x000080, roof: 0x191970 }, // Navy blue
        { body: 0x008000, roof: 0x006400 }, // Green
        { body: 0xFFD700, roof: 0xDAA520 }, // Gold
        { body: 0x4B0082, roof: 0x301934 }, // Indigo
        { body: 0xFF4500, roof: 0xCD4F39 }, // Orange
        { body: 0x2F4F4F, roof: 0x696969 }, // Dark slate gray
        { body: 0xFFFFFF, roof: 0xC0C0C0 }, // White
        { body: 0x000000, roof: 0x2F2F2F }  // Black
      ];
      
      const colorSet = carColors[Math.floor(Math.random() * carColors.length)];
      const botCar = createCar(colorSet.body, colorSet.roof);
      
      const lanes = [-6, -3, 0, 3, 6];
      const spawnLane = lanes[Math.floor(Math.random() * lanes.length)];
      
      // Spawn either ahead or behind
      const spawnDistance = Math.random() > 0.5 ? 
        playerZ + 30 + Math.random() * 50 : // Ahead
        playerZ - 30 - Math.random() * 30;  // Behind
      
      botCar.position.set(spawnLane, 0, spawnDistance);
      
      const bot = {
        car: botCar,
        speed: 0.8 + Math.random() * 0.6,
        lane: spawnLane,
        targetLane: spawnLane
      };
      
      bots.push(bot);
      scene.add(botCar);
      lastBotSpawn = Date.now();
    };

    // Environment spawning
    const spawnEnvironment = () => {
      while (environmentSpawnZ < playerZ + 200) {
        const side = Math.random() > 0.5 ? -1 : 1;
        const distance = 25 + Math.random() * 40;
        
        let obj;
        const rand = Math.random();
        if (rand < 0.4) {
          obj = createTree();
        } else if (rand < 0.7) {
          obj = createBuilding();
        } else {
          obj = createStreetLamp();
        }
        
        obj.position.set(
          side * distance,
          0,
          environmentSpawnZ
        );
        obj.rotation.y = Math.random() * Math.PI * 2;
        
        scene.add(obj);
        environmentObjects.push(obj);
        environmentSpawnZ += 15 + Math.random() * 25;
      }
    };

    const animate = () => {
      if (gameEnded) return;
      requestAnimationFrame(animate);

      // Player controls (NOT inverted)
      if (keys['ArrowUp'] || keys['w']) {
        playerSpeed = Math.min(playerSpeed + acceleration, maxSpeed);
      }
      if (keys['ArrowDown'] || keys['s']) {
        playerSpeed = Math.max(playerSpeed - acceleration * 1.5, -maxSpeed * 0.3);
      }
      if (!keys['ArrowUp'] && !keys['w'] && !keys['ArrowDown'] && !keys['s']) {
        playerSpeed *= 0.98;
      }
      
      // Steering
      if (keys['ArrowLeft'] || keys['a']) {
        playerX = Math.max(playerX - 0.15, -7);
        playerCar.rotation.y = 0.1;
        playerCar.rotation.z = 0.05;
      } else if (keys['ArrowRight'] || keys['d']) {
        playerX = Math.min(playerX + 0.15, 7);
        playerCar.rotation.y = -0.1;
        playerCar.rotation.z = -0.05;
      } else {
        playerCar.rotation.y *= 0.9;
        playerCar.rotation.z *= 0.9;
      }

      // Update player position
      playerZ += playerSpeed;
      totalDistance += Math.abs(playerSpeed);
      playerCar.position.x = playerX;
      playerCar.position.z = playerZ;

      // Update road segments for unlimited road
      roadSegments.forEach(segment => {
        if (segment.zPos < playerZ - segmentLength * 2) {
          segment.zPos += segmentLength * roadSegments.length;
          segment.mesh.position.z = segment.zPos;
        }
      });

      // Spawn bots and environment
      spawnRandomBot();
      spawnEnvironment();

      // Update bot cars
      bots.forEach((bot, index) => {
        bot.car.position.z -= bot.speed;
        
        // Remove bots that are too far behind
        if (bot.car.position.z < playerZ - 100) {
          scene.remove(bot.car);
          bots.splice(index, 1);
        }
      });

      // Clean up distant environment objects
      environmentObjects.forEach((obj, index) => {
        if (obj.position.z < playerZ - 150) {
          scene.remove(obj);
          environmentObjects.splice(index, 1);
        }
      });

      // Collision detection
      if (checkCollisions()) {
        gameEnded = true;
        const elapsed = (Date.now() - startTime) / 1000;
        alert('CRASH! Race ended due to collision.');
        onGameEnd(elapsed, 4); // Poor finishing position due to crash
        stopMusic();
        return;
      }

      // 3rd person camera
      const cameraDistance = 12;
      const cameraHeight = 6;
      const targetCameraPos = new THREE.Vector3(
        playerX,
        cameraHeight,
        playerZ - cameraDistance
      );
      
      camera.position.lerp(targetCameraPos, 0.1);
      camera.lookAt(playerX, 2, playerZ + 10);

      // Calculate position
      let currentPosition = 1;
      bots.forEach(bot => {
        if (bot.car.position.z > playerZ) {
          currentPosition++;
        }
      });

      // Update HUD
      setSpeed(Math.abs(playerSpeed * 180));
      const elapsed = (Date.now() - startTime) / 1000;
      setTime(elapsed);
      setPosition(currentPosition);
      
      // Update lap based on distance (every 100 units = 1 lap)
      const currentLap = Math.floor(totalDistance / 100) + 1;
      setLap(Math.min(currentLap, 3));
      
      // End race after sufficient distance and time
      if (totalDistance > 300 && elapsed > 30) {
        gameEnded = true;
        onGameEnd(elapsed, currentPosition);
        stopMusic();
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
      gameEnded = true;
      stopMusic();
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [onGameEnd]);

  return (
    <div ref={mountRef} className="relative">
      <HUD speed={speed} lap={lap} time={time} position={position} />
    </div>
  );
};

export default CarGame;