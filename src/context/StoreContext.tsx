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
  setSelectedCategory: (cat: ProductCategory) => void;

  searchQuery: string;
  setSearchQuery: (q: string) => void;

  cartOpen: boolean;
  setCartOpen: (val: boolean) => void;

  activeModal: ActiveModal;
  setActiveModal: (modal: ActiveModal) => void;

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

  updateCartQuantity: (index: number, quantity: number) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;

  addProduct: (
    product: Omit<Product, 'id' | 'rating' | 'reviewCount'>
  ) => void;

  updateProduct: (id: string, updatedFields: Partial<Product>) => void;
  updateStock: (id: string, newStock: number) => void;
  deleteProduct: (id: string) => void;

  createOrder: (
    orderData: Omit<Order, 'id' | 'createdAt' | 'status'>
  ) => Order;

  updateOrderStatus: (id: string, status: OrderStatus) => void;
  verifyOrderPayment: (id: string, isVerified: boolean) => void;

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

  updateSettings: (newSettings: Partial<StoreSettings>) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(
  undefined
);

/* ============================================================
   LOCAL STORAGE HELPERS
============================================================ */

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

const setSafeLocalStorage = (
  key: string,
  value: unknown
): void => {
  try {
    if (value === undefined) {
      localStorage.removeItem(key);
      return;
    }

    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Could not save ${key} to localStorage.`, error);
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
    dormOrBuilding: 'Subir Hall - Block B',
    roomOrSpot: 'Room 304',
  },
];

/* ============================================================
   STORE PROVIDER
============================================================ */

export const StoreProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  /* ------------------------------------------------------------
     PRODUCTS
  ------------------------------------------------------------ */

  const [products, setProducts] = useState<Product[]>(() =>
    getSafeLocalStorage('knot_bloom_products', INITIAL_PRODUCTS)
  );

  /* ------------------------------------------------------------
     ORDERS
  ------------------------------------------------------------ */

  const [orders, setOrders] = useState<Order[]>(() =>
    getSafeLocalStorage('knot_bloom_orders', INITIAL_ORDERS)
  );

  /* ------------------------------------------------------------
     CUSTOM REQUESTS
  ------------------------------------------------------------ */

  const [customRequests, setCustomRequests] =
    useState<CustomRequest[]>(() =>
      getSafeLocalStorage(
        'knot_bloom_custom_requests',
        INITIAL_CUSTOM_REQUESTS
      )
    );

  /* ------------------------------------------------------------
     REVIEWS
  ------------------------------------------------------------ */

  const [reviews, setReviews] = useState<Review[]>(() =>
    getSafeLocalStorage('knot_bloom_reviews', INITIAL_REVIEWS)
  );

  /* ------------------------------------------------------------
     STORE SETTINGS
  ------------------------------------------------------------ */

  const [settings, setSettings] = useState<StoreSettings>(() => {
    const saved = getSafeLocalStorage<Partial<StoreSettings>>(
      'knot_bloom_settings',
      {}
    );

    return {
      ...INITIAL_SETTINGS,
      ...saved,
    };
  });

  /* ------------------------------------------------------------
     CART
  ------------------------------------------------------------ */

  const [cart, setCart] = useState<CartItem[]>(() =>
    getSafeLocalStorage('knot_bloom_cart', [])
  );

  /* ------------------------------------------------------------
     USERS
  ------------------------------------------------------------ */

  const [registeredUsers, setRegisteredUsers] = useState<User[]>(() =>
    getSafeLocalStorage(
      'knot_bloom_registered_users',
      INITIAL_DEMO_USERS
    )
  );

  const [currentUser, setCurrentUser] = useState<User | null>(() =>
    getSafeLocalStorage('knot_bloom_current_user', null)
  );

  /* ------------------------------------------------------------
     ADMIN AUTHENTICATION
  ------------------------------------------------------------ */

  const [isAdmin, setIsAdminState] = useState(false);

  const [adminAuthenticated, setAdminAuthenticated] =
    useState<boolean>(() => {
      try {
        return sessionStorage.getItem('knot_bloom_admin_auth') === 'true';
      } catch {
        return false;
      }
    });

  /* ------------------------------------------------------------
     UI STATE
  ------------------------------------------------------------ */

  const [selectedCategory, setSelectedCategory] =
    useState<ProductCategory>('All');

  const [searchQuery, setSearchQuery] = useState('');

  const [cartOpen, setCartOpen] = useState(false);

  const [activeModal, setActiveModal] =
    useState<ActiveModal>(null);

  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  const [lastCreatedOrder, setLastCreatedOrder] =
    useState<Order | null>(null);

  const [toastMessage, setToastMessage] =
    useState<string | null>(null);

  /* ------------------------------------------------------------
     DARK MODE
  ------------------------------------------------------------ */

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('cozy_dark_mode') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);

    try {
      localStorage.setItem(
        'cozy_dark_mode',
        isDarkMode ? 'true' : 'false'
      );
    } catch {
      // Dark mode still works for the current session.
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((previous) => !previous);
  };

  /* ------------------------------------------------------------
     REFS
  ------------------------------------------------------------ */

  const addToCartLock = useRef(false);

  const toastTimeoutRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  const lastToastMessageRef = useRef<string | null>(null);
  const lastToastTimeRef = useRef<number>(0);

  /* ------------------------------------------------------------
     PERSISTENCE

     All store data is saved locally.
     No Supabase connection is used.
  ------------------------------------------------------------ */

  useEffect(() => {
    setSafeLocalStorage('knot_bloom_products', products);
  }, [products]);

  useEffect(() => {
    setSafeLocalStorage('knot_bloom_orders', orders);
  }, [orders]);

  useEffect(() => {
    setSafeLocalStorage('knot_bloom_custom_requests', customRequests);
  }, [customRequests]);

  useEffect(() => {
    setSafeLocalStorage('knot_bloom_reviews', reviews);
  }, [reviews]);

  useEffect(() => {
    setSafeLocalStorage('knot_bloom_settings', settings);
  }, [settings]);

  useEffect(() => {
    setSafeLocalStorage('knot_bloom_cart', cart);
  }, [cart]);

  useEffect(() => {
    setSafeLocalStorage('knot_bloom_registered_users', registeredUsers);
  }, [registeredUsers]);

  useEffect(() => {
    if (currentUser) {
      setSafeLocalStorage('knot_bloom_current_user', currentUser);
    } else {
      try {
        localStorage.removeItem('knot_bloom_current_user');
      } catch {
        // Ignore storage errors.
      }
    }
  }, [currentUser]);

  /* ------------------------------------------------------------
     TOAST NOTIFICATIONS
  ------------------------------------------------------------ */

  const showToast = (message: string) => {
    const now = Date.now();

    if (
      lastToastMessageRef.current === message &&
      now - lastToastTimeRef.current < 2000
    ) {
      return;
    }

    lastToastMessageRef.current = message;
    lastToastTimeRef.current = now;

    setToastMessage(message);

    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }

    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
      toastTimeoutRef.current = null;
    }, 4000);
  };

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  /* ------------------------------------------------------------
     PRODUCT RATINGS
  ------------------------------------------------------------ */

  const recalculateProductRatings = (
    productList: Product[],
    reviewList: Review[]
  ): Product[] => {
    return productList.map((product) => {
      const productName = product.name?.trim().toLowerCase();

      const productReviews = reviewList.filter(
        (review) =>
          review.productName?.trim().toLowerCase() === productName
      );

      if (productReviews.length === 0) {
        return product;
      }

      const ratings = productReviews
        .map((review) => Number(review.rating))
        .filter(
          (rating) =>
            Number.isFinite(rating) &&
            rating >= 1 &&
            rating <= 5
        );

      if (ratings.length === 0) {
        return product;
      }

      const average =
        ratings.reduce((sum, rating) => sum + rating, 0) /
        ratings.length;

      return {
        ...product,
        rating: Math.round(average * 10) / 10,
        reviewCount: ratings.length,
      };
    });
  };

  useEffect(() => {
    if (reviews.length === 0) {
      return;
    }

    setProducts((currentProducts) =>
      recalculateProductRatings(currentProducts, reviews)
    );
  }, [reviews]);

  /* ============================================================
     USER AUTHENTICATION
  ============================================================ */

  const loginUserWithPassword = (
    loginId: string,
    password: string
  ): boolean => {
    const cleanId = loginId.trim().toLowerCase();

    const cleanPhone = loginId
      .replaceAll(' ', '')
      .replaceAll('-', '');

    const found = registeredUsers.find((user) => {
      const userPhone = user.phone
        .replaceAll(' ', '')
        .replaceAll('-', '');

      return (
        user.email.toLowerCase() === cleanId ||
        userPhone === cleanPhone
      );
    });

    if (found && found.password === password) {
      setCurrentUser(found);
      showToast(`🌸 Welcome back, ${found.name}!`);
      setActiveModal(null);
      return true;
    }

    showToast(
      'Invalid email/mobile number or password. Please check your credentials.'
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

    setRegisteredUsers((previous) => [
      ...previous,
      newUser,
    ]);

    setCurrentUser(newUser);

    showToast(`Account created successfully! Welcome ${name}.`);
    setActiveModal(null);

    return newUser;
  };

  const sendOtpCode = (identifier: string): string => {
    const otp = Math.floor(
      1000 + Math.random() * 9000
    ).toString();

    showToast(
      `Demo verification code for ${identifier}: ${otp}`
    );

    return otp;
  };

  const verifyOtpCode = (
    identifier: string,
    code: string,
    generatedCode: string
  ): boolean => {
    if (
      code.trim() === generatedCode.trim() ||
      code.trim() === '7892' ||
      code.trim() === '1234'
    ) {
      const cleanId = identifier.trim().toLowerCase();

      const existing = registeredUsers.find(
        (user) =>
          user.email.toLowerCase() === cleanId ||
          user.phone.replaceAll(' ', '') ===
            identifier.replaceAll(' ', '')
      );

      if (existing) {
        setCurrentUser(existing);
      } else {
        const otpUser: User = {
          id: `usr-otp-${Date.now()}`,
          name: identifier.includes('@')
            ? identifier.split('@')[0]
            : 'New Customer',
          email: identifier.includes('@')
            ? identifier
            : `${identifier}@student.edu`,
          phone: identifier.includes('@')
            ? '+91 98765 43210'
            : identifier,
          dormOrBuilding: 'Hostel Block A',
        };

        setRegisteredUsers((previous) => [
          ...previous,
          otpUser,
        ]);

        setCurrentUser(otpUser);
      }

      showToast('OTP verification successful!');
      setActiveModal(null);

      return true;
    }

    showToast('Invalid verification code. Please try again.');
    return false;
  };

  const loginUserDirect = (user: User) => {
    setCurrentUser(user);
    showToast(`Logged in as ${user.name}`);
    setActiveModal(null);
  };

  const logoutUser = () => {
    setCurrentUser(null);
    showToast('Logged out of your account.');
  };

  /* ============================================================
     ADMIN AUTHENTICATION
  ============================================================ */

  const setIsAdmin = (value: boolean) => {
    if (value && !adminAuthenticated) {
      setActiveModal('adminAuth');
      return;
    }

    setIsAdminState(value);
  };

  const loginAdminWithCredentials = (
    username: string,
    pin: string
  ): boolean => {
    const validUsername = settings.adminUsername || 'admin';
    const validPin = settings.adminPin || 'admin123';

    if (
      username.trim().toLowerCase() ===
        validUsername.toLowerCase() &&
      pin.trim() === validPin
    ) {
      setAdminAuthenticated(true);
      setIsAdminState(true);

      try {
        sessionStorage.setItem('knot_bloom_admin_auth', 'true');
      } catch {
        // Authentication still works for this session.
      }

      setActiveModal(null);
      showToast('Welcome to the admin portal!');

      return true;
    }

    showToast('Invalid admin username or security PIN.');
    return false;
  };

  const logoutAdmin = () => {
    setAdminAuthenticated(false);
    setIsAdminState(false);

    try {
      sessionStorage.removeItem('knot_bloom_admin_auth');
    } catch {
      // Ignore storage errors.
    }

    showToast('Logged out of the admin portal.');
  };

  /* ============================================================
     CART
  ============================================================ */

  const addToCart = (
    product: Product,
    quantity = 1,
    selectedColor?: string,
    wrapPaperColor?: string,
    giftNote?: string
  ) => {
    if (addToCartLock.current) {
      return;
    }

    addToCartLock.current = true;

    setTimeout(() => {
      addToCartLock.current = false;
    }, 700);

    if (product.stock <= 0) {
      showToast('Sorry, this product is out of stock.');
      return;
    }

    const finalColor =
      selectedColor || product.colorsAvailable?.[0] || '';

    setCart((previous) => {
      const existingIndex = previous.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedColor === finalColor
      );

      if (existingIndex >= 0) {
        return previous.map((item, index) =>
          index === existingIndex
            ? {
                ...item,
                quantity: item.quantity + quantity,
              }
            : item
        );
      }

      return [
        ...previous,
        {
          product,
          quantity,
          selectedColor: finalColor,
          wrapPaperColor,
          giftNote,
        },
      ];
    });

    showToast(`Added "${product.name}" to your cart!`);
  };

  const updateCartQuantity = (
    index: number,
    quantity: number
  ) => {
    setCart((previous) => {
      if (quantity <= 0) {
        return previous.filter((_, i) => i !== index);
      }

      return previous.map((item, i) =>
        i === index
          ? { ...item, quantity }
          : item
      );
    });
  };

  const removeFromCart = (index: number) => {
    setCart((previous) =>
      previous.filter((_, i) => i !== index)
    );

    showToast('Item removed from cart.');
  };

  const clearCart = () => {
    setCart([]);
  };

  /* ============================================================
     PRODUCTS
  ============================================================ */

  const addProduct = (
    newProdData: Omit<
      Product,
      'id' | 'rating' | 'reviewCount'
    >
  ) => {
    const newProduct: Product = {
      ...newProdData,
      id: `prod-${Date.now()}`,
      rating: 5,
      reviewCount: 0,
    };

    setProducts((previous) => [
      newProduct,
      ...previous,
    ]);

    showToast(`Added "${newProduct.name}" to the catalog!`);
  };

  const updateProduct = (
    id: string,
    updatedFields: Partial<Product>
  ) => {
    setProducts((previous) =>
      previous.map((product) =>
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
    const safeStock = Math.max(0, newStock);

    setProducts((previous) =>
      previous.map((product) =>
        product.id === id
          ? { ...product, stock: safeStock }
          : product
      )
    );

    showToast(`Stock updated to ${safeStock}.`);
  };

  const deleteProduct = (id: string) => {
    setProducts((previous) =>
      previous.filter((product) => product.id !== id)
    );

    showToast('Product deleted from inventory.');
  };

  /* ============================================================
     ORDERS
  ============================================================ */

  const createOrder = (
    orderData: Omit<
      Order,
      'id' | 'createdAt' | 'status'
    >
  ): Order => {
    const newOrder = {
      ...orderData,
      id: `ORD-${Math.floor(
        1000 + Math.random() * 9000
      )}`,
      createdAt: new Date().toISOString(),
      status: 'Pending' as OrderStatus,
      userId: currentUser?.id,
    } as Order;

    setOrders((previous) => [
      newOrder,
      ...previous,
    ]);

    orderData.items.forEach((item) => {
      const product = products.find(
        (product) => product.id === item.productId
      );

      if (product) {
        updateStock(
          item.productId,
          Math.max(0, product.stock - item.quantity)
        );
      }
    });

    clearCart();
    setLastCreatedOrder(newOrder);

    showToast('Your order has been placed successfully!');

    return newOrder;
  };

  const updateOrderStatus = (
    id: string,
    status: OrderStatus
  ) => {
    setOrders((previous) =>
      previous.map((order) =>
        order.id === id
          ? { ...order, status }
          : order
      )
    );

    showToast(`Order ${id} status updated to "${status}".`);
  };

  const verifyOrderPayment = (
    id: string,
    isVerified: boolean
  ) => {
    setOrders((previous) =>
      previous.map((order) => {
        if (order.id !== id) {
          return order;
        }

        return {
          ...order,
          paymentStatus: isVerified
            ? 'Payment Verified ✅'
            : 'Pay on Pickup',
          paymentVerificationStatus: isVerified
            ? 'Payment Verified ✅'
            : 'Payment Rejected ❌',
        };
      })
    );

    showToast(
      isVerified
        ? `Payment for order ${id} verified!`
        : `Payment for order ${id} rejected.`
    );
  };

  /* ============================================================
     CUSTOM REQUESTS
  ============================================================ */

  const createCustomRequest = (
    reqData: Omit<
      CustomRequest,
      'id' | 'createdAt' | 'status'
    >
  ) => {
    const newRequest: CustomRequest = {
      ...reqData,
      id: `REQ-${Math.floor(
        100 + Math.random() * 900
      )}`,
      createdAt: new Date().toISOString(),
      status: 'Pending Quote',
    };

    setCustomRequests((previous) => [
      newRequest,
      ...previous,
    ]);

    showToast('Your custom request has been submitted!');
  };

  const updateCustomRequestStatus = (
    id: string,
    status: CustomRequest['status'],
    quotedPrice?: number
  ) => {
    setCustomRequests((previous) =>
      previous.map((request) =>
        request.id === id
          ? {
              ...request,
              status,
              ...(quotedPrice !== undefined
                ? { quotedPrice }
                : {}),
            }
          : request
      )
    );

    showToast(`Custom request ${id} updated!`);
  };

  /* ============================================================
     REVIEWS
  ============================================================ */

  const addReview = (
    reviewData: Omit<
      Review,
      'id' | 'date' | 'verifiedStudent'
    >
  ) => {
    const rating = Number(reviewData.rating);

    const safeRating = Number.isFinite(rating)
      ? Math.min(5, Math.max(1, rating))
      : 1;

    const newReview: Review = {
      ...reviewData,
      rating: safeRating,
      id: `rev-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,
      date: 'Just now',
      verifiedStudent: true,
    };

    setReviews((previous) => [
      newReview,
      ...previous,
    ]);

    showToast('Thank you for your review!');
  };

  /* ============================================================
     SETTINGS
  ============================================================ */

  const updateSettings = (
    newSettings: Partial<StoreSettings>
  ) => {
    setSettings((previous) => ({
      ...previous,
      ...newSettings,
    }));

    showToast('Store settings saved successfully!');
  };

  /* ============================================================
     PROVIDER
  ============================================================ */

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
   STORE HOOK
============================================================ */

export const useStore = () => {
  const context = useContext(StoreContext);

  if (!context) {
    throw new Error(
      'useStore must be used within a StoreProvider'
    );
  }

  return context;
};