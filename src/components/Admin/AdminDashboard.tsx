import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import type {
  Product,
  OrderStatus,
  ProductCategory,
  CustomRequest
} from '../../types';

import {
  Package,
  ShoppingBag,
  Sparkles,
  Settings,
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  Search,
  X,
  Upload,
  KeyRound,
  User,
  MapPin,
  QrCode,
  CreditCard
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    orders,
    customRequests,
    settings,
    addProduct,
    updateProduct,
    updateStock,
    deleteProduct,
    updateOrderStatus,
    updateCustomRequestStatus,
    updateSettings,
    setIsAdmin,
    logoutAdmin,
    showToast
  } = useStore();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'orders' | 'custom' | 'settings'
  >('overview');

  // Product Search & Filter
  const [productSearch, setProductSearch] = useState<string>('');
  const [isAddProductOpen, setIsAddProductOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // New Product Form State
  const [newTitle, setNewTitle] = useState<string>('');
  const [newCategory, setNewCategory] =
    useState<ProductCategory>('Flower Stems');
  const [newPrice, setNewPrice] = useState<number>(200);
  const [newOriginalPrice, setNewOriginalPrice] = useState<number>(250);
  const [newStock, setNewStock] = useState<number>(10);
  const [newLeadTime, setNewLeadTime] = useState<number>(1);
  const [newDescription, setNewDescription] = useState<string>('');
  const [newColors, setNewColors] = useState<string>(
    'Pastel Pink, Yellow, Cream'
  );
  const [newFeatures, setNewFeatures] = useState<string>(
    '100% Milk Cotton, Flexible Stem Wire'
  );
  const [newImageUrl, setNewImageUrl] = useState<string>('');

  // Store Settings State
  const [storeNameInput, setStoreNameInput] = useState<string>(
    settings.storeName
  );
  const [taglineInput, setTaglineInput] = useState<string>(
    settings.tagline
  );
  const [univNameInput, setUnivNameInput] = useState<string>(
    settings.universityName
  );
  const [whatsappInput, setWhatsappInput] = useState<string>(
    settings.whatsappNumber
  );
  const [announcementInput, setAnnouncementInput] = useState<string>(
    settings.announcementText
  );
  const [pickupLocInput, setPickupLocInput] = useState<string>(
    settings.pickupLocation
  );

  // Owner Credentials State
  const [adminUsernameInput, setAdminUsernameInput] = useState<string>(
    settings.adminUsername || 'admin'
  );
  const [adminPinInput, setAdminPinInput] = useState<string>(
    settings.adminPin || 'admin123'
  );

  // Payment Details & UPI QR Code State
  const [upiIdInput, setUpiIdInput] = useState<string>(
    settings.upiId || 'tanishcrochet@upi'
  );

  const [upiPayeeNameInput, setUpiPayeeNameInput] = useState<string>(
    settings.upiPayeeName || settings.storeName
  );

  const [upiQrImageUrlInput, setUpiQrImageUrlInput] =
    useState<string>(settings.upiQrImageUrl || '');

  const [paymentInstructionsInput, setPaymentInstructionsInput] =
    useState<string>(
      settings.paymentInstructions ||
        'Scan QR code with GPay/PhonePe/Paytm/BHIM to pay instantly.'
    );

  // Campus Delivery Locations State
  const [deliveryLocations, setDeliveryLocations] = useState<string[]>(
    settings.campusDeliveryLocations || [
      "Hostel Block A (Men's Dorm)",
      "Hostel Block B (Men's Dorm)",
      'Girls Hostel 1 (GH-1)',
      'Girls Hostel 3 (GH-3)',
      'Central Library Plaza',
      'Student Activity Center (SAC)'
    ]
  );

  const [newLocationInput, setNewLocationInput] = useState<string>('');

  // Stats
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  const activeOrdersCount = orders.filter(
    o => o.status !== 'Delivered' && o.status !== 'Cancelled'
  ).length;

  const lowStockCount = products.filter(p => p.stock <= 3).length;

  const pendingRequestsCount = customRequests.filter(
    r => r.status === 'Pending Quote'
  ).length;

  const handleCreateProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTitle.trim()) return;

    const defaultImages: Record<string, string> = {
      'Flower Stems':
        'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80',

      Bouquets:
        'https://images.unsplash.com/photo-1591886960571-74d43a9d4166?auto=format&fit=crop&w=800&q=80',

      Keychains:
        'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?auto=format&fit=crop&w=800&q=80',

      'Handbags & Pouches':
        'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',

      'Plushies & Amigurumi':
        'https://images.unsplash.com/photo-1558679908-541bcf1249ff?auto=format&fit=crop&w=800&q=80',

      'Wearables & Hair':
        'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',

      All:
        'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80'
    };

    const finalImage =
      newImageUrl.trim() ||
      defaultImages[newCategory] ||
      defaultImages['Flower Stems'];

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: newTitle,
        category: newCategory,
        price: newPrice,
        originalPrice: newOriginalPrice,
        stock: newStock,
        leadTimeDays: newLeadTime,
        description: newDescription,
        colorsAvailable: newColors.split(',').map(c => c.trim()),
        features: newFeatures.split(',').map(f => f.trim()),
        imageUrl: finalImage
      });

      setEditingProduct(null);
    } else {
      addProduct({
        name: newTitle,
        category: newCategory,
        price: newPrice,
        originalPrice: newOriginalPrice,
        stock: newStock,
        leadTimeDays: newLeadTime,
        description: newDescription,
        colorsAvailable: newColors.split(',').map(c => c.trim()),
        features: newFeatures.split(',').map(f => f.trim()),
        imageUrl: finalImage
      });
    }

    setIsAddProductOpen(false);
    resetProductForm();
  };

  const startEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setNewTitle(prod.name);
    setNewCategory(prod.category);
    setNewPrice(prod.price);
    setNewOriginalPrice(prod.originalPrice || prod.price);
    setNewStock(prod.stock);
    setNewLeadTime(prod.leadTimeDays);
    setNewDescription(prod.description);
    setNewColors(prod.colorsAvailable.join(', '));
    setNewFeatures(prod.features.join(', '));
    setNewImageUrl(prod.imageUrl);
    setIsAddProductOpen(true);
  };

  const resetProductForm = () => {
    setEditingProduct(null);
    setNewTitle('');
    setNewPrice(200);
    setNewStock(10);
    setNewDescription('');
    setNewImageUrl('');
  };

  const handleImageFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setNewImageUrl(reader.result as string);
        showToast('Image uploaded successfully preview ready!');
      };

      reader.readAsDataURL(file);
    }
  };

  const handleQrFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setUpiQrImageUrlInput(reader.result as string);
        showToast('Payment QR Code uploaded successfully!');
      };

      reader.readAsDataURL(file);
    }
  };

  const handleAddLocation = () => {
    if (!newLocationInput.trim()) return;

    if (deliveryLocations.includes(newLocationInput.trim())) {
      showToast('Location already exists in list!');
      return;
    }

    const updated = [
      ...deliveryLocations,
      newLocationInput.trim()
    ];

    setDeliveryLocations(updated);
    setNewLocationInput('');

    showToast(`Added location "${newLocationInput.trim()}"`);
  };

  const handleRemoveLocation = (locToRemove: string) => {
    if (deliveryLocations.length <= 1) {
      showToast('Must keep at least 1 delivery location!');
      return;
    }

    setDeliveryLocations(
      deliveryLocations.filter(loc => loc !== locToRemove)
    );

    showToast(`Removed location "${locToRemove}"`);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();

    updateSettings({
      storeName: storeNameInput,
      tagline: taglineInput,
      universityName: univNameInput,
      whatsappNumber: whatsappInput,
      announcementText: announcementInput,
      pickupLocation: pickupLocInput,
      adminUsername: adminUsernameInput.trim(),
      adminPin: adminPinInput.trim(),
      campusDeliveryLocations: deliveryLocations,
      upiId: upiIdInput.trim(),
      upiPayeeName: upiPayeeNameInput.trim(),
      upiQrImageUrl: upiQrImageUrlInput.trim(),
      paymentInstructions: paymentInstructionsInput.trim()
    });
  };

  const filteredProducts = products.filter(
    p =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-stone-100 text-black pb-16">

      {/* ========================================================= */}
      {/* TOP ADMIN BAR */}
      {/* ========================================================= */}

      <div className="bg-stone-900 text-white px-4 sm:px-8 py-4 shadow-md flex items-center justify-between flex-wrap gap-4">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-500 to-rose-500 flex items-center justify-center font-black text-xl shadow-md">
            👑
          </div>

          <div>
            <h1 className="text-xl font-bold leading-none text-white">
              {settings.storeName} — Admin Portal
            </h1>

            <p className="text-xs text-white mt-1 opacity-80">
              Manage catalog, stocks, orders, custom requests & payment QR code
            </p>
          </div>

        </div>

        <div className="flex items-center gap-3">

          <button
            onClick={() => {
              logoutAdmin();
              window.location.hash = '';
            }}
            className="bg-stone-800 hover:bg-stone-700 text-rose-400 text-xs font-bold px-4 py-2 rounded-xl transition-all border border-stone-700"
          >
            Sign Out of Admin 🔒
          </button>

          <button
            onClick={() => {
              setIsAdmin(false);
              window.location.hash = '';
            }}
            className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm"
          >
            Switch to Store View 🛍️
          </button>

        </div>
      </div>


      {/* ========================================================= */}
      {/* ADMIN NAVIGATION */}
      {/* ========================================================= */}

      <div className="bg-white border-b border-stone-200 px-4 sm:px-8 py-2 overflow-x-auto no-scrollbar flex items-center gap-2">

        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-stone-100 hover:bg-stone-200 text-black'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span className="text-black">
            Dashboard Overview
          </span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'products'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-stone-100 hover:bg-stone-200 text-black'
          }`}
        >
          <Package className="w-4 h-4" />
          <span className="text-black">
            Products & Stock Inventory ({products.length})
          </span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-stone-100 hover:bg-stone-200 text-black'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span className="text-black">
            Campus Orders ({orders.length})
          </span>
        </button>

        <button
          onClick={() => setActiveTab('custom')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'custom'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-stone-100 hover:bg-stone-200 text-black'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-black">
            Custom Commissions ({customRequests.length})
          </span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'settings'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-stone-100 hover:bg-stone-200 text-black'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span className="text-black">
            Store & Payment Settings
          </span>
        </button>

      </div>


      {/* ========================================================= */}
      {/* MAIN ADMIN CONTENT */}
      {/* ========================================================= */}

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">

        {/* ======================================================= */}
        {/* OVERVIEW */}
        {/* ======================================================= */}

        {activeTab === 'overview' && (
          <div className="space-y-8">

            {/* STAT CARDS */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

              {/* TOTAL REVENUE */}

              <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm flex items-center justify-between">

                <div>

                  <div className="text-xs font-bold text-black uppercase tracking-wider">
                    Total Sales Revenue
                  </div>

                  <div className="text-3xl font-extrabold text-black mt-1">
                    ₹{totalRevenue}
                  </div>

                  <div className="text-[11px] text-emerald-700 font-semibold mt-1">
                    ↑ From campus sales
                  </div>

                </div>

                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xl">
                  ₹
                </div>

              </div>


              {/* ACTIVE ORDERS */}

              <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm flex items-center justify-between">

                <div>

                  <div className="text-xs font-bold text-black uppercase tracking-wider">
                    Active Campus Orders
                  </div>

                  <div className="text-3xl font-extrabold text-purple-700 mt-1">
                    {activeOrdersCount}
                  </div>

                  <div className="text-[11px] text-black font-semibold mt-1">
                    Need fulfillment
                  </div>

                </div>

                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-xl">
                  🛍️
                </div>

              </div>


              {/* LOW STOCK */}

              <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm flex items-center justify-between">

                <div>

                  <div className="text-xs font-bold text-black uppercase tracking-wider">
                    Low Stock Warning
                  </div>

                  <div className="text-3xl font-extrabold text-amber-700 mt-1">
                    {lowStockCount}
                  </div>

                  <div className="text-[11px] text-black font-semibold mt-1">
                    Items ≤ 3 in stock
                  </div>

                </div>

                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xl">
                  ⚠️
                </div>

              </div>


              {/* CUSTOM REQUESTS */}

              <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm flex items-center justify-between">

                <div>

                  <div className="text-xs font-bold text-black uppercase tracking-wider">
                    Custom Design Requests
                  </div>

                  <div className="text-3xl font-extrabold text-rose-700 mt-1">
                    {pendingRequestsCount}
                  </div>

                  <div className="text-[11px] text-black font-semibold mt-1">
                    Pending price quotes
                  </div>

                </div>

                <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold text-xl">
                  ✨
                </div>

              </div>

            </div>


            {/* LOWER OVERVIEW */}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

              {/* RECENT ORDERS */}

              <div className="lg:col-span-8 bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4">

                <div className="flex items-center justify-between">

                  <h3 className="font-extrabold text-black text-lg">
                    Recent Campus Orders
                  </h3>

                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-bold text-purple-700 hover:text-purple-900"
                  >
                    View All ({orders.length}) →
                  </button>

                </div>

                <div className="space-y-3">

                  {orders.slice(0, 4).map(order => (

                    <div
                      key={order.id}
                      className="p-4 rounded-2xl border border-stone-200 bg-stone-50 flex items-center justify-between flex-wrap gap-3"
                    >

                      <div>

                        <div className="flex items-center gap-2">

                          <span className="font-bold text-black text-sm">
                            {order.id}
                          </span>

                          <span className="text-xs text-black">
                            • {order.customerName}
                          </span>

                          <span className="bg-stone-200 text-black text-[10px] font-bold px-2 py-0.5 rounded-md">
                            {order.dormOrBuilding}
                          </span>

                        </div>

                        <div className="text-xs text-black mt-1">
                          {order.items
                            .map(
                              i =>
                                `${i.quantity}x ${i.productName}`
                            )
                            .join(', ')}
                        </div>

                      </div>

                      <div className="flex items-center gap-3">

                        <span className="font-extrabold text-rose-700 text-sm">
                          ₹{order.total}
                        </span>

                        <select
                          value={order.status}
                          onChange={e =>
                            updateOrderStatus(
                              order.id,
                              e.target.value as OrderStatus
                            )
                          }
                          className="bg-white border border-stone-300 font-bold text-black text-xs rounded-xl px-2.5 py-1.5 outline-none focus:ring-2 focus:ring-purple-300"
                        >
                          <option value="Pending">
                            Pending
                          </option>

                          <option value="Crocheting">
                            Crocheting
                          </option>

                          <option value="Ready for Pickup">
                            Ready for Pickup
                          </option>

                          <option value="Delivered">
                            Delivered
                          </option>

                          <option value="Cancelled">
                            Cancelled
                          </option>
                        </select>

                      </div>

                    </div>

                  ))}

                </div>

              </div>


              {/* QUICK STOCK */}

              <div className="lg:col-span-4 bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4">

                <div className="flex items-center justify-between">

                  <h3 className="font-extrabold text-black text-lg">
                    Quick Stock Refill
                  </h3>

                  <button
                    onClick={() => {
                      resetProductForm();
                      setIsAddProductOpen(true);
                      setActiveTab('products');
                    }}
                    className="text-xs font-bold bg-purple-600 text-white px-3 py-1.5 rounded-xl hover:bg-purple-700"
                  >
                    + Add Product
                  </button>

                </div>

                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">

                  {products.map(prod => (

                    <div
                      key={prod.id}
                      className="p-3 rounded-2xl border border-stone-200 bg-stone-50 flex items-center justify-between"
                    >

                      <div className="flex items-center gap-2 max-w-[170px]">

                        <img
                          src={prod.imageUrl}
                          alt=""
                          className="w-8 h-8 rounded-lg object-cover"
                        />

                        <div className="truncate">

                          <div className="font-bold text-black text-xs truncate">
                            {prod.name}
                          </div>

                          <div className="text-[10px] text-black">
                            ₹{prod.price}
                          </div>

                        </div>

                      </div>

                      <div className="flex items-center border border-stone-300 rounded-xl bg-white p-0.5">

                        <button
                          onClick={() =>
                            updateStock(
                              prod.id,
                              prod.stock - 1
                            )
                          }
                          className="w-6 h-6 flex items-center justify-center font-bold text-xs text-black hover:bg-stone-100 rounded-lg"
                        >
                          -
                        </button>

                        <span
                          className={`w-8 text-center text-xs font-black ${
                            prod.stock <= 3
                              ? 'text-amber-700'
                              : 'text-black'
                          }`}
                        >
                          {prod.stock}
                        </span>

                        <button
                          onClick={() =>
                            updateStock(
                              prod.id,
                              prod.stock + 1
                            )
                          }
                          className="w-6 h-6 flex items-center justify-center font-bold text-xs text-black hover:bg-stone-100 rounded-lg"
                        >
                          +
                        </button>

                      </div>

                    </div>

                  ))}

                </div>

              </div>

            </div>

          </div>
        )}


        {/* ======================================================= */}
        {/* PRODUCTS */}
        {/* ======================================================= */}

        {activeTab === 'products' && (

          <div className="space-y-6">

            <div className="bg-white p-4 rounded-3xl border border-stone-200 flex flex-wrap items-center justify-between gap-4 shadow-sm">

              <div className="relative flex-1 max-w-md">

                <Search className="w-4 h-4 absolute left-3.5 top-3 text-black" />

                <input
                  type="text"
                  placeholder="Search products by title or category..."
                  value={productSearch}
                  onChange={e =>
                    setProductSearch(e.target.value)
                  }
                  className="w-full bg-stone-50 border border-stone-200 rounded-2xl pl-10 pr-4 py-2 text-xs font-semibold text-black placeholder:text-black outline-none focus:ring-2 focus:ring-purple-200"
                />

              </div>

              <button
                onClick={() => {
                  resetProductForm();
                  setIsAddProductOpen(true);
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-2xl shadow-md flex items-center gap-2 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Crochet Product</span>
              </button>

            </div>


            {/* ADD PRODUCT */}

            {isAddProductOpen && (

              <div className="bg-white rounded-3xl border-2 border-purple-400 p-6 shadow-xl space-y-4">

                <div className="flex items-center justify-between border-b border-stone-200 pb-3">

                  <h3 className="font-extrabold text-black text-lg">
                    {editingProduct
                      ? `Edit Product: ${editingProduct.name}`
                      : '✨ Add New Product to Store Catalog'}
                  </h3>

                  <button
                    onClick={() => {
                      setIsAddProductOpen(false);
                      resetProductForm();
                    }}
                    className="text-black hover:text-purple-700 p-1"
                  >
                    <X className="w-5 h-5" />
                  </button>

                </div>


                <form
                  onSubmit={handleCreateProductSubmit}
                  className="space-y-4"
                >

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                    <div>

                      <label className="block text-xs font-bold text-black mb-1">
                        Product Title:
                      </label>

                      <input
                        type="text"
                        required
                        placeholder="e.g. Handmade Sunflower Bouquet"
                        value={newTitle}
                        onChange={e =>
                          setNewTitle(e.target.value)
                        }
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-black placeholder:text-black outline-none"
                      />

                    </div>


                    <div>

                      <label className="block text-xs font-bold text-black mb-1">
                        Category:
                      </label>

                      <select
                        value={newCategory}
                        onChange={e =>
                          setNewCategory(
                            e.target.value as ProductCategory
                          )
                        }
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-black"
                      >

                        <option value="Flower Stems">
                          Flower Stems
                        </option>

                        <option value="Bouquets">
                          Bouquets
                        </option>

                        <option value="Keychains">
                          Keychains
                        </option>

                        <option value="Handbags & Pouches">
                          Handbags & Pouches
                        </option>

                        <option value="Plushies & Amigurumi">
                          Plushies & Amigurumi
                        </option>

                        <option value="Wearables & Hair">
                          Wearables & Hair
                        </option>

                      </select>

                    </div>


                    <div>

                      <label className="block text-xs font-bold text-black mb-1">
                        Price (₹):
                      </label>

                      <input
                        type="number"
                        required
                        min="10"
                        value={newPrice}
                        onChange={e =>
                          setNewPrice(
                            Number(e.target.value)
                          )
                        }
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-black outline-none"
                      />

                    </div>


                    <div>

                      <label className="block text-xs font-bold text-black mb-1">
                        Original Price (₹):
                      </label>

                      <input
                        type="number"
                        min="10"
                        value={newOriginalPrice}
                        onChange={e =>
                          setNewOriginalPrice(
                            Number(e.target.value)
                          )
                        }
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-black outline-none"
                      />

                    </div>


                    <div>

                      <label className="block text-xs font-bold text-black mb-1">
                        Stock Quantity:
                      </label>

                      <input
                        type="number"
                        required
                        min="0"
                        value={newStock}
                        onChange={e =>
                          setNewStock(
                            Number(e.target.value)
                          )
                        }
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-black outline-none"
                      />

                    </div>


                    <div>

                      <label className="block text-xs font-bold text-black mb-1">
                        Crochet Lead Time (Days):
                      </label>

                      <input
                        type="number"
                        required
                        min="1"
                        value={newLeadTime}
                        onChange={e =>
                          setNewLeadTime(
                            Number(e.target.value)
                          )
                        }
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-black outline-none"
                      />

                    </div>

                  </div>


                  <div>

                    <label className="block text-xs font-bold text-black mb-1">
                      Color Variations (comma separated):
                    </label>

                    <input
                      type="text"
                      placeholder="Pink, Yellow, Lavender, Cream"
                      value={newColors}
                      onChange={e =>
                        setNewColors(e.target.value)
                      }
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-black placeholder:text-black outline-none"
                    />

                  </div>


                  <div>

                    <label className="block text-xs font-bold text-black mb-1">
                      Product Description:
                    </label>

                    <textarea
                      rows={2}
                      placeholder="Describe yarn material, dimensions, and craft details..."
                      value={newDescription}
                      onChange={e =>
                        setNewDescription(e.target.value)
                      }
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-black placeholder:text-black outline-none"
                    />

                  </div>


                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">

                    <div>

                      <label className="block text-xs font-bold text-black mb-1">
                        Image URL:
                      </label>

                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={newImageUrl}
                        onChange={e =>
                          setNewImageUrl(e.target.value)
                        }
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-black placeholder:text-black outline-none"
                      />

                    </div>


                    <div>

                      <label className="block text-xs font-bold text-black mb-1 flex items-center gap-1">

                        <Upload className="w-3.5 h-3.5" />

                        Or Upload Image File:

                      </label>

                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileUpload}
                        className="w-full text-xs text-black file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200"
                      />

                    </div>

                  </div>


                  {newImageUrl && (

                    <div className="flex items-center gap-3 bg-stone-50 p-2 rounded-xl border border-stone-200">

                      <img
                        src={newImageUrl}
                        alt="Preview"
                        className="w-12 h-12 rounded-lg object-cover"
                      />

                      <span className="text-xs text-emerald-700 font-bold">
                        ✓ Image Preview Loaded Successfully
                      </span>

                    </div>

                  )}


                  <div className="flex justify-end gap-3 pt-2">

                    <button
                      type="button"
                      onClick={() =>
                        setIsAddProductOpen(false)
                      }
                      className="px-4 py-2 rounded-xl text-xs font-bold text-black hover:bg-stone-100"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="px-6 py-2 rounded-xl text-xs font-bold bg-purple-600 text-white hover:bg-purple-700 shadow-md"
                    >
                      {editingProduct
                        ? 'Save Product Changes'
                        : 'Publish Product to Store'}
                    </button>

                  </div>

                </form>

              </div>

            )}


            {/* PRODUCT CARDS */}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

              {filteredProducts.map(prod => (

                <div
                  key={prod.id}
                  className="bg-white rounded-3xl border border-stone-200 p-4 shadow-sm flex flex-col justify-between space-y-3"
                >

                  <div className="flex gap-3">

                    <img
                      src={prod.imageUrl}
                      alt={prod.name}
                      className="w-20 h-20 rounded-2xl object-cover border border-stone-200"
                    />

                    <div className="flex-1 min-w-0">

                      <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">
                        {prod.category}
                      </span>

                      <h4 className="font-bold text-black text-sm truncate">
                        {prod.name}
                      </h4>

                      <div className="text-xs font-black text-black mt-0.5">
                        ₹{prod.price}
                      </div>

                      <div className="flex items-center gap-2 mt-2">

                        <span className="text-[11px] text-black">
                          Stock:
                        </span>

                        <div className="flex items-center border border-stone-300 rounded-lg bg-stone-50 px-1">

                          <button
                            onClick={() =>
                              updateStock(
                                prod.id,
                                prod.stock - 1
                              )
                            }
                            className="w-5 h-5 flex items-center justify-center font-bold text-xs text-black"
                          >
                            -
                          </button>

                          <span
                            className={`w-6 text-center text-xs font-bold ${
                              prod.stock <= 3
                                ? 'text-amber-700'
                                : 'text-black'
                            }`}
                          >
                            {prod.stock}
                          </span>

                          <button
                            onClick={() =>
                              updateStock(
                                prod.id,
                                prod.stock + 1
                              )
                            }
                            className="w-5 h-5 flex items-center justify-center font-bold text-xs text-black"
                          >
                            +
                          </button>

                        </div>

                      </div>

                    </div>

                  </div>


                  <div className="flex items-center justify-between pt-2 border-t border-stone-100">

                    <span className="text-[11px] text-black font-semibold">
                      ★ {prod.rating.toFixed(1)} ({prod.reviewCount} reviews)
                    </span>

                    <div className="flex items-center gap-1">

                      <button
                        onClick={() =>
                          startEditProduct(prod)
                        }
                        className="p-1.5 text-black hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Edit Product"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() =>
                          deleteProduct(prod.id)
                        }
                        className="p-1.5 text-black hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </div>

        )}


        {/* ======================================================= */}
        {/* ORDERS */}
        {/* ======================================================= */}

        {activeTab === 'orders' && (

          <div className="space-y-4">

            <h3 className="font-extrabold text-black text-lg">
              Manage Incoming Campus Orders
            </h3>

            <div className="space-y-4">

              {orders.map(ord => (

                <div
                  key={ord.id}
                  className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4"
                >

                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-3">

                    <div>

                      <div className="flex items-center gap-2">

                        <span className="font-black text-black text-base">
                          {ord.id}
                        </span>

                        <span className="bg-stone-200 text-black text-xs font-bold px-2.5 py-0.5 rounded-full">
                          {ord.dormOrBuilding} ({ord.roomOrSpot})
                        </span>

                      </div>

                      <div className="text-xs text-black mt-0.5">

                        Customer:{' '}

                        <span className="font-bold text-black">
                          {ord.customerName}
                        </span>

                        {' '}({ord.phone}) • Ordered:{' '}

                        {new Date(
                          ord.createdAt
                        ).toLocaleString()}

                      </div>

                    </div>


                    <div className="flex items-center gap-3">

                      <div className="text-right">

                        <div className="text-xs text-black">
                          Payment ({ord.paymentMethod})
                        </div>

                        <div className="text-sm font-extrabold text-rose-700">
                          ₹{ord.total} ({ord.paymentStatus})
                        </div>

                      </div>


                      <select
                        value={ord.status}
                        onChange={e =>
                          updateOrderStatus(
                            ord.id,
                            e.target.value as OrderStatus
                          )
                        }
                        className={`font-extrabold text-xs rounded-xl px-3 py-2 outline-none border transition-all ${
                          ord.status === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                            : ord.status === 'Ready for Pickup'
                            ? 'bg-amber-100 text-amber-900 border-amber-300'
                            : 'bg-rose-100 text-rose-900 border-rose-300'
                        }`}
                      >

                        <option value="Pending">
                          Pending Order
                        </option>

                        <option value="Crocheting">
                          Hand-Crocheting
                        </option>

                        <option value="Ready for Pickup">
                          Ready for Campus Pickup
                        </option>

                        <option value="Delivered">
                          Delivered to Student
                        </option>

                        <option value="Cancelled">
                          Cancelled
                        </option>

                      </select>

                    </div>

                  </div>


                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">

                    {ord.items.map((item, idx) => (

                      <div
                        key={idx}
                        className="flex items-center gap-3 bg-stone-50 p-2 rounded-xl border border-stone-200"
                      >

                        <img
                          src={item.imageUrl}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover"
                        />

                        <div>

                          <div className="font-bold text-black">
                            {item.productName}
                          </div>

                          <div className="text-black">
                            Qty: {item.quantity} • ₹{item.price}{' '}
                            {item.selectedColor
                              ? `(${item.selectedColor})`
                              : ''}
                          </div>

                          {item.giftNote && (

                            <div className="text-[10px] text-rose-700 font-semibold">
                              Note: "{item.giftNote}"
                            </div>

                          )}

                        </div>

                      </div>

                    ))}

                  </div>

                </div>

              ))}

            </div>

          </div>

        )}


        {/* ======================================================= */}
        {/* CUSTOM COMMISSIONS */}
        {/* ======================================================= */}

        {activeTab === 'custom' && (

          <div className="space-y-4">

            <h3 className="font-extrabold text-black text-lg">
              Custom Student Crochet Requests
            </h3>

            <div className="space-y-4">

              {customRequests.map(req => (

                <div
                  key={req.id}
                  className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-3"
                >

                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">

                    <div>

                      <div className="flex items-center gap-2">

                        <span className="font-black text-rose-700 text-sm">
                          {req.id}
                        </span>

                        <span className="font-extrabold text-black text-base">
                          {req.itemType}
                        </span>

                      </div>

                      <div className="text-xs text-black">

                        Requested by{' '}

                        <span className="font-bold text-black">
                          {req.studentName}
                        </span>

                        {' '}({req.phone}) • Needed By:{' '}

                        {req.targetDate}

                      </div>

                    </div>


                    <div className="flex items-center gap-2">

                      <span className="text-xs text-black font-semibold">
                        Status:
                      </span>

                      <select
                        value={req.status}
                        onChange={e =>
                          updateCustomRequestStatus(
                            req.id,
                            e.target
                              .value as CustomRequest['status']
                          )
                        }
                        className="bg-stone-100 text-black font-bold text-xs rounded-xl px-3 py-1.5 outline-none border border-stone-200"
                      >

                        <option value="Pending Quote">
                          Pending Quote
                        </option>

                        <option value="Approved & Crocheting">
                          Approved & Crocheting
                        </option>

                        <option value="Ready for Pickup">
                          Ready for Pickup
                        </option>

                        <option value="Completed">
                          Completed
                        </option>

                      </select>

                    </div>

                  </div>


                  <p className="text-xs text-black bg-stone-50 p-3 rounded-xl border border-stone-200 italic">
                    "{req.description}"
                  </p>


                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">

                    <div className="flex items-center gap-4 text-black">

                      <span>
                        🎨 Colors:{' '}
                        <strong className="text-black">
                          {req.primaryColor} / {req.secondaryColor}
                        </strong>
                      </span>

                      <span>
                        📍 Pickup:{' '}
                        <strong className="text-black">
                          {req.dormOrBuilding}
                        </strong>
                      </span>

                    </div>


                    {req.quotedPrice && (

                      <div className="font-extrabold text-black text-sm">

                        Quoted Price:{' '}

                        <span className="text-rose-700">
                          ₹{req.quotedPrice}
                        </span>

                      </div>

                    )}

                  </div>

                </div>

              ))}

            </div>

          </div>

        )}


        {/* ======================================================= */}
        {/* SETTINGS */}
        {/* ======================================================= */}

        {activeTab === 'settings' && (

          <div className="space-y-6 max-w-3xl">

            <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-6">

              <h3 className="font-extrabold text-black text-xl border-b border-stone-100 pb-3">
                Store Settings, Payment QR & Campus Locations
              </h3>


              <form
                onSubmit={handleSaveSettings}
                className="space-y-6"
              >

                {/* GENERAL STORE INFO */}

                <div className="space-y-4">

                  <h4 className="font-extrabold text-rose-700 text-sm uppercase tracking-wider">
                    General Store Details
                  </h4>


                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    <div>

                      <label className="block text-xs font-bold text-black mb-1">
                        Store Brand Name:
                      </label>

                      <input
                        type="text"
                        value={storeNameInput}
                        onChange={e =>
                          setStoreNameInput(
                            e.target.value
                          )
                        }
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs font-bold text-black outline-none"
                      />

                    </div>


                    <div>

                      <label className="block text-xs font-bold text-black mb-1">
                        Tagline:
                      </label>

                      <input
                        type="text"
                        value={taglineInput}
                        onChange={e =>
                          setTaglineInput(
                            e.target.value
                          )
                        }
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-black outline-none"
                      />

                    </div>

                  </div>


                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    <div>

                      <label className="block text-xs font-bold text-black mb-1">
                        University Campus Name:
                      </label>

                      <input
                        type="text"
                        value={univNameInput}
                        onChange={e =>
                          setUnivNameInput(
                            e.target.value
                          )
                        }
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-black outline-none"
                      />

                    </div>


                    <div>

                      <label className="block text-xs font-bold text-black mb-1">
                        WhatsApp Order Contact Phone:
                      </label>

                      <input
                        type="text"
                        value={whatsappInput}
                        onChange={e =>
                          setWhatsappInput(
                            e.target.value
                          )
                        }
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-black outline-none"
                      />

                    </div>

                  </div>


                  <div>

                    <label className="block text-xs font-bold text-black mb-1">
                      Top Announcement Banner Text:
                    </label>

                    <input
                      type="text"
                      value={announcementInput}
                      onChange={e =>
                        setAnnouncementInput(
                          e.target.value
                        )
                      }
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-black outline-none"
                    />

                  </div>


                  <div>

                    <label className="block text-xs font-bold text-black mb-1">
                      Default Campus Pickup Spot:
                    </label>

                    <input
                      type="text"
                      value={pickupLocInput}
                      onChange={e =>
                        setPickupLocInput(
                          e.target.value
                        )
                      }
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-black outline-none"
                    />

                  </div>

                </div>


                {/* PAYMENT */}

                <div className="space-y-4 pt-4 border-t border-stone-200">

                  <h4 className="font-extrabold text-emerald-700 text-sm uppercase tracking-wider flex items-center gap-1.5">

                    <QrCode className="w-4 h-4 text-emerald-700" />

                    <span>
                      Payment Details & UPI QR Code Settings
                    </span>

                  </h4>


                  <p className="text-xs text-black">
                    Update your UPI Handle, Payee Name, and Upload your Custom Payment QR Code Image for student checkouts:
                  </p>


                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    <div>

                      <label className="block text-xs font-bold text-black mb-1 flex items-center gap-1">

                        <CreditCard className="w-3.5 h-3.5 text-black" />

                        Your UPI ID:

                      </label>

                      <input
                        type="text"
                        placeholder="e.g. 9876543210@paytm or tanishcrochet@upi"
                        value={upiIdInput}
                        onChange={e =>
                          setUpiIdInput(
                            e.target.value
                          )
                        }
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-black placeholder:text-black outline-none"
                      />

                    </div>


                    <div>

                      <label className="block text-xs font-bold text-black mb-1 flex items-center gap-1">

                        <User className="w-3.5 h-3.5 text-black" />

                        UPI Payee / Account Name:

                      </label>

                      <input
                        type="text"
                        placeholder="e.g. Knot & Bloom Crochet"
                        value={upiPayeeNameInput}
                        onChange={e =>
                          setUpiPayeeNameInput(
                            e.target.value
                          )
                        }
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-black placeholder:text-black outline-none"
                      />

                    </div>

                  </div>


                  {/* QR UPLOAD */}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">

                    <div>

                      <label className="block text-xs font-bold text-black mb-1">
                        Custom Payment QR Image URL:
                      </label>

                      <input
                        type="url"
                        placeholder="https://... or paste image link"
                        value={upiQrImageUrlInput}
                        onChange={e =>
                          setUpiQrImageUrlInput(
                            e.target.value
                          )
                        }
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs text-black placeholder:text-black outline-none"
                      />

                    </div>


                    <div>

                      <label className="block text-xs font-bold text-black mb-1 flex items-center gap-1">

                        <Upload className="w-3.5 h-3.5 text-emerald-700" />

                        Or Upload Payment QR Image File:

                      </label>

                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleQrFileUpload}
                        className="w-full text-xs text-black file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-100 file:text-emerald-700 hover:file:bg-emerald-200"
                      />

                    </div>

                  </div>


                  {upiQrImageUrlInput && (

                    <div className="flex items-center gap-3 bg-emerald-50/70 p-3 rounded-2xl border border-emerald-200">

                      <img
                        src={upiQrImageUrlInput}
                        alt="Custom QR Preview"
                        className="w-16 h-16 rounded-xl object-contain border border-white shadow-sm bg-white"
                      />

                      <div>

                        <div className="text-xs text-emerald-900 font-bold">
                          ✓ Custom Payment QR Code Uploaded!
                        </div>

                        <div className="text-[11px] text-black">
                          This exact QR code image will display at checkout for student payments.
                        </div>

                      </div>

                    </div>

                  )}


                  <div>

                    <label className="block text-xs font-bold text-black mb-1">
                      Student Payment Instructions:
                    </label>

                    <input
                      type="text"
                      placeholder="e.g. Scan QR code with GPay/PhonePe/Paytm and send screenshot on WhatsApp!"
                      value={paymentInstructionsInput}
                      onChange={e =>
                        setPaymentInstructionsInput(
                          e.target.value
                        )
                      }
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-black placeholder:text-black outline-none"
                    />

                  </div>

                </div>


                {/* DELIVERY LOCATIONS */}

                <div className="space-y-3 pt-4 border-t border-stone-200">

                  <div className="flex items-center justify-between">

                    <h4 className="font-extrabold text-purple-700 text-sm uppercase tracking-wider flex items-center gap-1.5">

                      <MapPin className="w-4 h-4" />

                      <span>
                        Manage Campus Delivery Locations ({deliveryLocations.length})
                      </span>

                    </h4>

                  </div>


                  <p className="text-xs text-black">
                    Add or remove hostel blocks and campus spots for checkout:
                  </p>


                  <div className="flex gap-2">

                    <input
                      type="text"
                      placeholder="e.g. Science Building Annex / GH-4 Lounge..."
                      value={newLocationInput}
                      onChange={e =>
                        setNewLocationInput(
                          e.target.value
                        )
                      }
                      className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-black placeholder:text-black outline-none font-semibold"
                    />

                    <button
                      type="button"
                      onClick={handleAddLocation}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1"
                    >

                      <Plus className="w-3.5 h-3.5" />

                      <span>
                        Add Spot
                      </span>

                    </button>

                  </div>


                  <div className="flex flex-wrap gap-2 pt-2">

                    {deliveryLocations.map((loc, idx) => (

                      <span
                        key={idx}
                        className="bg-purple-50 border border-purple-200 text-purple-900 font-semibold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-xs"
                      >

                        <span>
                          {loc}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveLocation(loc)
                          }
                          className="text-purple-700 hover:text-rose-700 font-black p-0.5 rounded-full hover:bg-rose-100 transition-colors"
                          title="Remove Location"
                        >
                          ×
                        </button>

                      </span>

                    ))}

                  </div>

                </div>


                {/* SECURITY */}

                <div className="space-y-4 pt-4 border-t border-stone-200">

                  <h4 className="font-extrabold text-amber-700 text-sm uppercase tracking-wider flex items-center gap-1.5">

                    <KeyRound className="w-4 h-4" />

                    <span>
                      Owner Admin Security Credentials
                    </span>

                  </h4>


                  <p className="text-xs text-black">
                    Update your secret login credentials for accessing the private owner admin page:
                  </p>


                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    <div>

                      <label className="block text-xs font-bold text-black mb-1 flex items-center gap-1">

                        <User className="w-3.5 h-3.5 text-black" />

                        Owner Username / Login ID:

                      </label>

                      <input
                        type="text"
                        required
                        value={adminUsernameInput}
                        onChange={e =>
                          setAdminUsernameInput(
                            e.target.value
                          )
                        }
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs font-bold text-black outline-none"
                      />

                    </div>


                    <div>

                      <label className="block text-xs font-bold text-black mb-1 flex items-center gap-1">

                        <KeyRound className="w-3.5 h-3.5 text-black" />

                        Security PIN / Password:

                      </label>

                      <input
                        type="password"
                        required
                        value={adminPinInput}
                        onChange={e =>
                          setAdminPinInput(
                            e.target.value
                          )
                        }
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs font-mono text-black outline-none"
                      />

                    </div>

                  </div>

                </div>


                {/* SAVE */}

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 via-rose-600 to-amber-500 hover:from-purple-700 hover:to-amber-600 text-white font-extrabold text-xs px-6 py-3.5 rounded-2xl shadow-lg transition-all"
                >
                  Save All Settings, Payment Details & Delivery Locations
                </button>

              </form>

            </div>

          </div>

        )}

      </div>

    </div>
  );
};