export type ProductCategory = 
  | 'All' 
  | 'Flower Stems' 
  | 'Bouquets' 
  | 'Keychains' 
  | 'Handbags & Pouches' 
  | 'Plushies & Amigurumi' 
  | 'Wearables & Hair';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  dormOrBuilding?: string;
  roomOrSpot?: string;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  stock: number;
  description: string;
  features: string[];
  colorsAvailable: string[];
  imageUrl: string;
  isPopular?: boolean;
  isNew?: boolean;
  leadTimeDays: number;
  rating: number;
  reviewCount: number;
}

export interface CustomizationOption {
  colorChoices: string[];
  wrapPaperColor?: string;
  ribbonColor?: string;
  giftMessage?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  wrapPaperColor?: string;
  giftNote?: string;
}

export type OrderStatus = 'Pending' | 'Crocheting' | 'Ready for Pickup' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  createdAt: string;
  customerName: string;
  phone: string;
  dormOrBuilding: string;
  roomOrSpot: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    selectedColor?: string;
    giftNote?: string;
    imageUrl: string;
  }[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: 'UPI / GPay' | 'Cash on Campus Pickup' | 'Card';
  paymentStatus: 'Paid' | 'Pay on Pickup' | 'Payment Verified ✅' | 'Payment Pending Owner Verification';
  estimatedDeliveryDate: string;
  specialInstructions?: string;
  userId?: string;
  upiTransactionId?: string;
  paymentScreenshotUrl?: string;
  paymentVerificationStatus?: 'Pending Owner Verification' | 'Payment Verified ✅' | 'Payment Rejected ❌';
}

export interface CustomRequest {
  id: string;
  createdAt: string;
  studentName: string;
  phone: string;
  dormOrBuilding: string;
  itemType: string;
  primaryColor: string;
  secondaryColor: string;
  targetDate: string;
  description: string;
  referenceImageUrl?: string;
  status: 'Pending Quote' | 'Approved & Crocheting' | 'Ready for Pickup' | 'Completed';
  quotedPrice?: number;
}

export interface Review {
  id: string;
  productName: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  userAvatar?: string;
  verifiedStudent: boolean;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  universityName: string;
  whatsappNumber: string;
  announcementText: string;
  pickupLocation: string;
  freeDeliveryThreshold: number;
  adminUsername: string;
  adminPin: string;
  campusDeliveryLocations: string[];
  upiId: string;
  upiPayeeName: string;
  upiQrImageUrl?: string;
  paymentInstructions: string;
}
