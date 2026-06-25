import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './i18n';
import confetti from 'canvas-confetti';
import { 
  ShoppingBag, 
  MapPin, 
  User, 
  Calendar, 
  Bell, 
  FileText, 
  TrendingUp, 
  ChevronRight, 
  LogOut, 
  LogIn, 
  UserPlus, 
  Sun, 
  Moon, 
  Search, 
  Filter, 
  CheckCircle, 
  Truck, 
  X, 
  Plus, 
  AlertTriangle, 
  CloudRain,
  Phone,
  DollarSign,
  Tag,
  Map,
  Clock
} from 'lucide-react';
import cropsBg from './assets/crops-bg.jpg';
import heroBeautiful from './assets/hero-beautiful.jpg';
import coffeeImg from './assets/coffee-beans.jpg';
import wheatImg from './assets/wheat.jpg';
import cornImg from './assets/corn.jpg';
import cattleImg from './assets/cattle.jpg';
import sheepImg from './assets/sheep.jpg';

// ===== FIX: Define livestockImg =====
// Option 1: Simple fallback
const livestockImg = cattleImg;

// Option 2: Dynamic image mapping (recommended)
const getLivestockImage = (type) => {
  const imageMap = {
    'Cattle': cattleImg,
    'Sheep': sheepImg,
    'Goat': sheepImg,
    'Bull': cattleImg,
    'Cow': cattleImg,
    'Calf': cattleImg,
    'Lamb': sheepImg,
    'Ram': sheepImg,
  };
  return imageMap[type] || cattleImg; // fallback to cattleImg if type not found
};
// ===== END FIX =====

// Register ChartJS
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function App() {
  const { t, i18n } = useTranslation();
  
  // Theme & App State
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || null);
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [currentTab, setCurrentTab] = useState('market'); // market, bulletins, dashboard, profile
  
  // Auth state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // login, register
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authRole, setAuthRole] = useState('buyer'); // farmer, buyer, admin
  const [authPhone, setAuthPhone] = useState('');
  const [authLocation, setAuthLocation] = useState('');
  const [authError, setAuthError] = useState('');

  // Catalog & Bulletins state
  const [products, setProducts] = useState([]);
  const [bulletins, setBulletins] = useState([]);
  const [orders, setOrders] = useState([]);
  
  // Admin state
  const [allUsers, setAllUsers] = useState([]);
  const [adminAnalytics, setAdminAnalytics] = useState(null);
  const [disputes, setDisputes] = useState([]);
  
  // Search & Filter
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Checkout simulation
  const [checkoutProduct, setCheckoutProduct] = useState(null);
  const [checkoutQuantity, setCheckoutQuantity] = useState(1);
  const [checkoutPaymentMethod, setCheckoutPaymentMethod] = useState('CBE_BIRR');
  const [checkoutPhone, setCheckoutPhone] = useState('');
  const [checkoutAddress, setCheckoutAddress] = useState('');
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [paymentConfig, setPaymentConfig] = useState({ cbeBirrEnabled: true, telebirrEnabled: false, codEnabled: true });
  const [paymentError, setPaymentError] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);
  
  // Logistics modal
  const [trackingOrder, setTrackingOrder] = useState(null);
  
  // Add product form (Farmer only)
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Crops');
  const [newProdType, setNewProdType] = useState('Coffee');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdQty, setNewProdQty] = useState('');
  const [newProdUnit, setNewProdUnit] = useState('kg');
  const [newProdHarvestDate, setNewProdHarvestDate] = useState('');
  const [newProdLocation, setNewProdLocation] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [prodFormError, setProdFormError] = useState('');

  // Profile Edit
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileLocation, setProfileLocation] = useState('');
  const [profileBio, setProfileBio] = useState('');
  const [profileCrops, setProfileCrops] = useState('');
  const [profileCoords, setProfileCoords] = useState('');
  const [profileSaved, setProfileSaved] = useState(false);

  // Sync dark theme
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  // Load Data
  const fetchData = async () => {
    try {
      const q = new URLSearchParams();
      if (category) q.append('category', category);
      if (locationFilter) q.append('location', locationFilter);
      if (minPrice) q.append('minPrice', minPrice);
      if (maxPrice) q.append('maxPrice', maxPrice);
      if (search) q.append('search', search);

      const prodRes = await fetch(`/api/products?${q.toString()}`);
      if (prodRes.ok) setProducts(await prodRes.json());

      const bulRes = await fetch('/api/bulletins');
      if (bulRes.ok) setBulletins(await bulRes.json());

      const payConfRes = await fetch('/api/payments/config');
      if (payConfRes.ok) setPaymentConfig(await payConfRes.json());
      
      if (token) {
        const ordRes = await fetch('/api/orders', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (ordRes.ok) setOrders(await ordRes.json());

        // Fetch admin data if user is admin
        if (user?.role === 'admin') {
          const usersRes = await fetch('/api/admin/users', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (usersRes.ok) setAllUsers(await usersRes.json());

          const analyticsRes = await fetch('/api/admin/analytics', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (analyticsRes.ok) setAdminAnalytics(await analyticsRes.json());

          const disputesRes = await fetch('/api/admin/disputes', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (disputesRes.ok) setDisputes(await disputesRes.json());
        }
      }
    } catch (err) {
      console.error("Error loading data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [category, locationFilter, minPrice, maxPrice, search, token]);

  // Pre-populate profile fields
  useEffect(() => {
    if (user && currentTab === 'profile') {
      setProfileName(user.name || '');
      setProfilePhone(user.phone || '');
      setProfileLocation(user.location || '');
      // If farmer, fetch specific farmer bio
      fetch(`/api/farmers/${user.id}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data) {
            setProfileBio(data.bio || '');
            setProfileCrops(data.crops ? data.crops.join(', ') : '');
            setProfileCoords(data.coordinates || '');
          }
        });
    }
  }, [user, currentTab]);

  // Authentication Handlers
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');

    // Hardcoded admin credentials check
    if (authMode === 'login' && authEmail === 'kenenijunedin@gmail.com' && authPassword === '12345@K') {
      const adminUser = {
        id: 'admin_001',
        email: 'kenenijunedin@gmail.com',
        name: 'Kenen Junadin',
        role: 'admin',
        location: 'Hararghe'
      };
      const adminToken = 'admin_token_' + Date.now();
      
      localStorage.setItem('token', adminToken);
      localStorage.setItem('user', JSON.stringify(adminUser));
      setToken(adminToken);
      setUser(adminUser);
      setAuthModalOpen(false);
      
      // Clear forms
      setAuthEmail('');
      setAuthPassword('');
      setAuthName('');
      setAuthPhone('');
      setAuthLocation('');
      
      confetti({ particleCount: 50, spread: 60 });
      fetchData();
      return;
    }

    const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/register';
    const payload = authMode === 'login' 
      ? { email: authEmail, password: authPassword }
      : { email: authEmail, password: authPassword, name: authName, role: authRole, phone: authPhone, location: authLocation };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || 'Authentication failed');
        return;
      }
      // Save details
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      setAuthModalOpen(false);
      
      // Clear forms
      setAuthEmail('');
      setAuthPassword('');
      setAuthName('');
      setAuthPhone('');
      setAuthLocation('');
      
      confetti({ particleCount: 50, spread: 60 });
      fetchData();
    } catch (err) {
      setAuthError('Network communication error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken('');
    setUser(null);
    setOrders([]);
    setCurrentTab('market');
  };

  // Profile Update
  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileSaved(false);
    try {
      const url = user.role === 'farmer' ? `/api/farmers/${user.id}` : `/api/buyers/${user.id}`;
      const payload = user.role === 'farmer' 
        ? {
            name: profileName,
            phone: profilePhone,
            location: profileLocation,
            coordinates: profileCoords,
            crops: profileCrops.split(',').map(s => s.trim()).filter(Boolean),
            bio: profileBio
          }
        : { name: profileName, phone: profilePhone, location: profileLocation };

      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to update profile');
        return;
      }

      // Update local storage user profile details
      const updatedUser = { ...user, name: profileName, phone: profilePhone, location: profileLocation };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
      confetti({ particleCount: 30, spread: 40 });
    } catch (err) {
      console.error(err);
    }
  };

  // Add Product (Farmer only)
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setProdFormError('');
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newProdName,
          category: newProdCategory,
          type: newProdType,
          price: parseFloat(newProdPrice),
          quantity: parseFloat(newProdQty),
          unit: newProdUnit,
          harvestDate: newProdHarvestDate,
          location: newProdLocation,
          description: newProdDesc
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setProdFormError(data.error || 'Failed to list product');
        return;
      }

      setAddProductOpen(false);
      setNewProdName('');
      setNewProdPrice('');
      setNewProdQty('');
      setNewProdHarvestDate('');
      setNewProdLocation('');
      setNewProdDesc('');
      
      confetti({ particleCount: 80, spread: 80 });
      fetchData();
    } catch (err) {
      setProdFormError('Network communication error');
    }
  };

  // Order Placement
  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setPaymentError('');
    if (!token) {
      setAuthModalOpen(true);
      return;
    }

    if (checkoutPaymentMethod === 'CBE_BIRR') {
      if (!checkoutPhone.match(/^(09|\+2519)\d{8}$/)) {
        setPaymentError('Invalid CBE Birr phone format (use 09xxxxxxxx)');
        return;
      }
      setOtpModalOpen(true);
    } else {
      // Direct Cash on delivery order placement
      await submitOrder();
    }
  };

  const submitOrder = async () => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: checkoutProduct.id,
          quantity: parseInt(checkoutQuantity),
          paymentMethod: checkoutPaymentMethod,
          shippingAddress: checkoutAddress
        })
      });
      const orderData = await res.json();
      if (!res.ok) {
        setPaymentError(orderData.error || 'Order placement failed');
        return;
      }

      // If CBE Birr payment, simulate the transaction execution
      if (checkoutPaymentMethod === 'CBE_BIRR') {
        setProcessingPayment(true);
        const payRes = await fetch('/api/payments/pay', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            orderId: orderData.id,
            phoneNumber: checkoutPhone,
            amount: orderData.totalPrice
          })
        });
        const payData = await payRes.json();
        setProcessingPayment(false);
        if (!payRes.ok) {
          setPaymentError(payData.error || 'Payment failed');
          return;
        }
      }

      setCheckoutProduct(null);
      setOtpModalOpen(false);
      setCheckoutPhone('');
      setCheckoutAddress('');
      confetti({ particleCount: 150, spread: 80 });
      fetchData();
      setCurrentTab('dashboard');
    } catch (err) {
      setPaymentError('Network communication error');
    }
  };

  // Order lifecycle controllers (Farmer only)
  const handleUpdateOrderStatus = async (orderId, nextStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) {
        fetchData();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to update order status');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Farmer delete listing
  const handleDeleteProduct = async (prodId) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    try {
      const res = await fetch(`/api/products/${prodId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Prepare Chart.js datasets
  const getFarmerSalesChartData = () => {
    const ordersPaid = orders.filter(o => o.paymentStatus === 'paid');
    // Group by month
    const monthlySum = {};
    ordersPaid.forEach(o => {
      const date = new Date(o.createdAt);
      const monthStr = date.toLocaleString('default', { month: 'short' });
      monthlySum[monthStr] = (monthlySum[monthStr] || 0) + o.totalPrice;
    });

    const labels = Object.keys(monthlySum);
    const data = Object.values(monthlySum);

    return {
      labels: labels.length ? labels : ['June'],
      datasets: [
        {
          label: 'Sales Revenue (ETB)',
          data: data.length ? data : [0],
          borderColor: 'rgb(20, 184, 166)',
          backgroundColor: 'rgba(20, 184, 166, 0.2)',
          tension: 0.4,
          fill: true,
        }
      ]
    };
  };

  const getCategoryBreakdownData = () => {
    const counts = { Crops: 0, Livestock: 0 };
    if (user.role === 'farmer') {
      // Count products listed
      products.forEach(p => {
        if (p.farmerId === user.id && counts[p.category] !== undefined) {
          counts[p.category] += p.quantity;
        }
      });
    } else {
      // Buyer - count products bought
      orders.forEach(o => {
        const p = products.find(prod => prod.id === o.productId);
        if (p && counts[p.category] !== undefined) {
          counts[p.category] += o.quantity;
        }
      });
    }

    return {
      labels: ['Crops (kg)', 'Livestock (heads)'],
      datasets: [
        {
          data: [counts.Crops, counts.Livestock],
          backgroundColor: ['rgba(13, 148, 136, 0.8)', 'rgba(217, 119, 6, 0.8)'],
          borderWidth: 1,
        }
      ]
    };
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-500 overflow-x-hidden relative">
      {/* Ambient Glow Blurs */}
      <div className="fixed -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none ambient-blob-1 animate-pulse" style={{ animationDuration: '8s' }}></div>
      <div className="fixed -bottom-40 -right-40 w-[650px] h-[650px] rounded-full blur-[120px] pointer-events-none ambient-blob-2 animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }}></div>
      <div className="fixed top-1/2 left-1/3 w-[500px] h-[500px] rounded-full blur-[150px] pointer-events-none ambient-blob-3 animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }}></div>

      {/* Sticky Header with Glassmorphism */}
      <header className="glass-nav sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentTab('market')}>
            <div className="w-10 h-10 rounded-xl bg-teal-600 dark:bg-teal-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-teal-600 to-amber-600 dark:from-teal-400 dark:to-amber-500 bg-clip-text text-transparent m-0 tracking-tight leading-none">
                {t('appName')}
              </h1>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                {t('slogan')}
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            <button 
              onClick={() => setCurrentTab('market')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${currentTab === 'market' ? 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400' : 'text-slate-600 hover:text-teal-600 dark:text-slate-300 dark:hover:text-teal-400'}`}
            >
              {t('navMarket')}
            </button>
            <button 
              onClick={() => setCurrentTab('bulletins')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all relative ${currentTab === 'bulletins' ? 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400' : 'text-slate-600 hover:text-teal-600 dark:text-slate-300 dark:hover:text-teal-400'}`}
            >
              {t('navBulletins')}
              {bulletins.length > 0 && (
                <span className="absolute top-1.5 right-1 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-white dark:ring-slate-950 animate-pulse"></span>
              )}
            </button>
            {user && (
              <button 
                onClick={() => setCurrentTab('dashboard')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${currentTab === 'dashboard' ? 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400' : 'text-slate-600 hover:text-teal-600 dark:text-slate-300 dark:hover:text-teal-400'}`}
              >
                {user.role === 'admin' ? 'Admin Panel' : user.role === 'farmer' ? t('navDashboard') : 'My Orders'}
              </button>
            )}
            {user && (
              <button 
                onClick={() => setCurrentTab('profile')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${currentTab === 'profile' ? 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400' : 'text-slate-600 hover:text-teal-600 dark:text-slate-300 dark:hover:text-teal-400'}`}
              >
                {t('navProfile')}
              </button>
            )}
          </nav>

          <div className="flex items-center space-x-3">
            {/* Language Selector */}
            <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{t('languageLabel')}:</span>
              <select 
                value={i18n.language} 
                onChange={(e) => i18n.changeLanguage(e.target.value)}
                className="bg-transparent text-xs font-semibold focus:outline-none cursor-pointer text-slate-700 dark:text-slate-300"
              >
                <option value="en">EN</option>
                <option value="am">አማ</option>
                <option value="om">ORM</option>
                <option value="so">SOM</option>
              </select>
            </div>

            {/* Dark Mode Switcher */}
            <button 
              onClick={() => setDark(!dark)}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            >
              {dark ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            {/* User Session buttons */}
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 hidden lg:inline-block">
                  {user.name} ({user.role === 'farmer' ? t('navProfile') : 'Buyer'})
                </span>
                <button 
                  onClick={handleLogout}
                  className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/40 dark:text-red-400 dark:border-red-950/30 transition-all flex items-center space-x-1"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-xs font-semibold hidden md:inline">{t('navLogout')}</span>
                </button>
              </div>
            ) : (
              <button 
                onClick={() => { setAuthMode('login'); setAuthModalOpen(true); }}
                className="px-4.5 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm shadow-md shadow-teal-500/20 flex items-center space-x-2 transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>{t('navLogin')}</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Dynamic Alerts Banner */}
        {bulletins.slice(0, 1).map(bul => (
          <div key={bul.id} className="mb-8 rounded-2xl bg-amber-500/10 border border-amber-500/20 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0 shadow-sm animate-pulse">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-amber-500/20 rounded-xl text-amber-600 dark:text-amber-400">
                {bul.type === 'weather' ? <CloudRain className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
              </div>
              <div>
                <p className="text-xs text-amber-700 dark:text-amber-400 font-semibold tracking-wider uppercase">
                  {bul.type === 'weather' ? t('weatherAlert') : t('marketUpdate')}
                </p>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {bul.title}
                </p>
              </div>
            </div>
            <button 
              onClick={() => setCurrentTab('bulletins')}
              className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center space-x-1 hover:underline"
            >
              <span>Read announcement details</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ))}

        {/* Tab 1: Marketplace Catalog */}
        {currentTab === 'market' && (
          <div>
            {/* Hero Banner with Agriculture Image */}
            <div className="relative rounded-3xl overflow-hidden mb-8 h-64 md:h-80">
              <img 
                src={heroBeautiful} 
                alt="Agricultural fields"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-teal-900/80 via-teal-800/60 to-transparent"></div>
              <div className="absolute inset-0 flex items-center px-8 md:px-12">
                <div className="max-w-2xl">
                  <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-3">
                    Agricultural Marketplace
                  </h2>
                  <p className="text-teal-100 text-sm md:text-base">
                    Direct purchase of fresh highland crops and livestock from Hararghe's local farmers.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Featured Products
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                  Browse our selection of quality agricultural products
                </p>
              </div>
              
              {/* Dynamic Quick Metrics - Glassmorphic */}
              <div className="flex space-x-3">
                <div className="glass-card rounded-xl px-4 py-2.5 flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400/20 to-teal-600/20 border border-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center shadow-inner shadow-teal-500/10">
                    <Tag className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Coffee Price</p>
                    <p className="text-sm font-extrabold bg-gradient-to-r from-teal-600 to-teal-800 dark:from-teal-300 dark:to-teal-500 bg-clip-text text-transparent">350 ETB/kg</p>
                  </div>
                </div>
                <div className="glass-card rounded-xl px-4 py-2.5 flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-600/20 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-inner shadow-amber-500/10">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Active Hubs</p>
                    <p className="text-sm font-extrabold bg-gradient-to-r from-amber-600 to-amber-800 dark:from-amber-300 dark:to-amber-500 bg-clip-text text-transparent">Babille, Alem Maya</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Panel & Search — Glassmorphic */}
            <div className="glass-card rounded-2xl p-5 mb-8 flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-400" />
                <input 
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t('searchPlaceholder')}
                  className="glass-input w-full pl-11 pr-4"
                />
              </div>

              <div className="flex flex-wrap gap-3 items-center">
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="glass-input cursor-pointer dark:text-slate-200"
                >
                  <option value="">{t('filterCategory')}: All</option>
                  <option value="Crops">Crops</option>
                  <option value="Livestock">Livestock</option>
                </select>

                <select 
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="glass-input cursor-pointer dark:text-slate-200"
                >
                  <option value="">{t('filterLocation')}: All Locations</option>
                  <option value="Alem Maya">Alem Maya</option>
                  <option value="Babille">Babille</option>
                  <option value="Harar City">Harar City</option>
                </select>

                <div className="flex items-center space-x-2">
                  <input 
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="Min"
                    className="glass-input w-24"
                  />
                  <span className="text-slate-400 font-bold">–</span>
                  <input 
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Max"
                    className="glass-input w-24"
                  />
                </div>
              </div>
            </div>

            {/* Listings Grid — Premium Glass Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(prod => (
                <div key={prod.id} className="group glass-card rounded-2xl overflow-hidden hover:scale-[1.025] hover:shadow-2xl hover:shadow-teal-500/10 dark:hover:shadow-teal-500/5 transition-all duration-400 flex flex-col justify-between relative">
                  {/* Hover shimmer border */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(20,184,166,0.07) 0%, rgba(217,119,6,0.05) 100%)' }}></div>

                  {/* Product Image - FIXED: Using getLivestockImage function */}
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src={prod.category === 'Crops' ? coffeeImg : getLivestockImage(prod.type)} 
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  </div>

                  <div className="p-6 relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wide backdrop-blur-sm ${prod.category === 'Crops' ? 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border border-teal-500/20' : 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/20'}`}>
                        {prod.category === 'Crops' ? '🌾 Crops' : '🐂 Livestock'}
                      </span>
                      <span className="text-slate-400 dark:text-slate-500 text-[10px] font-bold flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Harvest: {prod.harvestDate}</span>
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors duration-300">{prod.name}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-2 mb-4 leading-relaxed">{prod.description}</p>
                    
                    <div className="space-y-1.5 mb-4">
                      <div className="flex items-center text-xs font-semibold text-slate-500 dark:text-slate-400">
                        <MapPin className="w-3.5 h-3.5 text-teal-500 mr-2" />
                        <span>Hub: {prod.location}</span>
                      </div>
                      <div className="flex items-center text-xs font-semibold text-slate-500 dark:text-slate-400">
                        <User className="w-3.5 h-3.5 text-amber-500 mr-2" />
                        <span>Farmer: {prod.farmerName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10 px-6 py-4 flex items-center justify-between" style={{ background: 'rgba(248,250,252,0.4)', backdropFilter: 'blur(8px)', borderTop: '1px solid rgba(203,213,225,0.3)' }}>
                    <div>
                      <span className="text-xl font-black text-slate-900 dark:text-white">{prod.price}</span>
                      <span className="text-xs font-bold text-slate-400 dark:text-slate-500 ml-1">ETB/{prod.unit}</span>
                      <p className="text-[10px] text-teal-600 dark:text-teal-400 font-bold uppercase mt-0.5">Stock: {prod.quantity} {prod.unit}</p>
                    </div>

                    {user?.role === 'farmer' ? (
                      prod.farmerId === user.id ? (
                        <button 
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: 'rgb(220,38,38)' }}
                        >
                          Delete
                        </button>
                      ) : null
                    ) : (
                      <button 
                        onClick={() => {
                          if (!user) { setAuthModalOpen(true); return; }
                          setCheckoutProduct(prod);
                          setCheckoutQuantity(1);
                        }}
                        className="glass-btn-primary px-4 py-2 text-xs flex items-center space-x-1.5"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{t('addToCart')}</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {products.length === 0 && (
                <div className="col-span-full py-20 text-center">
                  <div className="glass-card w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-5">
                    <AlertTriangle className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No Listings Found</h3>
                  <p className="text-slate-400 text-sm mt-1">Try modifying your filters or search keywords.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Bulletins Announcement Board */}
        {currentTab === 'bulletins' && (
          <div className="max-w-3xl mx-auto">
            {/* Bulletins Header with Agriculture Image */}
            <div className="relative rounded-3xl overflow-hidden mb-8 h-48 md:h-56">
              <img 
                src={cropsBg} 
                alt="Agricultural bulletins"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-teal-900/70 via-teal-800/50 to-transparent"></div>
              <div className="absolute inset-0 flex items-center px-8 md:px-12">
                <div className="max-w-2xl">
                  <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-2">
                    Bulletins & Notices
                  </h2>
                  <p className="text-teal-100 text-sm">
                    Official information bulletins including meteorological weather predictions, local market coffee rates, and fertilizer distribution announcements.
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Latest Updates</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                Stay informed with the latest agricultural news and announcements.
              </p>
            </div>

            <div className="space-y-6">
              {bulletins.map(bul => (
                <div key={bul.id} className="glass-card rounded-2xl p-6 relative overflow-hidden">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl ${
                      bul.type === 'weather' 
                        ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' 
                        : bul.type === 'market' 
                        ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400' 
                        : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                    }`}>
                      {bul.type === 'weather' ? <CloudRain className="w-6 h-6" /> : bul.type === 'market' ? <TrendingUp className="w-6 h-6" /> : <Bell className="w-6 h-6" />}
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] font-extrabold tracking-wider uppercase text-slate-400 dark:text-slate-500">
                          {bul.type === 'weather' ? t('weatherAlert') : bul.type === 'market' ? t('marketUpdate') : t('govAlert')}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">{bul.date}</span>
                      </div>
                      <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-2">{bul.title}</h3>
                      <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">{bul.content}</p>
                      
                      <div className="flex items-center text-xs font-semibold text-slate-400 dark:text-slate-500">
                        <User className="w-3.5 h-3.5 mr-1.5" />
                        <span>{t('publishedBy')}: {bul.author}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Admin Dashboard */}
        {currentTab === 'dashboard' && user && user.role === 'admin' && (
          <div>
            {/* Admin Dashboard Header */}
            <div className="relative rounded-3xl overflow-hidden mb-8 h-48 md:h-56">
              <img 
                src={heroBeautiful} 
                alt="Admin dashboard"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/80 via-indigo-800/60 to-transparent"></div>
              <div className="absolute inset-0 flex items-center px-8 md:px-12">
                <div className="max-w-2xl">
                  <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-2">
                    Admin Control Panel
                  </h2>
                  <p className="text-indigo-100 text-sm">
                    Manage users, monitor marketplace, publish bulletins, and oversee system analytics.
                  </p>
                </div>
              </div>
            </div>

            {/* Admin Analytics Overview */}
            {adminAnalytics && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="glass-card rounded-2xl p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl" style={{ background: 'rgba(99,102,241,0.12)' }}></div>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Total Users</p>
                  <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">{adminAnalytics.users.total}</p>
                  <p className="text-[10px] text-indigo-500 dark:text-indigo-400 font-semibold mt-1">
                    {adminAnalytics.users.farmers} Farmers, {adminAnalytics.users.buyers} Buyers
                  </p>
                </div>
                <div className="glass-card rounded-2xl p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl" style={{ background: 'rgba(20,184,166,0.12)' }}></div>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Total Products</p>
                  <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">{adminAnalytics.products.total}</p>
                  <p className="text-[10px] text-teal-500 dark:text-teal-400 font-semibold mt-1">
                    {adminAnalytics.products.crops} Crops, {adminAnalytics.products.livestock} Livestock
                  </p>
                </div>
                <div className="glass-card rounded-2xl p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl" style={{ background: 'rgba(217,119,6,0.12)' }}></div>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Total Orders</p>
                  <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">{adminAnalytics.orders.total}</p>
                  <p className="text-[10px] text-amber-500 dark:text-amber-400 font-semibold mt-1">
                    {adminAnalytics.orders.paid} Paid · {adminAnalytics.orders.revenue} ETB Revenue
                  </p>
                </div>
                <div className="glass-card rounded-2xl p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl" style={{ background: 'rgba(239,68,68,0.12)' }}></div>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Active Disputes</p>
                  <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">{disputes.length}</p>
                  <p className="text-[10px] text-red-500 dark:text-red-400 font-semibold mt-1">Require attention</p>
                </div>
              </div>
            )}

            {/* User Management Section */}
            <div className="glass-card rounded-2xl p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">User Management</h3>
                <div className="flex space-x-2">
                  <select className="glass-input text-xs">
                    <option>All Roles</option>
                    <option>Farmers</option>
                    <option>Buyers</option>
                    <option>Admins</option>
                  </select>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-xs text-slate-400 dark:text-slate-51 font-bold uppercase">
                      <th className="py-3 px-4">User ID</th>
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                    {allUsers.map(u => (
                      <tr key={u.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                        <td className="py-4 px-4 font-mono text-xs">{u.id.substring(0, 8)}...</td>
                        <td className="py-4 px-4">{u.name}</td>
                        <td className="py-4 px-4">{u.email}</td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            u.role === 'admin' ? 'bg-indigo-500/15 text-indigo-600' :
                            u.role === 'farmer' ? 'bg-teal-500/15 text-teal-600' : 'bg-amber-500/15 text-amber-600'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-4 px-4">{u.location || 'N/A'}</td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            u.suspended ? 'bg-red-500/15 text-red-600' : 'bg-green-500/15 text-green-600'
                          }`}>
                            {u.suspended ? 'Suspended' : 'Active'}
                          </span>
                        </td>
                        <td className="py-4 px-4 flex justify-center items-center space-x-2">
                          {!u.approved && u.role !== 'admin' && (
                            <button className="px-2.5 py-1.5 rounded bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold">
                              Approve
                            </button>
                          )}
                          {!u.suspended && u.role !== 'admin' && (
                            <button className="px-2.5 py-1.5 rounded bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold">
                              Suspend
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Activity */}
            {adminAnalytics && (
              <div className="glass-card rounded-2xl p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Recent Orders Activity</h3>
                <div className="space-y-4">
                  {adminAnalytics.recentOrders.map(order => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-teal-500/15 flex items-center justify-center">
                          <ShoppingBag className="w-5 h-5 text-teal-500" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">{order.productName}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{order.id} · {order.createdAt}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900 dark:text-white">{order.totalPrice} ETB</p>
                        <p className={`text-[10px] font-bold ${order.paymentStatus === 'paid' ? 'text-teal-600' : 'text-amber-600'}`}>
                          {order.paymentStatus.toUpperCase()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Farmer Dashboard */}
        {currentTab === 'dashboard' && user && user.role === 'farmer' && (
          <div>
            {/* Dashboard Header with Agriculture Image */}
            <div className="relative rounded-3xl overflow-hidden mb-8 h-48 md:h-56">
              <img 
                src={heroBeautiful} 
                alt="Farmer dashboard"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-teal-900/70 via-teal-800/50 to-transparent"></div>
              <div className="absolute inset-0 flex items-center px-8 md:px-12">
                <div className="max-w-2xl">
                  <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-2">
                    Farmer Dashboard
                  </h2>
                  <p className="text-teal-100 text-sm">
                    Manage your products, track orders, and monitor your sales performance.
                  </p>
                </div>
              </div>
            </div>

            {/* Header dashboard stats */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-5 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  Sales Overview
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                  Track your product performance and order management
                </p>
              </div>

              <button 
                onClick={() => setAddProductOpen(true)}
                className="mt-4 md:mt-0 px-4.5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl shadow-md shadow-teal-500/20 transition-all flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>List New Product</span>
              </button>
            </div>

            {/* Dashboard grid metrics cards — Glass */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="glass-card rounded-2xl p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl" style={{ background: 'rgba(20,184,166,0.12)' }}></div>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Total Orders</p>
                <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">{orders.length}</p>
                <p className="text-[10px] text-teal-500 dark:text-teal-400 font-semibold mt-1">Pending/Completed</p>
              </div>
              <div className="glass-card rounded-2xl p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl" style={{ background: 'rgba(217,119,6,0.12)' }}></div>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                  {user.role === 'farmer' ? 'Total Earnings' : 'Total Spent'}
                </p>
                <p className="text-3xl font-black bg-gradient-to-r from-amber-600 to-amber-800 dark:from-amber-300 dark:to-amber-500 bg-clip-text text-transparent mt-1">
                  {orders.reduce((acc, o) => acc + (o.paymentStatus === 'paid' ? o.totalPrice : 0), 0)} ETB
                </p>
                <p className="text-[10px] text-amber-500 dark:text-amber-400 font-bold mt-1">Paid Invoices Only</p>
              </div>
              <div className="glass-card rounded-2xl p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl" style={{ background: 'rgba(99,102,241,0.12)' }}></div>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">CBE Birr payments</p>
                <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                  {orders.filter(o => o.paymentMethod === 'CBE_BIRR').length}
                </p>
                <p className="text-[10px] text-indigo-500 dark:text-indigo-400 font-semibold mt-1">Mobile transfers</p>
              </div>
              <div className="glass-card rounded-2xl p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl" style={{ background: 'rgba(20,184,166,0.1)' }}></div>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Logistics Status</p>
                <p className="text-xl font-black text-teal-600 dark:text-teal-400 mt-2 flex items-center">
                  <Truck className="w-5 h-5 mr-2 animate-bounce" />
                  <span>{orders.filter(o => o.status === 'shipped').length} In Transit</span>
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-1">Dispatched deliveries</p>
              </div>
            </div>

            {/* Chart Widgets */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {user.role === 'farmer' && (
                <div className="lg:col-span-2 glass-card rounded-2xl p-6 relative overflow-hidden">
                  <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full blur-3xl" style={{ background: 'rgba(20,184,166,0.1)' }}></div>
                  <h3 className="text-md font-bold mb-4 flex items-center">
                    <div className="w-7 h-7 rounded-lg bg-teal-500/15 flex items-center justify-center mr-2">
                      <TrendingUp className="w-4 h-4 text-teal-500" />
                    </div>
                    <span className="text-slate-800 dark:text-slate-100">Monthly Sales Activity</span>
                  </h3>
                  <div className="h-64">
                    <Line data={getFarmerSalesChartData()} options={{ responsive: true, maintainAspectRatio: false }} />
                  </div>
                </div>
              )}

              <div className={user.role === 'farmer' ? "glass-card rounded-2xl p-6 relative overflow-hidden" : "lg:col-span-3 glass-card rounded-2xl p-6 relative overflow-hidden"}>
                <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full blur-3xl" style={{ background: 'rgba(217,119,6,0.1)' }}></div>
                <h3 className="text-md font-bold mb-4 flex items-center">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/15 flex items-center justify-center mr-2">
                    <TrendingUp className="w-4 h-4 text-amber-500" />
                  </div>
                  <span className="text-slate-800 dark:text-slate-100">Category Volume Breakdown</span>
                </h3>
                <div className="h-64 flex justify-center">
                  <Doughnut data={getCategoryBreakdownData()} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
              </div>
            </div>

            {/* Active Orders List */}
            <div className="glass-card rounded-2xl p-6 overflow-hidden mb-8">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                Active Orders
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-xs text-slate-400 dark:text-slate-500 font-bold uppercase">
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Product</th>
                      <th className="py-3 px-4">{user.role === 'farmer' ? 'Buyer' : 'Farmer'}</th>
                      <th className="py-3 px-4">Quantity</th>
                      <th className="py-3 px-4">Total</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Payment</th>
                      <th className="py-3 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                    {orders.map(ord => (
                      <tr key={ord.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                        <td className="py-4 px-4 font-mono text-xs">{ord.id}</td>
                        <td className="py-4 px-4">{ord.productName}</td>
                        <td className="py-4 px-4">{user.role === 'farmer' ? ord.buyerName : ord.farmerName}</td>
                        <td className="py-4 px-4">{ord.quantity} {ord.productUnit}</td>
                        <td className="py-4 px-4 font-black">{ord.totalPrice} ETB</td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            ord.status === 'delivered' ? 'bg-green-500/15 text-green-600' :
                            ord.status === 'shipped' ? 'bg-blue-500/15 text-blue-600' :
                            ord.status === 'cancelled' ? 'bg-red-500/15 text-red-600' : 'bg-amber-500/15 text-amber-600'
                          }`}>
                            {ord.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`text-[10px] font-bold ${ord.paymentStatus === 'paid' ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400'}`}>
                            {ord.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'} ({ord.paymentMethod.replace('_', ' ')})
                          </span>
                        </td>
                        <td className="py-4 px-4 flex justify-center items-center space-x-2">
                          <button 
                            onClick={() => setTrackingOrder(ord)}
                            className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center space-x-1"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>Track</span>
                          </button>

                          {user.role === 'farmer' && ord.status === 'pending' && (
                            <button 
                              onClick={() => handleUpdateOrderStatus(ord.id, 'confirmed')}
                              className="px-2.5 py-1.5 rounded bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold"
                            >
                              Confirm
                            </button>
                          )}
                          {user.role === 'farmer' && ord.status === 'confirmed' && (
                            <button 
                              onClick={() => handleUpdateOrderStatus(ord.id, 'shipped')}
                              className="px-2.5 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
                            >
                              Ship
                            </button>
                          )}
                          {user.role === 'farmer' && ord.status === 'shipped' && (
                            <button 
                              onClick={() => handleUpdateOrderStatus(ord.id, 'delivered')}
                              className="px-2.5 py-1.5 rounded bg-green-600 hover:bg-green-700 text-white text-xs font-bold"
                            >
                              Delivered
                            </button>
                          )}
                          {user.role === 'buyer' && ord.status === 'pending' && (
                            <button 
                              onClick={() => handleUpdateOrderStatus(ord.id, 'cancelled')}
                              className="px-2.5 py-1.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/50 text-xs font-bold"
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}

                    {orders.length === 0 && (
                      <tr>
                        <td colSpan="8" className="py-12 text-center text-slate-400">
                          No orders registered yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Buyer Dashboard */}
        {currentTab === 'dashboard' && user && user.role === 'buyer' && (
          <div>
            {/* Dashboard Header with Agriculture Image */}
            <div className="relative rounded-3xl overflow-hidden mb-8 h-48 md:h-56">
              <img 
                src={heroBeautiful} 
                alt="Buyer dashboard"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-amber-900/70 via-amber-800/50 to-transparent"></div>
              <div className="absolute inset-0 flex items-center px-8 md:px-12">
                <div className="max-w-2xl">
                  <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-2">
                    Buyer Dashboard
                  </h2>
                  <p className="text-amber-100 text-sm">
                    Track your orders, manage payments, and view purchase history.
                  </p>
                </div>
              </div>
            </div>

            {/* Header dashboard stats */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-5 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  Purchase Overview
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                  Your agricultural procurement summary
                </p>
              </div>
            </div>

            {/* Dashboard grid metrics cards — Glass */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="glass-card rounded-2xl p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl" style={{ background: 'rgba(20,184,166,0.12)' }}></div>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Total Orders</p>
                <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">{orders.length}</p>
                <p className="text-[10px] text-teal-500 dark:text-teal-400 font-semibold mt-1">All time purchases</p>
              </div>
              <div className="glass-card rounded-2xl p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl" style={{ background: 'rgba(217,119,6,0.12)' }}></div>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Total Spent</p>
                <p className="text-3xl font-black bg-gradient-to-r from-amber-600 to-amber-800 dark:from-amber-300 dark:to-amber-500 bg-clip-text text-transparent mt-1">
                  {orders.reduce((acc, o) => acc + (o.paymentStatus === 'paid' ? o.totalPrice : 0), 0)} ETB
                </p>
                <p className="text-[10px] text-amber-500 dark:text-amber-400 font-bold mt-1">Paid orders only</p>
              </div>
              <div className="glass-card rounded-2xl p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl" style={{ background: 'rgba(99,102,241,0.12)' }}></div>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">CBE Birr Payments</p>
                <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                  {orders.filter(o => o.paymentMethod === 'CBE_BIRR').length}
                </p>
                <p className="text-[10px] text-indigo-500 dark:text-indigo-400 font-semibold mt-1">Mobile transfers</p>
              </div>
              <div className="glass-card rounded-2xl p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl" style={{ background: 'rgba(20,184,166,0.1)' }}></div>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Pending Orders</p>
                <p className="text-xl font-black text-amber-600 dark:text-amber-400 mt-2 flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  <span>{orders.filter(o => o.status === 'pending').length} Awaiting</span>
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-1">Processing orders</p>
              </div>
            </div>

            {/* Chart Widgets */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              <div className="lg:col-span-2 glass-card rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full blur-3xl" style={{ background: 'rgba(217,119,6,0.1)' }}></div>
                <h3 className="text-md font-bold mb-4 flex items-center">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/15 flex items-center justify-center mr-2">
                    <TrendingUp className="w-4 h-4 text-amber-500" />
                  </div>
                  <span className="text-slate-800 dark:text-slate-100">Purchase History by Category</span>
                </h3>
                <div className="h-64">
                  <Doughnut data={getCategoryBreakdownData()} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
              </div>

              <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full blur-3xl" style={{ background: 'rgba(20,184,166,0.1)' }}></div>
                <h3 className="text-md font-bold mb-4 flex items-center">
                  <div className="w-7 h-7 rounded-lg bg-teal-500/15 flex items-center justify-center mr-2">
                    <MapPin className="w-4 h-4 text-teal-500" />
                  </div>
                  <span className="text-slate-800 dark:text-slate-100">Purchase by Location</span>
                </h3>
                <div className="space-y-3">
                  {['Alem Maya', 'Babille', 'Harar City'].map(location => {
                    const locationOrders = orders.filter(o => o.productLocation === location);
                    const locationTotal = locationOrders.reduce((sum, o) => sum + o.totalPrice, 0);
                    return (
                      <div key={location} className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{location}</span>
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{locationTotal} ETB</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Active Orders List */}
            <div className="glass-card rounded-2xl p-6 overflow-hidden mb-8">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                My Orders
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-xs text-slate-400 dark:text-slate-500 font-bold uppercase">
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Product</th>
                      <th className="py-3 px-4">Farmer</th>
                      <th className="py-3 px-4">Quantity</th>
                      <th className="py-3 px-4">Total</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Payment</th>
                      <th className="py-3 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                    {orders.map(ord => (
                      <tr key={ord.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                        <td className="py-4 px-4 font-mono text-xs">{ord.id}</td>
                        <td className="py-4 px-4">{ord.productName}</td>
                        <td className="py-4 px-4">{ord.farmerName}</td>
                        <td className="py-4 px-4">{ord.quantity} {ord.productUnit}</td>
                        <td className="py-4 px-4 font-black">{ord.totalPrice} ETB</td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            ord.status === 'delivered' ? 'bg-green-500/15 text-green-600' :
                            ord.status === 'shipped' ? 'bg-blue-500/15 text-blue-600' :
                            ord.status === 'cancelled' ? 'bg-red-500/15 text-red-600' : 'bg-amber-500/15 text-amber-600'
                          }`}>
                            {ord.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`text-[10px] font-bold ${ord.paymentStatus === 'paid' ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400'}`}>
                            {ord.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'} ({ord.paymentMethod.replace('_', ' ')})
                          </span>
                        </td>
                        <td className="py-4 px-4 flex justify-center items-center space-x-2">
                          <button 
                            onClick={() => setTrackingOrder(ord)}
                            className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center space-x-1"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>Track</span>
                          </button>
                          {ord.status === 'pending' && (
                            <button 
                              onClick={() => handleUpdateOrderStatus(ord.id, 'cancelled')}
                              className="px-2.5 py-1.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/50 text-xs font-bold"
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}

                    {orders.length === 0 && (
                      <tr>
                        <td colSpan="8" className="py-12 text-center text-slate-400">
                          No orders placed yet. Start shopping in the marketplace!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Profile Editor */}
        {currentTab === 'profile' && user && (
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Profile Settings</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                Customize contact numbers, geographic location labels, coordinate tags, and crop varieties.
              </p>
            </div>

            <form onSubmit={handleProfileSave} className="glass-card rounded-2xl p-6 space-y-6">
              {profileSaved && (
                <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-700 dark:text-teal-400 text-sm font-bold flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Profile updated successfully!</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-extrabold uppercase text-slate-400 mb-2">Display Name</label>
                  <input type="text" value={profileName} onChange={(e) => setProfileName(e.target.value)} required className="glass-input w-full" />
                </div>
                <div>
                  <label className="block text-xs font-extrabold uppercase text-slate-400 mb-2">Phone Number</label>
                  <input type="text" value={profilePhone} onChange={(e) => setProfilePhone(e.target.value)} required className="glass-input w-full" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-400 mb-2">General Location</label>
                <input type="text" value={profileLocation} onChange={(e) => setProfileLocation(e.target.value)} required placeholder="e.g. Alem Maya, Babille, Harar City" className="glass-input w-full" />
              </div>

              {user.role === 'farmer' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-extrabold uppercase text-slate-400 mb-2">GPS Coordinates (Latitude, Longitude)</label>
                      <input 
                        type="text" 
                        value={profileCoords}
                        onChange={(e) => setProfileCoords(e.target.value)}
                        placeholder="e.g. 9.3900, 42.0800"
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold uppercase text-slate-400 mb-2">Crops Cultivated (Comma Separated)</label>
                      <input 
                        type="text" 
                        value={profileCrops}
                        onChange={(e) => setProfileCrops(e.target.value)}
                        placeholder="e.g. Coffee, Chat, Groundnuts"
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold uppercase text-slate-400 mb-2">Farmer Biography</label>
                    <textarea 
                      value={profileBio}
                      onChange={(e) => setProfileBio(e.target.value)}
                      rows="4"
                      placeholder="Share a short bio about your farm, harvests, and agricultural experience."
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    ></textarea>
                  </div>
                </>
              )}

              <div className="flex justify-end pt-4">
                <button 
                  type="submit"
                  className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl shadow-md shadow-teal-500/20 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950/50 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
            © 2026 Hararghe Agricultural Marketplace Hub. Powered by Node.js & React.
          </p>
        </div>
      </footer>

      {/* MODAL 1: Authentication Form Modal */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
          <div className="w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in-95 duration-200" style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '24px', boxShadow: '0 25px 60px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.6)' }}>
            <button 
              onClick={() => setAuthModalOpen(false)}
              className="absolute right-4.5 top-4.5 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="px-6 py-8">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white text-center mb-6">
                {authMode === 'login' ? 'Sign In to Marketplace' : 'Register Account'}
              </h3>

              {authError && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/15 border border-red-500/20 text-red-600 text-xs font-bold flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{authError}</span>
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {authMode === 'register' && (
                  <>
                    <div className="flex space-x-2 p-1 bg-slate-100 dark:bg-slate-950 rounded-xl mb-2">
                      <button 
                        type="button"
                        onClick={() => setAuthRole('buyer')}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${authRole === 'buyer' ? 'bg-white dark:bg-slate-900 shadow-sm text-teal-700 dark:text-teal-400' : 'text-slate-500'}`}
                      >
                        Buyer
                      </button>
                      <button 
                        type="button"
                        onClick={() => setAuthRole('farmer')}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${authRole === 'farmer' ? 'bg-white dark:bg-slate-900 shadow-sm text-teal-700 dark:text-teal-400' : 'text-slate-500'}`}
                      >
                        Farmer
                      </button>
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Full Name</label>
                      <input 
                        type="text" 
                        required
                        value={authName}
                        onChange={(e) => setAuthName(e.target.value)}
                        placeholder="e.g. Kenenisa Jila"
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Phone Number</label>
                      <input 
                        type="text" 
                        required
                        value={authPhone}
                        onChange={(e) => setAuthPhone(e.target.value)}
                        placeholder="e.g. 0911223344"
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Location</label>
                      <input 
                        type="text" 
                        required
                        value={authLocation}
                        onChange={(e) => setAuthLocation(e.target.value)}
                        placeholder="e.g. Alem Maya"
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Password</label>
                  <input 
                    type="password" 
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-sm shadow-md shadow-teal-500/20 transition-all pt-2.5 mt-4"
                >
                  {authMode === 'login' ? 'Sign In' : 'Register Account'}
                </button>
              </form>

              <div className="mt-6 text-center text-xs">
                <span className="text-slate-400 dark:text-slate-500">
                  {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
                </span>
                <button 
                  onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                  className="font-bold text-teal-600 dark:text-teal-400 hover:underline"
                >
                  {authMode === 'login' ? 'Register here' : 'Sign in here'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Checkout / Buy Modal */}
      {checkoutProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
          <div className="w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in-95 duration-200" style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '24px', boxShadow: '0 25px 60px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.6)' }}>
            <button 
              onClick={() => setCheckoutProduct(null)}
              className="absolute right-4.5 top-4.5 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="px-6 py-8">
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">{t('checkoutTitle')}</h3>
              <p className="text-xs text-slate-400 mb-6">Confirm quantities and select payment provider.</p>

              {paymentError && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/15 border border-red-500/20 text-red-600 text-xs font-bold flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{paymentError}</span>
                </div>
              )}

              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{checkoutProduct.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{checkoutProduct.price} ETB/{checkoutProduct.unit}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      type="button"
                      onClick={() => setCheckoutQuantity(Math.max(1, checkoutQuantity - 1))}
                      className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
                    >
                      -
                    </button>
                    <span className="text-sm font-bold w-6 text-center">{checkoutQuantity}</span>
                    <button 
                      type="button"
                      onClick={() => setCheckoutQuantity(Math.min(checkoutProduct.quantity, checkoutQuantity + 1))}
                      className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-2">Payment Method</label>
                  <div className="grid grid-cols-1 gap-2.5">
                    {paymentConfig.cbeBirrEnabled && (
                      <label className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${checkoutPaymentMethod === 'CBE_BIRR' ? 'border-teal-500 bg-teal-500/5 text-teal-900 dark:text-teal-400' : 'border-slate-200 dark:border-slate-800'}`}>
                        <div className="flex items-center space-x-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
                          <span className="text-xs font-bold">CBE Birr Mobile Banking (Enabled)</span>
                        </div>
                        <input 
                          type="radio" 
                          name="payment"
                          value="CBE_BIRR"
                          checked={checkoutPaymentMethod === 'CBE_BIRR'}
                          onChange={() => setCheckoutPaymentMethod('CBE_BIRR')}
                          className="accent-teal-600"
                        />
                      </label>
                    )}

                    {!paymentConfig.cbeBirrEnabled && (
                      <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-slate-400 flex items-center space-x-2">
                        <X className="w-4 h-4 text-red-400" />
                        <span className="text-xs font-medium">CBE Birr (Toggled Off)</span>
                      </div>
                    )}

                    <label className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${checkoutPaymentMethod === 'COD' ? 'border-teal-500 bg-teal-500/5 text-teal-900 dark:text-teal-400' : 'border-slate-200 dark:border-slate-800'}`}>
                      <div className="flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                        <span className="text-xs font-bold">{t('codPay')}</span>
                      </div>
                      <input 
                        type="radio" 
                        name="payment"
                        value="COD"
                        checked={checkoutPaymentMethod === 'COD'}
                        onChange={() => setCheckoutPaymentMethod('COD')}
                        className="accent-teal-600"
                      />
                    </label>
                  </div>
                </div>

                {checkoutPaymentMethod === 'CBE_BIRR' && (
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">CBE Birr Phone Number</label>
                    <input 
                      type="text" 
                      required
                      value={checkoutPhone}
                      onChange={(e) => setCheckoutPhone(e.target.value)}
                      placeholder="e.g. 0912345678"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Shipping Address / Pickup Hub</label>
                  <input 
                    type="text" 
                    required
                    value={checkoutAddress}
                    onChange={(e) => setCheckoutAddress(e.target.value)}
                    placeholder="e.g. Alem Maya Cooperatives Hub, Shelf #3"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-850">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">{t('totalPrice')}</p>
                    <p className="text-xl font-black text-slate-900 dark:text-white">
                      {checkoutProduct.price * checkoutQuantity} ETB
                    </p>
                  </div>
                  <button 
                    type="submit"
                    className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-md shadow-teal-500/20 transition-all"
                  >
                    Confirm Order
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* OTP MODAL for CBE Birr payment simulation */}
      {otpModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ background: 'rgba(15,23,42,0.75)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}>
          <div className="w-full max-w-sm overflow-hidden relative p-6 text-center animate-in fade-in zoom-in-95 duration-200" style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)', border: '1px solid rgba(255,255,255,0.5)', borderRadius: '24px', boxShadow: '0 25px 60px rgba(0,0,0,0.2)' }}>
            <h3 className="text-lg font-black mb-2">CBE Birr Security Verification</h3>
            <p className="text-xs text-slate-400 mb-6">
              A secure OTP transfer authorization was dispatched to <b>{checkoutPhone}</b>. Enter <b>123456</b> to authorize the simulated payment transaction.
            </p>

            {paymentError && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/15 border border-red-500/20 text-red-600 text-xs font-bold">
                {paymentError}
              </div>
            )}

            <div className="space-y-4">
              <input 
                type="text" 
                maxLength="6"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="Enter 6-digit OTP"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-center tracking-[1em] text-lg font-extrabold focus:outline-none focus:ring-2 focus:ring-teal-500"
              />

              <div className="flex space-x-2">
                <button 
                  onClick={() => setOtpModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold text-xs"
                >
                  Cancel
                </button>
                <button 
                  onClick={async () => {
                    if (otpCode !== '123456') {
                      setPaymentError('Invalid authentication code. Please try again.');
                      return;
                    }
                    await submitOrder();
                  }}
                  disabled={processingPayment}
                  className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex justify-center items-center"
                >
                  {processingPayment ? 'Processing...' : 'Authorize Pay'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Logistics Tracker Modal */}
      {trackingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
          <div className="w-full max-w-md overflow-hidden relative p-6 animate-in fade-in zoom-in-95 duration-200" style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '24px', boxShadow: '0 25px 60px rgba(0,0,0,0.15)' }}>
            <button 
              onClick={() => setTrackingOrder(null)}
              className="absolute right-4.5 top-4.5 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">{t('viewLogistics')}</h3>
            <p className="text-xs text-slate-400 mb-6">Real-time GPS carrier route statuses.</p>

            <div className="space-y-6">
              {/* Shipment Info details */}
              <div className="p-4 rounded-2xl grid grid-cols-2 gap-4 text-xs font-semibold text-slate-600 dark:text-slate-300" style={{ background: 'rgba(248,250,252,0.5)', border: '1px solid rgba(203,213,225,0.4)', backdropFilter: 'blur(8px)' }}>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Tracking Number</span>
                  <span className="font-mono text-slate-800 dark:text-white">{trackingOrder.logistics.trackingNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Carrier</span>
                  <span>{trackingOrder.logistics.carrier}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Estimated Delivery</span>
                  <span>{trackingOrder.logistics.estimatedDelivery}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Pickup Point</span>
                  <span>{trackingOrder.logistics.pickupPoint}</span>
                </div>
              </div>

              {/* Progress Steps */}
              <div className="relative pl-6 space-y-6 border-l-2 border-slate-200 dark:border-slate-800 ml-3">
                <div className="relative">
                  <span className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full border-2 ${trackingOrder.status === 'pending' || trackingOrder.status === 'confirmed' || trackingOrder.status === 'shipped' || trackingOrder.status === 'delivered' ? 'bg-teal-500 border-teal-500' : 'bg-white border-slate-300'}`}></span>
                  <h4 className="text-xs font-bold text-slate-950 dark:text-white">Order Confirmed</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Payment validated, packaging listing products.</p>
                </div>

                <div className="relative">
                  <span className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full border-2 ${trackingOrder.status === 'shipped' || trackingOrder.status === 'delivered' ? 'bg-teal-500 border-teal-500' : 'bg-white border-slate-300'}`}></span>
                  <h4 className="text-xs font-bold text-slate-950 dark:text-white">In Transit</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Courier dispatched. Package currently en-route.</p>
                </div>

                <div className="relative">
                  <span className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full border-2 ${trackingOrder.status === 'delivered' ? 'bg-teal-500 border-teal-500' : 'bg-white border-slate-300'}`}></span>
                  <h4 className="text-xs font-bold text-slate-950 dark:text-white">Delivered</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Arrived at hub/destination. Disbursed to customer.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Add Product Modal (Farmer only) */}
      {addProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
          <div className="w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in-95 duration-200" style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)', border: '1px solid rgba(255,255,255,0.45)', borderRadius: '24px', boxShadow: '0 25px 60px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.6)' }}>
            <button 
              onClick={() => setAddProductOpen(false)}
              className="absolute right-4.5 top-4.5 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="px-6 py-8">
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">List New Agricultural Product</h3>
              <p className="text-xs text-slate-400 mb-6">List crops or livestock for marketplace bidding.</p>

              {prodFormError && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/15 border border-red-500/20 text-red-600 text-xs font-bold">
                  {prodFormError}
                </div>
              )}

              <form onSubmit={handleAddProduct} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Product Title</label>
                  <input 
                    type="text" 
                    required
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    placeholder="e.g. Harar Coffee Beans, Red Groundnuts"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Category</label>
                    <select 
                      value={newProdCategory}
                      onChange={(e) => setNewProdCategory(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none cursor-pointer"
                    >
                      <option value="Crops">Crops</option>
                      <option value="Livestock">Livestock</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Crop/Breed Type</label>
                    <input 
                      type="text" 
                      required
                      value={newProdType}
                      onChange={(e) => setNewProdType(e.target.value)}
                      placeholder="e.g. Coffee, Bull, Goat"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Unit Price (ETB)</label>
                    <input 
                      type="number" 
                      required
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(e.target.value)}
                      placeholder="e.g. 350"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Unit</label>
                    <input 
                      type="text" 
                      required
                      value={newProdUnit}
                      onChange={(e) => setNewProdUnit(e.target.value)}
                      placeholder="e.g. kg, head"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Quantity Stock</label>
                    <input 
                      type="number" 
                      required
                      value={newProdQty}
                      onChange={(e) => setNewProdQty(e.target.value)}
                      placeholder="e.g. 500"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Harvest Date</label>
                    <input 
                      type="date" 
                      required
                      value={newProdHarvestDate}
                      onChange={(e) => setNewProdHarvestDate(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Location / Hub Point</label>
                  <input 
                    type="text" 
                    required
                    value={newProdLocation}
                    onChange={(e) => setNewProdLocation(e.target.value)}
                    placeholder="e.g. Alem Maya, Babille"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Short Description</label>
                  <textarea 
                    value={newProdDesc}
                    onChange={(e) => setNewProdDesc(e.target.value)}
                    rows="3"
                    placeholder="Product details, storage logs, moisture rates, organic certificates..."
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                  ></textarea>
                </div>

                <div className="flex justify-end pt-4 space-x-2">
                  <button 
                    type="button" 
                    onClick={() => setAddProductOpen(false)}
                    className="px-4.5 py-2.5 border border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-450 font-bold text-xs rounded-xl"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md shadow-teal-500/20 transition-all"
                  >
                    Post Listing
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}