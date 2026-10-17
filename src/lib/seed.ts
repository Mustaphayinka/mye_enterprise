// Generated from the old site's product list (legacy/product-details.html).
// Used only in demo mode (no Supabase keys) and as a reference for supabase/seed.sql.
import type { Category, Product, Settings } from "./types";

export const seedCategories: Category[] = [
  {
    "id": "cat-kitchen-dining",
    "name": "Kitchen & Dining",
    "slug": "kitchen-dining",
    "sort_order": 0
  },
  {
    "id": "cat-home-storage",
    "name": "Home & Storage",
    "slug": "home-storage",
    "sort_order": 1
  },
  {
    "id": "cat-beauty-personal-care",
    "name": "Beauty & Personal Care",
    "slug": "beauty-personal-care",
    "sort_order": 2
  },
  {
    "id": "cat-gadgets-accessories",
    "name": "Gadgets & Accessories",
    "slug": "gadgets-accessories",
    "sort_order": 3
  }
];

const catId = (slug: string) => "cat-" + slug;

export const seedProducts: Product[] = [
  {
    "id": "seed-1",
    "name": "Don't Waste My Soap",
    "slug": "don-t-waste-my-soap",
    "description": "",
    "price": 699.99,
    "compare_at_price": null,
    "images": [
      "/images/index.jpg",
      "/images/index3.jpg",
      "/images/index1.jpg",
      "/images/index2.jpg"
    ],
    "in_stock": true,
    "featured": true,
    "created_at": "2025-01-01T00:00:00.000Z",
    "category_id": catId("home-storage")
  },
  {
    "id": "seed-2",
    "name": "Pyramid Electric Kettle",
    "slug": "pyramid-electric-kettle",
    "description": "This is a pyramid electric kettle.",
    "price": 7499,
    "compare_at_price": null,
    "images": [
      "/images/IMG-20221217-WA0001.jpg",
      "/images/IMG-20221217-WA0003.jpg",
      "/images/IMG-20221217-WA0010.jpg",
      "/images/IMG-20221217-WA0016.jpg"
    ],
    "in_stock": true,
    "featured": false,
    "created_at": "2025-01-02T00:00:00.000Z",
    "category_id": catId("kitchen-dining")
  },
  {
    "id": "seed-3",
    "name": "500ml Water Temperature Flask",
    "slug": "500ml-water-temperature-flask",
    "description": "",
    "price": 7499,
    "compare_at_price": null,
    "images": [
      "/images/index4.jpg",
      "/images/index10.jpg"
    ],
    "in_stock": true,
    "featured": false,
    "created_at": "2025-01-03T00:00:00.000Z",
    "category_id": catId("kitchen-dining")
  },
  {
    "id": "seed-4",
    "name": "Self-stirring Mug",
    "slug": "self-stirring-mug",
    "description": "",
    "price": 2699,
    "compare_at_price": null,
    "images": [
      "/images/IMG-20221217-WA0011.jpg",
      "/images/IMG-20221217-WA0014.jpg",
      "/images/IMG-20221217-WA0017.jpg",
      "/images/IMG-20221217-WA0029.jpg"
    ],
    "in_stock": true,
    "featured": false,
    "created_at": "2025-01-04T00:00:00.000Z",
    "category_id": catId("kitchen-dining")
  },
  {
    "id": "seed-5",
    "name": "Foldable Chinese Wooden Fan",
    "slug": "foldable-chinese-wooden-fan",
    "description": "",
    "price": 1699,
    "compare_at_price": null,
    "images": [
      "/images/IMG-20221217-WA0039.jpg",
      "/images/IMG-20221217-WA0035.jpg",
      "/images/IMG-20221217-WA0034.jpg",
      "/images/IMG-20221217-WA0037.jpg"
    ],
    "in_stock": true,
    "featured": false,
    "created_at": "2025-01-05T00:00:00.000Z",
    "category_id": catId("gadgets-accessories")
  },
  {
    "id": "seed-6",
    "name": "Golden Spoons",
    "slug": "golden-spoons",
    "description": "",
    "price": 1699,
    "compare_at_price": null,
    "images": [
      "/images/IMG-20221217-WA0053.jpg",
      "/images/IMG-20221217-WA0051.jpg",
      "/images/IMG-20221217-WA0052.jpg"
    ],
    "in_stock": true,
    "featured": false,
    "created_at": "2025-01-06T00:00:00.000Z",
    "category_id": catId("kitchen-dining")
  },
  {
    "id": "seed-7",
    "name": "Dumbbell Water Bottle",
    "slug": "dumbbell-water-bottle",
    "description": "",
    "price": 4199,
    "compare_at_price": null,
    "images": [
      "/images/index9.jpg"
    ],
    "in_stock": true,
    "featured": false,
    "created_at": "2025-01-07T00:00:00.000Z",
    "category_id": catId("kitchen-dining")
  },
  {
    "id": "seed-8",
    "name": "Electric Food Chopper",
    "slug": "electric-food-chopper",
    "description": "",
    "price": 1699,
    "compare_at_price": null,
    "images": [
      "/images/index17.jpg"
    ],
    "in_stock": true,
    "featured": false,
    "created_at": "2025-01-08T00:00:00.000Z",
    "category_id": catId("kitchen-dining")
  },
  {
    "id": "seed-9",
    "name": "Serving Dish",
    "slug": "serving-dish",
    "description": "",
    "price": 3599,
    "compare_at_price": null,
    "images": [
      "/images/index12.jpg",
      "/images/index18.jpg",
      "/images/index19.jpg"
    ],
    "in_stock": true,
    "featured": false,
    "created_at": "2025-01-09T00:00:00.000Z",
    "category_id": catId("kitchen-dining")
  },
  {
    "id": "seed-10",
    "name": "Mini Basket",
    "slug": "mini-basket",
    "description": "",
    "price": 3199,
    "compare_at_price": null,
    "images": [
      "/images/index67.jpg",
      "/images/index45.jpg"
    ],
    "in_stock": true,
    "featured": false,
    "created_at": "2025-01-10T00:00:00.000Z",
    "category_id": catId("home-storage")
  },
  {
    "id": "seed-11",
    "name": "Electric Lunchbox",
    "slug": "electric-lunchbox",
    "description": "",
    "price": 5499,
    "compare_at_price": null,
    "images": [
      "/images/index11.jpg",
      "/images/index7.jpg",
      "/images/index6.jpg"
    ],
    "in_stock": true,
    "featured": false,
    "created_at": "2025-01-11T00:00:00.000Z",
    "category_id": catId("kitchen-dining")
  },
  {
    "id": "seed-12",
    "name": "Shoe Rack plus Hanger",
    "slug": "shoe-rack-plus-hanger",
    "description": "",
    "price": 15999,
    "compare_at_price": null,
    "images": [
      "/images/index95.jpg"
    ],
    "in_stock": true,
    "featured": false,
    "created_at": "2025-01-12T00:00:00.000Z",
    "category_id": catId("home-storage")
  },
  {
    "id": "seed-13",
    "name": "Toasting Machine",
    "slug": "toasting-machine",
    "description": "",
    "price": 9499,
    "compare_at_price": null,
    "images": [
      "/images/index79.jpg"
    ],
    "in_stock": true,
    "featured": false,
    "created_at": "2025-01-13T00:00:00.000Z",
    "category_id": catId("kitchen-dining")
  },
  {
    "id": "seed-14",
    "name": "Student Cutlery",
    "slug": "student-cutlery",
    "description": "",
    "price": 3099,
    "compare_at_price": null,
    "images": [
      "/images/index98.jpg"
    ],
    "in_stock": true,
    "featured": false,
    "created_at": "2025-01-14T00:00:00.000Z",
    "category_id": catId("kitchen-dining")
  },
  {
    "id": "seed-15",
    "name": "Cutting Board",
    "slug": "cutting-board",
    "description": "",
    "price": 1399,
    "compare_at_price": null,
    "images": [
      "/images/index69.jpg"
    ],
    "in_stock": true,
    "featured": false,
    "created_at": "2025-01-15T00:00:00.000Z",
    "category_id": catId("kitchen-dining")
  },
  {
    "id": "seed-16",
    "name": "Mini Electric Kettles",
    "slug": "mini-electric-kettles",
    "description": "",
    "price": 3199,
    "compare_at_price": null,
    "images": [
      "/images/index58.jpg"
    ],
    "in_stock": true,
    "featured": false,
    "created_at": "2025-01-16T00:00:00.000Z",
    "category_id": catId("kitchen-dining")
  },
  {
    "id": "seed-17",
    "name": "Two Sided Hotplate",
    "slug": "two-sided-hotplate",
    "description": "",
    "price": 16999,
    "compare_at_price": null,
    "images": [
      "/images/index57.jpg",
      "/images/index43.jpg"
    ],
    "in_stock": true,
    "featured": false,
    "created_at": "2025-01-17T00:00:00.000Z",
    "category_id": catId("kitchen-dining")
  },
  {
    "id": "seed-18",
    "name": "Not Laundry Bag",
    "slug": "not-laundry-bag",
    "description": "",
    "price": 1199,
    "compare_at_price": null,
    "images": [
      "/images/index54.jpg",
      "/images/index53.jpg",
      "/images/index56.jpg"
    ],
    "in_stock": true,
    "featured": false,
    "created_at": "2025-01-18T00:00:00.000Z",
    "category_id": catId("home-storage")
  },
  {
    "id": "seed-19",
    "name": "One Side Hotplate",
    "slug": "one-side-hotplate",
    "description": "",
    "price": 8499,
    "compare_at_price": null,
    "images": [
      "/images/index41.jpg",
      "/images/index33.jpg"
    ],
    "in_stock": true,
    "featured": false,
    "created_at": "2025-01-19T00:00:00.000Z",
    "category_id": catId("kitchen-dining")
  },
  {
    "id": "seed-20",
    "name": "Hair Dryer (small)",
    "slug": "hair-dryer-small",
    "description": "",
    "price": 2400,
    "compare_at_price": null,
    "images": [
      "/images/index55.jpg",
      "/images/index39.jpg",
      "/images/index46.jpg"
    ],
    "in_stock": true,
    "featured": false,
    "created_at": "2025-01-20T00:00:00.000Z",
    "category_id": catId("beauty-personal-care")
  },
  {
    "id": "seed-21",
    "name": "Food Warmers (small)",
    "slug": "food-warmers-small",
    "description": "",
    "price": 2199,
    "compare_at_price": null,
    "images": [
      "/images/index77.jpg"
    ],
    "in_stock": true,
    "featured": false,
    "created_at": "2025-01-21T00:00:00.000Z",
    "category_id": catId("kitchen-dining")
  },
  {
    "id": "seed-22",
    "name": "Seven Set Plastic Containers",
    "slug": "seven-set-plastic-containers",
    "description": "",
    "price": 4199,
    "compare_at_price": null,
    "images": [
      "/images/index47.jpg",
      "/images/index51.jpg"
    ],
    "in_stock": true,
    "featured": false,
    "created_at": "2025-01-22T00:00:00.000Z",
    "category_id": catId("kitchen-dining")
  },
  {
    "id": "seed-23",
    "name": "Covered Plate Rack",
    "slug": "covered-plate-rack",
    "description": "",
    "price": 16999,
    "compare_at_price": null,
    "images": [
      "/images/index35.jpg"
    ],
    "in_stock": true,
    "featured": false,
    "created_at": "2025-01-23T00:00:00.000Z",
    "category_id": catId("kitchen-dining")
  },
  {
    "id": "seed-24",
    "name": "Flower Food Warmer",
    "slug": "flower-food-warmer",
    "description": "",
    "price": 23999,
    "compare_at_price": null,
    "images": [
      "/images/index31.jpg"
    ],
    "in_stock": true,
    "featured": false,
    "created_at": "2025-01-24T00:00:00.000Z",
    "category_id": catId("kitchen-dining")
  },
  {
    "id": "seed-25",
    "name": "Multi-Colour Straw Flask",
    "slug": "multi-colour-straw-flask",
    "description": "",
    "price": 3199,
    "compare_at_price": null,
    "images": [
      "/images/index102.jpg"
    ],
    "in_stock": true,
    "featured": false,
    "created_at": "2025-01-25T00:00:00.000Z",
    "category_id": catId("kitchen-dining")
  },
  {
    "id": "seed-26",
    "name": "Hair Straightener",
    "slug": "hair-straightener",
    "description": "",
    "price": 1899,
    "compare_at_price": null,
    "images": [
      "/images/index103.jpg"
    ],
    "in_stock": true,
    "featured": true,
    "created_at": "2025-01-26T00:00:00.000Z",
    "category_id": catId("beauty-personal-care")
  },
  {
    "id": "seed-27",
    "name": "Hair Straightener",
    "slug": "hair-straightener-2",
    "description": "",
    "price": 2899,
    "compare_at_price": null,
    "images": [
      "/images/index104.jpg"
    ],
    "in_stock": true,
    "featured": false,
    "created_at": "2025-01-27T00:00:00.000Z",
    "category_id": catId("beauty-personal-care")
  },
  {
    "id": "seed-28",
    "name": "Long Breakable Mugs",
    "slug": "long-breakable-mugs",
    "description": "",
    "price": 2999,
    "compare_at_price": null,
    "images": [
      "/images/index105.jpg"
    ],
    "in_stock": true,
    "featured": false,
    "created_at": "2025-01-28T00:00:00.000Z",
    "category_id": catId("kitchen-dining")
  },
  {
    "id": "seed-29",
    "name": "Breakable Toothbrush Holder",
    "slug": "breakable-toothbrush-holder",
    "description": "",
    "price": 1999,
    "compare_at_price": null,
    "images": [
      "/images/index106.jpg"
    ],
    "in_stock": true,
    "featured": false,
    "created_at": "2025-01-29T00:00:00.000Z",
    "category_id": catId("home-storage")
  },
  {
    "id": "seed-30",
    "name": "3-Tier Commodity Rack",
    "slug": "3-tier-commodity-rack",
    "description": "",
    "price": 9699,
    "compare_at_price": null,
    "images": [
      "/images/index107.jpg"
    ],
    "in_stock": true,
    "featured": false,
    "created_at": "2025-01-30T00:00:00.000Z",
    "category_id": catId("home-storage")
  },
  {
    "id": "seed-31",
    "name": "16 Dinner Set",
    "slug": "16-dinner-set",
    "description": "",
    "price": 22999,
    "compare_at_price": null,
    "images": [
      "/images/index110.jpg"
    ],
    "in_stock": true,
    "featured": false,
    "created_at": "2025-01-31T00:00:00.000Z",
    "category_id": catId("kitchen-dining")
  },
  {
    "id": "seed-32",
    "name": "Plastic Wine Cups",
    "slug": "plastic-wine-cups",
    "description": "",
    "price": 599,
    "compare_at_price": null,
    "images": [
      "/images/index108.jpg"
    ],
    "in_stock": true,
    "featured": true,
    "created_at": "2025-02-01T00:00:00.000Z",
    "category_id": catId("kitchen-dining")
  },
  {
    "id": "seed-33",
    "name": "FootMats",
    "slug": "footmats",
    "description": "",
    "price": 4699,
    "compare_at_price": null,
    "images": [
      "/images/IMG-20221217-WA0027.jpg",
      "/images/IMG-20221217-WA0007.jpg",
      "/images/IMG-20221217-WA0030.jpg",
      "/images/IMG-20221217-WA0025.jpg"
    ],
    "in_stock": true,
    "featured": true,
    "created_at": "2025-02-02T00:00:00.000Z",
    "category_id": catId("home-storage")
  },
  {
    "id": "seed-34",
    "name": "Electric Handfan",
    "slug": "electric-handfan",
    "description": "",
    "price": 3699,
    "compare_at_price": null,
    "images": [
      "/images/IMG-20221217-WA0028.jpg"
    ],
    "in_stock": true,
    "featured": false,
    "created_at": "2025-02-03T00:00:00.000Z",
    "category_id": catId("gadgets-accessories")
  },
  {
    "id": "seed-35",
    "name": "Acrylic Jug with Cups",
    "slug": "acrylic-jug-with-cups",
    "description": "",
    "price": 7499,
    "compare_at_price": null,
    "images": [
      "/images/index78.jpg"
    ],
    "in_stock": true,
    "featured": false,
    "created_at": "2025-02-04T00:00:00.000Z",
    "category_id": catId("kitchen-dining")
  },
  {
    "id": "seed-36",
    "name": "Shoe Rack/Cabinet (Medium)",
    "slug": "shoe-rack-cabinet-medium",
    "description": "",
    "price": 10499,
    "compare_at_price": null,
    "images": [
      "/images/index111.jpg",
      "/images/index99.jpg",
      "/images/index95.jpg"
    ],
    "in_stock": true,
    "featured": true,
    "created_at": "2025-02-05T00:00:00.000Z",
    "category_id": catId("home-storage")
  },
  {
    "id": "seed-37",
    "name": "Large Capacity Laundry Plastic",
    "slug": "large-capacity-laundry-plastic",
    "description": "",
    "price": 5499,
    "compare_at_price": null,
    "images": [
      "/images/index109.jpg"
    ],
    "in_stock": true,
    "featured": true,
    "created_at": "2025-02-06T00:00:00.000Z",
    "category_id": catId("home-storage")
  },
  {
    "id": "seed-38",
    "name": "Plastic Wine Cups",
    "slug": "plastic-wine-cups-2",
    "description": "",
    "price": 22999,
    "compare_at_price": null,
    "images": [
      "/images/index110.jpg"
    ],
    "in_stock": true,
    "featured": true,
    "created_at": "2025-02-07T00:00:00.000Z",
    "category_id": catId("kitchen-dining")
  },
  {
    "id": "seed-39",
    "name": "Mini Parker and Brush",
    "slug": "mini-parker-and-brush",
    "description": "",
    "price": 16999,
    "compare_at_price": null,
    "images": [
      "/images/index91.jpg"
    ],
    "in_stock": true,
    "featured": false,
    "created_at": "2025-02-08T00:00:00.000Z",
    "category_id": catId("home-storage")
  },
  {
    "id": "seed-40",
    "name": "Bathroom Accessories",
    "slug": "bathroom-accessories",
    "description": "",
    "price": 35499,
    "compare_at_price": null,
    "images": [
      "/images/index97.jpg",
      "/images/index93.jpg",
      "/images/index96.jpg"
    ],
    "in_stock": true,
    "featured": false,
    "created_at": "2025-02-09T00:00:00.000Z",
    "category_id": catId("home-storage")
  },
  {
    "id": "seed-41",
    "name": "Breakable Mugs",
    "slug": "breakable-mugs",
    "description": "",
    "price": 2199,
    "compare_at_price": null,
    "images": [
      "/images/index112.jpg",
      "/images/index105.jpg"
    ],
    "in_stock": true,
    "featured": true,
    "created_at": "2025-02-10T00:00:00.000Z",
    "category_id": catId("kitchen-dining")
  }
];

export const defaultSettings: Settings = {
  store_name: "Mye Stores",
  tagline: "Everyday essentials for your kitchen, home and room",
  hero_title: "Quality home & kitchen essentials, at student-friendly prices",
  hero_subtitle: "Browse the store, add what you like to your cart, and send your order straight to us on WhatsApp.",
  announcement: "",
  whatsapp: "2348170084726",
  phone: "+234 817 008 4726",
  email: "",
  address: "Al-Hikmah University, Nigeria",
  hours: "08:00 - 16:00",
  instagram: "",
  facebook: "",
  tiktok: "",
};
