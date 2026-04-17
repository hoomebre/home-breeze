import { Product } from "@/types";

export const products: Product[] = [
  {
    id: "prod-1",
    category_id: "cat-1",
    name: "Aura Rain Shower System",
    slug: "aura-rain-shower-system",
    description: "Experience the ultimate relaxation with our Aura Rain Shower System. Featuring a massive 12-inch shower head and thermostatic controls.",
    short_description: "12-inch thermostatic rain shower system in matte black.",
    price: 499.99,
    compare_at_price: 650.00,
    sku: "SH-AURA-MB",
    stock_quantity: 15,
    is_featured: true,
    is_active: true,
    rating: 4.8,
    review_count: 124,
    images: [{ image_url: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&q=80", is_primary: true }],
    specifications: [
      { spec_name: "Material", spec_value: "Solid Brass" },
      { spec_name: "Finish", spec_value: "Matte Black" }
    ]
  },
  {
    id: "prod-2",
    category_id: "cat-2",
    name: "Lumina Basin Mixer",
    slug: "lumina-basin-mixer",
    description: "The Lumina Basin Mixer brings contemporary elegance to your vanity. Brushed gold finish with ceramic cartridge technology.",
    short_description: "Premium brushed gold basin mixer.",
    price: 189.50,
    compare_at_price: null,
    sku: "TP-LUM-BG",
    stock_quantity: 42,
    is_featured: true,
    is_active: true,
    rating: 4.9,
    review_count: 89,
    images: [{ image_url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80", is_primary: true }],
    specifications: [
      { spec_name: "Material", spec_value: "Brass" },
      { spec_name: "Finish", spec_value: "Brushed Gold" }
    ]
  },
  {
    id: "prod-3",
    category_id: "cat-3",
    name: "Zenith Floating Vanity",
    slug: "zenith-floating-vanity",
    description: "Maximize your space with the Zenith Floating Vanity. Includes a pure white ceramic basin and soft-close drawers.",
    short_description: "Wall-mounted vanity unit with ceramic basin.",
    price: 850.00,
    compare_at_price: 1100.00,
    sku: "VN-ZEN-80",
    stock_quantity: 5,
    is_featured: true,
    is_active: true,
    rating: 4.7,
    review_count: 45,
    images: [{ image_url: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&q=80", is_primary: true }],
    specifications: [
      { spec_name: "Width", spec_value: "800mm" },
      { spec_name: "Material", spec_value: "Moisture-resistant MDF" }
    ]
  },
  {
    id: "prod-4",
    category_id: "cat-4",
    name: "Nova Smart Bidet Toilet",
    slug: "nova-smart-bidet",
    description: "Redefine hygiene with the Nova Smart Bidet. Features heated seat, automatic flush, and adjustable water temperature.",
    short_description: "Intelligent rimless toilet with integrated bidet.",
    price: 1299.00,
    compare_at_price: null,
    sku: "TL-NOV-SM",
    stock_quantity: 8,
    is_featured: false,
    is_active: true,
    rating: 5.0,
    review_count: 12,
    images: [{ image_url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80", is_primary: true }],
    specifications: [
      { spec_name: "Type", spec_value: "Smart Toilet" },
      { spec_name: "Features", spec_value: "Heated Seat, Auto-flush" }
    ]
  },
  {
    id: "prod-5",
    category_id: "cat-5",
    name: "Halo LED Mirror",
    slug: "halo-led-mirror",
    description: "Perfect lighting for every routine. The Halo LED Mirror features touch controls, anti-fog technology, and adjustable color temperature.",
    short_description: "Round LED backlit mirror with anti-fog.",
    price: 249.00,
    compare_at_price: 299.00,
    sku: "MR-HAL-RND",
    stock_quantity: 25,
    is_featured: true,
    is_active: true,
    rating: 4.6,
    review_count: 67,
    images: [{ image_url: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&q=80", is_primary: true }],
    specifications: [
      { spec_name: "Diameter", spec_value: "600mm" },
      { spec_name: "Lighting", spec_value: "3000K-6000K Adjustable" }
    ]
  },
  {
    id: "prod-6",
    category_id: "cat-6",
    name: "Vogue 4-Piece Accessory Set",
    slug: "vogue-accessory-set",
    description: "Complete your bathroom look with the Vogue 4-Piece Set including towel rail, toilet paper holder, robe hook, and soap dispenser.",
    short_description: "Complete matching accessory set in brushed nickel.",
    price: 145.00,
    compare_at_price: 180.00,
    sku: "AC-VOG-BN",
    stock_quantity: 50,
    is_featured: false,
    is_active: true,
    rating: 4.8,
    review_count: 34,
    images: [{ image_url: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&q=80", is_primary: true }],
    specifications: [
      { spec_name: "Finish", spec_value: "Brushed Nickel" },
      { spec_name: "Items", spec_value: "4 pieces" }
    ]
  }
];
