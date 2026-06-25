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
  Clock,
  Heart,
  Pencil,
  Eye,
  EyeOff,
  Package,
  XCircle,
  BarChart3
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
  const [dashboardSubTab, setDashboardSubTab] = useState('overview'); // overview, production, inventory, quality, financial, selling
  const [buyerDashboardSubTab, setBuyerDashboardSubTab] = useState('overview'); // overview, wishlist, reviews, financial
  const [adminDashboardSubTab, setAdminDashboardSubTab] = useState('overview'); // overview, users, quality, disputes, system
  
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
  const [newProdImage, setNewProdImage] = useState(null);
  const [prodFormError, setProdFormError] = useState('');

  // Edit product form (Farmer only)
  const [editProductOpen, setEditProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editProdName, setEditProdName] = useState('');
  const [editProdCategory, setEditProdCategory] = useState('Crops');
  const [editProdType, setEditProdType] = useState('');
  const [editProdPrice, setEditProdPrice] = useState('');
  const [editProdQty, setEditProdQty] = useState('');
  const [editProdUnit, setEditProdUnit] = useState('kg');
  const [editProdHarvestDate, setEditProdHarvestDate] = useState('');
  const [editProdLocation, setEditProdLocation] = useState('');
  const [editProdDesc, setEditProdDesc] = useState('');
  const [editProdImage, setEditProdImage] = useState(null);
  const [editProdFormError, setEditProdFormError] = useState('');

  // Profile Edit
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileLocation, setProfileLocation] = useState('');
  const [profileBio, setProfileBio] = useState('');
  const [profileCrops, setProfileCrops] = useState('');
  const [profileCoords, setProfileCoords] = useState('');
  const [profileSaved, setProfileSaved] = useState(false);

  // Farmer Production & Inventory Management
  const [cropPlans, setCropPlans] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);
  const [storageFacilities, setStorageFacilities] = useState([]);
  const [batchLots, setBatchLots] = useState([]);
  
  // Quality & Certification
  const [qualityGrades, setQualityGrades] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [labTests, setLabTests] = useState([]);
  const [qualityInspections, setQualityInspections] = useState([]);
  
  // Financial Tools
  const [productionCosts, setProductionCosts] = useState([]);
  const [loanApplications, setLoanApplications] = useState([]);
  const [insurancePolicies, setInsurancePolicies] = useState([]);
  const [subsidyApplications, setSubsidyApplications] = useState([]);
  
  // Market Intelligence
  const [priceAlerts, setPriceAlerts] = useState([]);
  const [competitorPrices, setCompetitorPrices] = useState([]);
  const [marketNews, setMarketNews] = useState([]);
  
  // Operational Support
  const [irrigationSchedules, setIrrigationSchedules] = useState([]);
  const [pestAdvisories, setPestAdvisories] = useState([]);
  const [expertConsultations, setExpertConsultations] = useState([]);
  const [trainingResources, setTrainingResources] = useState([]);
  
  // Advanced Selling
  const [auctionBids, setAuctionBids] = useState([]);
  const [contractFarming, setContractFarming] = useState([]);
  const [advanceBookings, setAdvanceBookings] = useState([]);
  const [bulkDiscounts, setBulkDiscounts] = useState([]);
  
  // Buyer Features
  const [wishlist, setWishlist] = useState([]);
  const [supplierReviews, setSupplierReviews] = useState([]);
  const [trustedSuppliers, setTrustedSuppliers] = useState([]);
  const [buyerBudgets, setBuyerBudgets] = useState([]);
  const [buyerInvoices, setBuyerInvoices] = useState([]);
  const [refundRequests, setRefundRequests] = useState([]);
  
  // Admin Advanced Features
  const [qualityAudits, setQualityAudits] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [priceMonitoring, setPriceMonitoring] = useState([]);
  const [fraudAlerts, setFraudAlerts] = useState([]);
  const [customReports, setCustomReports] = useState([]);
  const [systemConfig, setSystemConfig] = useState({});
  
  // Modal States
  const [cropPlanModalOpen, setCropPlanModalOpen] = useState(false);
  const [inventoryModalOpen, setInventoryModalOpen] = useState(false);
  const [equipmentModalOpen, setEquipmentModalOpen] = useState(false);
  const [qualityGradeModalOpen, setQualityGradeModalOpen] = useState(false);
  const [certificationModalOpen, setCertificationModalOpen] = useState(false);
  const [loanModalOpen, setLoanModalOpen] = useState(false);
  const [wishlistModalOpen, setWishlistModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewOrderId, setReviewOrderId] = useState('');
  const [reviewFarmerId, setReviewFarmerId] = useState('');
  const [reviewFarmerName, setReviewFarmerName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [budgetModalOpen, setBudgetModalOpen] = useState(false);
  const [budgetAmount, setBudgetAmount] = useState('');
  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [disputeResolutionModalOpen, setDisputeResolutionModalOpen] = useState(false);

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

        // Fetch farmer-specific data
        if (user?.role === 'farmer') {
          const cropPlansRes = await fetch(`/api/crop-plans?farmerId=${user.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (cropPlansRes.ok) setCropPlans(await cropPlansRes.json());

          const inventoryRes = await fetch(`/api/inventory?farmerId=${user.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (inventoryRes.ok) setInventoryItems(await inventoryRes.json());

          const equipmentRes = await fetch(`/api/equipment?farmerId=${user.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (equipmentRes.ok) setEquipmentList(await equipmentRes.json());

          const qualityGradesRes = await fetch(`/api/quality-grades?farmerId=${user.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (qualityGradesRes.ok) setQualityGrades(await qualityGradesRes.json());

          const certificationsRes = await fetch(`/api/certifications?farmerId=${user.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (certificationsRes.ok) setCertifications(await certificationsRes.json());

          const loansRes = await fetch(`/api/loans?farmerId=${user.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (loansRes.ok) setLoanApplications(await loansRes.json());
        }

        // Fetch buyer-specific data
        if (user?.role === 'buyer') {
          const wishlistRes = await fetch(`/api/wishlist?buyerId=${user.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (wishlistRes.ok) setWishlist(await wishlistRes.json());

          const reviewsRes = await fetch(`/api/supplier-reviews?buyerId=${user.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (reviewsRes.ok) setSupplierReviews(await reviewsRes.json());
        }

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

          const disputesRes = await fetch('/api/disputes', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (disputesRes.ok) setDisputes(await disputesRes.json());

          const auditsRes = await fetch('/api/quality-audits', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (auditsRes.ok) setQualityAudits(await auditsRes.json());
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
      const formData = new FormData();
      formData.append('name', newProdName);
      formData.append('category', newProdCategory);
      formData.append('type', newProdType);
      formData.append('price', newProdPrice);
      formData.append('quantity', newProdQty);
      formData.append('unit', newProdUnit);
      formData.append('harvestDate', newProdHarvestDate);
      formData.append('location', newProdLocation);
      formData.append('description', newProdDesc);
      if (newProdImage) {
        formData.append('image', newProdImage);
      }

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
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
      setNewProdImage(null);
      
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

  // Farmer: Reject order when payment is false
  const handleRejectOrder = async (orderId) => {
    if (!confirm('Reject this order? Stock will be returned.')) return;
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status: 'cancelled' })
      });
      if (res.ok) { fetchData(); }
      else { const e = await res.json(); alert(e.error || 'Failed to reject order'); }
    } catch (err) { console.error(err); }
  };

  // Farmer: Toggle product visibility (hide/show)
  const handleToggleVisibility = async (prod) => {
    try {
      const formData = new FormData();
      formData.append('name', prod.name);
      formData.append('category', prod.category);
      formData.append('type', prod.type);
      formData.append('price', prod.price);
      formData.append('quantity', prod.quantity);
      formData.append('unit', prod.unit);
      formData.append('harvestDate', prod.harvestDate);
      formData.append('location', prod.location);
      formData.append('description', prod.description || '');
      formData.append('hidden', prod.hidden ? 'false' : 'true');
      const res = await fetch(`/api/products/${prod.id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      if (res.ok) { fetchData(); }
    } catch (err) { console.error(err); }
  };

  // Open edit modal
  const handleOpenEdit = (prod) => {
    setEditingProduct(prod);
    setEditProdName(prod.name);
    setEditProdCategory(prod.category);
    setEditProdType(prod.type);
    setEditProdPrice(String(prod.price));
    setEditProdQty(String(prod.quantity));
    setEditProdUnit(prod.unit);
    setEditProdHarvestDate(prod.harvestDate);
    setEditProdLocation(prod.location);
    setEditProdDesc(prod.description || '');
    setEditProdImage(null);
    setEditProdFormError('');
    setEditProductOpen(true);
  };

  // Submit edited product
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setEditProdFormError('');
    try {
      const formData = new FormData();
      formData.append('name', editProdName);
      formData.append('category', editProdCategory);
      formData.append('type', editProdType);
      formData.append('price', editProdPrice);
      formData.append('quantity', editProdQty);
      formData.append('unit', editProdUnit);
      formData.append('harvestDate', editProdHarvestDate);
      formData.append('location', editProdLocation);
      formData.append('description', editProdDesc);
      if (editProdImage) formData.append('image', editProdImage);
      const res = await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (!res.ok) { setEditProdFormError(data.error || 'Failed to update'); return; }
      setEditProductOpen(false);
      setEditingProduct(null);
      fetchData();
    } catch (err) { setEditProdFormError('Network error'); }
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

  // ===== NEW CRUD HANDLERS =====
  
  // Crop Plan CRUD
  const handleAddCropPlan = async (planData) => {
    try {
      const res = await fetch('/api/crop-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...planData, farmerId: user.id })
      });
      if (res.ok) {
        const newPlan = await res.json();
        setCropPlans([...cropPlans, newPlan]);
        confetti({ particleCount: 30, spread: 40 });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateCropPlan = async (id, planData) => {
    try {
      const res = await fetch(`/api/crop-plans/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(planData)
      });
      if (res.ok) {
        setCropPlans(cropPlans.map(p => p.id === id ? { ...p, ...planData } : p));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCropPlan = async (id) => {
    try {
      const res = await fetch(`/api/crop-plans/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setCropPlans(cropPlans.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Inventory CRUD
  const handleAddInventory = async (inventoryData) => {
    try {
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...inventoryData, farmerId: user.id })
      });
      if (res.ok) {
        const newItem = await res.json();
        setInventoryItems([...inventoryItems, newItem]);
        confetti({ particleCount: 30, spread: 40 });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateInventory = async (id, inventoryData) => {
    try {
      const res = await fetch(`/api/inventory/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(inventoryData)
      });
      if (res.ok) {
        setInventoryItems(inventoryItems.map(i => i.id === id ? { ...i, ...inventoryData } : i));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteInventory = async (id) => {
    try {
      const res = await fetch(`/api/inventory/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setInventoryItems(inventoryItems.filter(i => i.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Equipment CRUD
  const handleAddEquipment = async (equipmentData) => {
    try {
      const res = await fetch('/api/equipment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...equipmentData, farmerId: user.id })
      });
      if (res.ok) {
        const newEquipment = await res.json();
        setEquipmentList([...equipmentList, newEquipment]);
        confetti({ particleCount: 30, spread: 40 });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateEquipment = async (id, equipmentData) => {
    try {
      const res = await fetch(`/api/equipment/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(equipmentData)
      });
      if (res.ok) {
        setEquipmentList(equipmentList.map(e => e.id === id ? { ...e, ...equipmentData } : e));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteEquipment = async (id) => {
    try {
      const res = await fetch(`/api/equipment/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setEquipmentList(equipmentList.filter(e => e.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Quality Grade CRUD
  const handleAddQualityGrade = async (gradeData) => {
    try {
      const res = await fetch('/api/quality-grades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...gradeData, farmerId: user.id })
      });
      if (res.ok) {
        const newGrade = await res.json();
        setQualityGrades([...qualityGrades, newGrade]);
        confetti({ particleCount: 30, spread: 40 });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateQualityGrade = async (id, gradeData) => {
    try {
      const res = await fetch(`/api/quality-grades/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(gradeData)
      });
      if (res.ok) {
        setQualityGrades(qualityGrades.map(g => g.id === id ? { ...g, ...gradeData } : g));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteQualityGrade = async (id) => {
    try {
      const res = await fetch(`/api/quality-grades/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setQualityGrades(qualityGrades.filter(g => g.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Certification CRUD
  const handleAddCertification = async (certData) => {
    try {
      const res = await fetch('/api/certifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...certData, farmerId: user.id })
      });
      if (res.ok) {
        const newCert = await res.json();
        setCertifications([...certifications, newCert]);
        confetti({ particleCount: 30, spread: 40 });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateCertification = async (id, certData) => {
    try {
      const res = await fetch(`/api/certifications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(certData)
      });
      if (res.ok) {
        setCertifications(certifications.map(c => c.id === id ? { ...c, ...certData } : c));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCertification = async (id) => {
    try {
      const res = await fetch(`/api/certifications/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setCertifications(certifications.filter(c => c.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Loan Application CRUD
  const handleAddLoanApplication = async (loanData) => {
    try {
      const res = await fetch('/api/loans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...loanData, farmerId: user.id })
      });
      if (res.ok) {
        const newLoan = await res.json();
        setLoanApplications([...loanApplications, newLoan]);
        confetti({ particleCount: 30, spread: 40 });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateLoanApplication = async (id, loanData) => {
    try {
      const res = await fetch(`/api/loans/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(loanData)
      });
      if (res.ok) {
        setLoanApplications(loanApplications.map(l => l.id === id ? { ...l, ...loanData } : l));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteLoanApplication = async (id) => {
    try {
      const res = await fetch(`/api/loans/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setLoanApplications(loanApplications.filter(l => l.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Wishlist CRUD (Buyer)
  const handleAddToWishlist = async (product) => {
    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ 
          buyerId: user.id,
          productId: product.id,
          productName: product.name,
          price: product.price,
          farmerId: product.farmerId,
          farmerName: product.farmerName
        })
      });
      if (res.ok) {
        const newItem = await res.json();
        setWishlist([...wishlist, newItem]);
        confetti({ particleCount: 20, spread: 30 });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveFromWishlist = async (id) => {
    try {
      const res = await fetch(`/api/wishlist/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setWishlist(wishlist.filter(w => w.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Supplier Review CRUD
  const handleAddReview = async (reviewData) => {
    try {
      const res = await fetch('/api/supplier-reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...reviewData, buyerId: user.id })
      });
      if (res.ok) {
        const newReview = await res.json();
        setSupplierReviews([...supplierReviews, newReview]);
        confetti({ particleCount: 30, spread: 40 });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateReview = async (id, reviewData) => {
    try {
      const res = await fetch(`/api/supplier-reviews/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(reviewData)
      });
      if (res.ok) {
        setSupplierReviews(supplierReviews.map(r => r.id === id ? { ...r, ...reviewData } : r));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteReview = async (id) => {
    try {
      const res = await fetch(`/api/supplier-reviews/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setSupplierReviews(supplierReviews.filter(r => r.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Admin Quality Audit CRUD
  const handleAddQualityAudit = async (auditData) => {
    try {
      const res = await fetch('/api/quality-audits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(auditData)
      });
      if (res.ok) {
        const newAudit = await res.json();
        setQualityAudits([...qualityAudits, newAudit]);
        confetti({ particleCount: 30, spread: 40 });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateQualityAudit = async (id, auditData) => {
    try {
      const res = await fetch(`/api/quality-audits/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(auditData)
      });
      if (res.ok) {
        setQualityAudits(qualityAudits.map(a => a.id === id ? { ...a, ...auditData } : a));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteQualityAudit = async (id) => {
    try {
      const res = await fetch(`/api/quality-audits/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setQualityAudits(qualityAudits.filter(a => a.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Admin Dispute Resolution
  const handleResolveDispute = async (disputeId, resolutionData) => {
    try {
      const res = await fetch(`/api/disputes/${disputeId}/resolve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(resolutionData)
      });
      if (res.ok) {
        setDisputes(disputes.map(d => d.id === disputeId ? { ...d, status: 'resolved', resolution: resolutionData } : d));
        confetti({ particleCount: 30, spread: 40 });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Admin User Management
  const handleSuspendUser = async (userId) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/suspend`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setAllUsers(allUsers.map(u => u.id === userId ? { ...u, suspended: true } : u));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleActivateUser = async (userId) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/activate`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setAllUsers(allUsers.map(u => u.id === userId ? { ...u, suspended: false } : u));
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
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-500 overflow-x-hidden relative">
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
              <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium hidden sm:block">
                {t('slogan')}
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            <button 
              onClick={() => setCurrentTab('market')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${currentTab === 'market' ? 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400' : 'text-slate-700 hover:text-teal-600 dark:text-slate-300 dark:hover:text-teal-400'}`}
            >
              {t('navMarket')}
            </button>
            <button 
              onClick={() => setCurrentTab('bulletins')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all relative ${currentTab === 'bulletins' ? 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400' : 'text-slate-700 hover:text-teal-600 dark:text-slate-300 dark:hover:text-teal-400'}`}
            >
              {t('navBulletins')}
              {bulletins.length > 0 && (
                <span className="absolute top-1.5 right-1 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-white dark:ring-slate-950 animate-pulse"></span>
              )}
            </button>
            {user && (
              <button 
                onClick={() => setCurrentTab('dashboard')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${currentTab === 'dashboard' ? 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400' : 'text-slate-700 hover:text-teal-600 dark:text-slate-300 dark:hover:text-teal-400'}`}
              >
                {user.role === 'admin' ? 'Admin Panel' : user.role === 'farmer' ? t('navDashboard') : 'My Orders'}
              </button>
            )}
            {user && (
              <button 
                onClick={() => setCurrentTab('profile')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${currentTab === 'profile' ? 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400' : 'text-slate-700 hover:text-teal-600 dark:text-slate-300 dark:hover:text-teal-400'}`}
              >
                {t('navProfile')}
              </button>
            )}
          </nav>

          <div className="flex items-center space-x-3">
            {/* Language Selector */}
            <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold">{t('languageLabel')}:</span>
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
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
            >
              {dark ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            {/* User Session buttons */}
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-400 hidden lg:inline-block">
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
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
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
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Coffee Price</p>
                    <p className="text-sm font-extrabold bg-gradient-to-r from-teal-600 to-teal-800 dark:from-teal-300 dark:to-teal-500 bg-clip-text text-transparent">350 ETB/kg</p>
                  </div>
                </div>
                <div className="glass-card rounded-xl px-4 py-2.5 flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-600/20 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-inner shadow-amber-500/10">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Active Hubs</p>
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
                  className="glass-input cursor-pointer dark:text-slate-300"
                >
                  <option value="">{t('filterCategory')}: All</option>
                  <option value="Crops">Crops</option>
                  <option value="Livestock">Livestock</option>
                </select>

                <select 
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="glass-input cursor-pointer dark:text-slate-300"
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
                  <span className="text-slate-500 font-bold">–</span>
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
              {products.filter(p => !p.hidden).map(prod => (
                <div key={prod.id} className="group glass-card rounded-2xl overflow-hidden hover:scale-[1.025] hover:shadow-2xl hover:shadow-teal-500/10 dark:hover:shadow-teal-500/5 transition-all duration-400 flex flex-col justify-between relative">
                  {/* Hover shimmer border */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(20,184,166,0.07) 0%, rgba(217,119,6,0.05) 100%)' }}></div>

                  {/* Product Image - FIXED: Using getLivestockImage function */}
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src={prod.imageUrl ? prod.imageUrl : (prod.category === 'Crops' ? coffeeImg : getLivestockImage(prod.type))} 
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
                      <span className="text-slate-500 dark:text-slate-400 text-[10px] font-bold flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Harvest: {prod.harvestDate}</span>
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors duration-300">{prod.name}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-xs line-clamp-2 mb-4 leading-relaxed">{prod.description}</p>
                    
                    <div className="space-y-1.5 mb-4">
                      <div className="flex items-center text-xs font-semibold text-slate-600 dark:text-slate-400">
                        <MapPin className="w-3.5 h-3.5 text-teal-500 mr-2" />
                        <span>Hub: {prod.location}</span>
                      </div>
                      <div className="flex items-center text-xs font-semibold text-slate-600 dark:text-slate-400">
                        <User className="w-3.5 h-3.5 text-amber-500 mr-2" />
                        <span>Farmer: {prod.farmerName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10 px-6 py-4 flex items-center justify-between" style={{ background: 'rgba(248,250,252,0.4)', backdropFilter: 'blur(8px)', borderTop: '1px solid rgba(203,213,225,0.3)' }}>
                    <div>
                      <span className="text-xl font-black text-slate-900 dark:text-white">{prod.price}</span>
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 ml-1">ETB/{prod.unit}</span>
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
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => {
                            if (!user) { setAuthModalOpen(true); return; }
                            const isInWishlist = wishlist.some(w => w.productId === prod.id);
                            if (isInWishlist) {
                              const wishlistItem = wishlist.find(w => w.productId === prod.id);
                              handleRemoveFromWishlist(wishlistItem.id);
                            } else {
                              handleAddToWishlist(prod);
                            }
                          }}
                          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 ${wishlist.some(w => w.productId === prod.id) ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'}`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${wishlist.some(w => w.productId === prod.id) ? 'fill-current' : ''}`} />
                        </button>
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
                      </div>
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
                        <span className="text-[10px] font-extrabold tracking-wider uppercase text-slate-500 dark:text-slate-400">
                          {bul.type === 'weather' ? t('weatherAlert') : bul.type === 'market' ? t('marketUpdate') : t('govAlert')}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">{bul.date}</span>
                      </div>
                      <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-2">{bul.title}</h3>
                      <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">{bul.content}</p>
                      
                      <div className="flex items-center text-xs font-semibold text-slate-500 dark:text-slate-400">
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

            {/* Admin Dashboard Sub-Navigation */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2 pb-4 border-b border-slate-200 dark:border-slate-800">
                <button 
                  onClick={() => setAdminDashboardSubTab('overview')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${adminDashboardSubTab === 'overview' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 'text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400'}`}
                >
                  Overview
                </button>
                <button 
                  onClick={() => setAdminDashboardSubTab('users')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${adminDashboardSubTab === 'users' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 'text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400'}`}
                >
                  User Management
                </button>
                <button 
                  onClick={() => setAdminDashboardSubTab('quality')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${adminDashboardSubTab === 'quality' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 'text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400'}`}
                >
                  Quality Control
                </button>
                <button 
                  onClick={() => setAdminDashboardSubTab('disputes')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${adminDashboardSubTab === 'disputes' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 'text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400'}`}
                >
                  Dispute Resolution
                </button>
                <button 
                  onClick={() => setAdminDashboardSubTab('system')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${adminDashboardSubTab === 'system' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 'text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400'}`}
                >
                  System Configuration
                </button>
              </div>
            </div>

            {/* Admin Analytics Overview - Only show on overview */}
            {adminDashboardSubTab === 'overview' && adminAnalytics && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="glass-card rounded-2xl p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl" style={{ background: 'rgba(99,102,241,0.12)' }}></div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Total Users</p>
                  <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">{adminAnalytics.users.total}</p>
                  <p className="text-[10px] text-indigo-500 dark:text-indigo-400 font-semibold mt-1">
                    {adminAnalytics.users.farmers} Farmers, {adminAnalytics.users.buyers} Buyers
                  </p>
                </div>
                <div className="glass-card rounded-2xl p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl" style={{ background: 'rgba(20,184,166,0.12)' }}></div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Total Products</p>
                  <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">{adminAnalytics.products.total}</p>
                  <p className="text-[10px] text-teal-500 dark:text-teal-400 font-semibold mt-1">
                    {adminAnalytics.products.crops} Crops, {adminAnalytics.products.livestock} Livestock
                  </p>
                </div>
                <div className="glass-card rounded-2xl p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl" style={{ background: 'rgba(217,119,6,0.12)' }}></div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Total Orders</p>
                  <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">{adminAnalytics.orders.total}</p>
                  <p className="text-[10px] text-amber-500 dark:text-amber-400 font-semibold mt-1">
                    {adminAnalytics.orders.paid} Paid · {adminAnalytics.orders.revenue} ETB Revenue
                  </p>
                </div>
                <div className="glass-card rounded-2xl p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl" style={{ background: 'rgba(239,68,68,0.12)' }}></div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Active Disputes</p>
                  <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">{disputes.length}</p>
                  <p className="text-[10px] text-red-500 dark:text-red-400 font-semibold mt-1">Require attention</p>
                </div>
              </div>
            )}

            {/* User Management Section - Only show on users sub-tab */}
            {adminDashboardSubTab === 'users' && (
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
                            <button 
                              onClick={async () => {
                                const res = await fetch(`/api/admin/users/${u.id}/approve`, {
                                  method: 'PUT',
                                  headers: { 'Authorization': `Bearer ${token}` }
                                });
                                if (res.ok) {
                                  fetchData();
                                  confetti({ particleCount: 30, spread: 40 });
                                }
                              }}
                              className="px-2.5 py-1.5 rounded bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold"
                            >
                              Approve
                            </button>
                          )}
                          {!u.suspended && u.role !== 'admin' && (
                            <button 
                              onClick={async () => {
                                const res = await fetch(`/api/admin/users/${u.id}/suspend`, {
                                  method: 'PUT',
                                  headers: { 'Authorization': `Bearer ${token}` }
                                });
                                if (res.ok) {
                                  fetchData();
                                }
                              }}
                              className="px-2.5 py-1.5 rounded bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold"
                            >
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
            )}

            {/* Quality Control Sub-tab */}
            {adminDashboardSubTab === 'quality' && (
              <div className="glass-card rounded-2xl p-6 mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Quality Audits</h3>
                  <button 
                    onClick={() => setAuditModalOpen(true)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Schedule Audit</span>
                  </button>
                </div>
                {qualityAudits.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <p>No quality audits scheduled</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {qualityAudits.map(audit => (
                      <div key={audit.id} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl flex justify-between items-center">
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white">{audit.target} - {audit.type}</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Scheduled: {audit.scheduledDate} | Status: {audit.status}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button onClick={() => handleDeleteQualityAudit(audit.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Dispute Resolution Sub-tab */}
            {adminDashboardSubTab === 'disputes' && (
              <div className="glass-card rounded-2xl p-6 mb-8">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Dispute Resolution</h3>
                {disputes.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <p>No active disputes</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {disputes.map(dispute => (
                      <div key={dispute.id} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-bold text-slate-900 dark:text-white">Dispute #{dispute.id}</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Type: {dispute.type} | Status: {dispute.status}</p>
                          </div>
                          {dispute.status !== 'resolved' && (
                            <button 
                              onClick={() => handleResolveDispute(dispute.id, { resolution: 'Resolved by admin', resolvedBy: user.name })}
                              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg"
                            >
                              Resolve
                            </button>
                          )}
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{dispute.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* System Configuration Sub-tab */}
            {adminDashboardSubTab === 'system' && (
              <div className="space-y-8">
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Payment Gateway Configuration</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">CBE Birr</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Commercial Bank of Ethiopia mobile payment</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${paymentConfig.cbeBirrEnabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {paymentConfig.cbeBirrEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">Telebirr</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Ethio Telecom mobile payment</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${paymentConfig.telebirrEnabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {paymentConfig.telebirrEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">Cash on Delivery</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Pay upon delivery option</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${paymentConfig.codEnabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {paymentConfig.codEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Audit Logs</h3>
                  {auditLogs.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">
                      <p>No audit logs available</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {auditLogs.map(log => (
                        <div key={log.id} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                          <p className="text-sm text-slate-600 dark:text-slate-400">{log.action} by {log.user} at {log.timestamp}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Recent Activity - Only show on overview */}
            {adminDashboardSubTab === 'overview' && adminAnalytics && (
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

            {/* Dashboard Sub-Navigation */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2 pb-4 border-b border-slate-200 dark:border-slate-800">
                <button 
                  onClick={() => setDashboardSubTab('overview')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${dashboardSubTab === 'overview' ? 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400' : 'text-slate-600 hover:text-teal-600 dark:text-slate-300 dark:hover:text-teal-400'}`}
                >
                  Overview
                </button>
                <button 
                  onClick={() => setDashboardSubTab('production')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${dashboardSubTab === 'production' ? 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400' : 'text-slate-600 hover:text-teal-600 dark:text-slate-300 dark:hover:text-teal-400'}`}
                >
                  Production & Inventory
                </button>
                <button 
                  onClick={() => setDashboardSubTab('quality')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${dashboardSubTab === 'quality' ? 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400' : 'text-slate-600 hover:text-teal-600 dark:text-slate-300 dark:hover:text-teal-400'}`}
                >
                  Quality & Certification
                </button>
                <button 
                  onClick={() => setDashboardSubTab('financial')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${dashboardSubTab === 'financial' ? 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400' : 'text-slate-600 hover:text-teal-600 dark:text-slate-300 dark:hover:text-teal-400'}`}
                >
                  Financial Tools
                </button>
                <button 
                  onClick={() => setDashboardSubTab('selling')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${dashboardSubTab === 'selling' ? 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400' : 'text-slate-600 hover:text-teal-600 dark:text-slate-300 dark:hover:text-teal-400'}`}
                >
                  Advanced Selling
                </button>
              </div>
            </div>

            {/* Header dashboard stats */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-5 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  {dashboardSubTab === 'overview' ? 'Sales Overview' : 
                   dashboardSubTab === 'production' ? 'Production & Inventory Management' :
                   dashboardSubTab === 'quality' ? 'Quality & Certification' :
                   dashboardSubTab === 'financial' ? 'Financial Tools' : 'Advanced Selling'}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                  {dashboardSubTab === 'overview' ? 'Track your product performance and order management' :
                   dashboardSubTab === 'production' ? 'Manage crop planning, inventory, equipment, and storage' :
                   dashboardSubTab === 'quality' ? 'Quality grading, certifications, and lab test management' :
                   dashboardSubTab === 'financial' ? 'Production costs, loans, insurance, and subsidies' : 'Auctions, contracts, and bulk selling options'}
                </p>
              </div>

              {dashboardSubTab === 'overview' && (
                <button 
                  onClick={() => setAddProductOpen(true)}
                  className="mt-4 md:mt-0 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl shadow-md shadow-teal-500/20 transition-all flex items-center space-x-2 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>List New Product</span>
                </button>
              )}
            </div>

            {/* ============ OVERVIEW SUB-TAB ============ */}
            {dashboardSubTab === 'overview' && (
              <div className="space-y-8">

                {/* KPI Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 flex flex-col gap-1 shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Total Orders</p>
                      <div className="w-8 h-8 rounded-xl bg-teal-500/10 flex items-center justify-center"><ShoppingBag className="w-4 h-4 text-teal-600" /></div>
                    </div>
                    <p className="text-3xl font-black text-slate-900 dark:text-white">{orders.length}</p>
                    <p className="text-[10px] text-teal-500 font-semibold">All time</p>
                  </div>
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 flex flex-col gap-1 shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Total Earnings</p>
                      <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center"><DollarSign className="w-4 h-4 text-amber-600" /></div>
                    </div>
                    <p className="text-2xl font-black text-amber-600 dark:text-amber-400">{orders.reduce((acc, o) => acc + (o.paymentStatus === 'paid' ? o.totalPrice : 0), 0).toLocaleString()} ETB</p>
                    <p className="text-[10px] text-amber-500 font-bold">Paid invoices only</p>
                  </div>
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 flex flex-col gap-1 shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Pending Orders</p>
                      <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center"><AlertTriangle className="w-4 h-4 text-orange-600" /></div>
                    </div>
                    <p className="text-3xl font-black text-slate-900 dark:text-white">{orders.filter(o => o.status === 'pending').length}</p>
                    <p className="text-[10px] text-orange-500 font-semibold">Awaiting action</p>
                  </div>
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 flex flex-col gap-1 shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Active Listings</p>
                      <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center"><Package className="w-4 h-4 text-indigo-600" /></div>
                    </div>
                    <p className="text-3xl font-black text-slate-900 dark:text-white">{products.filter(p => p.farmerId === user.id && !p.hidden).length}</p>
                    <p className="text-[10px] text-indigo-500 font-semibold">Visible in market</p>
                  </div>
                </div>

                {/* Charts row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-teal-500" />Monthly Sales Activity</h3>
                    <div className="h-52"><Line data={getFarmerSalesChartData()} options={{ responsive: true, maintainAspectRatio: false }} /></div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-amber-500" />Category Breakdown</h3>
                    <div className="h-52 flex justify-center"><Doughnut data={getCategoryBreakdownData()} options={{ responsive: true, maintainAspectRatio: false }} /></div>
                  </div>
                </div>

                {/* My Products Table */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2"><Package className="w-4 h-4 text-teal-500" />My Listings</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Manage, edit, hide, or delete your products</p>
                    </div>
                    <button onClick={() => setAddProductOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-all shrink-0">
                      <Plus className="w-3.5 h-3.5" /><span>Add Product</span>
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-[10px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40">
                          <th className="py-3 px-4">Product</th>
                          <th className="py-3 px-4 hidden sm:table-cell">Category</th>
                          <th className="py-3 px-4">Price</th>
                          <th className="py-3 px-4 hidden md:table-cell">Stock</th>
                          <th className="py-3 px-4 hidden lg:table-cell">Location</th>
                          <th className="py-3 px-4 text-center">Status</th>
                          <th className="py-3 px-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {products.filter(p => p.farmerId === user.id).length === 0 ? (
                          <tr><td colSpan="7" className="py-12 text-center text-slate-400 text-sm">No products listed yet. Click "Add Product" to start.</td></tr>
                        ) : (
                          products.filter(p => p.farmerId === user.id).map(prod => (
                            <tr key={prod.id} className={`transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40 ${prod.hidden ? 'opacity-50' : ''}`}>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800">
                                    <img src={prod.imageUrl ? prod.imageUrl : (prod.category === 'Crops' ? coffeeImg : getLivestockImage(prod.type))} alt={prod.name} className="w-full h-full object-cover" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{prod.name}</p>
                                    <p className="text-[10px] text-slate-400">{prod.type}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4 hidden sm:table-cell">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${prod.category === 'Crops' ? 'bg-teal-500/10 text-teal-700 dark:text-teal-400' : 'bg-amber-500/10 text-amber-700 dark:text-amber-400'}`}>{prod.category}</span>
                              </td>
                              <td className="py-3 px-4 text-sm font-bold text-slate-800 dark:text-slate-200">{prod.price?.toLocaleString()} ETB/{prod.unit}</td>
                              <td className="py-3 px-4 hidden md:table-cell text-sm text-slate-600 dark:text-slate-300">{prod.quantity} {prod.unit}</td>
                              <td className="py-3 px-4 hidden lg:table-cell text-xs text-slate-500 dark:text-slate-400">{prod.location}</td>
                              <td className="py-3 px-4 text-center">
                                {prod.hidden
                                  ? <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400">Hidden</span>
                                  : <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-green-500/10 text-green-700 dark:text-green-400">Live</span>
                                }
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center justify-center gap-1">
                                  <button onClick={() => handleOpenEdit(prod)} title="Edit" className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 transition-colors">
                                    <Pencil className="w-3.5 h-3.5" />
                                  </button>
                                  <button onClick={() => handleToggleVisibility(prod)} title={prod.hidden ? 'Show' : 'Hide'} className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors">
                                    {prod.hidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                  </button>
                                  <button onClick={() => handleDeleteProduct(prod.id)} title="Delete" className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-500 transition-colors">
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Orders Management */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2"><Truck className="w-4 h-4 text-teal-500" />Order Management</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Confirm, ship, deliver, or reject unpaid orders</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                        <AlertTriangle className="w-3 h-3" />{orders.filter(o => o.status === 'pending').length} Pending
                      </span>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-[10px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40">
                          <th className="py-3 px-4">Order</th>
                          <th className="py-3 px-4 hidden sm:table-cell">Buyer</th>
                          <th className="py-3 px-4">Total</th>
                          <th className="py-3 px-4">Payment</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                        {orders.length === 0 ? (
                          <tr><td colSpan="6" className="py-12 text-center text-slate-400 text-sm">No orders yet.</td></tr>
                        ) : (
                          orders.map(ord => (
                            <tr key={ord.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                              <td className="py-3 px-4">
                                <p className="font-bold text-slate-900 dark:text-white text-xs leading-tight">{ord.productName}</p>
                                <p className="text-[10px] text-slate-400 font-mono mt-0.5">{ord.id}</p>
                              </td>
                              <td className="py-3 px-4 hidden sm:table-cell text-slate-600 dark:text-slate-300">{ord.buyerName}</td>
                              <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">{ord.totalPrice?.toLocaleString()} ETB</td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                  ord.paymentStatus === 'paid' ? 'bg-teal-500/10 text-teal-700 dark:text-teal-400' : 'bg-red-500/10 text-red-600 dark:text-red-400'
                                }`}>
                                  {ord.paymentStatus === 'paid' ? '✓ Paid' : '✗ Unpaid'}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                  ord.status === 'delivered' ? 'bg-green-500/15 text-green-700' :
                                  ord.status === 'shipped'   ? 'bg-blue-500/15 text-blue-700' :
                                  ord.status === 'confirmed' ? 'bg-indigo-500/15 text-indigo-700' :
                                  ord.status === 'cancelled' ? 'bg-slate-200 text-slate-500' :
                                  'bg-orange-500/15 text-orange-700'
                                }`}>{ord.status}</span>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center justify-center gap-1 flex-wrap">
                                  <button onClick={() => setTrackingOrder(ord)} title="Track" className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors">
                                    <Truck className="w-3.5 h-3.5" />
                                  </button>
                                  {ord.status === 'pending' && (
                                    <button onClick={() => handleUpdateOrderStatus(ord.id, 'confirmed')} className="px-2 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-[10px] font-bold transition-colors">
                                      Confirm
                                    </button>
                                  )}
                                  {ord.status === 'confirmed' && (
                                    <button onClick={() => handleUpdateOrderStatus(ord.id, 'shipped')} className="px-2 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold transition-colors">
                                      Ship
                                    </button>
                                  )}
                                  {ord.status === 'shipped' && (
                                    <button onClick={() => handleUpdateOrderStatus(ord.id, 'delivered')} className="px-2 py-1 rounded-lg bg-green-600 hover:bg-green-700 text-white text-[10px] font-bold transition-colors">
                                      Delivered
                                    </button>
                                  )}
                                  {(ord.status === 'pending' || ord.status === 'confirmed') && ord.paymentStatus !== 'paid' && (
                                    <button onClick={() => handleRejectOrder(ord.id)} title="Reject (unpaid)" className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-500 transition-colors">
                                      <XCircle className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}


            {/* Production & Inventory Sub-tab */}

            {dashboardSubTab === 'production' && (
              <div className="space-y-8">
                {/* Crop Plans Section */}
                <div className="glass-card rounded-2xl p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Crop Planning & Scheduling</h3>
                    <button 
                      onClick={() => setCropPlanModalOpen(true)}
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Crop Plan</span>
                    </button>
                  </div>
                  {cropPlans.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">
                      <p>No crop plans created yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cropPlans.map(plan => (
                        <div key={plan.id} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl flex justify-between items-center">
                          <div>
                            <h4 className="font-bold text-slate-900 dark:text-white">{plan.cropType}</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Planting: {plan.plantingDate} | Harvest: {plan.harvestDate}</p>
                          </div>
                          <div className="flex space-x-2">
                            <button onClick={() => handleDeleteCropPlan(plan.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Inventory Section */}
                <div className="glass-card rounded-2xl p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Inventory Management</h3>
                    <button 
                      onClick={() => setInventoryModalOpen(true)}
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Inventory</span>
                    </button>
                  </div>
                  {inventoryItems.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">
                      <p>No inventory items tracked</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {inventoryItems.map(item => (
                        <div key={item.id} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl flex justify-between items-center">
                          <div>
                            <h4 className="font-bold text-slate-900 dark:text-white">{item.itemName}</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Quantity: {item.quantity} {item.unit} | Location: {item.location}</p>
                          </div>
                          <div className="flex space-x-2">
                            <button onClick={() => handleDeleteInventory(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Equipment Section */}
                <div className="glass-card rounded-2xl p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Equipment Tracking</h3>
                    <button 
                      onClick={() => setEquipmentModalOpen(true)}
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Equipment</span>
                    </button>
                  </div>
                  {equipmentList.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">
                      <p>No equipment tracked</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {equipmentList.map(equip => (
                        <div key={equip.id} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl flex justify-between items-center">
                          <div>
                            <h4 className="font-bold text-slate-900 dark:text-white">{equip.equipmentName}</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Status: {equip.status} | Last Maintenance: {equip.lastMaintenance}</p>
                          </div>
                          <div className="flex space-x-2">
                            <button onClick={() => handleDeleteEquipment(equip.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quality & Certification Sub-tab */}
            {dashboardSubTab === 'quality' && (
              <div className="space-y-8">
                {/* Quality Grades Section */}
                <div className="glass-card rounded-2xl p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Quality Grading</h3>
                    <button 
                      onClick={() => setQualityGradeModalOpen(true)}
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Quality Grade</span>
                    </button>
                  </div>
                  {qualityGrades.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">
                      <p>No quality grades recorded</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {qualityGrades.map(grade => (
                        <div key={grade.id} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl flex justify-between items-center">
                          <div>
                            <h4 className="font-bold text-slate-900 dark:text-white">{grade.productName} - Grade {grade.grade}</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Date: {grade.assessmentDate} | Inspector: {grade.inspector}</p>
                          </div>
                          <div className="flex space-x-2">
                            <button onClick={() => handleDeleteQualityGrade(grade.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Certifications Section */}
                <div className="glass-card rounded-2xl p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Certifications</h3>
                    <button 
                      onClick={() => setCertificationModalOpen(true)}
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Certification</span>
                    </button>
                  </div>
                  {certifications.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">
                      <p>No certifications recorded</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {certifications.map(cert => (
                        <div key={cert.id} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl flex justify-between items-center">
                          <div>
                            <h4 className="font-bold text-slate-900 dark:text-white">{cert.certificationName}</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Issued: {cert.issueDate} | Expires: {cert.expiryDate}</p>
                          </div>
                          <div className="flex space-x-2">
                            <button onClick={() => handleDeleteCertification(cert.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Financial Tools Sub-tab */}
            {dashboardSubTab === 'financial' && (
              <div className="space-y-8">
                {/* Loan Applications Section */}
                <div className="glass-card rounded-2xl p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Loan Applications</h3>
                    <button 
                      onClick={() => setLoanModalOpen(true)}
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Apply for Loan</span>
                    </button>
                  </div>
                  {loanApplications.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">
                      <p>No loan applications submitted</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {loanApplications.map(loan => (
                        <div key={loan.id} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl flex justify-between items-center">
                          <div>
                            <h4 className="font-bold text-slate-900 dark:text-white">{loan.loanType} - {loan.amount} ETB</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">Status: {loan.status} | Applied: {loan.applicationDate}</p>
                          </div>
                          <div className="flex space-x-2">
                            <button onClick={() => handleDeleteLoanApplication(loan.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Production Costs Section */}
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Production Cost Calculator</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                      <p className="text-sm text-slate-600 dark:text-slate-400">Seed Costs</p>
                      <p className="text-xl font-bold text-slate-900 dark:text-white">0 ETB</p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                      <p className="text-sm text-slate-600 dark:text-slate-400">Fertilizer Costs</p>
                      <p className="text-xl font-bold text-slate-900 dark:text-white">0 ETB</p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                      <p className="text-sm text-slate-600 dark:text-slate-400">Labor Costs</p>
                      <p className="text-xl font-bold text-slate-900 dark:text-white">0 ETB</p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                      <p className="text-sm text-slate-600 dark:text-slate-400">Equipment Costs</p>
                      <p className="text-xl font-bold text-slate-900 dark:text-white">0 ETB</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Advanced Selling Sub-tab */}
            {dashboardSubTab === 'selling' && (
              <div className="space-y-8">
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Advanced Selling Options</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700">
                      <h4 className="font-bold text-slate-900 dark:text-white mb-2">Auction/Bidding</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">List products for competitive bidding</p>
                      <button className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl">
                        Start Auction
                      </button>
                    </div>
                    <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700">
                      <h4 className="font-bold text-slate-900 dark:text-white mb-2">Contract Farming</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Secure advance bookings with buyers</p>
                      <button className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl">
                        Create Contract
                      </button>
                    </div>
                    <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700">
                      <h4 className="font-bold text-slate-900 dark:text-white mb-2">Bulk Discounts</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Set volume-based pricing tiers</p>
                      <button className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl">
                        Configure Discounts
                      </button>
                    </div>
                    <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700">
                      <h4 className="font-bold text-slate-900 dark:text-white mb-2">Pre-Harvest Sales</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Sell before harvest for guaranteed income</p>
                      <button className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl">
                        List Pre-Sale
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Chart Widgets - Only show on overview */}
            {dashboardSubTab === 'overview' && (
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
            )}

            {/* Active Orders List - Only show on overview */}
            {dashboardSubTab === 'overview' && (
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
                          {user.role === 'buyer' && ord.status === 'pending' && ord.paymentStatus !== 'paid' && (
                            <button 
                              onClick={() => handleUpdateOrderStatus(ord.id, 'cancelled')}
                              className="px-2.5 py-1.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/50 text-xs font-bold"
                            >
                              Cancel
                            </button>
                          )}
                          {user.role === 'buyer' && ord.status === 'delivered' && !supplierReviews.some(r => r.orderId === ord.id) && (
                            <button 
                              onClick={() => {
                                setReviewOrderId(ord.id);
                                setReviewFarmerId(ord.farmerId);
                                setReviewFarmerName(ord.farmerName);
                                setReviewModalOpen(true);
                              }}
                              className="px-2.5 py-1.5 rounded bg-amber-50 hover:bg-amber-100 text-amber-600 border border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50 text-xs font-bold"
                            >
                              Review
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
            )}
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

            {/* Buyer Dashboard Sub-Navigation */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2 pb-4 border-b border-slate-200 dark:border-slate-800">
                <button 
                  onClick={() => setBuyerDashboardSubTab('overview')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${buyerDashboardSubTab === 'overview' ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'text-slate-600 hover:text-amber-600 dark:text-slate-300 dark:hover:text-amber-400'}`}
                >
                  Overview
                </button>
                <button 
                  onClick={() => setBuyerDashboardSubTab('wishlist')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${buyerDashboardSubTab === 'wishlist' ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'text-slate-600 hover:text-amber-600 dark:text-slate-300 dark:hover:text-amber-400'}`}
                >
                  Wishlist
                </button>
                <button 
                  onClick={() => setBuyerDashboardSubTab('reviews')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${buyerDashboardSubTab === 'reviews' ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'text-slate-600 hover:text-amber-600 dark:text-slate-300 dark:hover:text-amber-400'}`}
                >
                  Supplier Reviews
                </button>
                <button 
                  onClick={() => setBuyerDashboardSubTab('financial')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${buyerDashboardSubTab === 'financial' ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'text-slate-600 hover:text-amber-600 dark:text-slate-300 dark:hover:text-amber-400'}`}
                >
                  Financial Management
                </button>
              </div>
            </div>

            {/* Header dashboard stats */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-5 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  {buyerDashboardSubTab === 'overview' ? 'Purchase Overview' : 
                   buyerDashboardSubTab === 'wishlist' ? 'My Wishlist' :
                   buyerDashboardSubTab === 'reviews' ? 'Supplier Reviews' : 'Financial Management'}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                  {buyerDashboardSubTab === 'overview' ? 'Your agricultural procurement summary' :
                   buyerDashboardSubTab === 'wishlist' ? 'Save products for later purchase' :
                   buyerDashboardSubTab === 'reviews' ? 'Rate and review your suppliers' : 'Manage budgets, invoices, and expenses'}
                </p>
              </div>
            </div>

            {/* Dashboard grid metrics cards — Glass - Only show on overview */}
            {buyerDashboardSubTab === 'overview' && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="glass-card rounded-2xl p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl" style={{ background: 'rgba(20,184,166,0.12)' }}></div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Total Orders</p>
                  <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">{orders.length}</p>
                  <p className="text-[10px] text-teal-500 dark:text-teal-400 font-semibold mt-1">All time purchases</p>
                </div>
              <div className="glass-card rounded-2xl p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl" style={{ background: 'rgba(217,119,6,0.12)' }}></div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Total Spent</p>
                <p className="text-3xl font-black bg-gradient-to-r from-amber-600 to-amber-800 dark:from-amber-300 dark:to-amber-500 bg-clip-text text-transparent mt-1">
                  {orders.reduce((acc, o) => acc + (o.paymentStatus === 'paid' ? o.totalPrice : 0), 0)} ETB
                </p>
                <p className="text-[10px] text-amber-500 dark:text-amber-400 font-bold mt-1">Paid orders only</p>
              </div>
              <div className="glass-card rounded-2xl p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl" style={{ background: 'rgba(99,102,241,0.12)' }}></div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">CBE Birr Payments</p>
                <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                  {orders.filter(o => o.paymentMethod === 'CBE_BIRR').length}
                </p>
                <p className="text-[10px] text-indigo-500 dark:text-indigo-400 font-semibold mt-1">Mobile transfers</p>
              </div>
              <div className="glass-card rounded-2xl p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl" style={{ background: 'rgba(20,184,166,0.1)' }}></div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Pending Orders</p>
                <p className="text-xl font-black text-amber-600 dark:text-amber-400 mt-2 flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  <span>{orders.filter(o => o.status === 'pending').length} Awaiting</span>
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-1">Processing orders</p>
              </div>
              </div>
            )}

            {/* Wishlist Sub-tab */}
            {buyerDashboardSubTab === 'wishlist' && (
              <div className="glass-card rounded-2xl p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">My Wishlist</h3>
                {wishlist.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <p>No items in your wishlist</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlist.map(item => (
                      <div key={item.id} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                        <h4 className="font-bold text-slate-900 dark:text-white">{item.productName}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{item.price} ETB</p>
                        <button 
                          onClick={() => handleRemoveFromWishlist(item.id)}
                          className="mt-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Reviews Sub-tab */}
            {buyerDashboardSubTab === 'reviews' && (
              <div className="glass-card rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Supplier Reviews</h3>
                  <button 
                    onClick={() => setReviewModalOpen(true)}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm rounded-xl flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Review</span>
                  </button>
                </div>
                {supplierReviews.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <p>No reviews submitted yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {supplierReviews.map(review => (
                      <div key={review.id} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl flex justify-between items-center">
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white">{review.supplierName}</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Rating: {review.rating}/5 | {review.date}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{review.comment}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button onClick={() => handleDeleteReview(review.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Financial Sub-tab */}
            {buyerDashboardSubTab === 'financial' && (
              <div className="space-y-8">
                <div className="glass-card rounded-2xl p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Budget Management</h3>
                    <button 
                      onClick={() => setBudgetModalOpen(true)}
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Set Budget</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                      <p className="text-sm text-slate-600 dark:text-slate-400">Monthly Budget</p>
                      <p className="text-xl font-bold text-slate-900 dark:text-white">
                        {buyerBudgets.length > 0 ? buyerBudgets[0].amount + ' ETB' : '0 ETB'}
                      </p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                      <p className="text-sm text-slate-600 dark:text-slate-400">Spent This Month</p>
                      <p className="text-xl font-bold text-slate-900 dark:text-white">
                        {orders.filter(o => o.paymentStatus === 'paid').reduce((sum, o) => sum + o.totalPrice, 0)} ETB
                      </p>
                    </div>
                  </div>
                </div>
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Invoice Management</h3>
                  {orders.filter(o => o.paymentStatus === 'paid').length === 0 ? (
                    <div className="text-center py-8 text-slate-400">
                      <p>No invoices available</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.filter(o => o.paymentStatus === 'paid').map(order => (
                        <div key={order.id} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl flex justify-between items-center">
                          <div>
                            <h4 className="font-bold text-slate-900 dark:text-white">Invoice #{order.id}</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {order.productName} | {order.quantity} {order.productUnit} | {order.totalPrice} ETB
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-500">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${order.status === 'delivered' ? 'bg-green-500/15 text-green-600' : 'bg-amber-500/15 text-amber-600'}`}>
                            {order.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Chart Widgets - Only show on overview */}
            {buyerDashboardSubTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              <div className="lg:col-span-2 glass-card rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full blur-3xl" style={{ background: 'rgba(217,119,6,0.1)' }}></div>
                <h3 className="text-md font-bold mb-4 flex items-center">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/15 flex items-center justify-center mr-2">
                    <TrendingUp className="w-4 h-4 text-amber-500" />
                  </div>
                  <span className="text-slate-900 dark:text-slate-100">Purchase History by Category</span>
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
                  <span className="text-slate-900 dark:text-slate-100">Purchase by Location</span>
                </h3>
                <div className="space-y-3">
                  {['Alem Maya', 'Babille', 'Harar City'].map(location => {
                    const locationOrders = orders.filter(o => o.productLocation === location);
                    const locationTotal = locationOrders.reduce((sum, o) => sum + o.totalPrice, 0);
                    return (
                      <div key={location} className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{location}</span>
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{locationTotal} ETB</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            )}

            {/* Active Orders List - Only show on overview */}
            {buyerDashboardSubTab === 'overview' && (
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
            )}
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
                <div className="flex space-x-2 p-1 bg-slate-100 dark:bg-slate-950 rounded-xl mb-2">
                  {authMode === 'register' && (
                    <>
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
                    </>
                  )}
                  {authMode === 'login' && (
                    <>
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
                      <button 
                        type="button"
                        onClick={() => setAuthRole('admin')}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${authRole === 'admin' ? 'bg-white dark:bg-slate-900 shadow-sm text-indigo-700 dark:text-indigo-400' : 'text-slate-500'}`}
                      >
                        Admin
                      </button>
                    </>
                  )}
                </div>

                {authMode === 'register' && (
                  <>
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

      {/* MODAL: Edit Product (Farmer only) */}
      {editProductOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
          <div className="w-full max-w-md overflow-y-auto max-h-[90vh] relative bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-3xl shadow-2xl shadow-slate-900/20">
            <button onClick={() => setEditProductOpen(false)} className="absolute right-4 top-4 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-500 transition-colors z-10">
              <X className="w-4 h-4" />
            </button>
            <div className="px-6 py-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center"><Pencil className="w-5 h-5 text-blue-600" /></div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">Edit Product</h3>
                  <p className="text-xs text-slate-400">Update your listing details</p>
                </div>
              </div>
              {editProdFormError && (<div className="mb-4 p-3 rounded-lg bg-red-500/15 border border-red-500/20 text-red-600 text-xs font-bold">{editProdFormError}</div>)}
              <form onSubmit={handleUpdateProduct} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Product Title</label>
                  <input type="text" required value={editProdName} onChange={e => setEditProdName(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Category</label>
                    <select value={editProdCategory} onChange={e => setEditProdCategory(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none cursor-pointer">
                      <option value="Crops">Crops</option>
                      <option value="Livestock">Livestock</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Crop/Breed Type</label>
                    <input type="text" required value={editProdType} onChange={e => setEditProdType(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Unit Price (ETB)</label>
                    <input type="number" required value={editProdPrice} onChange={e => setEditProdPrice(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Unit</label>
                    <input type="text" required value={editProdUnit} onChange={e => setEditProdUnit(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Quantity Stock</label>
                    <input type="number" required value={editProdQty} onChange={e => setEditProdQty(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Harvest Date</label>
                    <input type="date" required value={editProdHarvestDate} onChange={e => setEditProdHarvestDate(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none cursor-pointer" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Location / Hub Point</label>
                  <input type="text" required value={editProdLocation} onChange={e => setEditProdLocation(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Replace Image (optional)</label>
                  <input type="file" accept="image/*" onChange={e => setEditProdImage(e.target.files[0])} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs focus:outline-none" />
                  {editingProduct.imageUrl && !editProdImage && (
                    <div className="mt-2 flex items-center gap-2">
                      <img src={editingProduct.imageUrl} alt="current" className="w-12 h-12 rounded-lg object-cover border border-slate-200" />
                      <p className="text-[10px] text-slate-400">Current image — upload a new one to replace</p>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Short Description</label>
                  <textarea value={editProdDesc} onChange={e => setEditProdDesc(e.target.value)} rows="3" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="flex justify-end pt-2 space-x-2">
                  <button type="button" onClick={() => setEditProductOpen(false)} className="px-4 py-2.5 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold text-xs rounded-xl">Cancel</button>
                  <button type="submit" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Add Product Modal (Farmer only) */}
      {addProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
          <div className="w-full max-w-md overflow-y-auto max-h-[90vh] relative bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-3xl shadow-2xl shadow-slate-900/20">
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
                  <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Product Image</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setNewProdImage(e.target.files[0])}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-650 dark:text-slate-450"
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

      {/* MODAL: Budget Modal */}
      {budgetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
          <div className="w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in-95 duration-200" style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '24px', boxShadow: '0 25px 60px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.6)' }}>
            <button 
              onClick={() => setBudgetModalOpen(false)}
              className="absolute right-4.5 top-4.5 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="px-6 py-8">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white text-center mb-6">
                Set Monthly Budget
              </h3>

              <form onSubmit={async (e) => {
                e.preventDefault();
                const newBudget = {
                  id: 'budget_' + Date.now(),
                  buyerId: user.id,
                  amount: parseInt(budgetAmount),
                  month: new Date().toISOString().slice(0, 7),
                  createdAt: new Date().toISOString()
                };
                setBuyerBudgets([...buyerBudgets, newBudget]);
                setBudgetModalOpen(false);
                setBudgetAmount('');
                confetti({ particleCount: 30, spread: 40 });
              }} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Budget Amount (ETB)</label>
                  <input
                    type="number"
                    value={budgetAmount}
                    onChange={(e) => setBudgetAmount(e.target.value)}
                    required
                    placeholder="e.g. 50000"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="flex justify-end pt-4 space-x-2">
                  <button 
                    type="button" 
                    onClick={() => setBudgetModalOpen(false)}
                    className="px-4.5 py-2.5 border border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-450 font-bold text-xs rounded-xl"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md shadow-teal-500/20 transition-all"
                  >
                    Set Budget
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Supplier Review Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
          <div className="w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in-95 duration-200" style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '24px', boxShadow: '0 25px 60px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.6)' }}>
            <button 
              onClick={() => setReviewModalOpen(false)}
              className="absolute right-4.5 top-4.5 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="px-6 py-8">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white text-center mb-6">
                Review Supplier
              </h3>

              <form onSubmit={async (e) => {
                e.preventDefault();
                await handleAddSupplierReview({
                  orderId: reviewOrderId,
                  farmerId: reviewFarmerId,
                  farmerName: reviewFarmerName,
                  rating: reviewRating,
                  comment: reviewComment
                });
                setReviewModalOpen(false);
                setReviewRating(5);
                setReviewComment('');
              }} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Farmer: {reviewFarmerName}</label>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-2">Rating</label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className={`text-2xl ${star <= reviewRating ? 'text-amber-500' : 'text-slate-300'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Your Review</label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows="4"
                    required
                    placeholder="Share your experience with this supplier..."
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                  ></textarea>
                </div>

                <div className="flex justify-end pt-4 space-x-2">
                  <button 
                    type="button" 
                    onClick={() => setReviewModalOpen(false)}
                    className="px-4.5 py-2.5 border border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-450 font-bold text-xs rounded-xl"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md shadow-teal-500/20 transition-all"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Crop Plan Modal */}
      {cropPlanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
          <div className="w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in-95 duration-200" style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '24px', boxShadow: '0 25px 60px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.6)' }}>
            <button onClick={() => setCropPlanModalOpen(false)} className="absolute right-4.5 top-4.5 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 transition-colors"><X className="w-4 h-4" /></button>
            <div className="px-6 py-8">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white text-center mb-6">Add Crop Plan</h3>
              <form onSubmit={async (e) => { e.preventDefault(); await handleAddCropPlan({ cropName: e.target.cropName.value, plantingDate: e.target.plantingDate.value, expectedHarvest: e.target.expectedHarvest.value, area: e.target.area.value }); setCropPlanModalOpen(false); }} className="space-y-4">
                <div><label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Crop Name</label><input name="cropName" required className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="e.g. Coffee" /></div>
                <div><label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Planting Date</label><input name="plantingDate" type="date" required className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500" /></div>
                <div><label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Expected Harvest</label><input name="expectedHarvest" type="date" required className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500" /></div>
                <div><label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Area (hectares)</label><input name="area" type="number" required className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="e.g. 5" /></div>
                <div className="flex justify-end pt-4 space-x-2"><button type="button" onClick={() => setCropPlanModalOpen(false)} className="px-4.5 py-2.5 border border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-450 font-bold text-xs rounded-xl">Cancel</button><button type="submit" className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md shadow-teal-500/20 transition-all">Add Plan</button></div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Inventory Modal */}
      {inventoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
          <div className="w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in-95 duration-200" style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '24px', boxShadow: '0 25px 60px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.6)' }}>
            <button onClick={() => setInventoryModalOpen(false)} className="absolute right-4.5 top-4.5 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 transition-colors"><X className="w-4 h-4" /></button>
            <div className="px-6 py-8">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white text-center mb-6">Add Inventory Item</h3>
              <form onSubmit={async (e) => { e.preventDefault(); await handleAddInventory({ itemName: e.target.itemName.value, quantity: e.target.quantity.value, unit: e.target.unit.value, location: e.target.location.value }); setInventoryModalOpen(false); }} className="space-y-4">
                <div><label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Item Name</label><input name="itemName" required className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="e.g. Coffee Beans" /></div>
                <div><label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Quantity</label><input name="quantity" type="number" required className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="e.g. 500" /></div>
                <div><label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Unit</label><input name="unit" required className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="e.g. kg" /></div>
                <div><label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Location</label><input name="location" required className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="e.g. Warehouse A" /></div>
                <div className="flex justify-end pt-4 space-x-2"><button type="button" onClick={() => setInventoryModalOpen(false)} className="px-4.5 py-2.5 border border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-450 font-bold text-xs rounded-xl">Cancel</button><button type="submit" className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md shadow-teal-500/20 transition-all">Add Item</button></div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Equipment Modal */}
      {equipmentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
          <div className="w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in-95 duration-200" style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '24px', boxShadow: '0 25px 60px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.6)' }}>
            <button onClick={() => setEquipmentModalOpen(false)} className="absolute right-4.5 top-4.5 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 transition-colors"><X className="w-4 h-4" /></button>
            <div className="px-6 py-8">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white text-center mb-6">Add Equipment</h3>
              <form onSubmit={async (e) => { e.preventDefault(); await handleAddEquipment({ equipmentName: e.target.equipmentName.value, type: e.target.type.value, status: e.target.status.value, purchaseDate: e.target.purchaseDate.value }); setEquipmentModalOpen(false); }} className="space-y-4">
                <div><label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Equipment Name</label><input name="equipmentName" required className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="e.g. Tractor" /></div>
                <div><label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Type</label><input name="type" required className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="e.g. Heavy Machinery" /></div>
                <div><label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Status</label><select name="status" required className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"><option value="operational">Operational</option><option value="maintenance">Under Maintenance</option><option value="retired">Retired</option></select></div>
                <div><label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Purchase Date</label><input name="purchaseDate" type="date" required className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500" /></div>
                <div className="flex justify-end pt-4 space-x-2"><button type="button" onClick={() => setEquipmentModalOpen(false)} className="px-4.5 py-2.5 border border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-450 font-bold text-xs rounded-xl">Cancel</button><button type="submit" className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md shadow-teal-500/20 transition-all">Add Equipment</button></div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Quality Grade Modal */}
      {qualityGradeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
          <div className="w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in-95 duration-200" style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '24px', boxShadow: '0 25px 60px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.6)' }}>
            <button onClick={() => setQualityGradeModalOpen(false)} className="absolute right-4.5 top-4.5 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 transition-colors"><X className="w-4 h-4" /></button>
            <div className="px-6 py-8">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white text-center mb-6">Add Quality Grade</h3>
              <form onSubmit={async (e) => { e.preventDefault(); await handleAddQualityGrade({ productName: e.target.productName.value, grade: e.target.grade.value, criteria: e.target.criteria.value, testDate: e.target.testDate.value }); setQualityGradeModalOpen(false); }} className="space-y-4">
                <div><label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Product Name</label><input name="productName" required className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="e.g. Coffee Grade 1" /></div>
                <div><label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Grade</label><input name="grade" required className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="e.g. A" /></div>
                <div><label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Criteria</label><textarea name="criteria" required className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="Quality criteria..."></textarea></div>
                <div><label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Test Date</label><input name="testDate" type="date" required className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500" /></div>
                <div className="flex justify-end pt-4 space-x-2"><button type="button" onClick={() => setQualityGradeModalOpen(false)} className="px-4.5 py-2.5 border border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-450 font-bold text-xs rounded-xl">Cancel</button><button type="submit" className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md shadow-teal-500/20 transition-all">Add Grade</button></div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Certification Modal */}
      {certificationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
          <div className="w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in-95 duration-200" style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '24px', boxShadow: '0 25px 60px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.6)' }}>
            <button onClick={() => setCertificationModalOpen(false)} className="absolute right-4.5 top-4.5 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 transition-colors"><X className="w-4 h-4" /></button>
            <div className="px-6 py-8">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white text-center mb-6">Add Certification</h3>
              <form onSubmit={async (e) => { e.preventDefault(); await handleAddCertification({ certName: e.target.certName.value, issuingBody: e.target.issuingBody.value, issueDate: e.target.issueDate.value, expiryDate: e.target.expiryDate.value }); setCertificationModalOpen(false); }} className="space-y-4">
                <div><label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Certification Name</label><input name="certName" required className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="e.g. Organic Certification" /></div>
                <div><label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Issuing Body</label><input name="issuingBody" required className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="e.g. Ministry of Agriculture" /></div>
                <div><label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Issue Date</label><input name="issueDate" type="date" required className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500" /></div>
                <div><label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Expiry Date</label><input name="expiryDate" type="date" required className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500" /></div>
                <div className="flex justify-end pt-4 space-x-2"><button type="button" onClick={() => setCertificationModalOpen(false)} className="px-4.5 py-2.5 border border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-450 font-bold text-xs rounded-xl">Cancel</button><button type="submit" className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md shadow-teal-500/20 transition-all">Add Certification</button></div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Loan Modal */}
      {loanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
          <div className="w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in-95 duration-200" style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '24px', boxShadow: '0 25px 60px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.6)' }}>
            <button onClick={() => setLoanModalOpen(false)} className="absolute right-4.5 top-4.5 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 transition-colors"><X className="w-4 h-4" /></button>
            <div className="px-6 py-8">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white text-center mb-6">Apply for Loan</h3>
              <form onSubmit={async (e) => { e.preventDefault(); await handleAddLoanApplication({ loanType: e.target.loanType.value, amount: e.target.amount.value, purpose: e.target.purpose.value, term: e.target.term.value }); setLoanModalOpen(false); }} className="space-y-4">
                <div><label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Loan Type</label><select name="loanType" required className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"><option value="production">Production Loan</option><option value="equipment">Equipment Loan</option><option value="operational">Operational Loan</option></select></div>
                <div><label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Amount (ETB)</label><input name="amount" type="number" required className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="e.g. 100000" /></div>
                <div><label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Purpose</label><textarea name="purpose" required className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="Loan purpose..."></textarea></div>
                <div><label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Term (months)</label><input name="term" type="number" required className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="e.g. 12" /></div>
                <div className="flex justify-end pt-4 space-x-2"><button type="button" onClick={() => setLoanModalOpen(false)} className="px-4.5 py-2.5 border border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-450 font-bold text-xs rounded-xl">Cancel</button><button type="submit" className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md shadow-teal-500/20 transition-all">Submit Application</button></div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Audit Modal */}
      {auditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
          <div className="w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in-95 duration-200" style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '24px', boxShadow: '0 25px 60px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.6)' }}>
            <button onClick={() => setAuditModalOpen(false)} className="absolute right-4.5 top-4.5 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 transition-colors"><X className="w-4 h-4" /></button>
            <div className="px-6 py-8">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white text-center mb-6">Schedule Quality Audit</h3>
              <form onSubmit={async (e) => { e.preventDefault(); await handleAddQualityAudit({ target: e.target.target.value, type: e.target.type.value, scheduledDate: e.target.scheduledDate.value, auditor: e.target.auditor.value }); setAuditModalOpen(false); }} className="space-y-4">
                <div><label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Target (Farmer/Product)</label><input name="target" required className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="e.g. Farmer John" /></div>
                <div><label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Audit Type</label><select name="type" required className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"><option value="quality">Quality Check</option><option value="safety">Safety Inspection</option><option value="compliance">Compliance Audit</option></select></div>
                <div><label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Scheduled Date</label><input name="scheduledDate" type="date" required className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500" /></div>
                <div><label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Auditor</label><input name="auditor" required className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="e.g. Audit Team A" /></div>
                <div className="flex justify-end pt-4 space-x-2"><button type="button" onClick={() => setAuditModalOpen(false)} className="px-4.5 py-2.5 border border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-450 font-bold text-xs rounded-xl">Cancel</button><button type="submit" className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-500/20 transition-all">Schedule Audit</button></div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Dispute Resolution Modal */}
      {disputeResolutionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
          <div className="w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in-95 duration-200" style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '24px', boxShadow: '0 25px 60px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.6)' }}>
            <button onClick={() => setDisputeResolutionModalOpen(false)} className="absolute right-4.5 top-4.5 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 transition-colors"><X className="w-4 h-4" /></button>
            <div className="px-6 py-8">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white text-center mb-6">Resolve Dispute</h3>
              <form onSubmit={async (e) => { e.preventDefault(); await handleResolveDispute(disputeResolutionModalOpen, e.target.resolution.value); setDisputeResolutionModalOpen(false); }} className="space-y-4">
                <div><label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Resolution</label><textarea name="resolution" required className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="Resolution details..."></textarea></div>
                <div className="flex justify-end pt-4 space-x-2"><button type="button" onClick={() => setDisputeResolutionModalOpen(false)} className="px-4.5 py-2.5 border border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-450 font-bold text-xs rounded-xl">Cancel</button><button type="submit" className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-500/20 transition-all">Resolve</button></div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
