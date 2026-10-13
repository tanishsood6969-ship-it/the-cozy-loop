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
name: 'Classic Crochet Rose',
category: 'Flower Stems',
price: 149,
originalPrice: 179,
stock: 25,
description: 'A handmade crochet rose that stays beautiful forever. Perfect for gifts and room decor.',
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
name: 'Sunny Crochet Sunflower',
category: 'Flower Stems',
price: 179,
stock: 20,
description: 'A cheerful handmade sunflower to brighten up your desk or bedroom.',
features: ['Soft yarn petals', 'Handmade centre', 'Perfect for gifting'],
colorsAvailable: ['Yellow', 'Orange'],
imageUrl: '/products/bird keychain.jpeg',
leadTimeDays: 2,
rating: 4.9,
reviewCount: 8
},
{
id: 'tulip-stem-03',
name: 'Pastel Crochet Tulip',
category: 'Flower Stems',
price: 129,
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
name: 'Lavender Crochet Stem',
category: 'Flower Stems',
price: 119,
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
name: 'Cute Crochet Daisy',
category: 'Flower Stems',
price: 139,
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
name: 'Romantic Rose Bouquet',
category: 'Bouquets',
price: 599,
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
name: 'Sunshine Bouquet',
category: 'Bouquets',
price: 499,
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
name: 'Pastel Dream Bouquet',
category: 'Bouquets',
price: 649,
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
name: 'Mini Flower Bouquet',
category: 'Bouquets',
price: 349,
stock: 15,
description: 'A small and affordable crochet bouquet made for everyday gifting.',
features: ['Compact size', 'Handmade flowers', 'Budget-friendly'],
colorsAvailable: ['Pink', 'Yellow', 'Red', 'Purple'],
imageUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800',
leadTimeDays: 3,
rating: 4.7,
reviewCount: 6
},
{
id: 'mixed-bouquet-10',
name: 'Forever Flowers Bouquet',
category: 'Bouquets',
price: 799,
stock: 6,
description: 'A statement bouquet of handcrafted yarn flowers for special occasions.',
features: ['Large bouquet', 'Multiple flower styles', 'Custom wrapping'],
colorsAvailable: ['Red', 'Pink', 'Purple', 'White'],
imageUrl: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=800',
leadTimeDays: 6,
rating: 5.0,
reviewCount: 4
},
{
id: 'heart-keychain-11',
name: 'Crochet Heart Keychain',
category: 'Keychains',
price: 99,
stock: 40,
description: 'A tiny handmade heart charm for keys, backpacks, and handbags.',
features: ['Lightweight', 'Metal key ring', 'Cute heart shape'],
colorsAvailable: ['Red', 'Pink', 'White', 'Black'],
imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800',
isPopular: true,
leadTimeDays: 1,
rating: 4.8,
reviewCount: 14
},
{
id: 'flower-keychain-12',
name: 'Flower Power Keychain',
category: 'Keychains',
price: 119,
stock: 35,
description: 'A colourful crochet flower charm for your everyday essentials.',
features: ['Flower design', 'Secure metal ring', 'Handmade'],
colorsAvailable: ['Pink', 'Yellow', 'Purple', 'Blue'],
imageUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800',
leadTimeDays: 1,
rating: 4.7,
reviewCount: 8
},
{
id: 'smiley-keychain-13',
name: 'Happy Smiley Keychain',
category: 'Keychains',
price: 89,
stock: 45,
description: 'A cheerful smiley charm to add personality to your bag.',
features: ['Smiley face', 'Compact size', 'Everyday accessory'],
colorsAvailable: ['Yellow', 'Pink', 'Blue'],
imageUrl: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800',
leadTimeDays: 1,
rating: 4.6,
reviewCount: 5
},
{
id: 'tote-bag-14',
name: 'Everyday Crochet Tote',
category: 'Handbags & Pouches',
price: 899,
stock: 7,
description: 'A handmade crochet tote for carrying everyday essentials in style.',
features: ['Reusable design', 'Handmade yarn construction', 'Spacious interior'],
colorsAvailable: ['Cream', 'Brown', 'Black', 'Pink'],
imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800',
isPopular: true,
leadTimeDays: 7,
rating: 4.9,
reviewCount: 10
},
{
id: 'rose-bag-15',
name: 'Handmade Rose Bag',
category: 'Handbags & Pouches',
price: 1199,
stock: 5,
description: 'A statement crochet handbag with a romantic rose-inspired design. Custom colours available.',
features: ['Handmade statement piece', 'Custom yarn shades', 'Gift-worthy design'],
colorsAvailable: ['Pink', 'Red', 'Cream', 'Black'],
imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800',
isPopular: true,
isNew: true,
leadTimeDays: 8,
rating: 5.0,
reviewCount: 3
},
{
id: 'coin-pouch-16',
name: 'Mini Crochet Coin Pouch',
category: 'Handbags & Pouches',
price: 249,
stock: 18,
description: 'A compact pouch for coins, earphones, and other small essentials.',
features: ['Small storage pouch', 'Handmade texture', 'Easy to carry'],
colorsAvailable: ['Pink', 'Blue', 'Cream', 'Brown'],
imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800',
leadTimeDays: 3,
rating: 4.7,
reviewCount: 6
},
{
id: 'shoulder-bag-17',
name: 'Crochet Shoulder Bag',
category: 'Handbags & Pouches',
price: 999,
stock: 6,
description: 'A stylish handmade shoulder bag for college and casual outings.',
features: ['Shoulder strap', 'Everyday capacity', 'Colour customisation'],
colorsAvailable: ['Cream', 'Olive', 'Brown', 'Black'],
imageUrl: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800',
leadTimeDays: 7,
rating: 4.8,
reviewCount: 7
},
{
id: 'teddy-plush-18',
name: 'Little Teddy Amigurumi',
category: 'Plushies & Amigurumi',
price: 399,
stock: 12,
description: 'A soft handmade teddy bear for gifting or decorating your desk.',
features: ['Amigurumi design', 'Soft yarn exterior', 'Handmade with care'],
colorsAvailable: ['Brown', 'Cream', 'Pink'],
imageUrl: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=800',
isPopular: true,
leadTimeDays: 4,
rating: 4.9,
reviewCount: 9
},
{
id: 'octopus-plush-19',
name: 'Tiny Octopus Plushie',
category: 'Plushies & Amigurumi',
price: 229,
stock: 16,
description: 'A pocket-sized crochet octopus with cute curly tentacles.',
features: ['Small plush toy', 'Cute tentacles', 'Multiple colours'],
colorsAvailable: ['Blue', 'Purple', 'Pink', 'Orange'],
imageUrl: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=800',
leadTimeDays: 3,
rating: 4.8,
reviewCount: 7
},
{
id: 'frog-plush-20',
name: 'Frog Prince Plushie',
category: 'Plushies & Amigurumi',
price: 349,
stock: 10,
description: 'A whimsical handmade frog plushie for your shelf or study table.',
features: ['Frog-inspired design', 'Soft yarn texture', 'Decorative plush'],
colorsAvailable: ['Green', 'Mint', 'Yellow'],
imageUrl: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=800',
leadTimeDays: 4,
rating: 4.8,
reviewCount: 6
},
{
id: 'bucket-hat-21',
name: 'Crochet Bucket Hat',
category: 'Wearables & Hair',
price: 499,
stock: 10,
description: 'A handmade crochet bucket hat for a playful everyday look.',
features: ['Wearable crochet design', 'Custom sizing available', 'Made to order'],
colorsAvailable: ['Cream', 'Black', 'Pink', 'Green'],
imageUrl: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800',
leadTimeDays: 5,
rating: 4.7,
reviewCount: 5
},
{
id: 'scrunchie-22',
name: 'Crochet Hair Scrunchie',
category: 'Wearables & Hair',
price: 79,
stock: 40,
description: 'A cute handmade crochet scrunchie to accessorise your hairstyle.',
features: ['Soft yarn exterior', 'Reusable hair accessory', 'Compact design'],
colorsAvailable: ['Pink', 'Purple', 'White', 'Blue'],
imageUrl: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800',
leadTimeDays: 1,
rating: 4.6,
reviewCount: 4
},
{
id: 'headband-23',
name: 'Crochet Flower Headband',
category: 'Wearables & Hair',
price: 199,
stock: 20,
description: 'A handmade headband decorated with crochet flower details.',
features: ['Flower embellishments', 'Lightweight accessory', 'Made to order'],
colorsAvailable: ['Pink', 'White', 'Yellow', 'Lilac'],
imageUrl: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800',
leadTimeDays: 3,
rating: 4.7,
reviewCount: 5
},
{
id: 'phone-pouch-24',
name: 'Crochet Phone Pouch',
category: 'Handbags & Pouches',
price: 299,
stock: 15,
description: 'A handy crochet pouch to protect and carry your phone.',
features: ['Lightweight design', 'Custom sizing', 'Choice of yarn colours'],
colorsAvailable: ['Cream', 'Brown', 'Pink', 'Black'],
imageUrl: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800',
leadTimeDays: 3,
rating: 4.7,
reviewCount: 6
},
{
id: 'gift-set-25',
name: 'Crochet Gift Set',
category: 'Bouquets',
price: 699,
stock: 8,
description: 'A thoughtful handmade gift set combining crochet flowers and a small keepsake.',
features: ['Gift-ready presentation', 'Handmade details', 'Custom colour selection'],
colorsAvailable: ['Pink', 'Red', 'Cream', 'Purple'],
imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800',
isPopular: true,
leadTimeDays: 5,
rating: 4.9,
reviewCount: 8
}
];


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