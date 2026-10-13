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
export const INITIAL_PRODUCTS: Product[] = [
{
id: 'rose-stem-01',
name: 'Classic Crochet Scrunchy',
category: 'Wearables & Hair',
price: 149,
originalPrice: 179,
stock: 25,
description: 'A handmade crochet Scrunchy that stays beautiful forever.',
features: ['Handmade yarn flower', 'Reusable gift', 'Approx. 25 cm tall'],
colorsAvailable: ['Red', 'Pink', 'White'],
imageUrl: '/products/round blue hand.jpeg',
isPopular: true,
leadTimeDays: 2,
rating: 4.8,
reviewCount: 12
},
{
id: 'sunflower-stem-02',
name: 'Sleepy Owl Keychain',
category: 'Keychains',
price: 179,
stock: 20,
description: 'A cheerful handmade Keychain.',
features: ['Soft yarn petals', 'Handmade centre', 'Perfect for gifting'],
colorsAvailable: ['Yellow', 'Orange'],
imageUrl: '/products/bird keychain.jpeg',
leadTimeDays: 2,
rating: 4.9,
reviewCount: 8
},
{
id: 'tulip-stem-03',
name: 'Crochet Bangles',
category: 'Wearables & Hair',
price: 1000,
stock: 30,
description: 'A delicate crochet tulip with a soft pastel aesthetic.',
features: ['Pastel yarn', 'Lightweight stem', 'Ideal for bouquets'],
colorsAvailable: ['Pink', 'Purple', 'Yellow', 'White'],
imageUrl: '/products/bracelet.jpeg',
leadTimeDays: 2,
rating: 4.7,
reviewCount: 6
},
{
id: 'lavender-stem-04',
name: 'Crochet Table Coaster',
category: 'Wearables & Hair',
price: 500,
stock: 25,
description: 'A handmade lavender-inspired stem for a calming room aesthetic.',
features: ['Purple yarn details', 'Minimalist design', 'Easy to display'],
colorsAvailable: ['Purple', 'Lilac', 'White'],
imageUrl:'/products/flower put.jpeg',
leadTimeDays: 2,
rating: 4.6,
reviewCount: 5
},
{
id: 'daisy-stem-05',
name: 'Cute Crochet Rose Boquet',
category: 'Flower Stems',
price: 300,
stock: 22,
description: 'A sweet handmade daisy that makes an adorable little gift.',
features: ['White petals', 'Yellow centre', 'Handmade finish'],
colorsAvailable: ['White', 'Pink', 'Yellow'],
imageUrl: '/products/mini boquet.jpeg',
leadTimeDays: 2,
rating: 4.8,
reviewCount: 9
},
{
id: 'rose-bouquet-06',
name: 'Crochet Handbag',
category: 'Handbags & Pouches',
price: 1200,
originalPrice: 699,
stock: 10,
description: 'A beautiful handmade rose bouquet designed for anniversaries and birthdays.',
features: ['Five crochet roses', 'Gift wrapping', 'Custom colour options'],
colorsAvailable: ['Red', 'Pink', 'Cream'],
imageUrl:'/products/pink hand bag 2.jpeg',
isPopular: true,
leadTimeDays: 4,
rating: 4.9,
reviewCount: 15
},
{
id: 'sunflower-bouquet-07',
name: 'Crochet Blossom Handbag',
category: 'Handbags & Pouches',
price: 1500,
stock: 12,
description: 'A cheerful sunflower-inspired bouquet for friends and family.',
features: ['Handmade flowers', 'Decorative wrapping', 'Gift-ready'],
colorsAvailable: ['Yellow', 'Orange', 'Cream'],
imageUrl: '/products/pink handbag.jpeg',
leadTimeDays: 4,
rating: 4.8,
reviewCount: 7
},
{
id: 'pastel-bouquet-08',
name: 'Peacock Feather Handpurse',
category: 'Handbags & Pouches',
price: 400,
stock: 8,
description: 'A dreamy pastel crochet bouquet for a soft and elegant gift.',
features: ['Mixed crochet flowers', 'Pastel palette', 'Premium wrapping'],
colorsAvailable: ['Pink', 'Lilac', 'Cream'],
imageUrl:'/products/pouch.jpeg',
isPopular: true,
leadTimeDays: 5,
rating: 4.9,
reviewCount: 11
},
{
id: 'mini-bouquet-09',
name: 'Crochet Hairpin',
category: 'Wearables & Hair',
price: 349,
stock: 15,
description: 'A small and affordable crochet bouquet made for everyday gifting.',
features: ['Compact size', 'Handmade flowers', 'Budget-friendly'],
colorsAvailable: ['Pink', 'Yellow', 'Red', 'Purple'],
imageUrl: '/products/hairpin.jpeg',
leadTimeDays: 3,
rating: 4.7,
reviewCount: 6
},
{
id: 'mixed-bouquet-10',
name: 'Rose Flower Pot',
category: 'Bouquets',
price: 300,
stock: 6,
description: 'A statement bouquet of handcrafted yarn flowers for special occasions.',
features: ['Large bouquet', 'Multiple flower styles', 'Custom wrapping'],
colorsAvailable: ['Red', 'Pink', 'Purple', 'White'],
imageUrl: '/products/WhatsApp Image 2026-10-13 at 2.37.03 PM (1).jpeg',
leadTimeDays: 6,
rating: 5.0,
reviewCount: 4
},
{
id: 'heart-keychain-11',
name: 'Sunflower Pot',
category: 'Bouquets',
price: 300,
stock: 40,
description: 'A tiny handmade heart charm for keys, backpacks, and handbags.',
features: ['Lightweight', 'Metal key ring', 'Cute heart shape'],
colorsAvailable: ['Red', 'Pink', 'White', 'Black'],
imageUrl: '/products/WhatsApp Image 2026-10-13 at 2.37.03 PM.jpeg',
isPopular: true,
leadTimeDays: 1,
rating: 4.8,
reviewCount: 14
},
{
id: 'flower-keychain-12',
name: 'Crochet Winter Cap',
category: 'Wearables & Hair',
price: 400,
stock: 35,
description: 'A colourful crochet flower charm for your everyday essentials.',
features: ['Flower design', 'Secure metal ring', 'Handmade'],
colorsAvailable: ['Pink', 'Yellow', 'Purple', 'Blue'],
imageUrl: '/products/WhatsApp Image 2026-10-13 at 4.43.51 PM (1).jpeg',
leadTimeDays: 1,
rating: 4.7,
reviewCount: 8
},
{
id: 'smiley-keychain-13',
name: 'Crochet Plushy',
category: 'Plushies & Amigurumi',
price: 2000,
stock: 45,
description: 'A cheerful smiley charm to add personality to your bag.',
features: ['Smiley face', 'Compact size', 'Everyday accessory'],
colorsAvailable: ['Yellow', 'Pink', 'Blue'],
imageUrl: '/products/WhatsApp Image 2026-10-13 at 4.43.51 PM (2).jpeg',
leadTimeDays: 1,
rating: 4.6,
reviewCount: 5
},
{
id: 'tote-bag-14',
name: 'Crochet Hand Gloves',
category: 'Wearables & Hair',
price: 400,
stock: 7,
description: 'A handmade crochet tote for carrying everyday essentials in style.',
features: ['Reusable design', 'Handmade yarn construction', 'Spacious interior'],
colorsAvailable: ['Cream', 'Brown', 'Black', 'Pink'],
imageUrl: '/products/WhatsApp Image 2026-10-13 at 4.43.51 PM.jpeg',
isPopular: true,
leadTimeDays: 7,
rating: 4.9,
reviewCount: 10
},
{
id: 'rose-bag-15',
name: 'Strawberry Keychain',
category: 'Keychains',
price: 200,
stock: 5,
description: 'A statement crochet handbag with a romantic rose-inspired design. Custom colours available.',
features: ['Handmade statement piece', 'Custom yarn shades', 'Gift-worthy design'],
colorsAvailable: ['Pink', 'Red', 'Cream', 'Black'],
imageUrl: '/products/WhatsApp Image 2026-10-13 at 4.43.52 PM (1).jpeg',
isPopular: true,
isNew: true,
leadTimeDays: 8,
rating: 5.0,
reviewCount: 3
},
{
id: 'coin-pouch-16',
name: 'Crochet Bow Handgloves',
category: 'Wearables & Hair',
price: 500,
stock: 18,
description: 'A compact pouch for coins, earphones, and other small essentials.',
features: ['Small storage pouch', 'Handmade texture', 'Easy to carry'],
colorsAvailable: ['Pink', 'Blue', 'Cream', 'Brown'],
imageUrl: '/products/WhatsApp Image 2026-10-13 at 4.43.52 PM (2).jpeg',
leadTimeDays: 3,
rating: 4.7,
reviewCount: 6
},
{
id: 'shoulder-bag-17',
name: 'Forever Rose Flower Bouquet',
category: 'Bouquets',
price: 999,
stock: 6,
description: 'A stylish handmade shoulder bag for college and casual outings.',
features: ['Shoulder strap', 'Everyday capacity', 'Colour customisation'],
colorsAvailable: ['Cream', 'Olive', 'Brown', 'Black'],
imageUrl: '/products/WhatsApp Image 2026-10-13 at 4.43.52 PM.jpeg',
leadTimeDays: 7,
rating: 4.8,
reviewCount: 7
},
{
id: 'teddy-plush-18',
name: 'Crochet Octopus Plushie',
category: 'Plushies & Amigurumi',
price: 600,
stock: 12,
description: 'A soft handmade teddy bear for gifting or decorating your desk.',
features: ['Amigurumi design', 'Soft yarn exterior', 'Handmade with care'],
colorsAvailable: ['Brown', 'Cream', 'Pink'],
imageUrl: '/products/WhatsApp Image 2026-10-13 at 4.43.53 PM (1).jpeg',
isPopular: true,
leadTimeDays: 4,
rating: 4.9,
reviewCount: 9
},
{
id: 'octopus-plush-19',
name: 'Sunflower Keychain',
category: 'Keychains',
price: 200,
stock: 16,
description: 'A pocket-sized crochet octopus with cute curly tentacles.',
features: ['Small plush toy', 'Cute tentacles', 'Multiple colours'],
colorsAvailable: ['Blue', 'Purple', 'Pink', 'Orange'],
imageUrl: '/products/WhatsApp Image 2026-10-13 at 4.43.53 PM.jpeg',
leadTimeDays: 3,
rating: 4.8,
reviewCount: 7
},
]


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