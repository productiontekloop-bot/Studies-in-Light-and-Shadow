import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sky, ContactShadows, Environment, Float, PerspectiveCamera, useCursor, MeshReflectorMaterial } from '@react-three/drei';
import { Suspense, useRef, useState, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { ARTWORKS, Artwork } from '../data/artworks';
import { ArtFrame } from './ArtFrame';
import ErrorBoundary from './ErrorBoundary';

export type FloorType = 'oak-parquet';

interface Gallery3DProps {
  onArtworkSelect: (artwork: Artwork | null) => void;
  selectedArtwork: Artwork | null;
  currentRoom: number;
  onRoomChange: (nextRoom: number) => void;
}

function Rig({ selectedArtwork, currentRoom }: { selectedArtwork: Artwork | null; currentRoom: number }) {
  const { gl } = useThree();
  const vec = new THREE.Vector3();
  const lookAtVec = new THREE.Vector3();
  
  // Use useRef instead of useState to avoid high-frequency React re-renders while walking
  const keys = useRef({ w: false, a: false, s: false, d: false });
  const pos = useRef(new THREE.Vector3(0, 1.8, 4));
  
  const targetLookAt = useRef(new THREE.Vector3(0, 1.8, -5));
  const rotation = useRef({ yaw: Math.PI, pitch: 0 }); // Start looking towards center
  const isDragging = useRef(false);

  // Reset position on room change
  useEffect(() => {
    pos.current.set(0, 1.8, 4);
    rotation.current = { yaw: Math.PI, pitch: 0 };
    targetLookAt.current.set(0, 1.8, -5);
  }, [currentRoom]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowleft', 'arrowdown', 'arrowright'].includes(key)) {
        const isUp = key === 'w' || key === 'arrowup';
        const isLeft = key === 'a' || key === 'arrowleft';
        const isDown = key === 's' || key === 'arrowdown';
        const isRight = key === 'd' || key === 'arrowright';

        if (isUp) keys.current.w = true;
        if (isLeft) keys.current.a = true;
        if (isDown) keys.current.s = true;
        if (isRight) keys.current.d = true;
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowleft', 'arrowdown', 'arrowright'].includes(key)) {
        const isUp = key === 'w' || key === 'arrowup';
        const isLeft = key === 'a' || key === 'arrowleft';
        const isDown = key === 's' || key === 'arrowdown';
        const isRight = key === 'd' || key === 'arrowright';

        if (isUp) keys.current.w = false;
        if (isLeft) keys.current.a = false;
        if (isDown) keys.current.s = false;
        if (isRight) keys.current.d = false;
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      // Only drag if clicking the left mouse button on the 3D canvas
      if (e.button === 0) {
        isDragging.current = true;
      }
    };
    const handleMouseUp = () => {
      isDragging.current = false;
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging.current && !selectedArtwork) {
        const sensitivity = 0.002;
        rotation.current.yaw -= e.movementX * sensitivity;
        rotation.current.pitch -= e.movementY * sensitivity;
        rotation.current.pitch = THREE.MathUtils.clamp(rotation.current.pitch, -Math.PI / 3, Math.PI / 3);
      }
    };

    // Touch Support for Mobile / Viewport drag
    let lastTouchX = 0;
    let lastTouchY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1 && !selectedArtwork) {
        lastTouchX = e.touches[0].clientX;
        lastTouchY = e.touches[0].clientY;
        isDragging.current = true;
      }
    };

    const handleTouchEnd = () => {
      isDragging.current = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging.current && !selectedArtwork && e.touches.length === 1) {
        const touch = e.touches[0];
        const deltaX = touch.clientX - lastTouchX;
        const deltaY = touch.clientY - lastTouchY;
        
        const sensitivity = 0.003;
        rotation.current.yaw -= deltaX * sensitivity;
        rotation.current.pitch -= deltaY * sensitivity;
        rotation.current.pitch = THREE.MathUtils.clamp(rotation.current.pitch, -Math.PI / 3, Math.PI / 3);
        
        lastTouchX = touch.clientX;
        lastTouchY = touch.clientY;
      }
    };

    // Attach dragging exclusively to canvas element, while releasing mouse globally
    gl.domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    gl.domElement.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (gl.domElement) {
        gl.domElement.removeEventListener('mousedown', handleMouseDown);
        gl.domElement.removeEventListener('touchstart', handleTouchStart);
      }
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [selectedArtwork, gl]);

  useFrame((state, delta) => {
    if (selectedArtwork) {
      // Zoom into artwork - scale focus distance dynamically on artwork dimensions
      const artRotation = new THREE.Euler(...selectedArtwork.rotation);
      const sizeFactor = Math.max(selectedArtwork.width, selectedArtwork.height);
      const zoomDistance = Math.max(1.8, sizeFactor * 0.75 + 5.3);
      const offset = new THREE.Vector3(0, 0, zoomDistance);
      offset.applyEuler(artRotation);
      
      const artworkPos = new THREE.Vector3(...selectedArtwork.position);
      const camPos = artworkPos.clone().add(offset);
      
      state.camera.position.lerp(camPos, 0.05);
      
      // Look at painting center
      lookAtVec.set(artworkPos.x, artworkPos.y, artworkPos.z);
      targetLookAt.current.lerp(lookAtVec, 0.08);
      state.camera.lookAt(targetLookAt.current);
      
      // Sync internal rotation when an artwork is selected so we look the right way when deselected
      rotation.current.yaw = selectedArtwork.rotation[1] + Math.PI;
      rotation.current.pitch = 0;
    } else {
      // WASD Movement relative to look direction
      const speed = 6;
      let isMoving = false;
      const k = keys.current;
      
      if (k.w || k.s || k.a || k.d) {
        const yaw = rotation.current.yaw;
        const forward = new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw));
        const right = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw));
        
        const direction = new THREE.Vector3();
        if (k.w) direction.add(forward);
        if (k.s) direction.sub(forward);
        if (k.a) direction.add(right);
        if (k.d) direction.sub(right);

        if (direction.length() > 0) {
          direction.normalize().multiplyScalar(speed * delta);
          pos.current.add(direction);
          isMoving = true;
        }
      }
      
      // Boundary checks (for ROOM_SIZE x ROOM_SIZE room)
      const limit = ROOM_SIZE / 2 - 1.5;
      pos.current.x = THREE.MathUtils.clamp(pos.current.x, -limit, limit);
      pos.current.z = THREE.MathUtils.clamp(pos.current.z, -limit, limit);
      
      // Head bobbing
      const bobPath = Math.sin(state.clock.elapsedTime * 8) * 0.012 * (isMoving ? 1 : 0);
      
      state.camera.position.lerp(vec.set(
        pos.current.x, 
        pos.current.y + bobPath, 
        pos.current.z
      ), 0.08);
      
      // Dynamic Look-at based on yaw/pitch
      const radius = 8;
      lookAtVec.set(
        pos.current.x + radius * Math.sin(rotation.current.yaw) * Math.cos(rotation.current.pitch),
        pos.current.y + radius * Math.sin(rotation.current.pitch),
        pos.current.z + radius * Math.cos(rotation.current.yaw) * Math.cos(rotation.current.pitch)
      );

      targetLookAt.current.lerp(lookAtVec, 0.15);
      state.camera.lookAt(targetLookAt.current);
    }
  });
  return null;
}

function CenterSculpture() {
  const coreRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);
  const midRingRef = useRef<THREE.Mesh>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useCursor(hovered);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    const speedMult = hovered ? 2.5 : 1.0;

    if (coreRef.current) {
      coreRef.current.rotation.y = elapsed * 0.5 * speedMult;
      coreRef.current.rotation.x = elapsed * 0.3 * speedMult;
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.x = elapsed * 0.4 * speedMult;
      innerRingRef.current.rotation.y = -elapsed * 0.2 * speedMult;
    }
    if (midRingRef.current) {
      midRingRef.current.rotation.y = elapsed * 0.3 * speedMult;
      midRingRef.current.rotation.z = elapsed * 0.5 * speedMult;
    }
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z = -elapsed * 0.2 * speedMult;
      outerRingRef.current.rotation.x = elapsed * 0.15 * speedMult;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Low-profile Tiered Obsidian & Gold Plinth */}
      <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.8, 1.9, 0.1, 64]} />
        <meshStandardMaterial color="#111111" roughness={0.15} metalness={0.9} />
      </mesh>
      
      {/* Golden Accent Base Ring */}
      <mesh position={[0, 0.11, 0]} castShadow>
        <cylinderGeometry args={[1.65, 1.65, 0.02, 64]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Recessed Glowing Light Well */}
      <mesh position={[0, 0.125, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.2, 1.4, 64]} />
        <meshBasicMaterial 
          color={hovered ? "#00f0ff" : "#a855f7"} 
          side={THREE.DoubleSide}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Central Pedestal Rise */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.6, 0.6, 8]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Golden Pedestal Crown Collar */}
      <mesh position={[0, 0.71, 0]} castShadow>
        <cylinderGeometry args={[0.52, 0.52, 0.04, 32]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.95} roughness={0.05} />
      </mesh>

      {/* Volumetric Holographic Light Pillar */}
      <mesh position={[0, 4.0, 0]}>
        <cylinderGeometry args={[0.08, 0.8, 8.0, 32, 1, true]} />
        <meshBasicMaterial 
          color={hovered ? "#00f0ff" : "#a855f7"} 
          transparent 
          opacity={hovered ? 0.12 : 0.06} 
          side={THREE.DoubleSide} 
          blending={THREE.AdditiveBlending} 
        />
      </mesh>

      {/* The Floating Kinetic Astrolabe Sphere */}
      <Float speed={2.5} rotationIntensity={0.3} floatIntensity={0.2} position={[0, 1.9, 0]}>
        <group 
          onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
          onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
        >
          {/* A. Dynamic Core - Color-shifting Polyhedron */}
          <mesh ref={coreRef} castShadow>
            <icosahedronGeometry args={[0.32, 0]} />
            <meshStandardMaterial 
              color={hovered ? "#00ffff" : "#a855f7"} 
              emissive={hovered ? "#00a3ff" : "#6366f1"}
              emissiveIntensity={hovered ? 2.5 : 1.2}
              roughness={0.1}
              metalness={0.9}
            />
          </mesh>

          {/* Core Mini Wireframe (adds technical/sculptural depth) */}
          <mesh ref={coreRef}>
            <icosahedronGeometry args={[0.35, 0]} />
            <meshBasicMaterial 
              color={hovered ? "#ffffff" : "#d8b4fe"} 
              wireframe 
              transparent 
              opacity={0.3} 
            />
          </mesh>

          {/* B. Inner Astrolabe Ring (Y-axis aligned) */}
          <mesh ref={innerRingRef}>
            <torusGeometry args={[0.55, 0.016, 16, 100]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.1} />
          </mesh>

          {/* C. Middle Astrolabe Ring (Z-axis aligned) */}
          <group ref={midRingRef}>
            <mesh>
              <torusGeometry args={[0.8, 0.02, 16, 100]} />
              <meshStandardMaterial color={hovered ? "#00ffff" : "#ffffff"} metalness={0.95} roughness={0.05} />
            </mesh>
            {/* Small glowing orbiting satellite node */}
            <mesh position={[0.8, 0, 0]}>
              <sphereGeometry args={[0.04, 16, 16]} />
              <meshBasicMaterial color={hovered ? "#00ffff" : "#c084fc"} />
            </mesh>
          </group>

          {/* D. Outer Astrolabe Ring (X-axis aligned) */}
          <group ref={outerRingRef}>
            <mesh>
              <torusGeometry args={[1.1, 0.024, 16, 120]} />
              <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.1} />
            </mesh>
            {/* Multi-satellite node array */}
            <mesh position={[0, 1.1, 0]}>
              <sphereGeometry args={[0.05, 16, 16]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            <mesh position={[0, -1.1, 0]}>
              <sphereGeometry args={[0.05, 16, 16]} />
              <meshBasicMaterial color={hovered ? "#00ffff" : "#c084fc"} />
            </mesh>
          </group>
        </group>
      </Float>

      {/* Internal floor glow revealing the structure */}
      <pointLight 
        position={[0, 0.8, 0]} 
        intensity={hovered ? 3.0 : 1.5} 
        distance={6} 
        color={hovered ? "#00ffff" : "#c084fc"} 
      />

      {/* Overhead high-end framing spotlight */}
      <spotLight
        position={[0, 7.8, 0]}
        target-position={[0, 1.9, 0]}
        intensity={hovered ? 12 : 7}
        angle={0.35}
        penumbra={1}
        distance={11}
        castShadow
        color={hovered ? "#e0f2fe" : "#faf5ff"}
        shadow-bias={-0.00005}
      />
    </group>
  );
}

const ROOM_SIZE = 22;
const ROOM_HEIGHT = 8;

function Room({ currentRoom }: { currentRoom: number }) {
  const wallProps = useMemo(() => {
    return {
      color: "#ffffff",
      roughness: 0.95, 
      metalness: 0.05,
    };
  }, []);

  // Procedurally generate the classic Warm Oak parquet wood texture in-memory.
  const { floorTexture, floorProps } = useMemo(() => {
    const defaultData = {
      floorTexture: null as THREE.Texture | null,
      floorProps: { roughness: 0.55, metalness: 0.08, color: '#a07c57', mirror: 0.15 }
    };
    if (typeof document === 'undefined') return defaultData;

    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (!ctx) return defaultData;

    // Elegant warm classic Oak Chevron/Brick parquet background
    ctx.fillStyle = '#9e7b56';
    ctx.fillRect(0, 0, 1024, 1024);

    // Fine wood grain background noise
    for (let y = 0; y < 1024; y += 4) {
      ctx.fillStyle = `rgba(125, 95, 65, ${0.07 + Math.random() * 0.1})`;
      ctx.fillRect(0, y, 1024, 1 + Math.random() * 2);
    }

    const numRows = 16;
    const rowHeight = 1024 / numRows;
    const numPlanks = 8;
    const plankWidth = 1024 / numPlanks;

    for (let r = 0; r < numRows; r++) {
      const yCoord = r * rowHeight;
      ctx.strokeStyle = '#4e3a26';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, yCoord);
      ctx.lineTo(1024, yCoord);
      ctx.stroke();

      const shiftX = (r % 2) * (plankWidth / 2);
      for (let p = -1; p <= numPlanks; p++) {
        const xCoord = p * plankWidth + shiftX;
        ctx.beginPath();
        ctx.moveTo(xCoord, yCoord);
        ctx.lineTo(xCoord, yCoord + rowHeight);
        ctx.stroke();

        const seed = (r * 13 + p * 23) % 100;
        ctx.fillStyle = `rgba(0, 0, 0, ${(seed % 10) * 0.015})`;
        ctx.fillRect(xCoord + 1, yCoord + 1, plankWidth - 2, rowHeight - 2);

        // Wood grain details
        ctx.strokeStyle = `rgba(50, 30, 10, 0.05)`;
        ctx.lineWidth = 1;
        for (let g = 0; g < 3; g++) {
          const gy = yCoord + 4 + (seed * (g + 1) * 7) % (rowHeight - 8);
          ctx.beginPath();
          ctx.moveTo(xCoord + 4, gy);
          ctx.lineTo(xCoord + plankWidth - 4, gy + (g - 1) * 2);
          ctx.stroke();
        }
      }
    }

    const roughness = 0.55;
    const metalness = 0.08;
    const color = '#a07c57';
    const mirror = 0.15;
    const repeat = 8;

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeat, repeat);
    return { floorTexture: tex, floorProps: { roughness, metalness, color, mirror } };
  }, []);

  return (
    <group>
      {/* Floor with MeshReflectorMaterial for high-end look */}
      <group position={[0, 0, 0]}>
        {/* Base slab featuring luxurious Warm Oak classic parquet wood texture */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
          <planeGeometry args={[ROOM_SIZE + 20, ROOM_SIZE + 20]} />
          <MeshReflectorMaterial
            blur={[200, 50]}
            resolution={1024}
            mixBlur={1}
            mixStrength={1.8}
            roughness={floorProps.roughness}
            depthScale={1.2}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.6}
            color={floorProps.color}
            metalness={floorProps.metalness}
            mirror={floorProps.mirror}
            map={floorTexture || undefined}
          />
        </mesh>
        
        {/* Luxury Concentric Gold Weave Area Rug underneath the central bench */}
        <group position={[0, 0.012, 0]}>
          {/* Main Rug Body */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <ringGeometry args={[0, 3.8]} />
            <meshStandardMaterial 
              color="#eedfc5" 
              roughness={0.8} 
              metalness={0.1} 
            />
          </mesh>
          {/* Elegant Outer Brass Trim */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
            <ringGeometry args={[3.75, 3.8, 64]} />
            <meshStandardMaterial 
              color="#D4AF37" 
              metalness={0.9} 
              roughness={0.1} 
            />
          </mesh>
          {/* Elegant Inner Brass Accent Rings */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
            <ringGeometry args={[2.0, 2.03, 64]} />
            <meshStandardMaterial 
              color="#D4AF37" 
              metalness={0.9} 
              roughness={0.2} 
            />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
            <ringGeometry args={[0.8, 0.82, 64]} />
            <meshStandardMaterial 
              color="#D4AF37" 
              metalness={0.9} 
              roughness={0.2} 
            />
          </mesh>
        </group>
        
        {/* Physical 3D Brass Inlay Joints at main room quadrants (Creates stunning physical shadowing) */}
        {useMemo(() => {
          const lines = [];
          const gridCoords = [-ROOM_SIZE / 2, 0, ROOM_SIZE / 2];
          gridCoords.forEach((coord) => {
            // X-axis Brass bars
            lines.push(
              <mesh key={`grid-brass-3d-x-${coord}`} position={[coord, 0.011, 0]}>
                <boxGeometry args={[0.04, 0.016, ROOM_SIZE + 20]} />
                <meshStandardMaterial color="#D4AF37" metalness={0.95} roughness={0.05} />
              </mesh>
            );
            // Z-axis Brass bars
            lines.push(
              <mesh key={`grid-brass-3d-z-${coord}`} position={[0, 0.011, coord]} rotation={[0, Math.PI / 2, 0]}>
                <boxGeometry args={[0.04, 0.016, ROOM_SIZE + 20]} />
                <meshStandardMaterial color="#D4AF37" metalness={0.95} roughness={0.05} />
              </mesh>
            );
          });
          return lines;
        }, [])}
      </group>

      {/* Decorative Baseboard - Improved with cap */}
      <group>
        {/* North Baseboard */}
        <group position={[0, 0, -ROOM_SIZE / 2 + 0.1]}>
          <mesh position={[0, 0.15, 0]}>
            <boxGeometry args={[ROOM_SIZE, 0.3, 0.1]} />
            <meshStandardMaterial color="#0a0a0a" roughness={0.1} metalness={0.5} />
          </mesh>
          <mesh position={[0, 0.3, 0]}>
            <boxGeometry args={[ROOM_SIZE + 0.1, 0.05, 0.15]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
        
        {/* South Baseboard */}
        <group position={[0, 0, ROOM_SIZE / 2 - 0.1]}>
          <mesh position={[0, 0.15, 0]}>
            <boxGeometry args={[ROOM_SIZE, 0.3, 0.1]} />
            <meshStandardMaterial color="#0a0a0a" roughness={0.1} metalness={0.5} />
          </mesh>
          <mesh position={[0, 0.3, 0]}>
            <boxGeometry args={[ROOM_SIZE + 0.1, 0.05, 0.15]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>

        {/* West Baseboard */}
        <group position={[-ROOM_SIZE / 2 + 0.1, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <mesh position={[0, 0.15, 0]}>
            <boxGeometry args={[ROOM_SIZE, 0.3, 0.1]} />
            <meshStandardMaterial color="#0a0a0a" roughness={0.1} metalness={0.5} />
          </mesh>
          <mesh position={[0, 0.3, 0]}>
            <boxGeometry args={[ROOM_SIZE + 0.1, 0.05, 0.15]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>

        {/* East Baseboard */}
        <group position={[ROOM_SIZE / 2 - 0.1, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <mesh position={[0, 0.15, 0]}>
            <boxGeometry args={[ROOM_SIZE, 0.3, 0.1]} />
            <meshStandardMaterial color="#0a0a0a" roughness={0.1} metalness={0.5} />
          </mesh>
          <mesh position={[0, 0.3, 0]}>
            <boxGeometry args={[ROOM_SIZE + 0.1, 0.05, 0.15]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      </group>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, ROOM_HEIGHT, 0]}>
        <planeGeometry args={[ROOM_SIZE + 20, ROOM_SIZE + 20]} />
        <meshStandardMaterial color="#0a0a0a" roughness={1} />
      </mesh>

      {/* Walls */}
      <group>
        {/* North */}
        <mesh position={[0, ROOM_HEIGHT / 2, -ROOM_SIZE / 2]} receiveShadow>
          <boxGeometry args={[ROOM_SIZE, ROOM_HEIGHT, 0.2]} />
          <meshStandardMaterial {...wallProps} />
        </mesh>
        {/* South */}
        <mesh position={[0, ROOM_HEIGHT / 2, ROOM_SIZE / 2]} receiveShadow>
          <boxGeometry args={[ROOM_SIZE, ROOM_HEIGHT, 0.2]} />
          <meshStandardMaterial {...wallProps} />
        </mesh>
        {/* West */}
        <mesh position={[-ROOM_SIZE / 2, ROOM_HEIGHT / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
          <boxGeometry args={[ROOM_SIZE, ROOM_HEIGHT, 0.2]} />
          <meshStandardMaterial {...wallProps} />
        </mesh>
        {/* East */}
        <mesh position={[ROOM_SIZE / 2, ROOM_HEIGHT / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
          <boxGeometry args={[ROOM_SIZE, ROOM_HEIGHT, 0.2]} />
          <meshStandardMaterial {...wallProps} />
        </mesh>
      </group>

      {/* Dynamic Museum Masterpiece Centerpiece Sculpture */}
      <CenterSculpture />

      {/* Lights */}
      <group>
        <ambientLight intensity={1.3} />
        <directionalLight 
          position={[10, 20, 10]} 
          intensity={1.0} 
          castShadow 
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0001}
        />
        {/* Triple point light array for brilliant, even illumination across the room space */}
        <pointLight position={[0, ROOM_HEIGHT - 1.5, -ROOM_SIZE / 4]} intensity={2.0} distance={70} />
        <pointLight position={[0, ROOM_HEIGHT - 1.5, 0]} intensity={2.0} distance={70} />
        <pointLight position={[0, ROOM_HEIGHT - 1.5, ROOM_SIZE / 4]} intensity={2.0} distance={70} />
      </group>
    </group>
  );
}

export default function Gallery3D({ onArtworkSelect, selectedArtwork, currentRoom, onRoomChange }: Gallery3DProps) {
  return (
    <div className="w-full h-full bg-[#0A0A0A]">
      <Canvas 
        shadows 
        camera={{ position: [0, 1.8, 10], fov: 60 }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#0A0A0A']} />
        
        <Suspense fallback={null}>
          <Room currentRoom={currentRoom} />
          
          <group>
            {ARTWORKS.filter(art => art.room === currentRoom).map((artwork) => (
              <ArtFrame 
                key={artwork.id} 
                artwork={artwork} 
                onClick={onArtworkSelect}
                isActive={selectedArtwork?.id === artwork.id}
              />
            ))}
          </group>
          
          <Rig selectedArtwork={selectedArtwork} currentRoom={currentRoom} />
        </Suspense>
      </Canvas>
    </div>
  );
}

