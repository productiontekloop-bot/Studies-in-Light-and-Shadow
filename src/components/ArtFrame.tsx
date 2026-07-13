import { useCursor, Text } from '@react-three/drei';
import { useState, Suspense, useMemo, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Artwork } from '../data/artworks';
import ErrorBoundary from './ErrorBoundary';

interface ArtFrameProps {
  artwork: Artwork;
  onClick: (artwork: Artwork) => void;
  isActive: boolean;
}

// Seeded pseudo-random generator to ensure absolute determinism for generated paintings
function createSeededRandom(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  }
  return function() {
    h = Math.imul(16807, h) | 0;
    return (Math.abs(h) % 2147483647) / 2147483647;
  };
}

// Generate an elegant, museum-quality programmatic abstract art masterpiece on an HTML Canvas
function createProceduralArtCanvas(artwork: Artwork, width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  // High-resolution source canvas mapped dynamically to physical frame aspect ratio to prevent stretching
  const baseSize = 800;
  canvas.width = baseSize;
  canvas.height = Math.round(baseSize * (height / width));
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // Fully deterministic seed per artwork
  const random = createSeededRandom(artwork.id + artwork.title);
  
  // Choose one of 4 luxury modern art styles based on ID hash
  let styleIndex = 0;
  for (let i = 0; i < artwork.id.length; i++) {
    styleIndex += artwork.id.charCodeAt(i);
  }
  styleIndex = styleIndex % 4;

  const w = canvas.width;
  const h = canvas.height;

  interface Palette {
    bgGrad: [string, string, string];
    shapes: string[];
    accent: string;
    lineColor: string;
  }

  const palettes: Palette[] = [
    // Style 0: Serene Earth & Terracotta Ochre
    {
      bgGrad: ["#f6f1ea", "#ebe3d5", "#ddd4c4"],
      shapes: ["#b44c2f", "#44554a", "#df9e51", "#845c3e"],
      accent: "#e5b95c", // Liquid gold
      lineColor: "rgba(35, 35, 35, 0.35)"
    },
    // Style 1: Midnight Luxury Cobalt & Bronze
    {
      bgGrad: ["#0b1120", "#080d19", "#04060c"],
      shapes: ["#233461", "#423263", "#435d7a", "#1e4466"],
      accent: "#cca43b", // Fine bronze gold
      lineColor: "rgba(255, 255, 255, 0.2)"
    },
    // Style 2: Bauhaus Color Block & Structural Geometry
    {
      bgGrad: ["#f3efe8", "#e4dfd8", "#cecac0"],
      shapes: ["#1c3e75", "#bf3122", "#424242", "#2e4f44"],
      accent: "#ebb308", // Bright cadmium yellow
      lineColor: "rgba(15, 15, 15, 0.65)"
    },
    // Style 3: Ethereal Pastel Rose & Sand
    {
      bgGrad: ["#faf3ef", "#ead9df", "#deccd4"],
      shapes: ["#df9bb6", "#b7a8d8", "#ebd5c1", "#abc6d8"],
      accent: "#f4bf6c", // Luminous amber
      lineColor: "rgba(85, 75, 95, 0.3)"
    }
  ];

  const palette = palettes[styleIndex];

  // 1. Draw smooth gradient background matching organic paper sheets
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, palette.bgGrad[0]);
  grad.addColorStop(0.5, palette.bgGrad[1]);
  grad.addColorStop(1, palette.bgGrad[2]);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Helper to draw soft-edged organic and geometric overlay fields
  const drawComplexShape = (type: number, size: number, color: string) => {
    ctx.fillStyle = color;
    ctx.save();
    
    // Seeded coordinate inside frame viewport margins
    const cx = w * (0.28 + random() * 0.44);
    const cy = h * (0.28 + random() * 0.44);
    
    if (type === 0) {
      // Elegant minimalist circle
      ctx.beginPath();
      ctx.arc(cx, cy, size, 0, Math.PI * 2);
      ctx.fill();
    } else if (type === 1) {
      // Dynamic smooth bezier fluid blob
      ctx.beginPath();
      ctx.moveTo(cx - size, cy);
      ctx.bezierCurveTo(cx - size, cy - size * 1.3, cx + size * 1.3, cy - size, cx + size, cy);
      ctx.bezierCurveTo(cx + size, cy + size * 1.2, cx - size * 1.2, cy + size * 1.3, cx - size, cy);
      ctx.closePath();
      ctx.fill();
    } else {
      // Rotated bento rectangular color plane
      ctx.translate(cx, cy);
      ctx.rotate(random() * Math.PI * 0.4 - Math.PI * 0.2);
      ctx.fillRect(-size, -size * 0.75, size * 2, size * 1.5);
    }
    ctx.restore();
  };

  // 2. Layer multiply-blended organic color planes
  ctx.globalCompositeOperation = "multiply";
  const numShapes = 2 + Math.floor(random() * 2);
  for (let i = 0; i < numShapes; i++) {
    const shapeColor = palette.shapes[i % palette.shapes.length];
    drawComplexShape(
      Math.floor(random() * 3), 
      Math.min(w, h) * (0.16 + random() * 0.16), 
      shapeColor
    );
  }
  ctx.globalCompositeOperation = "source-over";

  // 3. Highlight premium hand-drawn gold foil or copper element
  ctx.save();
  ctx.strokeStyle = palette.accent;
  ctx.shadowColor = "rgba(0,0,0,0.12)";
  ctx.shadowBlur = 10;
  const accentType = Math.floor(random() * 3);
  const ax = w * (0.32 + random() * 0.36);
  const ay = h * (0.32 + random() * 0.36);
  const ar = Math.min(w, h) * (0.12 + random() * 0.16);

  if (accentType === 0) {
    // Interlocking orbital metal rings
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(ax, ay, ar, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(ax + ar * 0.25, ay - ar * 0.15, ar * 0.75, 0, Math.PI * 2);
    ctx.stroke();
  } else if (accentType === 1) {
    // Elegant dynamic linear slashes and orbiting dots
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(ax - ar, ay - ar);
    ctx.lineTo(ax + ar, ay + ar);
    ctx.stroke();
    ctx.fillStyle = palette.accent;
    ctx.beginPath();
    ctx.arc(ax - ar, ay - ar, 6, 0, Math.PI * 2);
    ctx.arc(ax + ar, ay + ar, 6, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Broad sweeping golden frame curvature
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.arc(w/2, h/2, Math.min(w, h) * 0.38, random() * Math.PI, (random() + 0.9) * Math.PI);
    ctx.stroke();
  }
  ctx.restore();

  // 4. Architect fine alignment wireframe lines
  ctx.save();
  ctx.strokeStyle = palette.lineColor;
  ctx.lineWidth = 0.8;
  const lineCount = 1 + Math.floor(random() * 3);
  for (let i = 0; i < lineCount; i++) {
    const ly = h * (0.18 + random() * 0.64);
    ctx.beginPath();
    ctx.moveTo(w * 0.08, ly);
    ctx.lineTo(w * 0.92, ly);
    ctx.stroke();
    
    const lx = w * (0.18 + random() * 0.64);
    ctx.beginPath();
    ctx.moveTo(lx, h * 0.08);
    ctx.lineTo(lx, h * 0.92);
    ctx.stroke();
  }
  ctx.restore();

  // 5. Apply ultra-subtle fabric warp/weft thread rendering filter
  // This produces incredibly premium realistic physical appearance at close angles in 3D
  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;
  const len = data.length;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      const tH = Math.sin(x * 1.6) * 3.5;
      const tV = Math.sin(y * 1.6) * 3.5;
      const noise = tH + tV + (random() * 6 - 3);
      data[idx]     = Math.max(0, Math.min(255, data[idx] + noise));
      data[idx + 1] = Math.max(0, Math.min(255, data[idx + 1] + noise));
      data[idx + 2] = Math.max(0, Math.min(255, data[idx + 2] + noise));
    }
  }
  ctx.putImageData(imgData, 0, 0);

  // 6. Draw clean mounting museum matte paper border & original signature
  ctx.save();
  ctx.strokeStyle = "rgba(0, 0, 0, 0.06)";
  ctx.lineWidth = 14;
  ctx.strokeRect(7, 7, w - 14, h - 14);

  ctx.font = "italic normal 600 11px sans-serif";
  ctx.fillStyle = "rgba(0, 0, 0, 0.32)";
  if (styleIndex === 1) ctx.fillStyle = "rgba(255, 255, 255, 0.32)";
  ctx.textAlign = "right";
  ctx.fillText("Grace R.", w - 24, h - 20);
  ctx.restore();

  return canvas;
}

// Inner mesh that actually loads the texture safely with an asynchronous loader and handles fallback states cleanly
function TexturedArtworkMesh({ 
  artwork, 
  width, 
  height, 
  hovered, 
  isActive, 
  onClick 
}: { 
  artwork: Artwork; 
  width: number; 
  height: number; 
  hovered: boolean; 
  isActive: boolean; 
  onClick: () => void;
}) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [hasError, setHasError] = useState(false);
  const textureRef = useRef<THREE.Texture | null>(null);

  useEffect(() => {
    let active = true;
    setHasError(false);
    setTexture(null);

    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');

    loader.load(
      artwork.imageUrl,
      (tex) => {
        if (!active) {
          tex.dispose();
          return;
        }
        tex.wrapS = THREE.ClampToEdgeWrapping;
        tex.wrapT = THREE.ClampToEdgeWrapping;
        
        // Auto-center the image texture and preserve aspect-ratio (like background-size: cover)
        if (tex.image && typeof tex.image === 'object' && 'width' in tex.image && 'height' in tex.image) {
          const img = tex.image as { width: number; height: number };
          const imageAspect = img.width / img.height;
          const planeAspect = width / height;

          if (imageAspect > planeAspect) {
            // Texture is wider than frame: crop horizontally, keep vertically centered
            tex.repeat.set(planeAspect / imageAspect, 1);
            tex.offset.set((1 - planeAspect / imageAspect) / 2, 0);
          } else {
            // Texture is taller than frame: crop vertically, keep horizontally centered
            tex.repeat.set(1, imageAspect / planeAspect);
            tex.offset.set(0, (1 - imageAspect / planeAspect) / 2);
          }
        }
        
        tex.needsUpdate = true;
        setTexture(tex);
        textureRef.current = tex;
      },
      undefined,
      (err) => {
        // Log gracefully to warn without causing any uncaught exceptions in the iframe/runner console
        console.warn(`Could not load texture asynchronously: ${artwork.imageUrl}. Deploying perfect generative master fallback.`, err);
        if (!active) return;
        setHasError(true);
      }
    );

    return () => {
      active = false;
      if (textureRef.current) {
        textureRef.current.dispose();
        textureRef.current = null;
      }
    };
  }, [artwork.imageUrl, width, height]);

  // If there's an error loading, or if it is currently loading, we display the stunning procedural composition
  if (hasError || !texture) {
    return (
      <FallbackArtworkMesh 
        artwork={artwork}
        width={width}
        height={height}
        onClick={onClick}
      />
    );
  }

  return (
    <mesh 
      position={[0, 0, 0.01]}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      castShadow
      receiveShadow
    >
      <planeGeometry args={[width, height]} />
      <meshStandardMaterial 
        map={texture} 
        emissive={hovered || isActive ? "#222" : "#000"}
        emissiveIntensity={0.5}
        toneMapped={false}
        polygonOffset
        polygonOffsetFactor={-1}
      />
    </mesh>
  );
}

// Gorgeous procedural abstract fallback used during loading AND blockages
function FallbackArtworkMesh({ 
  artwork,
  width, 
  height, 
  onClick 
}: { 
  artwork: Artwork;
  width: number; 
  height: number; 
  onClick: () => void;
}) {
  const texture = useMemo(() => {
    const canvas = createProceduralArtCanvas(artwork, width, height);
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }, [artwork, width, height]);

  useEffect(() => {
    return () => {
      texture.dispose();
    };
  }, [texture]);

  return (
    <mesh 
      position={[0, 0, 0.01]}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      castShadow
      receiveShadow
    >
      <planeGeometry args={[width, height]} />
      <meshStandardMaterial 
        map={texture}
        roughness={0.7}
        metalness={0.15}
        polygonOffset
        polygonOffsetFactor={-1}
      />
    </mesh>
  );
}

export function ArtFrame({ artwork, onClick, isActive }: ArtFrameProps) {
  const [hovered, setHovered] = useState(false);

  useCursor(hovered);

  // Directly leverage the customized sizing loaded from the image configuration
  const width = artwork.width;
  const height = artwork.height;

  return (
    <group 
      position={artwork.position} 
      rotation={artwork.rotation}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
    >
      {/* Frame / Border */}
      <mesh position={[0, 0, -0.05]} castShadow receiveShadow>
        <boxGeometry args={[width + 0.25, height + 0.25, 0.08]} />
        <meshStandardMaterial 
          color="#151515" 
          roughness={0.6} 
          metalness={0.2} 
        />
      </mesh>

      {/* Bottom Label Plaque (Artist, Title, Size) */}
      {!(artwork.isLarge || artwork.id === "1") && (
        <group position={[0, -height / 2 - 0.72, 0.01]}>
          {/* Outer border plate */}
          <mesh position={[0, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.90, 0.80, 0.01]} />
            <meshStandardMaterial color="#444444" roughness={0.5} metalness={0.2} />
          </mesh>
          {/* Inner black plate */}
          <mesh position={[0, 0, 0.006]} castShadow receiveShadow>
            <boxGeometry args={[2.84, 0.74, 0.01]} />
            <meshStandardMaterial color="#050505" roughness={0.8} metalness={0.1} />
          </mesh>
          
          {/* Line 1: Artist Name */}
          <Text
            position={[0, 0.21, 0.012]}
            fontSize={0.10}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
            letterSpacing={0.04}
          >
            Grace Refuerzo 
          </Text>

          {/* Line 2: Product Name (Title) */}
          <Text
            position={[0, 0.01, 0.012]}
            fontSize={0.13}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
          >
            {artwork.title}
          </Text>

          {/* Line 3: Artwork Size */}
          <Text
            position={[0, -0.19, 0.012]}
            fontSize={0.10}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            fontWeight="normal"
          >
            {artwork.size}
          </Text>
        </group>
      )}

      {/* Textured Canvas wrapped in ErrorBoundary + Suspense */}
      <ErrorBoundary fallback={
        <FallbackArtworkMesh 
          artwork={artwork}
          width={width} 
          height={height} 
          onClick={() => onClick(artwork)} 
        />
      }>
        <Suspense fallback={
          <FallbackArtworkMesh 
            artwork={artwork}
            width={width} 
            height={height} 
            onClick={() => onClick(artwork)} 
          />
        }>
          <TexturedArtworkMesh 
            artwork={artwork}
            width={width}
            height={height}
            hovered={hovered}
            isActive={isActive}
            onClick={() => onClick(artwork)}
          />
        </Suspense>
      </ErrorBoundary>

      {/* Focused Spotlight for active/hovered artwork */}
      {(isActive || hovered) && (
        <spotLight
          position={[0, height / 2 + 2.0, 3.5]}
          target-position={[0, 0, 0]}
          intensity={isActive ? 6 : 3}
          angle={0.45}
          penumbra={1}
          distance={15}
          castShadow={isActive}
          color={isActive ? "#ffffff" : "#fff4e6"}
        />
      )}
    </group>
  );
}
