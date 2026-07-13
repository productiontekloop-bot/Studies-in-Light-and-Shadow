import { GALLERY_IMAGES, ImageArtwork } from './images';

export interface Artwork extends ImageArtwork {
  position: [number, number, number];
  rotation: [number, number, number];
  room: number;
  width: number;
  height: number;
}

// Global aesthetic mapping to ultra-reliable Unsplash fine art photos to prevent picsum.photos rate-limiting/CORS blocks
const UNSPLASH_IMAGES: Record<string, string> = {
  "1": "photo-1541701494587-cb58502866ab", // Majestic vertical abstract
  "2": "photo-1579783900882-c0d3dad7b119", // Classical botanical floral
  "3": "photo-1579783902614-a3fb3927b6a5", // Expressionistic oil portrait
  "4": "photo-1605721911519-3dfeb3be25e7", // Abstract shapes & paint block
  "5": "photo-1547891654-e66ed7edd96c", // Fluid acrylic ocean blue & gold
  "6": "photo-1549887534-1541e9326642", // Elegant textured vertical gold
  "7": "photo-1549490349-8643362247b5", // Textured gold wall sculpture
  "8": "photo-1501472312651-726afd116ff1", // Pollock style paint splatter
  "9": "photo-1579783928621-7a13d66a6211", // Colorful portrait painting
  "10": "photo-1578301978693-85fa9c0320b9", // Renaissance master oil portrait
  "11": "photo-1536924940846-227afb31e2a5", // Soft pastel brush strokes
  "12": "photo-1518895949257-7621c3c786d7", // Contemporary abstract red spline
  "13": "photo-1579783901586-d88db74b4fe4", // Palette knife painting
  "14": "photo-1549887552-cb1071d3e5ca", // Fluid color waves
  "15": "photo-1580136579312-94651dfd596d", // Academic oil landscape fields
  "16": "photo-1579783923564-9646487e4125", // Vibrant art composition
  "17": "photo-1618005182384-a83a8bd57fbe", // Liquid color flow art
  "18": "photo-1543857778-c4a1a3e0b2eb", // Modern urban graffiti art
  "19": "photo-1618005198143-e52e828a2a78", // Polished gold-veined marble
  "20": "photo-1579546929518-9e396f3cc809", // Warm pastel paint blend
  "21": "photo-1541963463532-d68292c34b19", // Vintage parchment painting
  "22": "photo-1513364776144-60967b0f800f", // Vibrant splash painting
  "23": "photo-1554188718-d8af7e9d48bc", // Soft flowing design elements
  "24": "photo-1577720643272-265f093674b8", // Modern grid color-block oil
  "25": "photo-1579783928121-7d18c4142e39", // Minimal line-art illustration
  "26": "photo-1594787318286-3d835c1d207f", // Palette impasto brush strokes
  "27": "photo-1604871000636-074fa5117945", // Neon visual gallery backdrop
  "28": "photo-1576016770956-debb63d900ad", // Cobalt ink wash textures
  "29": "photo-1506744038136-46273834b3fb", // Atmospheric oil landscape
  "30": "photo-1507525428034-b723cf961d3e", // Serene seascape oil canvas
  "31": "photo-1549887534-1541e9326642"  // Elegant geometric abstraction
};

// Seeded pseudo-random generator to ensure deterministic visual generation of SVGs
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

// Generate an elegant, museum-quality programmatic abstract art masterpiece encoded as a Base64 SVG Data URI
function generateHighFidelityDummySVG(id: string, title: string, width: number, height: number): string {
  const random = createSeededRandom(id + title);
  
  // Choose one of 4 luxury modern art styles based on dynamic seed hashing
  let styleIndex = 0;
  for (let i = 0; i < id.length; i++) {
    styleIndex += id.charCodeAt(i);
  }
  styleIndex = styleIndex % 4;

  const svgWidth = 800;
  const svgHeight = Math.round(svgWidth * (height / width));

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
      lineColor: "rgba(35, 35, 35, 0.25)"
    },
    // Style 1: Midnight Luxury Cobalt & Bronze
    {
      bgGrad: ["#0b1120", "#080d19", "#04060c"],
      shapes: ["#233461", "#423263", "#435d7a", "#1e4466"],
      accent: "#cca43b", // Fine bronze gold
      lineColor: "rgba(255, 255, 255, 0.15)"
    },
    // Style 2: Bauhaus Color Block & Structural Geometry
    {
      bgGrad: ["#f3efe8", "#e4dfd8", "#cecac0"],
      shapes: ["#1c3e75", "#bf3122", "#424242", "#2e4f44"],
      accent: "#ebb308", // Bright cadmium yellow
      lineColor: "rgba(15, 15, 15, 0.45)"
    },
    // Style 3: Ethereal Pastel Rose & Sand
    {
      bgGrad: ["#faf3ef", "#ead9df", "#deccd4"],
      shapes: ["#df9bb6", "#b7a8d8", "#ebd5c1", "#abc6d8"],
      accent: "#f4bf6c", // Luminous amber
      lineColor: "rgba(85, 75, 95, 0.2)"
    }
  ];

  const palette = palettes[styleIndex];

  // Assemble beautiful SVG vectors
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgWidth} ${svgHeight}" width="${svgWidth}" height="${svgHeight}">`;
  
  // Background gradient setup
  svg += `<defs>
    <linearGradient id="svg-bg-${id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${palette.bgGrad[0]}" />
      <stop offset="50%" stop-color="${palette.bgGrad[1]}" />
      <stop offset="100%" stop-color="${palette.bgGrad[2]}" />
    </linearGradient>
  </defs>`;

  // 1. Solid Canvas Background
  svg += `<rect width="100%" height="100%" fill="url(#svg-bg-${id})" />`;

  // 2. Beautiful overlapping painterly geometry
  const numShapes = 2 + Math.floor(random() * 2);
  for (let i = 0; i < numShapes; i++) {
    const color = palette.shapes[i % palette.shapes.length];
    const size = Math.min(svgWidth, svgHeight) * (0.18 + random() * 0.16);
    const cx = svgWidth * (0.28 + random() * 0.44);
    const cy = svgHeight * (0.28 + random() * 0.44);
    
    const shapeType = Math.floor(random() * 3);
    
    if (shapeType === 0) {
      // Elegant minimal circle
      svg += `<circle cx="${cx}" cy="${cy}" r="${size}" fill="${color}" opacity="0.82" style="mix-blend-mode: multiply;" />`;
    } else if (shapeType === 1) {
      // Rotated rectangular block
      const rot = Math.round(random() * 45 - 22.5);
      svg += `<rect x="${cx - size}" y="${cy - size * 0.75}" width="${size * 2}" height="${size * 1.5}" transform="rotate(${rot} ${cx} ${cy})" fill="${color}" opacity="0.82" style="mix-blend-mode: multiply;" />`;
    } else {
      // Perfect museum arch curve
      const w = size * 1.4;
      const h = size * 1.8;
      const topY = cy - h/2;
      const archR = w/2;
      svg += `<path d="M ${cx - w/2} ${cy + h/2} L ${cx - w/2} ${topY + archR} A ${archR} ${archR} 0 0 1 ${cx + w/2} ${topY + archR} L ${cx + w/2} ${cy + h/2} Z" fill="${color}" opacity="0.82" style="mix-blend-mode: multiply;" />`;
    }
  }

  // 3. Gold / Bronze custom foil line elements
  const accentType = Math.floor(random() * 3);
  const ax = svgWidth * (0.32 + random() * 0.36);
  const ay = svgHeight * (0.32 + random() * 0.36);
  const ar = Math.min(svgWidth, svgHeight) * (0.12 + random() * 0.16);

  if (accentType === 0) {
    // Interlocking orbital metal rings
    svg += `<circle cx="${ax}" cy="${ay}" r="${ar}" fill="none" stroke="${palette.accent}" stroke-width="2.5" opacity="0.95" />`;
    svg += `<circle cx="${ax + ar * 0.25}" cy="${ay - ar * 0.15}" r="${ar * 0.75}" fill="none" stroke="${palette.accent}" stroke-width="1.8" opacity="0.85" />`;
  } else if (accentType === 1) {
    // Fine aligned linear strokes
    svg += `<line x1="${ax - ar}" y1="${ay - ar}" x2="${ax + ar}" y2="${ay + ar}" stroke="${palette.accent}" stroke-width="3" stroke-linecap="round" opacity="0.95" />`;
    svg += `<circle cx="${ax - ar}" cy="${ay - ar}" r="7" fill="${palette.accent}" />`;
    svg += `<circle cx="${ax + ar}" cy="${ay + ar}" r="7" fill="${palette.accent}" />`;
  } else {
    // Broad modern curved swoosh mapping frame dimensions
    const curveSweep = Math.min(svgWidth, svgHeight) * 0.38;
    svg += `<path d="M ${svgWidth * 0.15} ${svgHeight * 0.55} Q ${ax} ${ay} ${svgWidth * 0.85} ${svgHeight * 0.45}" fill="none" stroke="${palette.accent}" stroke-width="2.4" opacity="0.95" />`;
  }

  // 4. Subtle museum alignment grid lines
  const lineCount = 1 + Math.floor(random() * 3);
  for (let i = 0; i < lineCount; i++) {
    const ly = svgHeight * (0.18 + random() * 0.64);
    svg += `<line x1="${svgWidth * 0.08}" y1="${ly}" x2="${svgWidth * 0.92}" y2="${ly}" stroke="${palette.lineColor}" stroke-width="0.8" />`;
    
    const lx = svgWidth * (0.18 + random() * 0.64);
    svg += `<line x1="${lx}" y1="${svgHeight * 0.08}" x2="${lx}" y2="${svgHeight * 0.92}" stroke="${palette.lineColor}" stroke-width="0.8" />`;
  }

  // 5. Classic double inner border & artist signature
  svg += `<rect x="15" y="15" width="${svgWidth - 30}" height="${svgHeight - 30}" fill="none" stroke="rgba(0, 0, 0, 0.05)" stroke-width="10" />`;
  
  const textFill = styleIndex === 1 ? "rgba(255, 255, 255, 0.38)" : "rgba(0, 0, 0, 0.35)";
  svg += `<text x="${svgWidth - 35}" y="${svgHeight - 35}" font-family="sans-serif" font-size="13" font-style="italic" font-weight="600" text-anchor="end" fill="${textFill}">Grace R.</text>`;

  svg += `</svg>`;

  // Base64 encoding with full unicode safety
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
}

// GLOBAL IMAGE SIZE CONTROLS (Edit these values directly to rescale elements globally)
export const GLOBAL_ART_CONFIG = {
  defaultStandardWidth: 3.3,   // Width of standard 1:1 square artwork frames
  defaultStandardHeight: 3.3,  // Height of standard 1:1 square artwork frames
  defaultLargeHeight: 6.4,     // Height of the large monolithic centerpiece scroll
  defaultLargeWidth: 6.4 * (223 / 1468) // Calculated width based on the artwork aspect ratio
};

const ROOM_HALF_SIZE = 10.85;

export const ARTWORKS: Artwork[] = GALLERY_IMAGES.map((img, i) => {
  const N = GALLERY_IMAGES.length;
  // Distribute into 4 walls: 0 (North), 1 (East), 2 (South), 3 (West)
  const baseCount = Math.floor(N / 4);
  const extra = N % 4;

  let wall = 0;
  let indexInWall = 0;
  let tempSum = 0;

  for (let w = 0; w < 4; w++) {
    const countForWall = baseCount + (w < extra ? 1 : 0);
    if (i < tempSum + countForWall) {
      wall = w;
      indexInWall = i - tempSum;
      break;
    }
    tempSum += countForWall;
  }

  const countForThisWall = baseCount + (wall < extra ? 1 : 0);
  const spacing = 5.0;
  const totalWidth = (countForThisWall - 1) * spacing;
  const startCoord = -totalWidth / 2;
  const coord = startCoord + indexInWall * spacing;

  let position: [number, number, number] = [0, 4.0, 0];
  let rotation: [number, number, number] = [0, 0, 0];

  if (wall === 0) {
    // North Wall
    position = [coord, 4.0, -ROOM_HALF_SIZE];
    rotation = [0, 0, 0];
  } else if (wall === 1) {
    // East Wall
    position = [ROOM_HALF_SIZE, 4.0, coord];
    rotation = [0, -Math.PI / 2, 0];
  } else if (wall === 2) {
    // South Wall
    position = [coord, 4.0, ROOM_HALF_SIZE];
    rotation = [0, Math.PI, 0];
  } else {
    // West Wall
    position = [-ROOM_HALF_SIZE, 4.0, coord];
    rotation = [0, Math.PI / 2, 0];
  }

  // Resolve final image sizes (preferred custom values vs defaults)
  const isLarge = img.isLarge === true;
  const defaultHeight = isLarge ? GLOBAL_ART_CONFIG.defaultLargeHeight : GLOBAL_ART_CONFIG.defaultStandardHeight;
  const defaultWidth = isLarge ? GLOBAL_ART_CONFIG.defaultLargeWidth : GLOBAL_ART_CONFIG.defaultStandardWidth;

  const width = img.width !== undefined ? img.width : defaultWidth;
  const height = img.height !== undefined ? img.height : defaultHeight;

  // Resolve artwork size label (such as "24in x 36in"). Can be updated separately per image in images.ts
  let fallbackSize = "24in x 24in";
  if (isLarge) {
    fallbackSize = "24in x 156in";
  } else if (width > height) {
    fallbackSize = "36in x 24in";
  } else if (height > width) {
    fallbackSize = "24in x 36in";
  }
  const size = img.size || fallbackSize;

  // If the image is a placeholder (contains picsum.photos or is empty/default), supply the beautiful local inline SVG dummy image.
  // This bypasses CORS and network latency entirely for the initial app, ensuring 100% reliable loading inside all environments!
  // If the user replaces the placeholders in images.ts with real image files/URLs, we load them directly.
  const isPlaceholder = !img.imageUrl || img.imageUrl.includes("picsum.photos") || img.imageUrl.includes("placeholder") || img.imageUrl.includes("example.com");
  const finalImageUrl = isPlaceholder 
    ? generateHighFidelityDummySVG(img.id, img.title, width, height) 
    : img.imageUrl;

  return {
    ...img,
    imageUrl: finalImageUrl,
    artist: "Grace Refuerzo ", // Apply user requested artist name globally
    size,                         // Expose resolved custom artwork size
    position,
    rotation,
    room: 1, // Only 1 room exists now
    width,
    height
  };
});
