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
  setSelectedCategory: (cat: ProductCategory) => void;

  searchQuery: string;
  setSearchQuery: (q: string) => void;

  cartOpen: boolean;
  setCartOpen: (val: boolean) => void;

  activeModal:
    | 'product'
    | 'customOrder'
    | 'checkout'
    | 'orderSuccess'
    | 'orderTracker'
    | 'auth'
    | 'adminAuth'
    | 'userOrders'
    | null;

  setActiveModal: (
    modal:
      | 'product'
      | 'customOrder'
      | 'checkout'
      | 'orderSuccess'
      | 'orderTracker'
      | 'auth'
      | 'adminAuth'
      | 'userOrders'
      | null
  ) => void;

  selectedProduct: Product | null;
  setSelectedProduct: (prod: Product | null) => void;

  lastCreatedOrder: Order | null;
  setLastCreatedOrder: (ord: Order | null) => void;

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
    product: Omit<Product, 'id' | 'rating' | 'reviewCount'>
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
    orderData: Omit<Order, 'id' | 'createdAt' | 'status'>
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
    reqData: Omit<CustomRequest, 'id' | 'createdAt' | 'status'>
  ) => void;

  updateCustomRequestStatus: (
    id: string,
    status: CustomRequest['status'],
    quotedPrice?: number
  ) => void;

  addReview: (
    reviewData: Omit<Review, 'id' | 'date' | 'verifiedStudent'>
  ) => void;

  updateSettings: (
    newSettings: Partial<StoreSettings>
  ) => void;
}

const StoreContext =
  createContext<StoreContextType | undefined>(undefined);

/*
 * ============================================================
 * SAFE LOCAL STORAGE HELPERS
 * ============================================================
 */

/*
 * Safely reads JSON data from localStorage.
 *
 * If the stored value is:
 * - missing
 * - "undefined"
 * - "null"
 * - corrupted JSON
 *
 * the fallback value is returned instead of crashing the app.
 */
const getSafeLocalStorage = <T,>(
  key: string,
  fallback: T
): T => {
  try {
    const saved = localStorage.getItem(key);

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

    /*
     * Remove corrupted data so it cannot break
     * the application again on the next refresh.
     */
    try {
      localStorage.removeItem(key);
    } catch {
      // Ignore localStorage removal errors.
    }

    return fallback;
  }
};

/*
 * Safely saves data to localStorage.
 *
 * Most importantly, undefined is NEVER saved as:
 *
 * "undefined"
 *
 * because that value cannot later be parsed by JSON.parse().
 */
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
    dormOrBuilding: 'Subir Hall - Block B',
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
  console.log('STORE PROVIDER IS RUNNING');

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
      const parsed = getSafeLocalStorage(
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

  const [adminAuthenticated, setAdminAuthenticated] =
    useState<boolean>(() => {
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

    root.classList.remove('dark');

    if (isDarkMode) {
      root.classList.add('dark');
    }

    localStorage.setItem(
      'cozy_dark_mode',
      isDarkMode ? 'true' : 'false'
    );
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(
      (prev) => !prev
    );
  };

  const [cartOpen, setCartOpen] =
    useState(false);

  const [activeModal, setActiveModal] =
    useState<
      | 'product'
      | 'customOrder'
      | 'checkout'
      | 'orderSuccess'
      | 'orderTracker'
      | 'auth'
      | 'adminAuth'
      | 'userOrders'
      | null
    >(null);

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

  const lastCloudData =
    useRef<Record<string, string>>({});

  /*
   * ============================================================
   * LOAD STORE DATA FROM SUPABASE
   * ============================================================
   */

  const loadStoreData = async () => {
    const { data, error } =
      await supabase
        .from('store_data')
        .select('data_type, data');

    if (error) {
      console.error(
        'Error loading store data:',
        error
      );

      return null;
    }

    return data;
  };

  /*
   * ============================================================
   * SAVE STORE DATA TO SUPABASE
   * ============================================================
   */

  const saveStoreData = async (
    dataType: string,
    data: unknown
  ) => {
    if (!cloudInitialized.current) {
      return;
    }

    /*
     * NEVER save undefined/null values.
     */
    if (
      data === undefined ||
      data === null
    ) {
      console.warn(
        `Skipping cloud save for ${dataType}: data is empty`
      );

      return;
    }

    const serialized =
      JSON.stringify(data);

    /*
     * Prevent realtime loops.
     */
    if (
      lastCloudData.current[dataType] ===
      serialized
    ) {
      delete lastCloudData.current[
        dataType
      ];

      return;
    }

    console.log(
      'Saving to cloud:',
      dataType
    );

    const { error } =
      await supabase
        .from('store_data')
        .upsert(
          {
            data_type: dataType,
            data,
            updated_at:
              new Date().toISOString()
          },
          {
            onConflict:
              'data_type'
          }
        );

    if (error) {
      console.error(
        `Error saving ${dataType}:`,
        error
      );
    } else {
      console.log(
        `Successfully saved ${dataType} to Supabase`
      );
    }
  };

  /*
   * ============================================================
   * INITIAL CLOUD LOAD
   * ============================================================
   */

  useEffect(() => {
    const initializeCloudData =
      async () => {
        const cloudData =
          await loadStoreData();

        if (
          cloudData &&
          cloudData.length > 0
        ) {
          cloudData.forEach(
            (item) => {
              /*
               * Ignore malformed Supabase rows.
               */
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
                    setProducts(
                      item.data as Product[]
                    );
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
                    setReviews(
                      item.data as Review[]
                    );
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
        }

        /*
         * Only after cloud data has been loaded
         * do we allow changes to be saved.
         */
        cloudInitialized.current =
          true;

        /*
         * If Supabase is empty, upload the
         * current local data once.
         */
        if (
          !cloudData ||
          cloudData.length === 0
        ) {
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
              reviews
            ),
            saveStoreData(
              'settings',
              settings
            )
          ]);
        }
      };

    initializeCloudData();
  }, []);

  /*
   * ============================================================
   * REALTIME SYNC
   * ============================================================
   */

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
            table: 'store_data'
          },
          (payload) => {
            /*
             * DELETE events don't contain the same
             * "new" data as INSERT/UPDATE events.
             */
            if (
              payload.eventType ===
              'DELETE'
            ) {
              return;
            }

            const newData =
              payload.new as {
                data_type?: string;
                data?: unknown;
              };

            /*
             * Never update React state with
             * undefined/null cloud data.
             */
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

            const serialized =
              JSON.stringify(data);

            lastCloudData.current[
              dataType
            ] = serialized;

            switch (
              dataType
            ) {
              case 'products':
                if (
                  Array.isArray(data)
                ) {
                  setProducts(
                    data as Product[]
                  );
                }
                break;

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

              case 'reviews':
                if (
                  Array.isArray(data)
                ) {
                  setReviews(
                    data as Review[]
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
                    ...(data as StoreSettings)
                  });
                }
                break;
            }
          }
        )
        .subscribe(
          (status) => {
            console.log(
              'Supabase realtime status:',
              status
            );
          }
        );

    return () => {
      supabase.removeChannel(
        channel
      );
    };
  }, []);

  /*
   * ============================================================
   * SHARED DATA → SUPABASE + LOCAL CACHE
   * ============================================================
   */

  useEffect(() => {
    saveStoreData(
      'products',
      products
    );

    setSafeLocalStorage(
      'knot_bloom_products',
      products
    );
  }, [products]);

  useEffect(() => {
    saveStoreData(
      'orders',
      orders
    );

    setSafeLocalStorage(
      'knot_bloom_orders',
      orders
    );
  }, [orders]);

  useEffect(() => {
    saveStoreData(
      'custom_requests',
      customRequests
    );

    setSafeLocalStorage(
      'knot_bloom_custom_requests',
      customRequests
    );
  }, [customRequests]);

  useEffect(() => {
    saveStoreData(
      'reviews',
      reviews
    );

    setSafeLocalStorage(
      'knot_bloom_reviews',
      reviews
    );
  }, [reviews]);

  useEffect(() => {
    saveStoreData(
      'settings',
      settings
    );

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
    setToastMessage(msg);

    setTimeout(() => {
      setToastMessage(null);
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
        (u) =>
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
      roomOrSpot
    };

    setRegisteredUsers(
      (prev) => [
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

    setActiveModal(null);

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
          (u) =>
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
          (prev) => [
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
      product.stock <= 0
    ) {
      showToast(
        '⚠️ Sorry, this item is currently out of stock!'
      );

      return;
    }

    setCart(
      (prev) => {
        const existingIndex =
          prev.findIndex(
            (item) =>
              item.product.id ===
                product.id &&
              item.selectedColor ===
                (selectedColor ||
                  product
                    .colorsAvailable[0])
          );

        if (
          existingIndex >
          -1
        ) {
          const updated =
            [...prev];

          updated[
            existingIndex
          ].quantity +=
            quantity;

          return updated;
        }

        return [
          ...prev,
          {
            product,
            quantity,
            selectedColor:
              selectedColor ||
              product
                .colorsAvailable[0],
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

  const updateCartQuantity = (
    index: number,
    quantity: number
  ) => {
    setCart(
      (prev) => {
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

        updated[
          index
        ].quantity =
          quantity;

        return updated;
      }
    );
  };

  const removeFromCart = (
    index: number
  ) => {
    setCart(
      (prev) =>
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
    const newProduct: Product =
      {
        ...newProdData,
        id: `prod-${Date.now()}`,
        rating: 5.0,
        reviewCount: 0
      };

    setProducts(
      (prev) => [
        newProduct,
        ...prev
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
    setProducts(
      (prev) =>
        prev.map(
          (p) =>
            p.id === id
              ? {
                  ...p,
                  ...updatedFields
                }
              : p
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
    setProducts(
      (prev) =>
        prev.map(
          (p) =>
            p.id === id
              ? {
                  ...p,
                  stock: Math.max(
                    0,
                    newStock
                  )
                }
              : p
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
    setProducts(
      (prev) =>
        prev.filter(
          (p) =>
            p.id !== id
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
      (prev) => [
        newOrder,
        ...prev
      ]
    );

    orderData.items.forEach(
      (item) => {
        updateStock(
          item.productId,
          (products.find(
            (p) =>
              p.id ===
              item.productId
          )?.stock ||
            1) -
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
    setOrders(
      (prev) =>
        prev.map(
          (o) =>
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
    setOrders(
      (prev) =>
        prev.map(
          (o) => {
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
      (prev) => [
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
    setCustomRequests(
      (prev) =>
        prev.map(
          (r) =>
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
    const newRev: Review =
      {
        ...reviewData,
        id: `rev-${Date.now()}`,
        date: 'Just now',
        verifiedStudent: true
      };

    setReviews(
      (prev) => [
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
    setSettings(
      (prev) => ({
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
    useContext(StoreContext);

  if (!context) {
    throw new Error(
      'useStore must be used within a StoreProvider'
    );
  }

  return context;
};