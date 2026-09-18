import type { Product, Order, CustomRequest, Review, StoreSettings } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Eternal Soft Tulip Stem',
    category: 'Flower Stems',
    price: 180,
    originalPrice: 220,
    stock: 15,
    description: 'Hand-crocheted single stem tulip made with premium 100% milk cotton yarn. Guaranteed to never wilt! Perfect gift for dorm desks, room decor, or surprise gifts for friends.',
    features: ['100% Milk Cotton Yarn', 'Flexible bendable stem wire', 'Never wilts', 'Height ~28cm'],
    colorsAvailable: ['Pastel Pink', 'Sun Gold Yellow', 'Soft Lavender', 'Ruby Red', 'Cream White'],
    imageUrl: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    leadTimeDays: 1,
    rating: 4.9,
    reviewCount: 42,
  },
  {
    id: 'prod-2',
    name: 'Grand Sunflower & Daisy Bouquet',
    category: 'Bouquets',
    price: 650,
    originalPrice: 799,
    stock: 8,
    description: 'A cheerful handcrafted arrangement featuring 1 Giant Sunflower, 3 Tulips, and 2 White Baby Daisies wrapped in vintage rustic kraft paper with a satin ribbon.',
    features: ['Includes 6 floral stems', 'Wrapped in premium kraft paper', 'Free gift message card included', 'Satin ribbon tied'],
    colorsAvailable: ['Classic Yellow & Pink Mix', 'Sunset Orange & Terracotta', 'Pastel Blossom Mix'],
    imageUrl: 'https://images.unsplash.com/photo-1591886960571-74d43a9d4166?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    isNew: true,
    leadTimeDays: 2,
    rating: 5.0,
    reviewCount: 38,
  },
  {
    id: 'prod-3',
    name: 'Chubby Frogie Keychain',
    category: 'Keychains',
    price: 150,
    originalPrice: 180,
    stock: 12,
    description: 'Adorable chubby green frog amigurumi keychain with soft blush cheeks. Clip it on your backpack, dorm keys, or tote bag!',
    features: ['Sturdy metal keyring', 'Soft polyester stuffing', 'Machine washable (hand spot clean)', 'Size ~6cm'],
    colorsAvailable: ['Sage Green', 'Mint Green', 'Kawaii Lime'],
    imageUrl: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    leadTimeDays: 1,
    rating: 4.8,
    reviewCount: 29,
  },
  {
    id: 'prod-4',
    name: 'Pastel Daisy Knit Tote Bag',
    category: 'Handbags & Pouches',
    price: 850,
    originalPrice: 999,
    stock: 5,
    description: 'Hand-crocheted sturdy shoulder tote bag adorned with raised daisy flower motifs. Roomy enough for your laptop, notebook, and daily campus essentials.',
    features: ['Reinforced comfortable shoulder strap', 'Holds up to 14" laptop', 'Thick durable yarn structure', 'Size 35x38cm'],
    colorsAvailable: ['Cream & Yellow Daisies', 'Sage & Lavender Daisies', 'Cozy Terracotta'],
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    isPopular: false,
    isNew: true,
    leadTimeDays: 3,
    rating: 4.9,
    reviewCount: 17,
  },
  {
    id: 'prod-5',
    name: 'Sweet Strawberry Pouch',
    category: 'Handbags & Pouches',
    price: 280,
    originalPrice: 320,
    stock: 9,
    description: 'Cute drawstring pouch shaped like a juicy strawberry with little green leaves. Ideal for earphones, lip balms, coin storage, or jewelry.',
    features: ['Drawstring green leaf closure', 'Soft touch cotton', 'Compact pocket size ~12cm'],
    colorsAvailable: ['Strawberry Red', 'Pastel Pink Berry', 'Matcha Green'],
    imageUrl: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&w=800&q=80',
    isPopular: false,
    leadTimeDays: 1,
    rating: 4.7,
    reviewCount: 14,
  },
  {
    id: 'prod-6',
    name: 'Puffy Heart Charm Keychain',
    category: 'Keychains',
    price: 120,
    stock: 20,
    description: 'Minimalist 3D plush heart charm with tiny pearl bead accent. Comes with a gold-tone lobster clasp hook.',
    features: ['3D soft puffy filling', 'Gold lobster clasp', 'Perfect matching friendship gift'],
    colorsAvailable: ['Soft Lavender', 'Cherry Red', 'Blush Pink', 'Sky Blue', 'Cream'],
    imageUrl: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80',
    isPopular: false,
    leadTimeDays: 1,
    rating: 4.9,
    reviewCount: 22,
  },
  {
    id: 'prod-7',
    name: 'Sleepy Bear Amigurumi Plushie',
    category: 'Plushies & Amigurumi',
    price: 520,
    originalPrice: 600,
    stock: 4,
    description: 'Ultra-cuddly hand-stitched bear wearing a tiny knitted scarf. Made with velvet chenille yarn for maximum softness.',
    features: ['Super soft Velvet Chenille yarn', 'Safety eyes attached securely', 'Height ~20cm'],
    colorsAvailable: ['Honey Brown', 'Oatmeal Beige', 'Dusty Rose'],
    imageUrl: 'https://images.unsplash.com/photo-1558679908-541bcf1249ff?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    isNew: true,
    leadTimeDays: 2,
    rating: 5.0,
    reviewCount: 19,
  },
  {
    id: 'prod-8',
    name: 'Floral Crochet Hair Bandana',
    category: 'Wearables & Hair',
    price: 240,
    stock: 7,
    description: 'Retro vintage tie-back crochet head kerchief with delicate wildflower lace pattern. Fits all head sizes with adjustable ties.',
    features: ['Adjustable tie straps', 'Breathable cotton knit', 'Boho vintage style'],
    colorsAvailable: ['Vintage Buttercup', 'Sage Floral', 'Washed Denim Blue'],
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    isPopular: false,
    leadTimeDays: 1,
    rating: 4.8,
    reviewCount: 11,
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-8942',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    customerName: 'Aarav Sharma',
    phone: '+91 98765 43210',
    dormOrBuilding: 'Subir Hall - Block B',
    roomOrSpot: 'Room 304',
    items: [
      {
        productId: 'prod-2',
        productName: 'Grand Sunflower & Daisy Bouquet',
        quantity: 1,
        price: 650,
        selectedColor: 'Classic Yellow & Pink Mix',
        giftNote: 'Happy Birthday Ananya! Hope you love these forever blooming flowers 🌻❤️',
        imageUrl: 'https://images.unsplash.com/photo-1591886960571-74d43a9d4166?auto=format&fit=crop&w=800&q=80'
      }
    ],
    subtotal: 650,
    deliveryFee: 0,
    total: 650,
    paymentMethod: 'UPI / GPay',
    paymentStatus: 'Paid',
    status: 'Crocheting',
    estimatedDeliveryDate: 'Tomorrow at 4:00 PM',
    specialInstructions: 'Please deliver around evening after lectures end!'
  },
  {
    id: 'ORD-8941',
    createdAt: new Date(Date.now() - 3600000 * 26).toISOString(),
    customerName: 'Priya Verma',
    phone: '+91 98123 76543',
    dormOrBuilding: 'Girls Hostel 3',
    roomOrSpot: 'Main Reception Lounge',
    items: [
      {
        productId: 'prod-3',
        productName: 'Chubby Frogie Keychain',
        quantity: 2,
        price: 150,
        selectedColor: 'Sage Green',
        imageUrl: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?auto=format&fit=crop&w=800&q=80'
      },
      {
        productId: 'prod-1',
        productName: 'Eternal Soft Tulip Stem',
        quantity: 1,
        price: 180,
        selectedColor: 'Pastel Pink',
        imageUrl: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80'
      }
    ],
    subtotal: 480,
    deliveryFee: 0,
    total: 480,
    paymentMethod: 'Cash on Campus Pickup',
    paymentStatus: 'Pay on Pickup',
    status: 'Ready for Pickup',
    estimatedDeliveryDate: 'Today at 5:30 PM'
  }
];

export const INITIAL_CUSTOM_REQUESTS: CustomRequest[] = [
  {
    id: 'REQ-102',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    studentName: 'Rohan Mehta',
    phone: '+91 99887 76655',
    dormOrBuilding: 'Tagore Hostel',
    itemType: 'Custom Bouquet for Anniversary',
    primaryColor: 'Lavenders & White',
    secondaryColor: 'Soft Lilac Ribbon',
    targetDate: '2026-09-22',
    description: 'Need a customized bouquet with 3 lavender tulips, 2 white roses, and 1 mini lily. Please wrap in white paper with purple bow!',
    status: 'Pending Quote'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productName: 'Grand Sunflower & Daisy Bouquet',
    customerName: 'Ananya R.',
    rating: 5,
    comment: 'My boyfriend gifted me this bouquet on my birthday and it looks so aesthetically pleasing on my dorm study table! Clean stitches and amazing quality!',
    date: '2 days ago',
    verifiedStudent: true
  },
  {
    id: 'rev-2',
    productName: 'Chubby Frogie Keychain',
    customerName: 'Devansh K.',
    rating: 5,
    comment: 'Super cute frog keychain! Half my batch mates asked me where I bought it. Definitely ordering more stems soon.',
    date: '4 days ago',
    verifiedStudent: true
  },
  {
    id: 'rev-3',
    productName: 'Eternal Soft Tulip Stem',
    customerName: 'Sanya M.',
    rating: 5,
    comment: 'Ordered 5 tulip stems for my roomie team! Fast dorm delivery within 24 hours. Loved the personalized gift tags!',
    date: '1 week ago',
    verifiedStudent: true
  }
];

export const INITIAL_SETTINGS: StoreSettings = {
  storeName: 'Knot & Bloom Crochet Studio',
  tagline: 'Handcrafted With Love For Campus Decor & Gifts',
  universityName: 'University Campus Store',
  whatsappNumber: '+91 98765 43210',
  announcementText: '✨ FREE Campus Dorm Delivery on orders over ₹300! Order your everlasting flowers today 🌸',
  pickupLocation: 'Central Library Fountain Plaza / GH-3 Lounge',
  freeDeliveryThreshold: 300,
  adminUsername: 'admin',
  adminPin: 'admin123',
  campusDeliveryLocations: [
    "Hostel Block A (Men's Dorm)",
    "Hostel Block B (Men's Dorm)",
    "Girls Hostel 1 (GH-1)",
    "Girls Hostel 3 (GH-3)",
    "Central Library Plaza",
    "Student Activity Center (SAC)",
    "Science & Tech Quad Bench",
    "Faculty Housing / Off Campus"
  ],
  upiId: 'tanishcrochet@upi',
  upiPayeeName: 'Knot & Bloom Crochet Studio',
  upiQrImageUrl: '',
  paymentInstructions: 'Scan QR code with GPay, PhonePe, Paytm, or BHIM to complete payment instantly.'
};
