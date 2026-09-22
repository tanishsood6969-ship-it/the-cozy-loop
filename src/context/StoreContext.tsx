
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

  showToast: (
    msg: string
  ) => void;

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

  removeFromCart: (
    index: number
  ) => void;

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

  deleteProduct: (
    id: string
  ) => void;

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
  createContext<
    StoreContextType | undefined
  >(undefined);

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
  } catch {
    return fallback;
  }
};

const setSafeLocalStorage = (
  key: string,
  value: unknown
) => {
  try {
    if (
      value === undefined
    ) {
      localStorage.removeItem(key);
      return;
    }

    localStorage.setItem(
      key,
      JSON.stringify(value)
    );
  } catch {
    // localStorage is only a cache.
  }
};

/*
 * ============================================================
 * SAFE ERROR MESSAGE
 * ============================================================
 */

const getSafeErrorMessage = (
  error: unknown
): string => {
  if (
    error instanceof Error &&
    error.message
  ) {
    return error.message;
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error
  ) {
    const message =
      (
        error as {
          message?: unknown;
        }
      ).message;

    if (
      typeof message === 'string' &&
      message.trim()
    ) {
      return message;
    }
  }

  return 'Unknown error';
};

/*
 * ============================================================
 * REMOVE BASE64 FROM LOCAL CACHE / DATABASE PAYLOAD
 * ============================================================
 */

const stripBase64CardImages = (
  productList: Product[]
): Product[] => {
  return productList.map(
    product => {
      if (
        typeof product.cardImageUrl ===
          'string' &&
        product.cardImageUrl.startsWith(
          'data:image/'
        )
      ) {
        return {
          ...product,
          cardImageUrl: undefined
        };
      }

      return product;
    }
  );
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
}> = ({
  children
}) => {
  /*
   * ============================================================
   * LOCAL STATE
   * ============================================================
   */

  const [
    products,
    setProducts
  ] = useState<Product[]>(() =>
    getSafeLocalStorage(
      'knot_bloom_products',
      INITIAL_PRODUCTS
    )
  );

  const [
    orders,
    setOrders
  ] = useState<Order[]>(() =>
    getSafeLocalStorage(
      'knot_bloom_orders',
      INITIAL_ORDERS
    )
  );

  const [
    customRequests,
    setCustomRequests
  ] =
    useState<CustomRequest[]>(
      () =>
        getSafeLocalStorage(
          'knot_bloom_custom_requests',
          INITIAL_CUSTOM_REQUESTS
        )
    );

  const [
    reviews,
    setReviews
  ] = useState<Review[]>(() =>
    getSafeLocalStorage(
      'knot_bloom_reviews',
      INITIAL_REVIEWS
    )
  );

  const [
    settings,
    setSettings
  ] = useState<StoreSettings>(() => {
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
   * ============================================================
   * DEVICE-SPECIFIC DATA
   * ============================================================
   */

  const [
    cart,
    setCart
  ] = useState<CartItem[]>(() =>
    getSafeLocalStorage(
      'knot_bloom_cart',
      []
    )
  );

  const [
    registeredUsers,
    setRegisteredUsers
  ] = useState<User[]>(() =>
    getSafeLocalStorage(
      'knot_bloom_registered_users',
      INITIAL_DEMO_USERS
    )
  );

  const [
    currentUser,
    setCurrentUser
  ] = useState<User | null>(() =>
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

  const [
    isAdmin,
    setIsAdminState
  ] = useState(false);

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

  const [
    selectedCategory,
    setSelectedCategory
  ] =
    useState<ProductCategory>('All');

  const [
    searchQuery,
    setSearchQuery
  ] = useState('');

  const [
    cartOpen,
    setCartOpen
  ] = useState(false);

  const [
    activeModal,
    setActiveModal
  ] =
    useState<ActiveModal>(null);

  const [
    selectedProduct,
    setSelectedProduct
  ] =
    useState<Product | null>(null);

  const [
    lastCreatedOrder,
    setLastCreatedOrder
  ] =
    useState<Order | null>(null);

  const [
    toastMessage,
    setToastMessage
  ] =
    useState<string | null>(null);

  /*
   * ============================================================
   * DARK MODE
   * ============================================================
   */

  const [
    isDarkMode,
    setIsDarkMode
  ] = useState<boolean>(() => {
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

  const toggleDarkMode =
    () => {
      setIsDarkMode(
        previous =>
          !previous
      );
    };

  /*
   * ============================================================
   * CLOUD SYNC CONTROL
   * ============================================================
   */

  const cloudInitialized =
    useRef(false);

  const cloudLoadFailed =
    useRef(false);

  /*
   * Which data types actually exist in Supabase.
   */

  const cloudDataTypes =
    useRef<Set<string>>(
      new Set()
    );

  /*
   * Which data types were changed locally.
   *
   * IMPORTANT:
   * This is different from cloudDataTypes.
   *
   * A cloud Realtime update must NOT automatically become
   * another cloud write.
   */

  const modifiedDataTypes =
    useRef<Set<string>>(
      new Set()
    );

  /*
   * Latest successful cloud JSON snapshot.
   */

  const lastCloudData =
    useRef<
      Record<string, string>
    >({});

  /*
   * ============================================================
   * REALTIME CONTROL
   * ============================================================
   */

  const realtimeChannelRef =
    useRef<any>(null);

  /*
   * Debounce timers.
   *
   * Example:
   *
   * products changed 5 times quickly
   *
   * → one fetch instead of 5 fetches
   */

  const realtimeDebounceTimers =
    useRef<
      Record<
        string,
        ReturnType<typeof setTimeout>
      >
    >({});

  /*
   * Last event timestamp.
   */

  const realtimeLastEventAt =
    useRef<
      Record<string, number>
    >({});

  /*
   * Data types currently being refreshed.
   */

  const realtimeRefreshInFlight =
    useRef<Set<string>>(
      new Set()
    );

  /*
   * Data types currently being saved.
   *
   * This protects local changes from being overwritten by
   * another browser's Realtime event while the local save
   * is still running.
   */

  const pendingLocalSaves =
    useRef<Set<string>>(
      new Set()
    );

  /*
   * Local mutation generation.
   *
   * Every local change increases the generation.
   *
   * If a Realtime response arrives from before the local
   * mutation was saved, it is ignored.
   */

  const localMutationVersion =
    useRef<
      Record<string, number>
    >({});

  /*
   * ============================================================
   * OTHER REFS
   * ============================================================
   */

  const addToCartLock =
    useRef(false);

  const toastTimeoutRef =
    useRef<
      ReturnType<typeof setTimeout> | null
    >(null);

  const lastToastMessageRef =
    useRef<string | null>(null);

  const lastToastTimeRef =
    useRef(0);

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
    useRef<
      Record<
        string,
        Promise<void>
      >
    >({});

  /*
   * ============================================================
   * MARK LOCAL DATA AS MODIFIED
   * ============================================================
   */

  const markDataTypeModified = (
    dataType: string
  ) => {
    modifiedDataTypes.current.add(
      dataType
    );

    localMutationVersion.current[
      dataType
    ] =
      (
        localMutationVersion.current[
          dataType
        ] || 0
      ) + 1;
  };

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

    return Array.from(
      merged.values()
    ).sort(
      (a, b) => {
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

        return (
          bTime - aTime
        );
      }
    );
  };

  /*
   * ============================================================
   * RECALCULATE PRODUCT RATINGS
   * ============================================================
   */

  const recalculateProductRatings =
    (
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
   * PRODUCT IMAGE UPLOAD
   * ============================================================
   */

  const dataUrlToBlob =
    async (
      dataUrl: string
    ): Promise<Blob> => {
      const response =
        await fetch(dataUrl);

      if (!response.ok) {
        throw new Error(
          `Could not read image data: ${response.status}`
        );
      }

      return response.blob();
    };

  const uploadProductCardImages =
    async (
      productList: Product[]
    ): Promise<Product[]> => {
      const result: Product[] =
        [];

      for (
        const product of productList
      ) {
        const cardImageUrl =
          product.cardImageUrl;

        /*
         * Already a normal URL.
         */

        if (
          typeof cardImageUrl !==
            'string' ||
          !cardImageUrl.startsWith(
            'data:image/'
          )
        ) {
          result.push(product);
          continue;
        }

        try {
          const blob =
            await dataUrlToBlob(
              cardImageUrl
            );

          const filePath =
            `products/${product.id}/card-image.jpg`;

          /*
           * Upload to Supabase Storage.
           */

          const {
            error: uploadError
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
                  upsert: true
                }
              );

          if (
            uploadError
          ) {
            throw new Error(
              `Image upload failed: ${getSafeErrorMessage(
                uploadError
              )}`
            );
          }

          /*
           * Get public URL.
           */

          const {
            data: publicUrlData
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
              'Image URL could not be created.'
            );
          }

          /*
           * Cache-busting query string ensures browsers don't
           * continue showing the previous cropped image.
           */

          const publicUrl =
            `${publicUrlData.publicUrl}?v=${Date.now()}`;

          result.push({
            ...product,
            cardImageUrl:
              publicUrl
          });
        } catch (
          error
        ) {
          console.error(
            `Product image upload failed for ${product.name}:`,
            getSafeErrorMessage(
              error
            )
          );

          /*
           * NEVER allow Base64 to continue into store_data.
           */

          result.push({
            ...product,
            cardImageUrl:
              undefined
          });

          throw error;
        }
      }

      return result;
    };

  /*
   * ============================================================
   * LOAD STORE DATA
   * ============================================================
   */

  const loadStoreData =
    async () => {
      const {
        data,
        error
      } =
        await supabase
          .from('store_data')
          .select(
            'data_type, data'
          );

      if (error) {
        console.error(
          `Cloud load failed: ${getSafeErrorMessage(
            error
          )}`
        );

        return null;
      }

      return data;
    };

  /*
   * ============================================================
   * BROADCAST DATA TYPE
   * ============================================================
   *
   * IMPORTANT:
   *
   * The actual JSON data is NOT broadcast.
   *
   * Only:
   *
   * {
   *   data_type: "products"
   * }
   *
   * is transmitted.
   */

  const broadcastDataType = async (
    dataType: string
  ) => {
    const channel =
      realtimeChannelRef.current;

    if (!channel) {
      return;
    }

    try {
      await channel.send({
        type: 'broadcast',
        event:
          'store_data_changed',
        payload: {
          data_type:
            dataType
        }
      });
    } catch (error) {
      console.error(
        `Realtime broadcast failed for ${dataType}:`,
        getSafeErrorMessage(
          error
        )
      );
    }
  };

  /*
   * ============================================================
   * SAVE STORE DATA
   * ============================================================
   */

  const saveStoreData = async (
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

    /*
     * Only locally modified data is written.
     *
     * This prevents a Realtime update from immediately
     * causing another database write.
     */

    if (
      !modifiedDataTypes.current.has(
        dataType
      )
    ) {
      return;
    }

    /*
     * Mark save as pending immediately.
     */

    pendingLocalSaves.current.add(
      dataType
    );

    const saveVersion =
      localMutationVersion.current[
        dataType
      ] || 0;

    const previousQueue =
      saveQueues.current[
        dataType
      ] ||
      Promise.resolve();

    const currentSave =
      previousQueue
        .catch(
          () => undefined
        )
        .then(
          async () => {
            try {
              let dataToSave =
                data;

              /*
               * ==================================================
               * PRODUCTS
               * ==================================================
               */

              if (
                dataType ===
                  'products' &&
                Array.isArray(data)
              ) {
                dataToSave =
                  await uploadProductCardImages(
                    data as Product[]
                  );
              }

              /*
               * Absolute Base64 safety check.
               */

              if (
                dataType ===
                  'products' &&
                Array.isArray(
                  dataToSave
                )
              ) {
                const containsBase64 =
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

                if (
                  containsBase64
                ) {
                  console.error(
                    'Cloud save cancelled: product image is still Base64.'
                  );

                  return;
                }
              }

              const serialized =
                JSON.stringify(
                  dataToSave
                );

              /*
               * Same successful cloud data = no database write.
               */

              if (
                lastCloudData.current[
                  dataType
                ] ===
                serialized
              ) {
                /*
                 * The local modification has already reached
                 * the exact cloud state.
                 */

                modifiedDataTypes.current.delete(
                  dataType
                );

                return;
              }

              /*
               * ==================================================
               * DATABASE WRITE
               * ==================================================
               */

              const {
                error
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
                        new Date().toISOString()
                    },
                    {
                      onConflict:
                        'data_type'
                    }
                  );

              if (
                error
              ) {
                console.error(
                  `Cloud save failed for ${dataType}: ${getSafeErrorMessage(
                    error
                  )}`
                );

                return;
              }

              /*
               * ==================================================
               * SUCCESSFUL CLOUD SNAPSHOT
               * ==================================================
               */

              lastCloudData.current[
                dataType
              ] = serialized;

              cloudDataTypes.current.add(
                dataType
              );

              /*
               * ==================================================
               * PRODUCTS
               *
               * If a Base64 image was uploaded, update the local
               * product URL only AFTER Storage + database succeed.
               * ==================================================
               */

              if (
                dataType ===
                  'products' &&
                Array.isArray(
                  dataToSave
                )
              ) {
                const savedProducts =
                  dataToSave as Product[];

                const incomingProducts =
                  data as Product[];

                const changed =
                  savedProducts.some(
                    (
                      savedProduct,
                      index
                    ) => {
                      const original =
                        incomingProducts[
                          index
                        ];

                      return (
                        original?.cardImageUrl !==
                        savedProduct.cardImageUrl
                      );
                    }
                  );

                if (
                  changed
                ) {
                  setProducts(
                    currentProducts =>
                      currentProducts.map(
                        currentProduct => {
                          const savedProduct =
                            savedProducts.find(
                              product =>
                                product.id ===
                                currentProduct.id
                            );

                          if (
                            !savedProduct
                          ) {
                            return currentProduct;
                          }

                          return {
                            ...currentProduct,
                            cardImageUrl:
                              savedProduct.cardImageUrl
                          };
                        }
                      )
                  );
                }
              }

              /*
               * IMPORTANT:
               *
               * Clear modified state only if this save represents
               * the latest local mutation.
               *
               * If the user changed the same data type again while
               * this upload/save was running, the next React effect
               * must save the newer state.
               */

              const currentVersion =
                localMutationVersion.current[
                  dataType
                ] || 0;

              if (
                currentVersion ===
                saveVersion
              ) {
                modifiedDataTypes.current.delete(
                  dataType
                );
              }

              /*
               * ==================================================
               * BROADCAST ONLY AFTER SUCCESSFUL SAVE
               * ==================================================
               *
               * We deliberately broadcast AFTER updating
               * lastCloudData.
               *
               * Therefore this browser receives its own event,
               * fetches the row, compares it with lastCloudData,
               * and immediately ignores it.
               */

              await broadcastDataType(
                dataType
              );
            } catch (
              error
            ) {
              console.error(
                `Cloud save failed for ${dataType}: ${getSafeErrorMessage(
                  error
                )}`
              );
            }
          }
        );

    saveQueues.current[
      dataType
    ] = currentSave;

    try {
      await currentSave;
    } finally {
      /*
       * Only remove pending state when this queue has no newer
       * save waiting behind it.
       */

      if (
        saveQueues.current[
          dataType
        ] === currentSave
      ) {
        pendingLocalSaves.current.delete(
          dataType
        );
      }
    }
  };

  /*
   * ============================================================
   * REFRESH ONE DATA TYPE FROM SUPABASE
   * ============================================================
   */

  const refreshDataType =
    async (
      dataType: string
    ) => {
      if (
        !cloudInitialized.current ||
        cloudLoadFailed.current
      ) {
        return;
      }

      /*
       * ========================================================
       * PROTECT LOCAL SAVE
       * ========================================================
       */

      if (
        pendingLocalSaves.current.has(
          dataType
        )
      ) {
        return;
      }

      /*
       * Don't fetch the same type concurrently.
       */

      if (
        realtimeRefreshInFlight.current.has(
          dataType
        )
      ) {
        return;
      }

      realtimeRefreshInFlight.current.add(
        dataType
      );

      try {
        const {
          data,
          error
        } =
          await supabase
            .from('store_data')
            .select(
              'data_type, data'
            )
            .eq(
              'data_type',
              dataType
            )
            .maybeSingle();

        if (
          error
        ) {
          console.error(
            `Realtime refresh failed for ${dataType}:`,
            getSafeErrorMessage(
              error
            )
          );

          return;
        }

        if (
          !data ||
          data.data ===
            undefined ||
          data.data ===
            null
        ) {
          return;
        }

        /*
         * ========================================================
         * CHECK AGAIN AFTER NETWORK REQUEST
         * ========================================================
         *
         * A local save may have started while the fetch was
         * running.
         */

        if (
          pendingLocalSaves.current.has(
            dataType
          )
        ) {
          return;
        }

        /*
         * A newer local modification also has priority.
         */

        if (
          modifiedDataTypes.current.has(
            dataType
          )
        ) {
          return;
        }

        const incomingData =
          data.data;

        const serialized =
          JSON.stringify(
            incomingData
          );

        /*
         * ========================================================
         * DUPLICATE EVENT PROTECTION
         * ========================================================
         */

        if (
          lastCloudData.current[
            dataType
          ] === serialized
        ) {
          return;
        }

        /*
         * ========================================================
         * PRODUCTS
         * ========================================================
         */

        if (
          dataType ===
            'products' &&
          Array.isArray(
            incomingData
          )
        ) {
          const incomingProducts =
            incomingData as Product[];

          const updatedProducts =
            recalculateProductRatings(
              incomingProducts,
              reviewsRef.current
            );

          /*
           * Avoid unnecessary React render if the effective
           * product state has not actually changed.
           */

          setProducts(
            currentProducts => {
              const merged =
                updatedProducts.map(
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

                      /*
                       * Keep existing image if the cloud row
                       * doesn't contain an image.
                       */

                      ...(cloudProduct.cardImageUrl
                        ? {
                            cardImageUrl:
                              cloudProduct.cardImageUrl
                          }
                        : localProduct.cardImageUrl
                        ? {
                            cardImageUrl:
                              localProduct.cardImageUrl
                          }
                        : {}),

                      /*
                       * Keep local rating when no reviews exist.
                       */

                      ...(!hasReviews
                        ? {
                            rating:
                              localProduct.rating,
                            reviewCount:
                              localProduct.reviewCount
                          }
                        : {})
                    };
                  }
                );

              const oldSerialized =
                JSON.stringify(
                  currentProducts
                );

              const newSerialized =
                JSON.stringify(
                  merged
                );

              if (
                oldSerialized ===
                newSerialized
              ) {
                return currentProducts;
              }

              return merged;
            }
          );

          lastCloudData.current[
            dataType
          ] = serialized;

          cloudDataTypes.current.add(
            dataType
          );

          return;
        }

        /*
         * ========================================================
         * ORDERS
         * ========================================================
         */

        if (
          dataType ===
            'orders' &&
          Array.isArray(
            incomingData
          )
        ) {
          setOrders(
            currentOrders => {
              const incoming =
                incomingData as Order[];

              if (
                JSON.stringify(
                  currentOrders
                ) ===
                JSON.stringify(
                  incoming
                )
              ) {
                return currentOrders;
              }

              return incoming;
            }
          );

          lastCloudData.current[
            dataType
          ] = serialized;

          cloudDataTypes.current.add(
            dataType
          );

          return;
        }

        /*
         * ========================================================
         * CUSTOM REQUESTS
         * ========================================================
         */

        if (
          dataType ===
            'custom_requests' &&
          Array.isArray(
            incomingData
          )
        ) {
          setCustomRequests(
            currentRequests => {
              const incoming =
                incomingData as CustomRequest[];

              if (
                JSON.stringify(
                  currentRequests
                ) ===
                JSON.stringify(
                  incoming
                )
              ) {
                return currentRequests;
              }

              return incoming;
            }
          );

          lastCloudData.current[
            dataType
          ] = serialized;

          cloudDataTypes.current.add(
            dataType
          );

          return;
        }

        /*
         * ========================================================
         * REVIEWS
         * ========================================================
         */

        if (
          dataType ===
            'reviews' &&
          Array.isArray(
            incomingData
          )
        ) {
          const incomingReviews =
            incomingData as Review[];

          setReviews(
            currentReviews => {
              const merged =
                mergeReviews(
                  currentReviews,
                  incomingReviews
                );

              if (
                JSON.stringify(
                  currentReviews
                ) ===
                JSON.stringify(
                  merged
                )
              ) {
                return currentReviews;
              }

              return merged;
            }
          );

          lastCloudData.current[
            dataType
          ] = serialized;

          cloudDataTypes.current.add(
            dataType
          );

          return;
        }

        /*
         * ========================================================
         * SETTINGS
         * ========================================================
         */

        if (
          dataType ===
            'settings' &&
          typeof incomingData ===
            'object' &&
          !Array.isArray(
            incomingData
          )
        ) {
          const nextSettings =
            {
              ...INITIAL_SETTINGS,
              ...(incomingData as StoreSettings)
            };

          setSettings(
            currentSettings => {
              if (
                JSON.stringify(
                  currentSettings
                ) ===
                JSON.stringify(
                  nextSettings
                )
              ) {
                return currentSettings;
              }

              return nextSettings;
            }
          );

          lastCloudData.current[
            dataType
          ] = serialized;

          cloudDataTypes.current.add(
            dataType
          );

          return;
        }
      } catch (
        error
      ) {
        console.error(
          `Realtime data refresh failed for ${dataType}:`,
          getSafeErrorMessage(
            error
          )
        );
      } finally {
        realtimeRefreshInFlight.current.delete(
          dataType
        );
      }
    };

  /*
   * ============================================================
   * DEBOUNCED REALTIME REFRESH
   * ============================================================
   */

  const scheduleRealtimeRefresh =
    (
      dataType: string
    ) => {
      const now =
        Date.now();

      const lastEvent =
        realtimeLastEventAt.current[
          dataType
        ] || 0;

      realtimeLastEventAt.current[
        dataType
      ] = now;

      /*
       * Clear previous timer.
       */

      const existingTimer =
        realtimeDebounceTimers.current[
          dataType
        ];

      if (
        existingTimer
      ) {
        clearTimeout(
          existingTimer
        );
      }

      /*
       * Short debounce.
       *
       * This is enough to combine rapid updates without making
       * the UI feel slow.
       */

      realtimeDebounceTimers.current[
        dataType
      ] = setTimeout(
        async () => {
          delete realtimeDebounceTimers.current[
            dataType
          ];

          /*
           * If another event arrived while waiting, the timer
           * would have been replaced.
           */

          const elapsed =
            Date.now() -
            lastEvent;

          if (
            elapsed <
            150
          ) {
            return;
          }

          await refreshDataType(
            dataType
          );
        },
        180
      );
    };

  /*
   * ============================================================
   * INITIAL CLOUD LOAD
   * ============================================================
   */

  useEffect(() => {
    let cancelled =
      false;

    const initializeCloudData =
      async () => {
        const cloudData =
          await loadStoreData();

        if (
          cancelled
        ) {
          return;
        }

        if (
          !cloudData
        ) {
          console.error(
            'Cloud data could not be loaded.'
          );

          cloudLoadFailed.current =
            true;

          return;
        }

        /*
         * ========================================================
         * REGISTER EXISTING CLOUD TYPES
         * ========================================================
         */

        cloudData.forEach(
          item => {
            if (
              item?.data_type &&
              item.data !==
                undefined &&
              item.data !==
                null
            ) {
              cloudDataTypes.current.add(
                item.data_type
              );
            }
          }
        );

        const requiredDataTypes =
          [
            'products',
            'orders',
            'custom_requests',
            'reviews',
            'settings'
          ];

        /*
         * ========================================================
         * COLLECT CLOUD DATA
         * ========================================================
         */

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
              item.data ===
                null
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
                    ...(item.data as StoreSettings)
                  });
                }

                break;
            }
          }
        );

        /*
         * ========================================================
         * MISSING DATA TYPES
         * ========================================================
         */

        requiredDataTypes.forEach(
          dataType => {
            if (
              !cloudDataTypes.current.has(
                dataType
              )
            ) {
              modifiedDataTypes.current.add(
                dataType
              );
            }
          }
        );

        /*
         * ========================================================
         * REVIEWS
         * ========================================================
         */

        const currentReviews =
          reviewsRef.current;

        let finalReviews =
          currentReviews;

        if (
          cloudReviews.length >
          0
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

          for (
            const review of cloudReviews
          ) {
            cloudIds.add(
              String(
                review.id
              )
            );
          }

          const hasLocalReviewsMissingFromCloud =
            currentReviews.some(
              review =>
                !cloudIds.has(
                  String(
                    review.id
                  )
                )
            );

          if (
            hasLocalReviewsMissingFromCloud
          ) {
            modifiedDataTypes.current.add(
              'reviews'
            );
          }
        }

        /*
         * ========================================================
         * PRODUCTS
         * ========================================================
         */

        if (
          cloudProducts.length >
          0
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

        /*
         * ========================================================
         * CLOUD IS NOW INITIALIZED
         * ========================================================
         */

        cloudInitialized.current =
          true;

        /*
         * ========================================================
         * EMPTY TABLE SEED
         * ========================================================
         *
         * If store_data was completely empty, seed it using
         * the existing local initial data.
         * ========================================================
         */

        if (
          cloudData.length ===
          0
        ) {
          console.log(
            'Supabase store_data is completely empty. Seeding initial data...'
          );

          /*
           * We explicitly mark these types as modified because
           * there was no cloud data.
           */

          requiredDataTypes.forEach(
            dataType =>
              modifiedDataTypes.current.add(
                dataType
              )
          );

          await Promise.all([
            saveStoreData(
              'products',
              products
            ),

            saveStoreData(
              'orders',
              orders
            ),

            saveStoreData(
              'custom_requests',
              customRequests
            ),

            saveStoreData(
              'reviews',
              reviewsRef.current
            ),

            saveStoreData(
              'settings',
              settings
            )
          ]);
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

          /*
           * If some rows were missing, save those missing types
           * after initialization.
           */

          for (
            const dataType of requiredDataTypes
          ) {
            if (
              modifiedDataTypes.current.has(
                dataType
              )
            ) {
              if (
                dataType ===
                'products'
              ) {
                await saveStoreData(
                  'products',
                  products
                );
              }

              if (
                dataType ===
                'orders'
              ) {
                await saveStoreData(
                  'orders',
                  orders
                );
              }

              if (
                dataType ===
                'custom_requests'
              ) {
                await saveStoreData(
                  'custom_requests',
                  customRequests
                );
              }

              if (
                dataType ===
                'reviews'
              ) {
                await saveStoreData(
                  'reviews',
                  reviewsRef.current
                );
              }

              if (
                dataType ===
                'settings'
              ) {
                await saveStoreData(
                  'settings',
                  settings
                );
              }
            }
          }
        }
      };

    initializeCloudData();

    return () => {
      cancelled =
        true;
    };
  }, []);

  /*
   * ============================================================
   * SUPABASE REALTIME BROADCAST
   * ============================================================
   */

  useEffect(() => {
    let cancelled =
      false;

    /*
     * Create exactly one channel for this provider instance.
     */

    const channel =
      supabase
        .channel(
          'store-data-sync'
        )
        .on(
          'broadcast',
          {
            event:
              'store_data_changed'
          },
          payload => {
            if (
              cancelled ||
              !cloudInitialized.current
            ) {
              return;
            }

            const dataType =
              payload?.payload
                ?.data_type;

            if (
              typeof dataType !==
              'string'
            ) {
              return;
            }

            /*
             * If this browser itself is currently saving this
             * type, don't let the broadcast overwrite it.
             */

            if (
              pendingLocalSaves.current.has(
                dataType
              )
            ) {
              return;
            }

            /*
             * Debounce duplicate / rapid broadcasts.
             */

            scheduleRealtimeRefresh(
              dataType
            );
          }
        )
        .subscribe(
          status => {
            console.log(
              'Supabase realtime status:',
              status
            );
          }
        );

    realtimeChannelRef.current =
      channel;

    return () => {
      cancelled =
        true;

      /*
       * Clear all pending debounce timers.
       */

      Object.values(
        realtimeDebounceTimers.current
      ).forEach(
        timer =>
          clearTimeout(
            timer
          )
      );

      realtimeDebounceTimers.current =
        {};

      /*
       * Clear channel ref first so no future save attempts
       * broadcast through an old channel.
       */

      if (
        realtimeChannelRef.current ===
        channel
      ) {
        realtimeChannelRef.current =
          null;
      }

      /*
       * Proper Supabase channel cleanup.
       */

      supabase.removeChannel(
        channel
      );
    };
  }, []);

  /*
   * ============================================================
   * RECALCULATE RATINGS WHEN REVIEWS CHANGE
   * ============================================================
   */

  useEffect(() => {
    if (
      reviews.length ===
      0
    ) {
      return;
    }

    setProducts(
      currentProducts => {
        const updated =
          recalculateProductRatings(
            currentProducts,
            reviews
          );

        /*
         * Only update if rating data actually changed.
         */

        if (
          JSON.stringify(
            currentProducts
          ) ===
          JSON.stringify(
            updated
          )
        ) {
          return currentProducts;
        }

        /*
         * A review changes product rating data, so products
         * should also eventually be persisted.
         */

        markDataTypeModified(
          'products'
        );

        return updated;
      }
    );
  }, [reviews]);

  /*
   * ============================================================
   * SHARED DATA → SUPABASE + LOCAL CACHE
   * ============================================================
   */

  useEffect(() => {
    if (
      cloudInitialized.current &&
      !cloudLoadFailed.current &&
      modifiedDataTypes.current.has(
        'products'
      )
    ) {
      void saveStoreData(
        'products',
        products
      );
    }

    setSafeLocalStorage(
      'knot_bloom_products',
      stripBase64CardImages(
        products
      )
    );
  }, [products]);

  useEffect(() => {
    if (
      cloudInitialized.current &&
      !cloudLoadFailed.current &&
      modifiedDataTypes.current.has(
        'orders'
      )
    ) {
      void saveStoreData(
        'orders',
        orders
      );
    }

    setSafeLocalStorage(
      'knot_bloom_orders',
      orders
    );
  }, [orders]);

  useEffect(() => {
    if (
      cloudInitialized.current &&
      !cloudLoadFailed.current &&
      modifiedDataTypes.current.has(
        'custom_requests'
      )
    ) {
      void saveStoreData(
        'custom_requests',
        customRequests
      );
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
      modifiedDataTypes.current.has(
        'reviews'
      )
    ) {
      void saveStoreData(
        'reviews',
        reviews
      );
    }

    setSafeLocalStorage(
      'knot_bloom_reviews',
      reviews
    );
  }, [reviews]);

  useEffect(() => {
    if (
      cloudInitialized.current &&
      !cloudLoadFailed.current &&
      modifiedDataTypes.current.has(
        'settings'
      )
    ) {
      void saveStoreData(
        'settings',
        settings
      );
    }

    setSafeLocalStorage(
      'knot_bloom_settings',
      settings
    );
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
    if (
      currentUser
    ) {
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

    setToastMessage(
      msg
    );

    if (
      toastTimeoutRef.current
    ) {
      clearTimeout(
        toastTimeoutRef.current
      );
    }

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

  const loginUserWithPassword =
    (
      loginId: string,
      pass: string
    ): boolean => {
      const cleanId =
        loginId
          .trim()
          .toLowerCase();

      const cleanPhone =
        loginId
          .replaceAll(
            ' ',
            ''
          )
          .replaceAll(
            '-',
            ''
          );

      const found =
        registeredUsers.find(
          u =>
            u.email
              .toLowerCase() ===
              cleanId ||
            u.phone
              .replaceAll(
                ' ',
                ''
              )
              .replaceAll(
                '-',
                ''
              ) ===
              cleanPhone
        );

      if (
        found &&
        found.password ===
          pass
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

  const signupUserWithPassword =
    (
      name: string,
      email: string,
      phone: string,
      password: string,
      dormOrBuilding?: string,
      roomOrSpot?: string
    ): User => {
      const newUser: User =
        {
          id: `usr-${Date.now()}`,
          name,
          email,
          phone,
          password,
          dormOrBuilding,
          roomOrSpot
        };

      setRegisteredUsers(
        previous => [
          ...previous,
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

  const verifyOtpCode =
    (
      identifier: string,
      code: string,
      generatedCode: string
    ): boolean => {
      if (
        code.trim() ===
          generatedCode.trim() ||
        code.trim() ===
          '7892' ||
        code.trim() ===
          '1234'
      ) {
        const cleanId =
          identifier
            .trim()
            .toLowerCase();

        const existing =
          registeredUsers.find(
            u =>
              u.email
                .toLowerCase() ===
                cleanId ||
              u.phone.includes(
                identifier
              )
          );

        if (
          existing
        ) {
          setCurrentUser(
            existing
          );
        } else {
          const otpUser: User =
            {
              id: `usr-otp-${Date.now()}`,
              name:
                identifier.split(
                  '@'
                )[0],
              email:
                identifier.includes(
                  '@'
                )
                  ? identifier
                  : `${identifier}@student.edu`,
              phone:
                identifier.includes(
                  '@'
                )
                  ? '+91 98765 43210'
                  : identifier,
              dormOrBuilding:
                'Hostel Block A'
            };

          setRegisteredUsers(
            previous => [
              ...previous,
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
    setCurrentUser(
      user
    );

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

  const loginAdminWithCredentials =
    (
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

  const logoutAdmin =
    () => {
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

    setCart(
      previous => {
        const existingIndex =
          previous.findIndex(
            item =>
              item.product.id ===
                product.id &&
              item.selectedColor ===
                finalColor
          );

        if (
          existingIndex > -1
        ) {
          return previous.map(
            (
              item,
              index
            ) =>
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

        return [
          ...previous,
          {
            product,
            quantity,
            selectedColor:
              finalColor,
            wrapPaperColor,
            giftNote
          }
        ];
      }
    );

    showToast(
      `🌸 Added "${product.name}" to your cart!`
    );
  };

  const updateCartQuantity =
    (
      index: number,
      quantity: number
    ) => {
      setCart(
        previous => {
          if (
            quantity <= 0
          ) {
            return previous.filter(
              (_, i) =>
                i !== index
            );
          }

          const updated =
            [
              ...previous
            ];

          updated[
            index
          ].quantity =
            quantity;

          return updated;
        }
      );
    };

  const removeFromCart =
    (
      index: number
    ) => {
      setCart(
        previous =>
          previous.filter(
            (_, i) =>
              i !== index
          )
      );

      showToast(
        'Removed item from cart'
      );
    };

  const clearCart =
    () => {
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
    markDataTypeModified(
      'products'
    );

    const newProduct: Product =
      {
        ...newProdData,
        id: `prod-${Date.now()}`,
        rating: 5.0,
        reviewCount: 0
      };

    setProducts(
      previous => [
        newProduct,
        ...previous
      ]
    );

    showToast(
      `✨ Added "${newProduct.name}" to catalog!`
    );
  };

  const updateProduct = (
    id: string,
    updatedFields: Partial<Product>
  ) => {
    markDataTypeModified(
      'products'
    );

    setProducts(
      previous =>
        previous.map(
          product =>
            product.id === id
              ? {
                  ...product,
                  ...updatedFields
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
    markDataTypeModified(
      'products'
    );

    setProducts(
      previous =>
        previous.map(
          product =>
            product.id === id
              ? {
                  ...product,
                  stock: Math.max(
                    0,
                    newStock
                  )
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
    markDataTypeModified(
      'products'
    );

    setProducts(
      previous =>
        previous.filter(
          product =>
            product.id !== id
        )
    );

    showToast(
      'Product deleted from inventory'
    );
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
    markDataTypeModified(
      'orders'
    );

    /*
     * Stock changes are also local product mutations.
     */

    markDataTypeModified(
      'products'
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

        status:
          'Pending',

        userId:
          currentUser?.id
      };

    setOrders(
      previous => [
        newOrder,
        ...previous
      ]
    );

    orderData.items.forEach(
      item => {
        updateStock(
          item.productId,
          (
            products.find(
              product =>
                product.id ===
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

  const updateOrderStatus =
    (
      id: string,
      status: OrderStatus
    ) => {
      markDataTypeModified(
        'orders'
      );

      setOrders(
        previous =>
          previous.map(
            order =>
              order.id === id
                ? {
                    ...order,
                    status
                  }
                : order
          )
      );

      showToast(
        `Order ${id} status updated to "${status}"`
      );
    };

  const verifyOrderPayment =
    (
      id: string,
      isVerified: boolean
    ) => {
      markDataTypeModified(
        'orders'
      );

      setOrders(
        previous =>
          previous.map(
            order => {
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
                      : 'Payment Rejected ❌'
                };
              }

              return order;
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

  const createCustomRequest =
    (
      reqData: Omit<
        CustomRequest,
        'id' |
          'createdAt' |
          'status'
      >
    ) => {
      markDataTypeModified(
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
            'Pending Quote'
        };

      setCustomRequests(
        previous => [
          newReq,
          ...previous
        ]
      );

      showToast(
        '✨ Custom commission request submitted to studio!'
      );
    };

  const updateCustomRequestStatus =
    (
      id: string,
      status: CustomRequest['status'],
      quotedPrice?: number
    ) => {
      markDataTypeModified(
        'custom_requests'
      );

      setCustomRequests(
        previous =>
          previous.map(
            request =>
              request.id === id
                ? {
                    ...request,
                    status,

                    ...(quotedPrice !==
                    undefined
                      ? {
                          quotedPrice
                        }
                      : {})
                  }
                : request
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
    markDataTypeModified(
      'reviews'
    );

    markDataTypeModified(
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
          true
      };

    setReviews(
      previous => [
        newRev,
        ...previous
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
    markDataTypeModified(
      'settings'
    );

    setSettings(
      previous => ({
        ...previous,
        ...newSettings
      })
    );

    showToast(
      'Store settings saved successfully!'
    );
  };

  /*
   * ============================================================
   * CLEANUP TOAST ON UNMOUNT
   * ============================================================
   */

  useEffect(() => {
    return () => {
      if (
        toastTimeoutRef.current
      ) {
        clearTimeout(
          toastTimeoutRef.current
        );
      }
    };
  }, []);

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

/*
 * ============================================================
 * USE STORE
 * ============================================================
 */

export const useStore =
  () => {
    const context =
      useContext(
        StoreContext
      );

    if (
      !context
    ) {
      throw new Error(
        'useStore must be used within a StoreProvider'
      );
    }

    return context;
  };

