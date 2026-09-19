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
 * No demo products.
 * Products will come from Supabase
 * or be added through the Admin Portal.
 */
export const INITIAL_PRODUCTS: Product[] = [];

/*
 * ORDERS
 *
 * No demo orders.
 * Orders will be created through the actual store.
 */
export const INITIAL_ORDERS: Order[] = [];

/*
 * CUSTOM REQUESTS
 *
 * No demo custom requests.
 */
export const INITIAL_CUSTOM_REQUESTS: CustomRequest[] = [];

/*
 * REVIEWS
 *
 * No demo reviews.
 * Reviews will be created through the actual store.
 */
export const INITIAL_REVIEWS: Review[] = [];

/*
 * STORE SETTINGS
 *
 * Your actual store settings are kept.
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