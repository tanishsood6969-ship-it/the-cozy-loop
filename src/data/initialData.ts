import type {
  Product,
  Order,
  CustomRequest,
  Review,
  StoreSettings
} from '../types';

/*
 * PRODUCTS
 *
 * Demo products have been removed.
 * Products will now come from Supabase
 * or be added through the Admin Portal.
 */
export const INITIAL_PRODUCTS: Product[] = [];

/*
 * INITIAL ORDERS
 *
 * Kept unchanged.
 */
export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-8942',
    createdAt: new Date(
      Date.now() - 3600000 * 4
    ).toISOString(),
    customerName: 'Aarav Sharma',
    phone: '+91 98765 43210',
    dormOrBuilding: 'Subir Hall - Block B',
    roomOrSpot: 'Room 304',
    items: [
      {
        productId: 'prod-2',
        productName:
          'Grand Sunflower & Daisy Bouquet',
        quantity: 1,
        price: 650,
        selectedColor:
          'Classic Yellow & Pink Mix',
        giftNote:
          'Happy Birthday Ananya! Hope you love these forever blooming flowers 🌻❤️',
        imageUrl:
          'https://images.unsplash.com/photo-1591886960571-74d43a9d4166?auto=format&fit=crop&w=800&q=80'
      }
    ],
    subtotal: 650,
    deliveryFee: 0,
    total: 650,
    paymentMethod: 'UPI / GPay',
    paymentStatus: 'Paid',
    status: 'Crocheting',
    estimatedDeliveryDate:
      'Tomorrow at 4:00 PM',
    specialInstructions:
      'Please deliver around evening after lectures end!'
  },

  {
    id: 'ORD-8941',
    createdAt: new Date(
      Date.now() - 3600000 * 26
    ).toISOString(),
    customerName: 'Priya Verma',
    phone: '+91 98123 76543',
    dormOrBuilding: 'Girls Hostel 3',
    roomOrSpot: 'Main Reception Lounge',
    items: [
      {
        productId: 'prod-3',
        productName:
          'Chubby Frogie Keychain',
        quantity: 2,
        price: 150,
        selectedColor: 'Sage Green',
        imageUrl:
          'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?auto=format&fit=crop&w=800&q=80'
      },

      {
        productId: 'prod-1',
        productName:
          'Eternal Soft Tulip Stem',
        quantity: 1,
        price: 180,
        selectedColor: 'Pastel Pink',
        imageUrl:
          'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80'
      }
    ],
    subtotal: 480,
    deliveryFee: 0,
    total: 480,
    paymentMethod:
      'Cash on Campus Pickup',
    paymentStatus: 'Pay on Pickup',
    status: 'Ready for Pickup',
    estimatedDeliveryDate:
      'Today at 5:30 PM'
  }
];

/*
 * INITIAL CUSTOM REQUESTS
 *
 * Kept unchanged.
 */
export const INITIAL_CUSTOM_REQUESTS: CustomRequest[] = [
  {
    id: 'REQ-102',
    createdAt: new Date(
      Date.now() - 3600000 * 12
    ).toISOString(),
    studentName: 'Rohan Mehta',
    phone: '+91 99887 76655',
    dormOrBuilding: 'Tagore Hostel',
    itemType:
      'Custom Bouquet for Anniversary',
    primaryColor:
      'Lavenders & White',
    secondaryColor:
      'Soft Lilac Ribbon',
    targetDate: '2026-09-22',
    description:
      'Need a customized bouquet with 3 lavender tulips, 2 white roses, and 1 mini lily. Please wrap in white paper with purple bow!',
    status: 'Pending Quote'
  }
];

/*
 * INITIAL REVIEWS
 *
 * Kept unchanged.
 */
export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productName:
      'Grand Sunflower & Daisy Bouquet',
    customerName: 'Ananya R.',
    rating: 5,
    comment:
      'My boyfriend gifted me this bouquet on my birthday and it looks so aesthetically pleasing on my dorm study table! Clean stitches and amazing quality!',
    date: '2 days ago',
    verifiedStudent: true
  },

  {
    id: 'rev-2',
    productName:
      'Chubby Frogie Keychain',
    customerName: 'Devansh K.',
    rating: 5,
    comment:
      'Super cute frog keychain! Half my batch mates asked me where I bought it. Definitely ordering more stems soon.',
    date: '4 days ago',
    verifiedStudent: true
  },

  {
    id: 'rev-3',
    productName:
      'Eternal Soft Tulip Stem',
    customerName: 'Sanya M.',
    rating: 5,
    comment:
      'Ordered 5 tulip stems for my roomie team! Fast dorm delivery within 24 hours. Loved the personalized gift tags!',
    date: '1 week ago',
    verifiedStudent: true
  }
];

/*
 * INITIAL STORE SETTINGS
 *
 * Kept unchanged.
 */
export const INITIAL_SETTINGS: StoreSettings = {
  storeName:
    'Knot & Bloom Crochet Studio',

  tagline:
    'Handcrafted With Love For Campus Decor & Gifts',

  universityName:
    'University Campus Store',

  whatsappNumber:
    '+91 98765 43210',

  announcementText:
    '✨ FREE Campus Dorm Delivery on orders over ₹300! Order your everlasting flowers today 🌸',

  pickupLocation:
    'Central Library Fountain Plaza / GH-3 Lounge',

  freeDeliveryThreshold: 300,

  adminUsername: 'admin',

  adminPin: 'admin123',

  campusDeliveryLocations: [
    "Hostel Block A (Men's Dorm)",
    "Hostel Block B (Men's Dorm)",
    'Girls Hostel 1 (GH-1)',
    'Girls Hostel 3 (GH-3)',
    'Central Library Plaza',
    'Student Activity Center (SAC)',
    'Science & Tech Quad Bench',
    'Faculty Housing / Off Campus'
  ],

  upiId:
    'tanishcrochet@upi',

  upiPayeeName:
    'Knot & Bloom Crochet Studio',

  upiQrImageUrl: '',

  paymentInstructions:
    'Scan QR code with GPay, PhonePe, Paytm, or BHIM to complete payment instantly.'
};