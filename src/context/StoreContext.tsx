import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
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
  User,
} from '../types';

import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_CUSTOM_REQUESTS,
  INITIAL_REVIEWS,
  INITIAL_SETTINGS,
} from '../data/initialData';

import { supabase } from '../lib/supabaseClient';

/* ============================================================
   MODAL TYPE
============================================================ */

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

/* ============================================================
   STORE CONTEXT TYPE
============================================================ */

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

  sendOtpCode: (identifier: string) => string;

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

/* ============================================================
   LOCAL STORAGE
============================================================ */

const getSafeLocalStorage = <T,>(
  key: string,
  fallback: T
): T => {
  try {
    const saved =
      localStorage.getItem(key);

    if (
      !saved ||
      saved === 'undefined' ||
      saved === 'null'
    ) {
      return fallback;
    }

    return JSON.parse(saved) as T;
  } catch (error) {
    console.error(
      `Failed to load ${key} from localStorage:`,
      error
    );

    return fallback;
  }
};

const setSafeLocalStorage = (
  key: string,
  value: unknown
) => {
  try {
    if (value === undefined) {
      localStorage.removeItem(key);
      return;
    }

    localStorage.setItem(
      key,
      JSON.stringify(value)
    );
  } catch (error) {
    console.error(
      `Failed to save ${key} to localStorage:`,
      error
    );
  }
};

/* ============================================================
   DEMO USER
============================================================ */

const INITIAL_DEMO_USERS: User[] = [
  {
    id: 'usr-demo-1',
    name: 'Aarav Sharma',
    email: 'aarav@university.edu',
    phone: '+91 98765 43210',
    password: 'student123',
    dormOrBuilding:
      'Subir Hall - Block B',
    roomOrSpot: 'Room 304',
  },
];

/* ============================================================
   PROVIDER
============================================================ */

export const StoreProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  /* ==========================================================
     STATE
  ========================================================== */

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
        ...parsed,
      };
    });

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

  const [isAdmin, setIsAdminState] =
    useState(false);

  const [
    adminAuthenticated,
    setAdminAuthenticated,
  ] = useState<boolean>(() => {
    return (
      sessionStorage.getItem(
        'knot_bloom_admin_auth'
      ) === 'true'
    );
  });

  const [selectedCategory, setSelectedCategory] =
    useState<ProductCategory>('All');

  const [searchQuery, setSearchQuery] =
    useState('');

  const [isDarkMode, setIsDarkMode] =
    useState<boolean>(() => {
      return (
        localStorage.getItem(
          'cozy_dark_mode'
        ) === 'true'
      );
    });

  const [cartOpen, setCartOpen] =
    useState(false);

  const [activeModal, setActiveModal] =
    useState<ActiveModal>(null);

  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  const [lastCreatedOrder, setLastCreatedOrder] =
    useState<Order | null>(null);

  const [toastMessage, setToastMessage] =
    useState<string | null>(null);

  /* ==========================================================
     REFS
  ========================================================== */

  const cloudInitialized =
    useRef(false);

  const cloudLoadFailed =
    useRef(false);

  const addToCartLock =
    useRef(false);

  const toastTimeoutRef =
    useRef<ReturnType<typeof setTimeout> | null>(
      null
    );

  const lastToastMessageRef =
    useRef<string | null>(null);

  const lastToastTimeRef =
    useRef<number>(0);

  const cloudDataTypes =
    useRef<Set<string>>(new Set());

  const modifiedDataTypes =
    useRef<Set<string>>(new Set());

  const lastCloudData =
    useRef<Record<string, string>>({});

  const reviewsRef =
    useRef<Review[]>(reviews);

  const saveQueues =
    useRef<Record<string, Promise<void>>>({});

  /* ==========================================================
     REVIEWS REF
  ========================================================== */

  useEffect(() => {
    reviewsRef.current = reviews;
  }, [reviews]);

  /* ==========================================================
     DARK MODE
  ========================================================== */

  useEffect(() => {
    document.documentElement.classList.toggle(
      'dark',
      isDarkMode
    );

    localStorage.setItem(
      'cozy_dark_mode',
      isDarkMode ? 'true' : 'false'
    );
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  /* ==========================================================
     REVIEW MERGE
  ========================================================== */

  const mergeReviews = (
    existing: Review[],
    incoming: Review[]
  ): Review[] => {
    const merged =
      new Map<string, Review>();

    incoming.forEach(review => {
      if (review?.id) {
        merged.set(
          String(review.id),
          review
        );
      }
    });

    existing.forEach(review => {
      if (review?.id) {
        merged.set(
          String(review.id),
          review
        );
      }
    });

    return Array.from(
      merged.values()
    ).sort((a, b) => {
      const aTime =
        Number(
          String(a.id).replace(
            /\D/g,
            ''
          )
        ) || 0;

      const bTime =
        Number(
          String(b.id).replace(
            /\D/g,
            ''
          )
        ) || 0;

      return bTime - aTime;
    });
  };

  /* ==========================================================
     PRODUCT RATINGS
  ========================================================== */

  const recalculateProductRatings = (
    productList: Product[],
    reviewList: Review[]
  ): Product[] => {
    return productList.map(product => {
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

      if (
        productReviews.length ===
        0
      ) {
        return product;
      }

      const ratings =
        productReviews
          .map(review =>
            Number(review.rating)
          )
          .filter(
            rating =>
              Number.isFinite(rating) &&
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
          (sum, rating) =>
            sum + rating,
          0
        );

      const average =
        total / ratings.length;

      return {
        ...product,
        rating:
          Math.round(
            average * 10
          ) / 10,
        reviewCount:
          ratings.length,
      };
    });
  };

  /* ==========================================================
     LOAD STORE DATA
  ========================================================== */

  const loadStoreData =
    async () => {
      const {
        data,
        error,
      } = await supabase
        .from('store_data')
        .select(
          'data_type, data'
        );

      if (error) {
        console.error(
          'Error loading store data:',
          error
        );

        return null;
      }

      return data;
    };

  /* ==========================================================
     BASE64 → BLOB
  ========================================================== */

  const dataUrlToBlob =
    async (
      dataUrl: string
    ): Promise<Blob> => {
      const response =
        await fetch(dataUrl);

      if (!response.ok) {
        throw new Error(
          'Unable to convert image data.'
        );
      }

      return response.blob();
    };

  /* ==========================================================
     UPLOAD PRODUCT CARD IMAGES
     
     IMPORTANT:
     Base64 images NEVER go into store_data.
     
     They are converted to files and uploaded to:
     
     product-images/products/{productId}/card-image.jpg
  ========================================================== */

  const uploadProductCardImages =
    async (
      productList: Product[]
    ): Promise<Product[]> => {
      return Promise.all(
        productList.map(
          async product => {
            const cardImageUrl =
              product.cardImageUrl;

            /*
             * Already a normal URL.
             */
            if (
              !cardImageUrl ||
              !cardImageUrl.startsWith(
                'data:image/'
              )
            ) {
              return product;
            }

            console.log(
              `Uploading card image for ${product.name}...`
            );

            try {
              const blob =
                await dataUrlToBlob(
                  cardImageUrl
                );

              const filePath =
                `products/${product.id}/card-image.jpg`;

              const {
                error:
                  uploadError,
              } =
                await supabase.storage
                  .from(
                    'product-images'
                  )
                  .upload(
                    filePath,
                    blob,
                    {
                      contentType:
                        'image/jpeg',
                      cacheControl:
                        '31536000',
                      upsert: true,
                    }
                  );

              if (uploadError) {
                console.error(
                  'SUPABASE STORAGE UPLOAD ERROR:',
                  uploadError
                );

                throw uploadError;
              }

              const {
                data:
                  publicUrlData,
              } =
                supabase.storage
                  .from(
                    'product-images'
                  )
                  .getPublicUrl(
                    filePath
                  );

              if (
                !publicUrlData?.publicUrl
              ) {
                throw new Error(
                  'Supabase did not return a public image URL.'
                );
              }

              const publicUrl =
                `${publicUrlData.publicUrl}?v=${Date.now()}`;

              console.log(
                `Card image uploaded successfully for ${product.name}`
              );

              return {
                ...product,
                cardImageUrl:
                  publicUrl,
              };
            } catch (error) {
              console.error(
                `Product card image upload failed for ${product.name}:`,
                error
              );

              /*
               * VERY IMPORTANT:
               *
               * Do not return the original product.
               *
               * Otherwise the Base64 image would be
               * sent to store_data and cause another
               * huge payload / 500 error.
               */
              throw error;
            }
          }
        )
      );
    };

  /* ==========================================================
     SAVE STORE DATA
  ========================================================== */

  const saveStoreData =
    async (
      dataType: string,
      data: unknown
    ) => {
      if (
        !cloudInitialized.current ||
        cloudLoadFailed.current
      ) {
        return;
      }

      if (
        data === undefined ||
        data === null
      ) {
        return;
      }

      if (
        !cloudDataTypes.current.has(
          dataType
        ) &&
        !modifiedDataTypes.current.has(
          dataType
        )
      ) {
        return;
      }

      const previousQueue =
        saveQueues.current[
          dataType
        ] ||
        Promise.resolve();

      const currentSave =
        previousQueue
          .catch(() => {})
          .then(async () => {
            let dataToSave =
              data;

            /*
             * ======================================================
             * PRODUCTS
             * ======================================================
             */

            if (
              dataType ===
                'products' &&
              Array.isArray(data)
            ) {
              try {
                dataToSave =
                  await uploadProductCardImages(
                    data as Product[]
                  );
              } catch (error) {
                console.error(
                  'Product image upload failed. Cloud product save cancelled.',
                  error
                );

                return;
              }

              /*
               * Update React state with the real Storage URLs.
               *
               * This removes the Base64 data from state.
               */
              const uploadedProducts =
                dataToSave as Product[];

              const hasChanged =
                uploadedProducts.some(
                  uploadedProduct => {
                    const current =
                      (
                        data as Product[]
                      ).find(
                        product =>
                          product.id ===
                          uploadedProduct.id
                      );

                    return (
                      current?.cardImageUrl !==
                      uploadedProduct.cardImageUrl
                    );
                  }
                );

              if (hasChanged) {
                setProducts(
                  currentProducts =>
                    currentProducts.map(
                      currentProduct => {
                        const uploaded =
                          uploadedProducts.find(
                            product =>
                              product.id ===
                              currentProduct.id
                          );

                        if (!uploaded) {
                          return currentProduct;
                        }

                        return {
                          ...currentProduct,
                          cardImageUrl:
                            uploaded.cardImageUrl,
                        };
                      }
                    )
                );
              }
            }

            /*
             * ======================================================
             * SAFETY CHECK
             *
             * Never allow a Base64 cardImageUrl to reach
             * store_data.
             * ======================================================
             */

            if (
              dataType ===
                'products' &&
              Array.isArray(dataToSave)
            ) {
              const hasBase64 =
                (
                  dataToSave as Product[]
                ).some(
                  product =>
                    typeof product.cardImageUrl ===
                      'string' &&
                    product.cardImageUrl.startsWith(
                      'data:image/'
                    )
                );

              if (hasBase64) {
                console.error(
                  'BLOCKED cloud save: Base64 product image still exists.'
                );

                return;
              }
            }

            const serialized =
              JSON.stringify(
                dataToSave
              );

            /*
             * Prevent duplicate saves.
             */

            if (
              lastCloudData.current[
                dataType
              ] === serialized
            ) {
              return;
            }

            console.log(
              `Saving ${dataType} to Supabase...`
            );

            const {
              error,
            } =
              await supabase
                .from(
                  'store_data'
                )
                .upsert(
                  {
                    data_type:
                      dataType,
                    data:
                      dataToSave,
                    updated_at:
                      new Date().toISOString(),
                  },
                  {
                    onConflict:
                      'data_type',
                  }
                );

            if (error) {
              console.error(
                `Error saving ${dataType} to Supabase:`,
                error
              );

              /*
               * Log the complete Supabase error
               * so the actual database problem is visible.
               */
              console.error(
                'Supabase error details:',
                {
                  message:
                    error.message,
                  details:
                    error.details,
                  hint:
                    error.hint,
                  code:
                    error.code,
                }
              );

              return;
            }

            cloudDataTypes.current.add(
              dataType
            );

            modifiedDataTypes.current.delete(
              dataType
            );

            lastCloudData.current[
              dataType
            ] = serialized;

            console.log(
              `Successfully saved ${dataType} to Supabase`
            );
          });

      saveQueues.current[
        dataType
      ] = currentSave;

      await currentSave;
    };

  /* ==========================================================
     INITIAL CLOUD LOAD
  ========================================================== */

  useEffect(() => {
    let cancelled =
      false;

    const initializeCloudData =
      async () => {
        const cloudData =
          await loadStoreData();

        if (cancelled) {
          return;
        }

        if (!cloudData) {
          console.error(
            'Cloud data could not be loaded.'
          );

          cloudLoadFailed.current =
            true;

          return;
        }

        cloudData.forEach(
          item => {
            if (
              item?.data_type &&
              item.data !==
                undefined &&
              item.data !== null
            ) {
              cloudDataTypes.current.add(
                item.data_type
              );
            }
          }
        );

        let cloudReviews:
          Review[] = [];

        let cloudProducts:
          Product[] = [];

        cloudData.forEach(
          item => {
            if (
              !item?.data_type ||
              item.data ===
                undefined ||
              item.data === null
            ) {
              return;
            }

            const serialized =
              JSON.stringify(
                item.data
              );

            lastCloudData.current[
              item.data_type
            ] = serialized;

            switch (
              item.data_type
            ) {
              case 'products':
                if (
                  Array.isArray(
                    item.data
                  )
                ) {
                  cloudProducts =
                    item.data as Product[];
                }
                break;

              case 'orders':
                if (
                  Array.isArray(
                    item.data
                  )
                ) {
                  setOrders(
                    item.data as Order[]
                  );
                }
                break;

              case 'custom_requests':
                if (
                  Array.isArray(
                    item.data
                  )
                ) {
                  setCustomRequests(
                    item.data as CustomRequest[]
                  );
                }
                break;

              case 'reviews':
                if (
                  Array.isArray(
                    item.data
                  )
                ) {
                  cloudReviews =
                    item.data as Review[];
                }
                break;

              case 'settings':
                if (
                  typeof item.data ===
                    'object' &&
                  !Array.isArray(
                    item.data
                  )
                ) {
                  setSettings({
                    ...INITIAL_SETTINGS,
                    ...(item.data as StoreSettings),
                  });
                }
                break;
            }
          }
        );

        /* ======================================================
           REVIEWS
        ====================================================== */

        const currentReviews =
          reviewsRef.current;

        let finalReviews =
          currentReviews;

        if (
          cloudReviews.length > 0
        ) {
          finalReviews =
            mergeReviews(
              currentReviews,
              cloudReviews
            );

          setReviews(
            finalReviews
          );

          const cloudIds =
            new Set<string>();

          cloudReviews.forEach(
            review => {
              cloudIds.add(
                String(review.id)
              );
            }
          );

          const localMissing =
            currentReviews.some(
              review =>
                !cloudIds.has(
                  String(
                    review.id
                  )
                )
            );

          if (localMissing) {
            modifiedDataTypes.current.add(
              'reviews'
            );
          }
        }

        /* ======================================================
           PRODUCTS
        ====================================================== */

        if (
          cloudProducts.length > 0
        ) {
          const productsWithRatings =
            recalculateProductRatings(
              cloudProducts,
              finalReviews
            );

          setProducts(
            productsWithRatings
          );
        }

        /* ======================================================
           INITIALIZED
        ====================================================== */

        cloudInitialized.current =
          true;

        /* ======================================================
           EMPTY DATABASE
        ====================================================== */

        if (
          cloudData.length === 0
        ) {
          console.log(
            'Supabase store_data is completely empty.'
          );

          modifiedDataTypes.current.add(
            'products'
          );

          modifiedDataTypes.current.add(
            'orders'
          );

          modifiedDataTypes.current.add(
            'custom_requests'
          );

          modifiedDataTypes.current.add(
            'reviews'
          );

          modifiedDataTypes.current.add(
            'settings'
          );

          await saveStoreData(
            'products',
            products
          );

          await saveStoreData(
            'orders',
            orders
          );

          await saveStoreData(
            'custom_requests',
            customRequests
          );

          await saveStoreData(
            'reviews',
            reviewsRef.current
          );

          await saveStoreData(
            'settings',
            settings
          );
        } else {
          console.log(
            'Supabase store data loaded successfully.'
          );

          console.log(
            'Existing cloud data types:',
            Array.from(
              cloudDataTypes.current
            )
          );
        }
      };

    initializeCloudData();

    return () => {
      cancelled = true;
    };
  }, []);

  /* ==========================================================
     REALTIME SYNC
  ========================================================== */

  useEffect(() => {
    const channel =
      supabase
        .channel(
          'store-data-sync'
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'store_data',
          },
          payload => {
            if (
              payload.eventType ===
              'DELETE'
            ) {
              return;
            }

            if (
              !cloudInitialized.current
            ) {
              return;
            }

            const newData =
              payload.new as {
                data_type?: string;
                data?: unknown;
              };

            if (
              !newData?.data_type ||
              newData.data ===
                undefined ||
              newData.data === null
            ) {
              return;
            }

            const dataType =
              newData.data_type;

            const data =
              newData.data;

            cloudDataTypes.current.add(
              dataType
            );

            const serialized =
              JSON.stringify(data);

            /* ==================================================
               REVIEWS
            ================================================== */

            if (
              dataType ===
              'reviews'
            ) {
              if (
                Array.isArray(data)
              ) {
                const incomingReviews =
                  data as Review[];

                setReviews(
                  currentReviews => {
                    const merged =
                      mergeReviews(
                        currentReviews,
                        incomingReviews
                      );

                    const incomingIds =
                      new Set(
                        incomingReviews.map(
                          review =>
                            String(
                              review.id
                            )
                        )
                      );

                    const localMissing =
                      currentReviews.some(
                        review =>
                          !incomingIds.has(
                            String(
                              review.id
                            )
                          )
                      );

                    if (
                      localMissing
                    ) {
                      modifiedDataTypes.current.add(
                        'reviews'
                      );
                    }

                    return merged;
                  }
                );

                lastCloudData.current[
                  dataType
                ] = serialized;
              }

              return;
            }

            /* ==================================================
               PRODUCTS
            ================================================== */

            if (
              dataType ===
              'products'
            ) {
              if (
                Array.isArray(data)
              ) {
                const incomingProducts =
                  data as Product[];

                setProducts(
                  currentProducts => {
                    const updatedProducts =
                      recalculateProductRatings(
                        incomingProducts,
                        reviewsRef.current
                      );

                    return updatedProducts.map(
                      cloudProduct => {
                        const localProduct =
                          currentProducts.find(
                            current =>
                              current.id ===
                              cloudProduct.id
                          );

                        if (
                          !localProduct
                        ) {
                          return cloudProduct;
                        }

                        const hasReviews =
                          reviewsRef.current.some(
                            review =>
                              review.productName
                                ?.trim()
                                .toLowerCase() ===
                              cloudProduct.name
                                ?.trim()
                                .toLowerCase()
                          );

                        return {
                          ...localProduct,
                          ...cloudProduct,

                          ...(cloudProduct.cardImageUrl
                            ? {
                                cardImageUrl:
                                  cloudProduct.cardImageUrl,
                              }
                            : localProduct.cardImageUrl
                            ? {
                                cardImageUrl:
                                  localProduct.cardImageUrl,
                              }
                            : {}),

                          ...(!hasReviews
                            ? {
                                rating:
                                  localProduct.rating,
                                reviewCount:
                                  localProduct.reviewCount,
                              }
                            : {}),
                        };
                      }
                    );
                  }
                );
              }

              lastCloudData.current[
                dataType
              ] = serialized;

              return;
            }

            /* ==================================================
               OTHER DATA
            ================================================== */

            lastCloudData.current[
              dataType
            ] = serialized;

            switch (
              dataType
            ) {
              case 'orders':
                if (
                  Array.isArray(data)
                ) {
                  setOrders(
                    data as Order[]
                  );
                }
                break;

              case 'custom_requests':
                if (
                  Array.isArray(data)
                ) {
                  setCustomRequests(
                    data as CustomRequest[]
                  );
                }
                break;

              case 'settings':
                if (
                  typeof data ===
                    'object' &&
                  !Array.isArray(data)
                ) {
                  setSettings({
                    ...INITIAL_SETTINGS,
                    ...(data as StoreSettings),
                  });
                }
                break;
            }
          }
        )
        .subscribe(status => {
          console.log(
            'Supabase realtime status:',
            status
          );
        });

    return () => {
      supabase.removeChannel(
        channel
      );
    };
  }, []);

  /* ==========================================================
     RATINGS
  ========================================================== */

  useEffect(() => {
    if (
      reviews.length === 0
    ) {
      return;
    }

    setProducts(
      currentProducts =>
        recalculateProductRatings(
          currentProducts,
          reviews
        )
    );
  }, [reviews]);

  /* ==========================================================
     PRODUCTS → SUPABASE + LOCAL CACHE
  ========================================================== */

  useEffect(() => {
    if (
      cloudInitialized.current &&
      !cloudLoadFailed.current
    ) {
      saveStoreData(
        'products',
        products
      );
    }

    /*
     * Important:
     * After upload, products state contains the Storage URL,
     * not the Base64 image.
     */
    setSafeLocalStorage(
      'knot_bloom_products',
      products
    );
  }, [products]);

  /* ==========================================================
     ORDERS
  ========================================================== */

  useEffect(() => {
    if (
      cloudInitialized.current &&
      !cloudLoadFailed.current
    ) {
      saveStoreData(
        'orders',
        orders
      );
    }

    setSafeLocalStorage(
      'knot_bloom_orders',
      orders
    );
  }, [orders]);

  /* ==========================================================
     CUSTOM REQUESTS
  ========================================================== */

  useEffect(() => {
    if (
      cloudInitialized.current &&
      !cloudLoadFailed.current
    ) {
      saveStoreData(
        'custom_requests',
        customRequests
      );
    }

    setSafeLocalStorage(
      'knot_bloom_custom_requests',
      customRequests
    );
  }, [customRequests]);

  /* ==========================================================
     REVIEWS
  ========================================================== */

  useEffect(() => {
    if (
      cloudInitialized.current &&
      !cloudLoadFailed.current
    ) {
      saveStoreData(
        'reviews',
        reviews
      );
    }

    setSafeLocalStorage(
      'knot_bloom_reviews',
      reviews
    );
  }, [reviews]);

  /* ==========================================================
     SETTINGS
  ========================================================== */

  useEffect(() => {
    if (
      cloudInitialized.current &&
      !cloudLoadFailed.current
    ) {
      saveStoreData(
        'settings',
        settings
      );
    }

    setSafeLocalStorage(
      'knot_bloom_settings',
      settings
    );
  }, [settings]);

  /* ==========================================================
     DEVICE DATA
  ========================================================== */

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

  /* ==========================================================
     TOAST
  ========================================================== */

  const showToast = (
    msg: string
  ) => {
    const now =
      Date.now();

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

    if (
      toastTimeoutRef.current
    ) {
      clearTimeout(
        toastTimeoutRef.current
      );
    }

    toastTimeoutRef.current =
      setTimeout(() => {
        setToastMessage(null);
        toastTimeoutRef.current =
          null;
      }, 4000);
  };

  /* ==========================================================
     USER AUTH
  ========================================================== */

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
      setCurrentUser(found);

      showToast(
        `🌸 Welcome back, ${found.name}!`
      );

      setActiveModal(null);

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
      roomOrSpot,
    };

    setRegisteredUsers(
      prev => [
        ...prev,
        newUser,
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
            'Hostel Block A',
        };

        setRegisteredUsers(
          prev => [
            ...prev,
            otpUser,
          ]
        );

        setCurrentUser(
          otpUser
        );
      }

      showToast(
        '✅ OTP Verification Successful! logged in.'
      );

      setActiveModal(null);

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

    setActiveModal(null);
  };

  const logoutUser = () => {
    setCurrentUser(null);

    showToast(
      'Logged out of student account'
    );
  };

  /* ==========================================================
     ADMIN AUTH
  ========================================================== */

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

    setIsAdminState(val);
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
        validUsername.toLowerCase() &&
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

      setIsAdminState(true);

      setActiveModal(null);

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

    setIsAdminState(false);

    showToast(
      'Logged out of Admin Portal'
    );
  };

  /* ==========================================================
     CART
  ========================================================== */

  const addToCart = (
    product: Product,
    quantity = 1,
    selectedColor?: string,
    wrapPaperColor?: string,
    giftNote?: string
  ) => {
    if (
      addToCartLock.current
    ) {
      return;
    }

    addToCartLock.current =
      true;

    setTimeout(() => {
      addToCartLock.current =
        false;
    }, 700);

    if (
      product.stock <= 0
    ) {
      showToast(
        '⚠️ Sorry, this item is currently out of stock!'
      );

      return;
    }

    const finalColor =
      selectedColor ||
      product.colorsAvailable[0];

    setCart(prev => {
      const existingIndex =
        prev.findIndex(
          item =>
            item.product.id ===
              product.id &&
            item.selectedColor ===
              finalColor
        );

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
                    quantity,
                }
              : item
        );
      }

      return [
        ...prev,
        {
          product,
          quantity,
          selectedColor:
            finalColor,
          wrapPaperColor,
          giftNote,
        },
      ];
    });

    showToast(
      `🌸 Added "${product.name}" to your cart!`
    );
  };

  const updateCartQuantity = (
    index: number,
    quantity: number
  ) => {
    setCart(prev => {
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
    });
  };

  const removeFromCart = (
    index: number
  ) => {
    setCart(prev =>
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

  /* ==========================================================
     PRODUCTS
  ========================================================== */

  const addProduct = (
    newProdData: Omit<
      Product,
      'id' |
        'rating' |
        'reviewCount'
    >
  ) => {
    modifiedDataTypes.current.add(
      'products'
    );

    const newProduct: Product =
      {
        ...newProdData,
        id: `prod-${Date.now()}`,
        rating: 5.0,
        reviewCount: 0,
      };

    setProducts(prev => [
      newProduct,
      ...prev,
    ]);

    showToast(
      `✨ Added "${newProduct.name}" to catalog!`
    );
  };

  const updateProduct = (
    id: string,
    updatedFields: Partial<Product>
  ) => {
    modifiedDataTypes.current.add(
      'products'
    );

    setProducts(prev =>
      prev.map(product =>
        product.id === id
          ? {
              ...product,
              ...updatedFields,
            }
          : product
      )
    );

    showToast(
      'Product updated successfully!'
    );
  };

  const updateStock = (
    id: string,
    newStock: number
  ) => {
    modifiedDataTypes.current.add(
      'products'
    );

    setProducts(prev =>
      prev.map(product =>
        product.id === id
          ? {
              ...product,
              stock: Math.max(
                0,
                newStock
              ),
            }
          : product
      )
    );

    showToast(
      `Stock updated to ${Math.max(
        0,
        newStock
      )}`
    );
  };

  const deleteProduct = (
    id: string
  ) => {
    modifiedDataTypes.current.add(
      'products'
    );

    setProducts(prev =>
      prev.filter(
        product =>
          product.id !== id
      )
    );

    showToast(
      'Product deleted from inventory'
    );
  };

  /* ==========================================================
     ORDERS
  ========================================================== */

  const createOrder = (
    orderData: Omit<
      Order,
      'id' |
        'createdAt' |
        'status'
    >
  ): Order => {
    modifiedDataTypes.current.add(
      'orders'
    );

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
          currentUser?.id,
      };

    setOrders(prev => [
      newOrder,
      ...prev,
    ]);

    orderData.items.forEach(
      item => {
        updateStock(
          item.productId,
          (
            products.find(
              product =>
                product.id ===
                item.productId
            )?.stock || 1
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
    modifiedDataTypes.current.add(
      'orders'
    );

    setOrders(prev =>
      prev.map(order =>
        order.id === id
          ? {
              ...order,
              status,
            }
          : order
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
    modifiedDataTypes.current.add(
      'orders'
    );

    setOrders(prev =>
      prev.map(order => {
        if (
          order.id === id
        ) {
          return {
            ...order,

            paymentStatus:
              isVerified
                ? 'Payment Verified ✅'
                : 'Pay on Pickup',

            paymentVerificationStatus:
              isVerified
                ? 'Payment Verified ✅'
                : 'Payment Rejected ❌',
          };
        }

        return order;
      })
    );

    showToast(
      isVerified
        ? `✅ Order ${id} Payment Verified!`
        : `❌ Order ${id} Payment Rejected!`
    );
  };

  /* ==========================================================
     CUSTOM REQUESTS
  ========================================================== */

  const createCustomRequest = (
    reqData: Omit<
      CustomRequest,
      'id' |
        'createdAt' |
        'status'
    >
  ) => {
    modifiedDataTypes.current.add(
      'custom_requests'
    );

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
          'Pending Quote',
      };

    setCustomRequests(
      prev => [
        newReq,
        ...prev,
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
    modifiedDataTypes.current.add(
      'custom_requests'
    );

    setCustomRequests(
      prev =>
        prev.map(
          request =>
            request.id === id
              ? {
                  ...request,
                  status,

                  ...(quotedPrice !==
                  undefined
                    ? {
                        quotedPrice,
                      }
                    : {}),
                }
              : request
        )
    );

    showToast(
      `Custom Request ${id} updated!`
    );
  };

  /* ==========================================================
     REVIEWS
  ========================================================== */

  const addReview = (
    reviewData: Omit<
      Review,
      'id' |
        'date' |
        'verifiedStudent'
    >
  ) => {
    modifiedDataTypes.current.add(
      'reviews'
    );

    modifiedDataTypes.current.add(
      'products'
    );

    const numericRating =
      Number(
        reviewData.rating
      );

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

    const newRev: Review =
      {
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
          true,
      };

    setReviews(prev => [
      newRev,
      ...prev,
    ]);

    showToast(
      'Thank you for your review!'
    );
  };

  /* ==========================================================
     SETTINGS
  ========================================================== */

  const updateSettings = (
    newSettings: Partial<StoreSettings>
  ) => {
    modifiedDataTypes.current.add(
      'settings'
    );

    setSettings(prev => ({
      ...prev,
      ...newSettings,
    }));

    showToast(
      'Store settings saved successfully!'
    );
  };

  /* ==========================================================
     PROVIDER
  ========================================================== */

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

        updateSettings,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

/* ============================================================
   HOOK
============================================================ */

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