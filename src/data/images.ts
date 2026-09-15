export interface ImageArtwork {
  id: string;
  title: string;
  artist: string;
  description: string;
  price?: string;
  imageUrl: string;
  productUrl: string;
  isLarge?: boolean;
  width?: number;  // Optional custom width (in meters). Overrides global config.
  height?: number; // Optional custom height (in meters). Overrides global config.
  size?: string;   // Optional custom artwork size (e.g. "24in x 36in")
}

/**
 * GALLERY_IMAGES
 * To customize the dimensions of any specific image, add properties:
 *    width: [number],
 *    height: [number]
 * inside the image object below. E.g.:
 *    width: 4.5,
 *    height: 3.0
 */
export const GALLERY_IMAGES: ImageArtwork[] = [
  // --- NORTH WALL (6 Normal Artworks) ---
  {
    id: "2",
    title: "Mystery, Acrylic on wood",
    artist: "Grace Refuerzo Art",
    description: "Elegant gallery-level exhibition frame. Ready for replacement.",
    price: "$6,500",
    imageUrl: "/images/06.png",
    productUrl: "https://your-link-2.com https://demowebsiteexecutions.com/grace/checkout/?add-to-cart=1265&quantity=1",
    width: 2.5,
    height: 4.0,
    size: "2-18in x 48in"
  },
  {
    id: "3",
    title: "Intersection Of Light",
    artist: "Grace Refuerzo ",
    description: "Elegant gallery-level exhibition frame. Ready for replacement.",
    price: "$20,000.00 ",
    imageUrl: "/images/13.jpeg",
    productUrl: "https://demowebsiteexecutions.com/grace/checkout/?add-to-cart=2608&quantity=1",
    size: "36in x 48in",
    width: 3.0,
    height: 4.0
  },
  {
    id: "4",
    title: "Echoes, Acrylic on wood",
    artist: "Grace Refuerzo Art",
    description: "Elegant gallery-level exhibition frame. Ready for replacement.",
    price: "$4,800",
    imageUrl: "/images/05.png",
    productUrl: "https://demowebsiteexecutions.com/grace/checkout/?add-to-cart=1267&quantity=1",
    width: 2.5,
    height: 4.0,
    size: "26in x 48in"
  },

  {
    id: "5",
    title: "Ink Series 1, Acrylic and Ink on wood",
    artist: "Grace Refuerzo Art",
    description: "Elegant gallery-level exhibition frame. Ready for replacement.",
    price: "$2,400",
    imageUrl: "/images/04.png",
    productUrl: "https://demowebsiteexecutions.com/grace/checkout/?add-to-cart=1278&quantity=1",
    width: 3.0,
    height: 3.0,
    size: "24in x 24in"
  },
  {
    id: "6",
    title: " Ink Series 2, Acrylic and Ink on wood",
    artist: "Grace Refuerzo Art",
    description: "Elegant gallery-level exhibition frame. Ready for replacement.",
    price: "$2,400",
    imageUrl: "/images/03.png",
    productUrl: "https://demowebsiteexecutions.com/grace/checkout/?add-to-cart=1279&quantity=1",
    width: 3.0,
    height: 3.0,
    size: "24in x 24in"
  },
 {
    id: "7",
    title: "Ink Series 3, Acrylic and Ink on wood",
    artist: "Grace Refuerzo Art",
    description: "Elegant gallery-level exhibition frame. Ready for replacement.",
    price: "$2,400",
    imageUrl: "/images/02.png",
    productUrl: "https://demowebsiteexecutions.com/grace/checkout/?add-to-cart=1280&quantity=1",
    width: 3.0,
    height: 3.0,
    size: "24in x 24in"
  },

  // --- EAST WALL (8 Normal Artworks) ---
  {
    id: "8",
    title: "Shadows Of Light II, Oil on canvas",
    artist: "Artist Room 1",
    description: "Elegant gallery-level exhibition frame. Ready for replacement.",
    price: "$3,800",
    imageUrl: "/images/14.png",
    productUrl: "https://demowebsiteexecutions.com/grace/checkout/?add-to-cart=1290&quantity=1",
    width: 3.0,
    height: 4.0,
    size: "36in x 48in"
  },
  // {
  //   id: "9",
  //   title: "Echoes, Acrylic on wood",
  //   artist: "Artist Room 1",
  //   description: "Elegant gallery-level exhibition frame. Ready for replacement.",
  //   price: "$4,800",
  //   imageUrl: "/images/08.png",
  //   productUrl: "https://demowebsiteexecutions.com/grace/checkout/?add-to-cart=1267&quantity=1",
  //   width: 2.0,
  //   height: 3.0,
  //   size: "24in x 36in"
  // },
 
{
    id: "10",
    title: "Shadows Of Light l, Oil on Canvas",
    artist: "Artist Room 1",
    description: "Elegant gallery-level exhibition frame. Ready for replacement.",
    price: "$3,900",
    imageUrl: "/images/10.jpg",
    productUrl: "https://demowebsiteexecutions.com/grace/checkout/?add-to-cart=1290&quantity=1",
    width: 3.0,
    height: 4.0,
    size: "36in x 48in"

  },
  {
    id: "11",
    title: "Ink Series 1-3 Triptych",
    artist: "Artist Room 1",
    description: "Elegant gallery-level exhibition frame. Ready for replacement.",
    price: "$7,200",
    imageUrl: "/images/01.jpg ",
    productUrl: "https://your-link-2.com",
    width: 5.0,
    height: 2.0,
    size: "24in x 72in"
  },
   {
    id: "14",
    title: "Evening At The Shore, Acrylic on wood",
    artist: "Artist Room 1",
    description: "Elegant gallery-level exhibition frame. Ready for replacement.",
    price: "$3,500",
    imageUrl: "/images/07.jpg",
    productUrl: "https://demowebsiteexecutions.com/grace/checkout/?add-to-cart=2021&quantity=1",
    width: 3.0,
    height: 4.0,
    size: "36in x 48in"
  },


  {
    id: "13",
    title: "Window Panes, Acrylic on wood",
    artist: "Artist Room 1",
    description: "Elegant gallery-level exhibition frame. Ready for replacement.",
    price: "$2,500",
    imageUrl: "/images/12.png",
    productUrl: "https://demowebsiteexecutions.com/grace/checkout/?add-to-cart=1274&quantity=1",
    width: 3.0,
    height: 4.0,
    size: "36in x 48in"
  },

  // {
  //   id: "12",
  //   title: "Window Panes, Acrylic on wood",
  //   artist: "Artist Room 1",
  //   description: "Elegant gallery-level exhibition frame. Ready for replacement.",
  //   price: "$2,500",
  //   imageUrl: "/images/12.png",
  //   productUrl: "https://demowebsiteexecutions.com/grace/checkout/?add-to-cart=1274&quantity=1",
  //   width: 3.0,
  //   height: 4.0,
  //   size: "36in x 48in"
  // },

  {
    id: "13",
    title: "Solitude, Acrylic on wood",
    artist: "Artist Room 1",
    description: "Elegant gallery-level exhibition frame. Ready for replacement.",
    price: "$3,500",
    imageUrl: "/images/09.png",
    productUrl: "https://demowebsiteexecutions.com/grace/checkout/?add-to-cart=1261&quantity=1 ",
    width: 2.5,
    height: 3.0,
    size: "30in x 36in"

  },
  // {
  // id: "14",
  //   title: "Intersection Of Light II",
  //   artist: "Artist Room 1",
  //   description: "Elegant gallery-level exhibition frame. Ready for replacement.",
  //   price: "$20,000.00",
  //   imageUrl: "/images/13.jpeg",
  //   productUrl: "https://demowebsiteexecutions.com/grace/checkout/?add-to-cart=2608&quantity=1",
  //   width: 3.0,
  //   height: 4.0,
  //   size: "36in x 48in"
  // }

];

// NOTE: To use your local images later:
// 1. Upload your images to the /public/images/ folder named art1.jpg, art2.jpg, etc.
// 2. Change the fields above (or replace the list) to point to `/images/art${id}.jpg`
