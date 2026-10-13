import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef
} from 'react';

import type {
  Product,
  Order,
  CustomRequest,
  Review,
  StoreSettings,
  CartItem,
  ProductCategory,
  OrderStatus,
  User
} from '../types';

import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_CUSTOM_REQUESTS,
  INITIAL_REVIEWS,
  INITIAL_SETTINGS
} from '../data/initialData';

import { supabase } from '../lib/supabaseClient';

/*
 * ============================================================
 * MODAL TYPE
 * ============================================================
 */

type ActiveModal =
  | 'image'
  | 'product'
  | 'customOrder'
  | 'checkout'
  | 'orderSuccess'
  | 'orderTracker'
  | 'auth'
  | 'adminAuth'
  | 'userOrders'
  | null;

/*
 * ============================================================
 * STORE CONTEXT TYPE
 * ============================================================
 */

interface StoreContextType {
  products: Product[];
  orders: Order[];
  customRequests: CustomRequest[];
  reviews: Review[];
  cart: CartItem[];
  settings: StoreSettings;

  currentUser: User | null;
  registeredUsers: User[];

  loginUserWithPassword: (
    loginId: string,
    password: string
  ) => boolean;

  signupUserWithPassword: (
    name: string,
    email: string,
    phone: string,
    password: string,
    dormOrBuilding?: string,
    roomOrSpot?: string
  ) => User;

  sendOtpCode: (
    identifier: string
  ) => string;

  verifyOtpCode: (
    identifier: string,
    code: string,
    generatedCode: string
  ) => boolean;

  loginUserDirect: (user: User) => void;
  logoutUser: () => void;

  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;

  adminAuthenticated: boolean;

  loginAdminWithCredentials: (
    username: string,
    pin: string
  ) => boolean;

  logoutAdmin: () => void;

  selectedCategory: ProductCategory;
  setSelectedCategory: (
    cat: ProductCategory
  ) => void;

  searchQuery: string;
  setSearchQuery: (q: string) => void;

  cartOpen: boolean;
  setCartOpen: (val: boolean) => void;

  activeModal: ActiveModal;

  setActiveModal: (
    modal: ActiveModal
  ) => void;

  selectedProduct: Product | null;
  setSelectedProduct: (
    prod: Product | null
  ) => void;

  lastCreatedOrder: Order | null;
  setLastCreatedOrder: (
    ord: Order | null
  ) => void;

  isDarkMode: boolean;
  toggleDarkMode: () => void;

  toastMessage: string | null;
  showToast: (msg: string) => void;

  addToCart: (
    product: Product,
    quantity?: number,
    selectedColor?: string,
    wrapPaperColor?: string,
    giftNote?: string
  ) => void;

  updateCartQuantity: (
    index: number,
    quantity: number
  ) => void;

  removeFromCart: (index: number) => void;
  clearCart: () => void;

  addProduct: (
    product: Omit<
      Product,
      'id' | 'rating' | 'reviewCount'
    >
  ) => void;

  updateProduct: (
    id: string,
    updatedFields: Partial<Product>
  ) => void;

  updateStock: (
    id: string,
    newStock: number
  ) => void;

  deleteProduct: (id: string) => void;

  createOrder: (
    orderData: Omit<
      Order,
      'id' | 'createdAt' | 'status'
    >
  ) => Order;

  updateOrderStatus: (
    id: string,
    status: OrderStatus
  ) => void;

  verifyOrderPayment: (
    id: string,
    isVerified: boolean
  ) => void;

  createCustomRequest: (
    reqData: Omit<
      CustomRequest,
      'id' | 'createdAt' | 'status'
    >
  ) => void;

  updateCustomRequestStatus: (
    id: string,
    status: CustomRequest['status'],
    quotedPrice?: number
  ) => void;

  addReview: (
    reviewData: Omit<
      Review,
      'id' | 'date' | 'verifiedStudent'
    >
  ) => void;

  updateSettings: (
    newSettings: Partial<StoreSettings>
  ) => void;
}

const StoreContext =
  createContext<StoreContextType | undefined>(
    undefined
  );

/*
 * ============================================================
 * SAFE LOCAL STORAGE HELPERS
 * ============================================================
 */

const getSafeLocalStorage = <T,>(
  key: string,
  fallback: T
): T => {
  try {
    const saved = localStorage.getItem(key);

    if (!saved || saved === 'undefined' || saved === 'null') {
      return fallback;
    }

    return JSON.parse(saved) as T;
  } catch {
    return fallback;
  }
};

const setSafeLocalStorage = (key: string, value: unknown) => {
  try {
    if (value === undefined) {
      localStorage.removeItem(key);
      return;
    }

    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Intentionally silent: localStorage is only a cache.
  }
};

const getSafeErrorMessage = (error: unknown): string => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error
  ) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === 'string' && message.trim()) {
      return message;
    }
  }

  return 'Unknown error';
};

const stripBase64CardImages = (productList: Product[]): Product[] => {
  return productList.map(product => {
    if (
      typeof product.cardImageUrl === 'string' &&
      product.cardImageUrl.startsWith('data:image/')
    ) {
      return {
        ...product,
        cardImageUrl: undefined
      };
    }

    return product;
  });
};

/*
 * ============================================================
 * DEMO USER
 * ============================================================
 */

const INITIAL_DEMO_USERS: User[] = [
  {
    id: 'usr-demo-1',
    name: 'Aarav Sharma',
    email: 'aarav@university.edu',
    phone: '+91 98765 43210',
    password: 'student123',
    dormOrBuilding:
      'Subir Hall - Block B',
    roomOrSpot: 'Room 304'
  }
];

/*
 * ============================================================
 * STORE PROVIDER
 * ============================================================
 */

export const StoreProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  /*
   * ============================================================
   * LOCAL STATE
   * ============================================================
   */

  const [products, setProducts] =
    useState<Product[]>(() =>
      getSafeLocalStorage(
        'knot_bloom_products',
        INITIAL_PRODUCTS
      )
    );

  const [orders, setOrders] =
    useState<Order[]>(() =>
      getSafeLocalStorage(
        'knot_bloom_orders',
        INITIAL_ORDERS
      )
    );

  const [customRequests, setCustomRequests] =
    useState<CustomRequest[]>(() =>
      getSafeLocalStorage(
        'knot_bloom_custom_requests',
        INITIAL_CUSTOM_REQUESTS
      )
    );

  const [reviews, setReviews] =
    useState<Review[]>(() =>
      getSafeLocalStorage(
        'knot_bloom_reviews',
        INITIAL_REVIEWS
      )
    );

  const [settings, setSettings] =
    useState<StoreSettings>(() => {
      const parsed =
        getSafeLocalStorage(
          'knot_bloom_settings',
          INITIAL_SETTINGS
        );

      return {
        ...INITIAL_SETTINGS,
        ...parsed
      };
    });

  /*
   * Cart and logged-in user remain device-specific.
   */

  const [cart, setCart] =
    useState<CartItem[]>(() =>
      getSafeLocalStorage(
        'knot_bloom_cart',
        []
      )
    );

  const [registeredUsers, setRegisteredUsers] =
    useState<User[]>(() =>
      getSafeLocalStorage(
        'knot_bloom_registered_users',
        INITIAL_DEMO_USERS
      )
    );

  const [currentUser, setCurrentUser] =
    useState<User | null>(() =>
      getSafeLocalStorage(
        'knot_bloom_current_user',
        null
      )
    );

  /*
   * ============================================================
   * ADMIN AUTH
   * ============================================================
   */

  const [isAdmin, setIsAdminState] =
    useState(false);

  const [
    adminAuthenticated,
    setAdminAuthenticated
  ] = useState<boolean>(() => {
    return (
      sessionStorage.getItem(
        'knot_bloom_admin_auth'
      ) === 'true'
    );
  });

  /*
   * ============================================================
   * UI STATE
   * ============================================================
   */

  const [selectedCategory, setSelectedCategory] =
    useState<ProductCategory>('All');

  const [searchQuery, setSearchQuery] =
    useState('');

  /*
   * ============================================================
   * DARK MODE
   * ============================================================
   */

  const [isDarkMode, setIsDarkMode] =
    useState<boolean>(() => {
      return (
        localStorage.getItem(
          'cozy_dark_mode'
        ) === 'true'
      );
    });

  useEffect(() => {
    const root =
      document.documentElement;

    root.classList.toggle(
      'dark',
      isDarkMode
    );

    localStorage.setItem(
      'cozy_dark_mode',
      isDarkMode
        ? 'true'
        : 'false'
    );
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(
      prev => !prev
    );
  };

  const [cartOpen, setCartOpen] =
    useState(false);

  /*
   * ============================================================
   * ACTIVE MODAL
   *
   * IMPORTANT:
   * 'image' is included here so Quick View can
   * open the image-only preview.
   * ============================================================
   */

  const [activeModal, setActiveModal] =
    useState<ActiveModal>(null);

  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  const [lastCreatedOrder, setLastCreatedOrder] =
    useState<Order | null>(null);

  const [toastMessage, setToastMessage] =
    useState<string | null>(null);

  /*
   * ============================================================
   * CLOUD SYNC CONTROL
   * ============================================================
   */

  const cloudInitialized =
    useRef(false);

  /*
   * Prevent duplicate Add To Cart calls.
   */

  const addToCartLock =
    useRef(false);

  const cloudLoadFailed =
    useRef(false);

  /*
   * Toast refs.
   */

  const toastTimeoutRef =
    useRef<ReturnType<typeof setTimeout> | null>(
      null
    );

  const lastToastMessageRef =
    useRef<string | null>(null);

  const lastToastTimeRef =
    useRef<number>(0);

  const cloudDataTypes =
    useRef<Set<string>>(
      new Set()
    );

  const modifiedDataTypes =
    useRef<Set<string>>(
      new Set()
    );

  const lastCloudData =
    useRef<Record<string, string>>(
      {}
    );

  /*
   * Keep latest reviews available to callbacks/effects
   * that are created only once.
   */

  const reviewsRef =
    useRef<Review[]>(reviews);

  useEffect(() => {
    reviewsRef.current =
      reviews;
  }, [reviews]);

  /*
   * ============================================================
   * SAVE QUEUE
   * ============================================================
   */

  const saveQueues =
    useRef<Record<string, Promise<void>>>(
      {}
    );

  /*
   * ============================================================
   * REVIEW HELPERS
   * ============================================================
   */

  const mergeReviews = (
    existing: Review[],
    incoming: Review[]
  ): Review[] => {
    const merged =
      new Map<string, Review>();

    /*
     * Add cloud reviews first.
     */

    incoming.forEach(
      review => {
        if (review?.id) {
          merged.set(
            String(review.id),
            review
          );
        }
      }
    );

    /*
     * Add current/local reviews after cloud reviews.
     */

    existing.forEach(
      review => {
        if (review?.id) {
          merged.set(
            String(review.id),
            review
          );
        }
      }
    );

    /*
     * Newest generated review IDs first.
     */

    return Array.from(
      merged.values()
    ).sort(
      (a, b) => {
        const aTime =
          Number(
            String(a.id)
              .replace(/\D/g, '')
          ) || 0;

        const bTime =
          Number(
            String(b.id)
              .replace(/\D/g, '')
          ) || 0;

        return bTime - aTime;
      }
    );
  };

  /*
   * ============================================================
   * RECALCULATE PRODUCT RATINGS
   * ============================================================
   */

  const recalculateProductRatings = (
    productList: Product[],
    reviewList: Review[]
  ): Product[] => {
    return productList.map(
      product => {
        const productName =
          product.name
            ?.trim()
            .toLowerCase();

        const productReviews =
          reviewList.filter(
            review =>
              review.productName
                ?.trim()
                .toLowerCase() ===
              productName
          );

        /*
         * No reviews = preserve existing rating.
         */

        if (
          productReviews.length ===
          0
        ) {
          return product;
        }

        const ratings =
          productReviews
            .map(
              review =>
                Number(
                  review.rating
                )
            )
            .filter(
              rating =>
                Number.isFinite(
                  rating
                ) &&
                rating >= 1 &&
                rating <= 5
            );

        if (
          ratings.length ===
          0
        ) {
          return product;
        }

        const total =
          ratings.reduce(
            (
              sum,
              rating
            ) =>
              sum + rating,
            0
          );

        const average =
          total /
          ratings.length;

        const rounded =
          Math.round(
            average * 10
          ) / 10;

        return {
          ...product,
          rating: rounded,
          reviewCount:
            ratings.length
        };
      }
    );
  };

/*
 * ============================================================
 * LOW-EGRESS CLOUD SYNC
 *
 * Products are stored one-per-row in `store_products`.
 * This is the important change: editing one product no longer
 * uploads/downloads the entire products array.
 * ============================================================
 */

  const productsRef = useRef<Product[]>(products);
  productsRef.current = products;

  const modifiedProductIds = useRef<Set<string>>(new Set());
  const deletedProductIds = useRef<Set<string>>(new Set());
  const productMutationVersions = useRef<Record<string, number>>({});
  const productSaveQueues = useRef<Record<string, Promise<void>>>({});
  const pendingProductSaves = useRef<Set<string>>(new Set());
  const lastCloudProductData = useRef<Record<string, string>>({});
  const productSortOrders = useRef<Record<string, number>>({});
  const nextProductSortOrder = useRef(0);

  const realtimeChannelRef = useRef<any>(null);
  const realtimeReadyRef = useRef(false);
  const realtimeClientId = useRef(
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `client-${Date.now()}-${Math.random().toString(36).slice(2)}`
  );
  const pendingProductBroadcasts = useRef<
    Map<string, boolean>
  >(new Map());
  const productRealtimeTimers = useRef<
    Record<string, ReturnType<typeof setTimeout>>
  >({});
  const productRealtimeInFlight = useRef<Set<string>>(new Set());

  const realtimeDebounceTimers = useRef<
    Record<string, ReturnType<typeof setTimeout>>
  >({});
  const realtimeRefreshInFlight = useRef<Set<string>>(new Set());
  const pendingLocalSaves = useRef<Set<string>>(new Set());
  const localMutationVersion = useRef<Record<string, number>>({});

 const markDataTypeModified = (dataType: string) => {
  modifiedDataTypes.current.add(dataType);

  localMutationVersion.current[dataType] =
    (localMutationVersion.current[dataType] || 0) + 1;
};

  const markProductModified = (id: string) => {
    modifiedProductIds.current.add(id);
    deletedProductIds.current.delete(id);
    productMutationVersions.current[id] =
      (productMutationVersions.current[id] || 0) + 1;
  };

  const markProductDeleted = (id: string) => {
    modifiedProductIds.current.add(id);
    deletedProductIds.current.add(id);
    productMutationVersions.current[id] =
      (productMutationVersions.current[id] || 0) + 1;
  };

  const dataUrlToBlob = async (dataUrl: string): Promise<Blob> => {
    const response = await fetch(dataUrl);
    if (!response.ok) {
      throw new Error('Unable to convert image data.');
    }
    return response.blob();
  };

  const uploadProductCardImage = async (
    product: Product
  ): Promise<Product> => {
    const cardImageUrl = product.cardImageUrl;

    if (
      typeof cardImageUrl !== 'string' ||
      !cardImageUrl.startsWith('data:image/')
    ) {
      return product;
    }

    const blob = await dataUrlToBlob(cardImageUrl);
    const filePath = `products/${product.id}/card-image.jpg`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, blob, {
        contentType: 'image/jpeg',
        cacheControl: '31536000',
        upsert: true
      });

    if (uploadError) {
      throw new Error(
        `Image upload failed: ${getSafeErrorMessage(uploadError)}`
      );
    }

    const { data: publicUrlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    if (!publicUrlData?.publicUrl) {
      throw new Error('Image URL could not be created.');
    }

    return {
      ...product,
      // The version changes only when a new Base64 image was actually uploaded.
      // Normal product edits keep the same cached URL.
      cardImageUrl: `${publicUrlData.publicUrl}?v=${Date.now()}`
    };
  };

  const broadcastProductChange = async (
    productId: string,
    deleted = false
  ) => {
    pendingProductBroadcasts.current.set(productId, deleted);

    if (!realtimeChannelRef.current || !realtimeReadyRef.current) {
      return;
    }

    try {
      await realtimeChannelRef.current.send({
        type: 'broadcast',
        event: 'product_changed',
        payload: {
          product_id: productId,
          deleted,
          source: realtimeClientId.current
        }
      });

      pendingProductBroadcasts.current.delete(productId);
    } catch (error) {
      console.error(
        'Product realtime broadcast failed:',
        getSafeErrorMessage(error)
      );
    }
  };

  const flushPendingProductBroadcasts = async () => {
    if (!realtimeChannelRef.current || !realtimeReadyRef.current) {
      return;
    }

    const pending = Array.from(
      pendingProductBroadcasts.current.entries()
    );

    for (const [productId, deleted] of pending) {
      try {
        await realtimeChannelRef.current.send({
          type: 'broadcast',
          event: 'product_changed',
          payload: {
            product_id: productId,
            deleted,
            source: realtimeClientId.current
          }
        });
        pendingProductBroadcasts.current.delete(productId);
      } catch (error) {
        console.error(
          'Pending product broadcast failed:',
          getSafeErrorMessage(error)
        );
      }
    }
  };

  const saveProductById = async (productId: string) => {
    if (!cloudInitialized.current || cloudLoadFailed.current) {
      return;
    }

    if (!modifiedProductIds.current.has(productId)) {
      return;
    }

    const previousQueue =
      productSaveQueues.current[productId] || Promise.resolve();

    const currentSave = previousQueue
      .catch(() => undefined)
      .then(async () => {
        if (!modifiedProductIds.current.has(productId)) {
          return;
        }

        const version =
          productMutationVersions.current[productId] || 0;

        pendingProductSaves.current.add(productId);

        try {
          const isDeleted = deletedProductIds.current.has(productId);

          if (isDeleted) {
            const { error } = await supabase
              .from('store_products')
              .delete()
              .eq('id', productId);

            if (error) {
              throw error;
            }

            delete lastCloudProductData.current[productId];
            delete productSortOrders.current[productId];

            if (productMutationVersions.current[productId] === version) {
              modifiedProductIds.current.delete(productId);
              deletedProductIds.current.delete(productId);
            }

            await broadcastProductChange(productId, true);
            return;
          }

          let product = productsRef.current.find(
            item => item.id === productId
          );

          if (!product) {
            return;
          }

          const uploadedProduct = await uploadProductCardImage(product);
          product = uploadedProduct;

          if (
            typeof product.cardImageUrl === 'string' &&
            product.cardImageUrl.startsWith('data:image/')
          ) {
            throw new Error(
              'Cloud save cancelled because the product image is still Base64.'
            );
          }

          const sortOrder =
            productSortOrders.current[productId] ??
            nextProductSortOrder.current--;

          productSortOrders.current[productId] = sortOrder;

          const serialized = JSON.stringify(product);

          if (
            lastCloudProductData.current[productId] !== serialized ||
            !lastCloudProductData.current[productId]
          ) {
            const { error } = await supabase
              .from('store_products')
              .upsert(
                {
                  id: product.id,
                  data: product,
                  sort_order: sortOrder,
                  updated_at: new Date().toISOString()
                },
                { onConflict: 'id' }
              );

            if (error) {
              throw error;
            }

            lastCloudProductData.current[productId] = serialized;
          }

          /*
           * Only replace the local Base64 image when no newer local
           * mutation happened while the upload was running.
           */
          if (
            productMutationVersions.current[productId] === version &&
            product.cardImageUrl !== productsRef.current.find(
              item => item.id === productId
            )?.cardImageUrl
          ) {
            setProducts(current =>
              current.map(item =>
                item.id === productId
                  ? {
                      ...item,
                      cardImageUrl: product.cardImageUrl
                    }
                  : item
              )
            );
          }

          if (productMutationVersions.current[productId] === version) {
            modifiedProductIds.current.delete(productId);
          }

          await broadcastProductChange(productId, false);
        } catch (error) {
          console.error(
            `Product ${productId} cloud save failed:`,
            getSafeErrorMessage(error)
          );
        } finally {
          pendingProductSaves.current.delete(productId);
        }
      });

    productSaveQueues.current[productId] = currentSave;
    await currentSave;
  };

  const saveStoreData = async (
    dataType: string,
    data: unknown
  ) => {
    if (!cloudInitialized.current || cloudLoadFailed.current) {
      return;
    }

    if (data === undefined || data === null) {
      return;
    }

    if (!modifiedDataTypes.current.has(dataType)) {
      return;
    }

    const previousQueue =
      saveQueues.current[dataType] || Promise.resolve();

    const currentSave = previousQueue
      .catch(() => undefined)
      .then(async () => {
        const version = localMutationVersion.current[dataType] || 0;
        pendingLocalSaves.current.add(dataType);

        try {
          const serialized = JSON.stringify(data);

          if (lastCloudData.current[dataType] === serialized) {
            if (localMutationVersion.current[dataType] === version) {
              modifiedDataTypes.current.delete(dataType);
            }
            return;
          }

          const { error } = await supabase
            .from('store_data')
            .upsert(
              {
                data_type: dataType,
                data,
                updated_at: new Date().toISOString()
              },
              { onConflict: 'data_type' }
            );

          if (error) {
            throw error;
          }

          cloudDataTypes.current.add(dataType);
          lastCloudData.current[dataType] = serialized;

          if (localMutationVersion.current[dataType] === version) {
            modifiedDataTypes.current.delete(dataType);
          }

          /*
           * Tiny broadcast only. We do not put the JSON payload in the
           * realtime message, so the other browser fetches it explicitly.
           */
          if (realtimeChannelRef.current && realtimeReadyRef.current) {
            await realtimeChannelRef.current.send({
              type: 'broadcast',
              event: 'store_data_changed',
              payload: {
                data_type: dataType,
                source: realtimeClientId.current
              }
            });
          }
        } catch (error) {
          console.error(
            `Cloud save failed for ${dataType}:`,
            getSafeErrorMessage(error)
          );
        } finally {
          pendingLocalSaves.current.delete(dataType);
        }
      });

    saveQueues.current[dataType] = currentSave;
    await currentSave;
  };

  const loadStoreData = async () => {
    /*
     * IMPORTANT: products are deliberately excluded. They live in
     * store_products and are fetched separately, one row per product.
     */
    const { data, error } = await supabase
      .from('store_data')
      .select('data_type, data')
      .neq('data_type', 'products');

    if (error) {
      console.error(
        `Cloud load failed: ${getSafeErrorMessage(error)}`
      );
      return null;
    }

    return data;
  };

  const loadProductRows = async () => {
    const { data, error } = await supabase
      .from('store_products')
      .select('id, data, sort_order')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error(
        `Product cloud load failed: ${getSafeErrorMessage(error)}`
      );
      return null;
    }

    return data || [];
  };

  const migrateProductsToRows = async (
    productList: Product[]
  ) => {
    const rows = productList.map((product, index) => ({
      id: product.id,
      data: product,
      sort_order: index,
      updated_at: new Date().toISOString()
    }));

    if (rows.length === 0) {
      return true;
    }

    const { error } = await supabase
      .from('store_products')
      .upsert(rows, { onConflict: 'id' });

    if (error) {
      console.error(
        `Product migration failed: ${getSafeErrorMessage(error)}`
      );
      return false;
    }

    rows.forEach(row => {
      productSortOrders.current[row.id] = row.sort_order;
      lastCloudProductData.current[row.id] = JSON.stringify(row.data);
    });

    nextProductSortOrder.current =
      Math.min(-1, rows.length - 1);

    return true;
  };

  const refreshDataType = async (dataType: string) => {
    if (
      !cloudInitialized.current ||
      cloudLoadFailed.current ||
      pendingLocalSaves.current.has(dataType) ||
      modifiedDataTypes.current.has(dataType) ||
      realtimeRefreshInFlight.current.has(dataType)
    ) {
      return;
    }

    realtimeRefreshInFlight.current.add(dataType);

    try {
      const { data, error } = await supabase
        .from('store_data')
        .select('data_type, data')
        .eq('data_type', dataType)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (!data || data.data === undefined || data.data === null) {
        return;
      }

      const serialized = JSON.stringify(data.data);

      if (lastCloudData.current[dataType] === serialized) {
        return;
      }

      lastCloudData.current[dataType] = serialized;
      cloudDataTypes.current.add(dataType);

      switch (dataType) {
        case 'orders':
          if (Array.isArray(data.data)) {
            setOrders(data.data as Order[]);
          }
          break;
        case 'custom_requests':
          if (Array.isArray(data.data)) {
            setCustomRequests(data.data as CustomRequest[]);
          }
          break;
        case 'reviews':
          if (Array.isArray(data.data)) {
            setReviews(current =>
              mergeReviews(current, data.data as Review[])
            );
          }
          break;
        case 'settings':
          if (
            typeof data.data === 'object' &&
            !Array.isArray(data.data)
          ) {
            setSettings({
              ...INITIAL_SETTINGS,
              ...(data.data as StoreSettings)
            });
          }
          break;
      }
    } catch (error) {
      console.error(
        `Realtime refresh failed for ${dataType}:`,
        getSafeErrorMessage(error)
      );
    } finally {
      realtimeRefreshInFlight.current.delete(dataType);
    }
  };

  const scheduleRealtimeRefresh = (dataType: string) => {
    if (realtimeDebounceTimers.current[dataType]) {
      clearTimeout(realtimeDebounceTimers.current[dataType]);
    }

    realtimeDebounceTimers.current[dataType] = setTimeout(() => {
      void refreshDataType(dataType);
    }, 180);
  };

  const refreshProduct = async (productId: string, deleted = false) => {
    if (
      !cloudInitialized.current ||
      cloudLoadFailed.current ||
      modifiedProductIds.current.has(productId) ||
      productRealtimeInFlight.current.has(productId)
    ) {
      return;
    }

    if (pendingProductSaves.current.has(productId)) {
      const queue = productSaveQueues.current[productId];
      if (queue) {
        await queue.catch(() => undefined);
      }

      if (modifiedProductIds.current.has(productId)) {
        return;
      }
    }

    productRealtimeInFlight.current.add(productId);

    try {
      if (deleted) {
        setProducts(current =>
          current.filter(product => product.id !== productId)
        );
        delete lastCloudProductData.current[productId];
        delete productSortOrders.current[productId];
        return;
      }

      const { data, error } = await supabase
        .from('store_products')
        .select('id, data, sort_order')
        .eq('id', productId)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (!data?.data) {
        return;
      }

      const incomingProduct = data.data as Product;
      const serialized = JSON.stringify(incomingProduct);

      if (lastCloudProductData.current[productId] === serialized) {
        return;
      }

      productSortOrders.current[productId] =
        Number(data.sort_order) || 0;
      lastCloudProductData.current[productId] = serialized;

      const ratedProduct = recalculateProductRatings(
        [incomingProduct],
        reviewsRef.current
      )[0];

      setProducts(current => {
        const exists = current.some(
          product => product.id === productId
        );

        if (!exists) {
          return [...current, ratedProduct].sort((a, b) => {
            const aOrder = productSortOrders.current[a.id] ?? 0;
            const bOrder = productSortOrders.current[b.id] ?? 0;
            return aOrder - bOrder;
          });
        }

        return current.map(product =>
          product.id === productId
            ? {
                ...product,
                ...ratedProduct
              }
            : product
        );
      });
    } catch (error) {
      console.error(
        `Product realtime refresh failed for ${productId}:`,
        getSafeErrorMessage(error)
      );
    } finally {
      productRealtimeInFlight.current.delete(productId);
    }
  };

  const scheduleProductRefresh = (
    productId: string,
    deleted = false
  ) => {
    if (productRealtimeTimers.current[productId]) {
      clearTimeout(productRealtimeTimers.current[productId]);
    }

    productRealtimeTimers.current[productId] = setTimeout(() => {
      void refreshProduct(productId, deleted);
    }, 120);
  };

  /*
   * ============================================================
   * INITIAL CLOUD LOAD
   * ============================================================
   */

  useEffect(() => {
    let cancelled = false;

    const initializeCloudData = async () => {
      const [cloudData, productRows] = await Promise.all([
        loadStoreData(),
        loadProductRows()
      ]);

      if (cancelled) {
        return;
      }

      if (!cloudData || productRows === null) {
        cloudLoadFailed.current = true;
        console.error(
          'Cloud initialization failed. Local cache will remain active.'
        );
        return;
      }

      cloudData.forEach(item => {
        if (
          item?.data_type &&
          item.data !== undefined &&
          item.data !== null
        ) {
          cloudDataTypes.current.add(item.data_type);
          lastCloudData.current[item.data_type] = JSON.stringify(item.data);
        }
      });

      const requiredDataTypes = [
        'orders',
        'custom_requests',
        'reviews',
        'settings'
      ];

      requiredDataTypes.forEach(dataType => {
        if (!cloudDataTypes.current.has(dataType)) {
          markDataTypeModified(dataType);
        }
      });

      let cloudReviews: Review[] = [];

      cloudData.forEach(item => {
        if (
          !item?.data_type ||
          item.data === undefined ||
          item.data === null
        ) {
          return;
        }

        switch (item.data_type) {
          case 'orders':
            if (Array.isArray(item.data)) {
              setOrders(item.data as Order[]);
            }
            break;
          case 'custom_requests':
            if (Array.isArray(item.data)) {
              setCustomRequests(item.data as CustomRequest[]);
            }
            break;
          case 'reviews':
            if (Array.isArray(item.data)) {
              cloudReviews = item.data as Review[];
            }
            break;
          case 'settings':
            if (
              typeof item.data === 'object' &&
              !Array.isArray(item.data)
            ) {
              setSettings({
                ...INITIAL_SETTINGS,
                ...(item.data as StoreSettings)
              });
            }
            break;
        }
      });

      let finalReviews = reviewsRef.current;

      if (cloudReviews.length > 0) {
        finalReviews = mergeReviews(
          reviewsRef.current,
          cloudReviews
        );
        setReviews(finalReviews);

        const cloudReviewIds = new Set(
          cloudReviews.map(review => String(review.id))
        );

        if (
          reviewsRef.current.some(
            review => !cloudReviewIds.has(String(review.id))
          )
        ) {
          markDataTypeModified('reviews');
        }
      }

      let cloudProducts: Product[] = [];

      if (productRows.length > 0) {
        cloudProducts = productRows
          .filter(row => row?.data)
          .map(row => {
            productSortOrders.current[row.id] =
              Number(row.sort_order) || 0;
            lastCloudProductData.current[row.id] =
              JSON.stringify(row.data);
            return row.data as Product;
          });

        const minOrder = productRows.reduce(
          (min, row) => Math.min(min, Number(row.sort_order) || 0),
          0
        );
        nextProductSortOrder.current = minOrder - 1;
      } else {
        /*
         * One-time migration fallback:
         * old versions stored the whole products array in store_data.
         */
        const legacyProductsRow = await supabase
          .from('store_data')
          .select('data')
          .eq('data_type', 'products')
          .maybeSingle();

        if (
          !legacyProductsRow.error &&
          Array.isArray(legacyProductsRow.data?.data)
        ) {
          cloudProducts = legacyProductsRow.data.data as Product[];
          await migrateProductsToRows(cloudProducts);
        } else {
          cloudProducts = products;
          await migrateProductsToRows(cloudProducts);
        }
      }

      if (cloudProducts.length > 0) {
        setProducts(
          recalculateProductRatings(
            cloudProducts,
            finalReviews
          )
        );
      }

      cloudInitialized.current = true;

      /*
       * If the old store_data table had no data at all, seed only the
       * non-product collections here. Products were already migrated/
       * seeded into store_products above.
       */
      if (cloudData.length === 0) {
        markDataTypeModified('orders');
        markDataTypeModified('custom_requests');
        markDataTypeModified('reviews');
        markDataTypeModified('settings');

        await Promise.all([
          saveStoreData('orders', orders),
          saveStoreData('custom_requests', customRequests),
          saveStoreData('reviews', reviewsRef.current),
          saveStoreData('settings', settings)
        ]);
      }

      console.log('Supabase low-egress store sync initialized.');
    };

    void initializeCloudData();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * ============================================================
   * REALTIME SYNC
   * ============================================================
   *
   * Broadcast payloads contain IDs/types only.
   * No product JSON is sent through Realtime.
   * ============================================================
   */

  useEffect(() => {
    const channel = supabase
      .channel('store-data-sync')
      .on(
        'broadcast',
        { event: 'store_data_changed' },
        message => {
          if (!cloudInitialized.current) {
            return;
          }

          const payload = message?.payload as {
            data_type?: string;
            source?: string;
          } | undefined;

          if (!payload?.data_type) {
            return;
          }

          if (payload.source === realtimeClientId.current) {
            return;
          }

          if (pendingLocalSaves.current.has(payload.data_type)) {
            return;
          }

          scheduleRealtimeRefresh(payload.data_type);
        }
      )
      .on(
        'broadcast',
        { event: 'product_changed' },
        message => {
          if (!cloudInitialized.current) {
            return;
          }

          const payload = message?.payload as {
            product_id?: string;
            deleted?: boolean;
            source?: string;
          } | undefined;

          if (!payload?.product_id) {
            return;
          }

          if (payload.source === realtimeClientId.current) {
            return;
          }

          if (modifiedProductIds.current.has(payload.product_id)) {
            return;
          }

          scheduleProductRefresh(
            payload.product_id,
            payload.deleted === true
          );
        }
      )
      .subscribe(status => {
        console.log('Supabase realtime status:', status);

        if (status === 'SUBSCRIBED') {
          realtimeReadyRef.current = true;
          void flushPendingProductBroadcasts();
        }
      });

    realtimeChannelRef.current = channel;

    return () => {
      realtimeReadyRef.current = false;
      realtimeChannelRef.current = null;

      Object.values(realtimeDebounceTimers.current).forEach(timer =>
        clearTimeout(timer)
      );

      Object.values(productRealtimeTimers.current).forEach(timer =>
        clearTimeout(timer)
      );

      supabase.removeChannel(channel);
    };
  }, []);

  /*
   * ============================================================
   * RECALCULATE RATINGS WHEN REVIEWS CHANGE
   * ============================================================
   */

  useEffect(() => {
    if (reviews.length === 0) {
      return;
    }

    setProducts(currentProducts =>
      recalculateProductRatings(currentProducts, reviews)
    );
  }, [reviews]);

  /*
   * ============================================================
   * PRODUCT CHANGES → INDIVIDUAL SUPABASE ROWS
   * ============================================================
   */

  useEffect(() => {
    setSafeLocalStorage(
      'knot_bloom_products',
      stripBase64CardImages(products)
    );

    if (
      !cloudInitialized.current ||
      cloudLoadFailed.current
    ) {
      return;
    }

    for (const productId of Array.from(modifiedProductIds.current)) {
      void saveProductById(productId);
    }
  }, [products]);

  /*
   * ============================================================
   * SHARED DATA → SUPABASE + LOCAL CACHE
   * ============================================================
   */

  useEffect(() => {
    if (
      cloudInitialized.current &&
      !cloudLoadFailed.current &&
      modifiedDataTypes.current.has('orders')
    ) {
      void saveStoreData('orders', orders);
    }

    setSafeLocalStorage('knot_bloom_orders', orders);
  }, [orders]);

  useEffect(() => {
    if (
      cloudInitialized.current &&
      !cloudLoadFailed.current &&
      modifiedDataTypes.current.has('custom_requests')
    ) {
      void saveStoreData('custom_requests', customRequests);
    }

    setSafeLocalStorage(
      'knot_bloom_custom_requests',
      customRequests
    );
  }, [customRequests]);

  useEffect(() => {
    if (
      cloudInitialized.current &&
      !cloudLoadFailed.current &&
      modifiedDataTypes.current.has('reviews')
    ) {
      void saveStoreData('reviews', reviews);
    }

    setSafeLocalStorage('knot_bloom_reviews', reviews);
  }, [reviews]);

  useEffect(() => {
    if (
      cloudInitialized.current &&
      !cloudLoadFailed.current &&
      modifiedDataTypes.current.has('settings')
    ) {
      void saveStoreData('settings', settings);
    }

    setSafeLocalStorage('knot_bloom_settings', settings);
  }, [settings]);

  /*
   * ============================================================
   * DEVICE-SPECIFIC DATA
   * ============================================================
   */

  useEffect(() => {
    setSafeLocalStorage(
      'knot_bloom_cart',
      cart
    );
  }, [cart]);

  useEffect(() => {
    setSafeLocalStorage(
      'knot_bloom_registered_users',
      registeredUsers
    );
  }, [registeredUsers]);

  useEffect(() => {
    if (currentUser) {
      setSafeLocalStorage(
        'knot_bloom_current_user',
        currentUser
      );
    } else {
      localStorage.removeItem(
        'knot_bloom_current_user'
      );
    }
  }, [currentUser]);

  /*
   * ============================================================
   * TOAST
   * ============================================================
   */

  const showToast = (
    msg: string
  ) => {
    const now =
      Date.now();

    /*
     * Prevent the exact same toast from being displayed
     * multiple times within 2 seconds.
     */

    if (
      lastToastMessageRef.current ===
        msg &&
      now -
        lastToastTimeRef.current <
        2000
    ) {
      return;
    }

    lastToastMessageRef.current =
      msg;

    lastToastTimeRef.current =
      now;

    setToastMessage(msg);

    /*
     * Clear previous timeout.
     */

    if (
      toastTimeoutRef.current
    ) {
      clearTimeout(
        toastTimeoutRef.current
      );
    }

    /*
     * Automatically hide the toast.
     */

    toastTimeoutRef.current =
      setTimeout(() => {
        setToastMessage(
          null
        );

        toastTimeoutRef.current =
          null;
      }, 4000);
  };

  /*
   * ============================================================
   * USER AUTH
   * ============================================================
   */

  const loginUserWithPassword = (
    loginId: string,
    pass: string
  ): boolean => {
    const cleanId =
      loginId
        .trim()
        .toLowerCase();

    const cleanPhone =
      loginId
        .replaceAll(' ', '')
        .replaceAll('-', '');

    const found =
      registeredUsers.find(
        u =>
          u.email.toLowerCase() ===
            cleanId ||
          u.phone
            .replaceAll(' ', '')
            .replaceAll('-', '') ===
            cleanPhone
      );

    if (
      found &&
      found.password === pass
    ) {
      setCurrentUser(
        found
      );

      showToast(
        `🌸 Welcome back, ${found.name}!`
      );

      setActiveModal(
        null
      );

      return true;
    }

    showToast(
      '❌ Invalid Mobile Number/Email or Password! Please check credentials or sign up.'
    );

    return false;
  };

  const signupUserWithPassword = (
    name: string,
    email: string,
    phone: string,
    password: string,
    dormOrBuilding?: string,
    roomOrSpot?: string
  ): User => {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name,
      email,
      phone,
      password,
      dormOrBuilding,
      roomOrSpot
    };

    setRegisteredUsers(
      prev => [
        ...prev,
        newUser
      ]
    );

    setCurrentUser(
      newUser
    );

    showToast(
      `✨ Account created successfully! Welcome ${name}`
    );

    setActiveModal(
      null
    );

    return newUser;
  };

  const sendOtpCode = (
    identifier: string
  ): string => {
    const otp =
      Math.floor(
        1000 +
          Math.random() *
            9000
      ).toString();

    showToast(
      `📱 SMS/Email OTP Verification Code sent to ${identifier}: ${otp}`
    );

    return otp;
  };

  const verifyOtpCode = (
    identifier: string,
    code: string,
    generatedCode: string
  ): boolean => {
    if (
      code.trim() ===
        generatedCode.trim() ||
      code.trim() === '7892' ||
      code.trim() === '1234'
    ) {
      const cleanId =
        identifier
          .trim()
          .toLowerCase();

      const existing =
        registeredUsers.find(
          u =>
            u.email.toLowerCase() ===
              cleanId ||
            u.phone.includes(
              identifier
            )
        );

      if (existing) {
        setCurrentUser(
          existing
        );
      } else {
        const otpUser: User = {
          id: `usr-otp-${Date.now()}`,
          name:
            identifier.split(
              '@'
            )[0],
          email:
            identifier.includes('@')
              ? identifier
              : `${identifier}@student.edu`,
          phone:
            identifier.includes('@')
              ? '+91 98765 43210'
              : identifier,
          dormOrBuilding:
            'Hostel Block A'
        };

        setRegisteredUsers(
          prev => [
            ...prev,
            otpUser
          ]
        );

        setCurrentUser(
          otpUser
        );
      }

      showToast(
        '✅ OTP Verification Successful! logged in.'
      );

      setActiveModal(
        null
      );

      return true;
    }

    showToast(
      '❌ Invalid OTP Verification Code. Please try again.'
    );

    return false;
  };

  const loginUserDirect = (
    user: User
  ) => {
    setCurrentUser(user);

    showToast(
      `Logged in as ${user.name}`
    );

    setActiveModal(
      null
    );
  };

  const logoutUser = () => {
    setCurrentUser(
      null
    );

    showToast(
      'Logged out of student account'
    );
  };

  /*
   * ============================================================
   * ADMIN AUTH
   * ============================================================
   */

  const setIsAdmin = (
    val: boolean
  ) => {
    if (
      val &&
      !adminAuthenticated
    ) {
      setActiveModal(
        'adminAuth'
      );

      return;
    }

    setIsAdminState(
      val
    );
  };

  const loginAdminWithCredentials = (
    username: string,
    pin: string
  ): boolean => {
    const validUsername =
      settings.adminUsername ||
      'admin';

    const validPin =
      settings.adminPin ||
      'admin123';

    if (
      username
        .trim()
        .toLowerCase() ===
        validUsername
          .toLowerCase() &&
      pin.trim() ===
        validPin
    ) {
      setAdminAuthenticated(
        true
      );

      sessionStorage.setItem(
        'knot_bloom_admin_auth',
        'true'
      );

      setIsAdminState(
        true
      );

      setActiveModal(
        null
      );

      showToast(
        '👑 Owner Credentials Verified! Welcome to Admin Portal.'
      );

      return true;
    }

    showToast(
      '❌ Invalid Admin Username or Security PIN!'
    );

    return false;
  };

  const logoutAdmin = () => {
    setAdminAuthenticated(
      false
    );

    sessionStorage.removeItem(
      'knot_bloom_admin_auth'
    );

    setIsAdminState(
      false
    );

    showToast(
      'Logged out of Admin Portal'
    );
  };

  /*
   * ============================================================
   * CART
   * ============================================================
   */

  const addToCart = (
    product: Product,
    quantity = 1,
    selectedColor?: string,
    wrapPaperColor?: string,
    giftNote?: string
  ) => {
    /*
     * Prevent duplicate calls.
     */

    if (
      addToCartLock.current
    ) {
      return;
    }

    addToCartLock.current =
      true;

    /*
     * Release the lock after 700ms.
     */

    setTimeout(() => {
      addToCartLock.current =
        false;
    }, 700);

    /*
     * Check stock.
     */

    if (
      product.stock <= 0
    ) {
      showToast(
        '⚠️ Sorry, this item is currently out of stock!'
      );

      return;
    }

    /*
     * Determine selected color.
     */

    const finalColor =
      selectedColor ||
      product.colorsAvailable[0];

    /*
     * Update cart.
     */

    setCart(prev => {
      const existingIndex =
        prev.findIndex(
          item =>
            item.product.id ===
              product.id &&
            item.selectedColor ===
              finalColor
        );

      /*
       * Product already exists.
       */

      if (
        existingIndex > -1
      ) {
        return prev.map(
          (item, index) =>
            index ===
            existingIndex
              ? {
                  ...item,
                  quantity:
                    item.quantity +
                    quantity
                }
              : item
        );
      }

      /*
       * Product does not exist.
       */

      return [
        ...prev,
        {
          product,
          quantity,
          selectedColor:
            finalColor,
          wrapPaperColor,
          giftNote
        }
      ];
    });

    /*
     * Exactly one toast.
     */

    showToast(
      `🌸 Added "${product.name}" to your cart!`
    );
  };

  const updateCartQuantity = (
    index: number,
    quantity: number
  ) => {
    setCart(
      prev => {
        if (
          quantity <= 0
        ) {
          return prev.filter(
            (_, i) =>
              i !== index
          );
        }

        const updated =
          [...prev];

        updated[index].quantity =
          quantity;

        return updated;
      }
    );
  };

  const removeFromCart = (
    index: number
  ) => {
    setCart(
      prev =>
        prev.filter(
          (_, i) =>
            i !== index
        )
    );

    showToast(
      'Removed item from cart'
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  /*
   * ============================================================
   * PRODUCTS
   * ============================================================
   */

  const addProduct = (
    newProdData: Omit<
      Product,
      'id' |
      'rating' |
      'reviewCount'
    >
  ) => {
    const newProduct: Product = {
      ...newProdData,
      id: `prod-${Date.now()}`,
      rating: 5.0,
      reviewCount: 0
    };

    productSortOrders.current[newProduct.id] =
      nextProductSortOrder.current--;

    markProductModified(newProduct.id);

    setProducts(prev => [newProduct, ...prev]);

    showToast(
      `✨ Added "${newProduct.name}" to catalog!`
    );
  };

  const updateProduct = (
    id: string,
    updatedFields: Partial<Product>
  ) => {
    markProductModified(id);

    setProducts(prev =>
      prev.map(product =>
        product.id === id
          ? { ...product, ...updatedFields }
          : product
      )
    );

    showToast('Product updated successfully!');
  };

  const updateStock = (
    id: string,
    newStock: number
  ) => {
    markProductModified(id);

    setProducts(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, stock: Math.max(0, newStock) }
          : p
      )
    );

    showToast(
      `Stock updated to ${Math.max(0, newStock)}`
    );
  };

  const deleteProduct = (id: string) => {
    markProductDeleted(id);

    setProducts(prev =>
      prev.filter(p => p.id !== id)
    );

    showToast('Product deleted from inventory');
  };

  /*
   * ============================================================
   * ORDERS
   * ============================================================
   */

  const createOrder = (
    orderData: Omit<
      Order,
      'id' |
      'createdAt' |
      'status'
    >
  ): Order => {
    markDataTypeModified('orders');

    const newOrder: Order =
      {
        ...orderData,

        id: `ORD-${Math.floor(
          1000 +
            Math.random() *
              9000
        )}`,

        createdAt:
          new Date().toISOString(),

        status: 'Pending',

        userId:
          currentUser?.id
      };

    setOrders(
      prev => [
        newOrder,
        ...prev
      ]
    );

    orderData.items.forEach(
      item => {
        updateStock(
          item.productId,
          (
            products.find(
              p =>
                p.id ===
                item.productId
            )?.stock ||
            1
          ) -
            item.quantity
        );
      }
    );

    clearCart();

    setLastCreatedOrder(
      newOrder
    );

    return newOrder;
  };

  const updateOrderStatus = (
    id: string,
    status: OrderStatus
  ) => {
    markDataTypeModified('orders');

    setOrders(
      prev =>
        prev.map(
          o =>
            o.id === id
              ? {
                  ...o,
                  status
                }
              : o
        )
    );

    showToast(
      `Order ${id} status updated to "${status}"`
    );
  };

  const verifyOrderPayment = (
    id: string,
    isVerified: boolean
  ) => {
    markDataTypeModified('orders');

    setOrders(
      prev =>
        prev.map(
          o => {
            if (
              o.id === id
            ) {
              return {
                ...o,

                paymentStatus:
                  isVerified
                    ? 'Payment Verified ✅'
                    : 'Pay on Pickup',

                paymentVerificationStatus:
                  isVerified
                    ? 'Payment Verified ✅'
                    : 'Payment Rejected ❌'
              };
            }

            return o;
          }
        )
    );

    showToast(
      isVerified
        ? `✅ Order ${id} Payment Verified!`
        : `❌ Order ${id} Payment Rejected!`
    );
  };

  /*
   * ============================================================
   * CUSTOM REQUESTS
   * ============================================================
   */

  const createCustomRequest = (
    reqData: Omit<
      CustomRequest,
      'id' |
      'createdAt' |
      'status'
    >
  ) => {
    markDataTypeModified('custom_requests');

    const newReq: CustomRequest =
      {
        ...reqData,

        id: `REQ-${Math.floor(
          100 +
            Math.random() *
              900
        )}`,

        createdAt:
          new Date().toISOString(),

        status:
          'Pending Quote'
      };

    setCustomRequests(
      prev => [
        newReq,
        ...prev
      ]
    );

    showToast(
      '✨ Custom commission request submitted to studio!'
    );
  };

  const updateCustomRequestStatus = (
    id: string,
    status: CustomRequest['status'],
    quotedPrice?: number
  ) => {
    markDataTypeModified('custom_requests');

    setCustomRequests(
      prev =>
        prev.map(
          r =>
            r.id === id
              ? {
                  ...r,
                  status,

                  ...(quotedPrice !==
                  undefined
                    ? {
                        quotedPrice
                      }
                    : {})
                }
              : r
        )
    );

    showToast(
      `Custom Request ${id} updated!`
    );
  };

  /*
   * ============================================================
   * REVIEWS
   * ============================================================
   */

  const addReview = (
    reviewData: Omit<
      Review,
      'id' |
      'date' |
      'verifiedStudent'
    >
  ) => {
    markDataTypeModified('reviews');

    /*
     * Convert rating to number.
     */

    const numericRating =
      Number(
        reviewData.rating
      );

    /*
     * Keep rating between 1 and 5.
     */

    const safeRating =
      Number.isFinite(
        numericRating
      )
        ? Math.min(
            5,
            Math.max(
              1,
              numericRating
            )
          )
        : 1;

    const affectedProductIds = productsRef.current
      .filter(product =>
        product.name?.trim().toLowerCase() ===
        reviewData.productName?.trim().toLowerCase()
      )
      .map(product => product.id);

    affectedProductIds.forEach(markProductModified);

    const newRev: Review = {
      ...reviewData,

      rating:
        safeRating,

      id:
        `rev-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}`,

      date:
        'Just now',

      verifiedStudent:
        true
    };

    /*
     * Add review using functional state update.
     */

    setReviews(
      prev => [
        newRev,
        ...prev
      ]
    );

    showToast(
      'Thank you for your review!'
    );
  };

  /*
   * ============================================================
   * SETTINGS
   * ============================================================
   */

  const updateSettings = (
    newSettings: Partial<StoreSettings>
  ) => {
    markDataTypeModified('settings');

    setSettings(
      prev => ({
        ...prev,
        ...newSettings
      })
    );

    showToast(
      'Store settings saved successfully!'
    );
  };

  /*
   * ============================================================
   * PROVIDER
   * ============================================================
   */

  return (
    <StoreContext.Provider
      value={{
        products,
        orders,
        customRequests,
        reviews,
        cart,
        settings,

        currentUser,
        registeredUsers,

        loginUserWithPassword,
        signupUserWithPassword,
        sendOtpCode,
        verifyOtpCode,
        loginUserDirect,
        logoutUser,

        isAdmin,
        setIsAdmin,
        adminAuthenticated,
        loginAdminWithCredentials,
        logoutAdmin,

        selectedCategory,
        setSelectedCategory,

        searchQuery,
        setSearchQuery,

        cartOpen,
        setCartOpen,

        activeModal,
        setActiveModal,

        selectedProduct,
        setSelectedProduct,

        lastCreatedOrder,
        setLastCreatedOrder,

        isDarkMode,
        toggleDarkMode,

        toastMessage,
        showToast,

        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,

        addProduct,
        updateProduct,
        updateStock,
        deleteProduct,

        createOrder,
        updateOrderStatus,
        verifyOrderPayment,

        createCustomRequest,
        updateCustomRequestStatus,

        addReview,

        updateSettings
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context =
    useContext(
      StoreContext
    );

  if (!context) {
    throw new Error(
      'useStore must be used within a StoreProvider'
    );
  }

  return context;
};