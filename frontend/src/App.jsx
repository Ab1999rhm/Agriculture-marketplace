import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./i18n";
import confetti from "canvas-confetti";
import {
  ShoppingBag,
  Bell,
  ChevronRight,
  LogOut,
  LogIn,
  Sun,
  Moon,
  CloudRain,
  Menu,
  X,
  User,
  Languages,
  ChevronDown,
} from "lucide-react";
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
  Filler,
} from "chart.js";

// Assets
import cropsBg from "./assets/crops-bg.jpg";
import heroBeautiful from "./assets/hero-beautiful.jpg";
import coffeeImg from "./assets/coffee-beans.jpg";
import cattleImg from "./assets/cattle.jpg";
import sheepImg from "./assets/sheep.jpg";

// Hooks
import { useFarmerHandlers } from "./hooks/useFarmerHandlers";
import { useProductHandlers } from "./hooks/useProductHandlers";
import { useBuyerHandlers } from "./hooks/useBuyerHandlers";
import { useAdminHandlers } from "./hooks/useAdminHandlers";

// Pages
import MarketPage from "./pages/MarketPage";
import BulletinsPage from "./pages/BulletinsPage";
import AdminDashboard from "./pages/AdminDashboard";
import FarmerDashboard from "./pages/FarmerDashboard";
import BuyerDashboard from "./pages/BuyerDashboard";
import ProfilePage from "./pages/ProfilePage";

// Modals
import AuthModal from "./components/modals/AuthModal";
import CheckoutModal from "./components/modals/CheckoutModal";
import OTPModal from "./components/modals/OTPModal";
import TrackingModal from "./components/modals/TrackingModal";
import {
  AddProductModal,
  EditProductModal,
} from "./components/modals/ProductModals";
import { BudgetModal, ReviewModal } from "./components/modals/BuyerModals";
import DisputeModal from "./components/modals/DisputeModal";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const getLivestockImage = (type) => {
  const map = {
    Cattle: cattleImg,
    Sheep: sheepImg,
    Goat: sheepImg,
    Bull: cattleImg,
    Cow: cattleImg,
    Calf: cattleImg,
    Lamb: sheepImg,
    Ram: sheepImg,
  };
  return map[type] || cattleImg;
};

export default function App() {
  const { t, i18n } = useTranslation();

  // ── Theme
  const [dark, setDark] = useState(
    () => localStorage.getItem("theme") === "dark",
  );
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    document.body.style.overflow = mobileNavOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileNavOpen]);

  // ── Auth
  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem("user")) || null,
  );
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authRole, setAuthRole] = useState("buyer");
  const [authPhone, setAuthPhone] = useState("");
  const [authLocation, setAuthLocation] = useState("");
  const [authFarmName, setAuthFarmName] = useState("");
  const [authFarmSize, setAuthFarmSize] = useState("");
  const [authCrops, setAuthCrops] = useState("");
  const [authBusinessName, setAuthBusinessName] = useState("");
  const [authBusinessType, setAuthBusinessType] = useState("retailer");
  const [authConfirmPassword, setAuthConfirmPassword] = useState("");
  const [authLicenseFile, setAuthLicenseFile] = useState(null);
  const [authNationalIdFile, setAuthNationalIdFile] = useState(null);
  const [authError, setAuthError] = useState("");

  // ── Navigation
  const [currentTab, setCurrentTab] = useState("market");
  const [dashboardSubTab, setDashboardSubTab] = useState("overview");
  const [buyerDashboardSubTab, setBuyerDashboardSubTab] = useState("overview");
  const [adminDashboardSubTab, setAdminDashboardSubTab] = useState("overview");
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [currentTab, user]);

  // ── Catalog
  const [products, setProducts] = useState([]);
  const [bulletins, setBulletins] = useState([]);
  const [orders, setOrders] = useState([]);
  const [paymentConfig, setPaymentConfig] = useState({
    cbeBirrEnabled: true,
    telebirrEnabled: false,
    codEnabled: true,
  });
  const [marketQualityGrades, setMarketQualityGrades] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // ── Admin
  const [allUsers, setAllUsers] = useState([]);
  const [adminAnalytics, setAdminAnalytics] = useState(null);
  const [disputes, setDisputes] = useState([]);
  const [qualityAudits, setQualityAudits] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  // ── Farmer
  const [cropPlans, setCropPlans] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);
  const [storageFacilities, setStorageFacilities] = useState([]);
  const [batchLots, setBatchLots] = useState([]);
  const [qualityGrades, setQualityGrades] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [labTests, setLabTests] = useState([]);
  const [loanApplications, setLoanApplications] = useState([]);
  const [productionCosts, setProductionCosts] = useState([]);
  const [insurancePolicies, setInsurancePolicies] = useState([]);
  const [subsidyApplications, setSubsidyApplications] = useState([]);
  const [auctionBids, setAuctionBids] = useState([]);
  const [contractFarming, setContractFarming] = useState([]);
  const [bulkDiscounts, setBulkDiscounts] = useState([]);
  const [advanceBookings, setAdvanceBookings] = useState([]);

  // ── Buyer
  const [wishlist, setWishlist] = useState([]);
  const [supplierReviews, setSupplierReviews] = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  const [buyerBudgets, setBuyerBudgets] = useState([]);

  // ── Profile
  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileLocation, setProfileLocation] = useState("");
  const [profileBio, setProfileBio] = useState("");
  const [profileCrops, setProfileCrops] = useState("");
  const [profileCoords, setProfileCoords] = useState("");
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileCbeEnabled, setProfileCbeEnabled] = useState(false);
  const [profileCbeAccount, setProfileCbeAccount] = useState("");
  const [profileCbePhone, setProfileCbePhone] = useState("");
  const [profileTelebirrEnabled, setProfileTelebirrEnabled] = useState(false);
  const [profileTelebirrMerchant, setProfileTelebirrMerchant] = useState("");
  const [profileTelebirrPhone, setProfileTelebirrPhone] = useState("");
  const [profileAwashEnabled, setProfileAwashEnabled] = useState(false);
  const [profileAwashAccount, setProfileAwashAccount] = useState("");
  const [profileAwashPhone, setProfileAwashPhone] = useState("");
  const [profileSelectedBanks, setProfileSelectedBanks] = useState([]);
  const [profileBankAccountDetails, setProfileBankAccountDetails] = useState({});

  // ── Checkout
  const [checkoutProduct, setCheckoutProduct] = useState(null);
  const [checkoutQuantity, setCheckoutQuantity] = useState(1);
  const [checkoutPaymentMethod, setCheckoutPaymentMethod] =
    useState("CBE_BIRR");
  const [checkoutPhone, setCheckoutPhone] = useState("");
  const [checkoutAddress, setCheckoutAddress] = useState("");
  const [checkoutWalletType, setCheckoutWalletType] = useState("wallet");
  const [checkoutCbeAccount, setCheckoutCbeAccount] = useState("");
  const [checkoutSecurityPin, setCheckoutSecurityPin] = useState("");
  const [checkoutTelebirrFlow, setCheckoutTelebirrFlow] = useState("app");
  const [checkoutFtCode, setCheckoutFtCode] = useState("");
  const [checkoutAwashPhone, setCheckoutAwashPhone] = useState("");
  const [checkoutAwashPin, setCheckoutAwashPin] = useState("");
  const [checkoutFarmerPayments, setCheckoutFarmerPayments] = useState({});
  const [checkoutFarmerBankAccounts, setCheckoutFarmerBankAccounts] = useState([]);
  const [checkoutBankAccount, setCheckoutBankAccount] = useState("");
  const [checkoutBankPin, setCheckoutBankPin] = useState("");
  const [banks, setBanks] = useState([]);
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [processingPayment, setProcessingPayment] = useState(false);

  // ── Other UI
  const [trackingOrder, setTrackingOrder] = useState(null);
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [editProductOpen, setEditProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [budgetModalOpen, setBudgetModalOpen] = useState(false);
  const [budgetAmount, setBudgetAmount] = useState("");
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewOrderId, setReviewOrderId] = useState("");
  const [reviewFarmerId, setReviewFarmerId] = useState("");
  const [reviewFarmerName, setReviewFarmerName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [disputeResolutionModalOpen, setDisputeResolutionModalOpen] =
    useState(false);
  const [auditModalOpen, setAuditModalOpen] = useState(false);

  // ── Add product fields
  const [newProdName, setNewProdName] = useState("");
  const [newProdCategory, setNewProdCategory] = useState("Crops");
  const [newProdType, setNewProdType] = useState("Coffee");
  const [newProdPrice, setNewProdPrice] = useState("");
  const [newProdQty, setNewProdQty] = useState("");
  const [newProdUnit, setNewProdUnit] = useState("kg");
  const [newProdHarvestDate, setNewProdHarvestDate] = useState("");
  const [newProdLocation, setNewProdLocation] = useState("");
  const [newProdDesc, setNewProdDesc] = useState("");
  const [newProdImage, setNewProdImage] = useState(null);
  const [prodFormError, setProdFormError] = useState("");

  // ── Edit product fields
  const [editProdName, setEditProdName] = useState("");
  const [editProdCategory, setEditProdCategory] = useState("Crops");
  const [editProdType, setEditProdType] = useState("");
  const [editProdPrice, setEditProdPrice] = useState("");
  const [editProdQty, setEditProdQty] = useState("");
  const [editProdUnit, setEditProdUnit] = useState("kg");
  const [editProdHarvestDate, setEditProdHarvestDate] = useState("");
  const [editProdLocation, setEditProdLocation] = useState("");
  const [editProdDesc, setEditProdDesc] = useState("");
  const [editProdImage, setEditProdImage] = useState(null);
  const [editProdFormError, setEditProdFormError] = useState("");

  // ── Farmer modal flags
  const [cropPlanModalOpen, setCropPlanModalOpen] = useState(false);
  const [inventoryModalOpen, setInventoryModalOpen] = useState(false);
  const [equipmentModalOpen, setEquipmentModalOpen] = useState(false);
  const [storageFacilityModalOpen, setStorageFacilityModalOpen] =
    useState(false);
  const [batchLotModalOpen, setBatchLotModalOpen] = useState(false);
  const [qualityGradeModalOpen, setQualityGradeModalOpen] = useState(false);
  const [certificationModalOpen, setCertificationModalOpen] = useState(false);
  const [labTestModalOpen, setLabTestModalOpen] = useState(false);
  const [loanModalOpen, setLoanModalOpen] = useState(false);
  const [productionCostModalOpen, setProductionCostModalOpen] = useState(false);
  const [insuranceModalOpen, setInsuranceModalOpen] = useState(false);
  const [subsidyModalOpen, setSubsidyModalOpen] = useState(false);
  const [auctionModalOpen, setAuctionModalOpen] = useState(false);
  const [contractModalOpen, setContractModalOpen] = useState(false);
  const [bulkDiscountModalOpen, setBulkDiscountModalOpen] = useState(false);
  const [preHarvestModalOpen, setPreHarvestModalOpen] = useState(false);

  // ── Data Fetching
  const fetchData = async () => {
    try {
      const q = new URLSearchParams();
      if (category) q.append("category", category);
      if (locationFilter) q.append("location", locationFilter);
      if (minPrice) q.append("minPrice", minPrice);
      if (maxPrice) q.append("maxPrice", maxPrice);
      if (search) q.append("search", search);

      const [prodRes, bulRes, payConfRes, reviewsRes, banksRes] = await Promise.all([
        fetch(`/api/products?${q.toString()}`),
        fetch("/api/bulletins"),
        fetch("/api/payments/config"),
        fetch("/api/supplier-reviews"),
        fetch("/api/banks"),
      ]);
      if (prodRes.ok) setProducts(await prodRes.json());
      if (bulRes.ok) setBulletins(await bulRes.json());
      if (payConfRes.ok) setPaymentConfig(await payConfRes.json());
      if (reviewsRes.ok) setAllReviews(await reviewsRes.json());
      if (banksRes.ok) {
        const banksData = await banksRes.json();
        setBanks(banksData.filter(b => b.active));
      }

      const qgRes = await fetch(
        "/api/quality-grades",
        token ? { headers: { Authorization: `Bearer ${token}` } } : undefined,
      );
      if (qgRes.ok) setMarketQualityGrades(await qgRes.json());

      if (token) {
        const authH = { Authorization: `Bearer ${token}` };
        const ordRes = await fetch("/api/orders", { headers: authH });
        if (ordRes.ok) setOrders(await ordRes.json());

        const opt = async (url, setter) => {
          try {
            const r = await fetch(url, { headers: authH });
            if (r.ok) setter(await r.json());
          } catch (e) {
            console.error(e);
          }
        };

        if (user?.role === "farmer") {
          const fid = user.id;
          await Promise.all([
            opt(`/api/crop-plans?farmerId=${fid}`, setCropPlans),
            opt(`/api/inventory?farmerId=${fid}`, setInventoryItems),
            opt(`/api/equipment?farmerId=${fid}`, setEquipmentList),
            opt(`/api/storage?farmerId=${fid}`, setStorageFacilities),
            opt(`/api/batch-lots?farmerId=${fid}`, setBatchLots),
            opt(`/api/quality-grades?farmerId=${fid}`, setQualityGrades),
            opt(`/api/certifications?farmerId=${fid}`, setCertifications),
            opt(`/api/lab-tests?farmerId=${fid}`, setLabTests),
            opt(`/api/loans?farmerId=${fid}`, setLoanApplications),
            opt(`/api/production-costs?farmerId=${fid}`, setProductionCosts),
            opt(`/api/insurance?farmerId=${fid}`, setInsurancePolicies),
            opt(`/api/subsidies?farmerId=${fid}`, setSubsidyApplications),
            opt(`/api/auctions?farmerId=${fid}`, setAuctionBids),
            opt(`/api/contracts?farmerId=${fid}`, setContractFarming),
            opt(`/api/bulk-discounts?farmerId=${fid}`, setBulkDiscounts),
            opt(`/api/pre-harvest?farmerId=${fid}`, setAdvanceBookings),
            opt(`/api/products?farmerId=${fid}`, setProducts),
          ]);
        }

        if (user?.role === "buyer") {
          await Promise.all([
            opt(`/api/wishlist?buyerId=${user.id}`, setWishlist),
            opt(`/api/supplier-reviews?buyerId=${user.id}`, setSupplierReviews),
          ]);
        }

        if (user?.role === "admin") {
          await Promise.all([
            opt("/api/admin/users", setAllUsers),
            opt("/api/admin/analytics", setAdminAnalytics),
            opt("/api/disputes", setDisputes),
            opt("/api/quality-audits", setQualityAudits),
          ]);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token, user, search, category, locationFilter, minPrice, maxPrice]);

  // ── Notification polling (every 30s while logged in)
  const fetchNotifications = async () => {
    if (!token || !user) return;
    try {
      const res = await fetch('/api/notifications', { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setNotifications(await res.json());
    } catch (e) { /* silent */ }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [token, user]);

  const markNotifRead = async (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` } });
    } catch (e) { /* silent */ }
  };

  const markAllNotifsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    try {
      await fetch('/api/notifications/read-all', { method: 'PUT', headers: { Authorization: `Bearer ${token}` } });
    } catch (e) { /* silent */ }
  };


  useEffect(() => {
    const loadProfileData = async () => {
      if (!token || !user) return;
      try {
        if (user.role === 'farmer') {
          const res = await fetch(`/api/farmers/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setProfileName(data.name || user.name || "");
            setProfilePhone(data.phone || user.phone || "");
            setProfileLocation(data.location || user.location || "");
            setProfileBio(data.bio || "");
            setProfileCoords(data.coordinates || "");
            setProfileCrops(data.crops ? data.crops.join(", ") : "");
            
            const pm = data.paymentMethods || {};
            setProfileCbeEnabled(!!pm.cbe?.enabled);
            setProfileCbeAccount(pm.cbe?.accountNumber || "");
            setProfileCbePhone(pm.cbe?.walletPhone || "");
            setProfileTelebirrEnabled(!!pm.telebirr?.enabled);
            setProfileTelebirrMerchant(pm.telebirr?.merchantCode || "");
            setProfileTelebirrPhone(pm.telebirr?.walletPhone || "");
            setProfileAwashEnabled(!!pm.awash?.enabled);
            setProfileAwashAccount(pm.awash?.accountNumber || "");
            setProfileAwashPhone(pm.awash?.walletPhone || "");
            
            // Load selected bank accounts and their details
            if (data.bankAccounts && Array.isArray(data.bankAccounts)) {
              setProfileSelectedBanks(data.bankAccounts);
            }
            if (data.bankAccountDetails && typeof data.bankAccountDetails === 'object') {
              setProfileBankAccountDetails(data.bankAccountDetails);
            }
          }
        } else if (user.role === 'buyer') {
          const res = await fetch(`/api/buyers/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setProfileName(data.name || user.name || "");
            setProfilePhone(data.phone || user.phone || "");
            setProfileLocation(data.location || user.location || "");
          }
        }
      } catch (err) {
        console.error("Error loading profile details:", err);
      }
    };

    if (currentTab === 'profile') {
      loadProfileData();
    }
  }, [currentTab, user, token]);

  // ── Auth
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    const endpoint =
      authMode === "login" ? "/api/auth/login" : "/api/auth/register";
    
    try {
      let res, data;
      
      if (authMode === "login") {
        const payload = { email: authEmail, password: authPassword };
        res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        data = await res.json();
      } else {
        // Registration with potential file upload
        const formData = new FormData();
        formData.append("email", authEmail);
        formData.append("password", authPassword);
        formData.append("name", authName);
        formData.append("role", authRole);
        formData.append("phone", authPhone);
        formData.append("location", authLocation);
        formData.append("farmName", authFarmName || "");
        formData.append("farmSize", authFarmSize || "");
        formData.append("crops", authCrops || "");
        
        if (authNationalIdFile) {
          formData.append("nationalId", authNationalIdFile);
        }
        
        res = await fetch(endpoint, {
          method: "POST",
          body: formData,
        });
        data = await res.json();
      }
      
      if (res.ok) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setAuthModalOpen(false);
        setProfileName(data.user.name || "");
        setProfilePhone(data.user.phone || "");
        setProfileLocation(data.user.location || "");
        confetti({ particleCount: 30, spread: 40 });
      } else {
        setAuthError(data.error || "Authentication failed");
      }
    } catch (err) {
      setAuthError("Network error. Please try again.");
    }
  };

  const handleLogout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentTab("market");
  };

  // ── Profile
  const handleProfileSave = async (e, selectedBanks, bankAccountDetails) => {
    e.preventDefault();
    const url =
      user.role === "farmer"
        ? `/api/farmers/${user.id}`
        : `/api/buyers/${user.id}`;
    const payload =
      user.role === "farmer"
        ? {
            name: profileName,
            phone: profilePhone,
            location: profileLocation,
            coordinates: profileCoords,
            crops: profileCrops.split(",").map((c) => c.trim()),
            bio: profileBio,
            paymentMethods: {
              cbe: {
                enabled: profileCbeEnabled,
                accountNumber: profileCbeAccount,
                walletPhone: profileCbePhone,
              },
              telebirr: {
                enabled: profileTelebirrEnabled,
                merchantCode: profileTelebirrMerchant,
                walletPhone: profileTelebirrPhone,
              },
              awash: {
                enabled: profileAwashEnabled,
                accountNumber: profileAwashAccount,
                walletPhone: profileAwashPhone,
              }
            },
            bankAccounts: selectedBanks || [],
            bankAccountDetails: bankAccountDetails || {}
          }
        : { name: profileName, phone: profilePhone, location: profileLocation };
    
    console.log('Saving profile with payload:', payload);
    console.log('Selected banks:', selectedBanks);
    console.log('Bank account details:', bankAccountDetails);
    
    try {
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        console.log('Profile save response:', data);
        const updatedUser = {
          ...user,
          name: data.name,
          phone: data.phone,
          location: data.location,
        };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        
        // Update bank account state if farmer
        if (user.role === 'farmer') {
          setProfileSelectedBanks(data.bankAccounts || []);
          setProfileBankAccountDetails(data.bankAccountDetails || {});
        }
        
        setProfileSaved(true);
        setTimeout(() => setProfileSaved(false), 3000);
        confetti({ particleCount: 30, spread: 40 });
      } else {
        const errorData = await res.json();
        console.error('Profile save error:', errorData);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ── Checkout
  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setPaymentError("");
    if (
      checkoutPaymentMethod === "CBE_BIRR" ||
      (checkoutPaymentMethod === "TELEBIRR" && checkoutTelebirrFlow === "app") ||
      checkoutPaymentMethod === "AWASH" ||
      checkoutPaymentMethod.startsWith("BANK_")
    ) {
      setOtpModalOpen(true);
      return;
    }
    await submitOrder();
  };

  const submitOrder = async () => {
    setProcessingPayment(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: checkoutProduct.id,
          quantity: checkoutQuantity,
          paymentMethod: checkoutPaymentMethod,
          shippingAddress: checkoutAddress,
        }),
      });
      const orderData = await res.json();
      if (res.ok) {
        if (
          checkoutPaymentMethod === "CBE_BIRR" ||
          checkoutPaymentMethod === "TELEBIRR" ||
          checkoutPaymentMethod === "AWASH" ||
          checkoutPaymentMethod.startsWith("BANK_")
        ) {
          const buyerPhone = checkoutPaymentMethod === "AWASH" ? checkoutAwashPhone : (checkoutPaymentMethod.startsWith("BANK_") ? checkoutBankAccount : checkoutPhone);
          await fetch("/api/payments/pay", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              orderId: orderData.id,
              phoneNumber: buyerPhone,
              amount: checkoutProduct.price * checkoutQuantity,
              paymentMethod: checkoutPaymentMethod,
              paymentDetails: {
                walletType: checkoutWalletType,
                cbeAccount: checkoutCbeAccount,
                telebirrFlow: checkoutTelebirrFlow,
                ftCode: checkoutFtCode,
                awashPhone: checkoutAwashPhone,
                awashPin: checkoutAwashPin,
                bankAccount: checkoutBankAccount,
                bankPin: checkoutBankPin,
              }
            }),
          });
        }
        
        // Reset states
        setCheckoutProduct(null);
        setOtpModalOpen(false);
        setOtpCode("");
        setCheckoutCbeAccount("");
        setCheckoutSecurityPin("");
        setCheckoutFtCode("");
        setCheckoutAwashPhone("");
        setCheckoutAwashPin("");
        setCheckoutBankAccount("");
        setCheckoutBankPin("");
        
        // Fetch updated orders and products list
        await fetchData();
        confetti({ particleCount: 30, spread: 40 });
      } else {
        setPaymentError(orderData.error || "Order failed");
      }
    } catch (err) {
      setPaymentError("Network error.");
    } finally {
      setProcessingPayment(false);
    }
  };

  // ── Handler Hooks
  const farmerHandlers = useFarmerHandlers({
    token,
    user,
    products,
    setProducts,
    cropPlans,
    setCropPlans,
    inventoryItems,
    setInventoryItems,
    equipmentList,
    setEquipmentList,
    storageFacilities,
    setStorageFacilities,
    batchLots,
    setBatchLots,
    qualityGrades,
    setQualityGrades,
    certifications,
    setCertifications,
    labTests,
    setLabTests,
    loanApplications,
    setLoanApplications,
    productionCosts,
    setProductionCosts,
    insurancePolicies,
    setInsurancePolicies,
    subsidyApplications,
    setSubsidyApplications,
    auctionBids,
    setAuctionBids,
    contractFarming,
    setContractFarming,
    bulkDiscounts,
    setBulkDiscounts,
    advanceBookings,
    setAdvanceBookings,
  });

  const productHandlers = useProductHandlers({
    token,
    user,
    products,
    setProducts,
    orders,
    setOrders,
    setEditProductOpen,
    setEditingProduct,
    setEditProdName,
    setEditProdCategory,
    setEditProdType,
    setEditProdPrice,
    setEditProdQty,
    setEditProdUnit,
    setEditProdHarvestDate,
    setEditProdLocation,
    setEditProdDesc,
    editingProduct,
    editProdName,
    editProdCategory,
    editProdType,
    editProdPrice,
    editProdQty,
    editProdUnit,
    editProdHarvestDate,
    editProdLocation,
    editProdDesc,
    editProdImage,
    setEditProdFormError,
    newProdName,
    newProdCategory,
    newProdType,
    newProdPrice,
    newProdQty,
    newProdUnit,
    newProdHarvestDate,
    newProdLocation,
    newProdDesc,
    newProdImage,
    setProdFormError,
    setAddProductOpen,
  });

  const buyerHandlers = useBuyerHandlers({
    token,
    user,
    wishlist,
    setWishlist,
    supplierReviews,
    setSupplierReviews,
    allReviews,
    setAllReviews,
  });
  const adminHandlers = useAdminHandlers({
    token,
    user,
    qualityAudits,
    setQualityAudits,
    disputes,
    setDisputes,
    fetchData,
    products,
    setProducts,
  });

  // ── Chart helpers
  const getFarmerSalesChartData = () => {
    const paid = orders.filter((o) => o.paymentStatus === "paid");
    const monthly = {};
    paid.forEach((o) => {
      const m = new Date(o.createdAt).toLocaleString("default", {
        month: "short",
      });
      monthly[m] = (monthly[m] || 0) + o.totalPrice;
    });
    const labels = Object.keys(monthly);
    const data = Object.values(monthly);
    return {
      labels: labels.length ? labels : ["June"],
      datasets: [
        {
          label: "Sales Revenue (ETB)",
          data: data.length ? data : [0],
          borderColor: "rgb(20,184,166)",
          backgroundColor: "rgba(20,184,166,0.2)",
          tension: 0.4,
          fill: true,
        },
      ],
    };
  };

  const getCategoryBreakdownData = () => {
    const counts = { Crops: 0, Livestock: 0 };
    if (user?.role === "farmer") {
      products.forEach((p) => {
        if (p.farmerId === user.id && counts[p.category] !== undefined)
          counts[p.category] += p.quantity;
      });
    } else {
      orders.forEach((o) => {
        const p = products.find((prod) => prod.id === o.productId);
        if (p && counts[p.category] !== undefined)
          counts[p.category] += o.quantity;
      });
    }
    return {
      labels: ["Crops (kg)", "Livestock (heads)"],
      datasets: [
        {
          data: [counts.Crops, counts.Livestock],
          backgroundColor: ["rgba(13,148,136,0.8)", "rgba(217,119,6,0.8)"],
          borderWidth: 1,
        },
      ],
    };
  };

  // ── Render
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-500 overflow-x-hidden relative">
      <div
        className="fixed -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none ambient-blob-1 animate-pulse"
        style={{ animationDuration: "8s" }}
      ></div>
      <div
        className="fixed -bottom-40 -right-40 w-[650px] h-[650px] rounded-full blur-[120px] pointer-events-none ambient-blob-2 animate-pulse"
        style={{ animationDuration: "10s", animationDelay: "2s" }}
      ></div>
      <div
        className="fixed top-1/2 left-1/3 w-[500px] h-[500px] rounded-full blur-[150px] pointer-events-none ambient-blob-3 animate-pulse"
        style={{ animationDuration: "12s", animationDelay: "4s" }}
      ></div>

      {/* Header */}
      <header className="glass-nav sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-16 py-3 flex items-center justify-between gap-3">
          <div
            className="flex min-w-0 items-center space-x-3 cursor-pointer"
            onClick={() => setCurrentTab("market")}
          >
            <div className="w-10 h-10 shrink-0 rounded-xl bg-teal-600 dark:bg-teal-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-lg sm:text-2xl font-bold bg-gradient-to-r from-teal-600 to-amber-600 dark:from-teal-400 dark:to-amber-500 bg-clip-text text-transparent m-0 tracking-tight leading-none">
                {t("appName")}
              </h1>
              <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium hidden sm:block">
                {t("slogan")}
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-1 rounded-2xl border border-slate-200/80 bg-white/60 px-2 py-1.5 dark:border-slate-800 dark:bg-slate-900/60">
            <button
              onClick={() => setCurrentTab("market")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${currentTab === "market" ? "bg-teal-600 text-white shadow-md shadow-teal-500/20 dark:bg-teal-500 dark:text-slate-950" : "text-slate-700 hover:text-teal-600 dark:text-slate-300 dark:hover:text-teal-300"}`}
            >
              {t("navMarket")}
            </button>
            <button
              onClick={() => setCurrentTab("bulletins")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all relative ${currentTab === "bulletins" ? "bg-teal-600 text-white shadow-md shadow-teal-500/20 dark:bg-teal-500 dark:text-slate-950" : "text-slate-700 hover:text-teal-600 dark:text-slate-300 dark:hover:text-teal-300"}`}
            >
              {t("navBulletins")}
              {bulletins.length > 0 && (
                <span className="absolute top-1.5 right-1 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-white dark:ring-slate-950 animate-pulse"></span>
              )}
            </button>
            {user && (
              <button
                onClick={() => setCurrentTab("dashboard")}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${currentTab === "dashboard" ? "bg-teal-600 text-white shadow-md shadow-teal-500/20 dark:bg-teal-500 dark:text-slate-950" : "text-slate-700 hover:text-teal-600 dark:text-slate-300 dark:hover:text-teal-300"}`}
              >
                {user.role === "admin"
                  ? "Admin Panel"
                  : user.role === "farmer"
                    ? t("navDashboard")
                    : "My Orders"}
              </button>
            )}
          </nav>

          <div className="hidden md:flex items-center space-x-3">
            <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-900 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <Languages className="w-4 h-4 text-slate-600 dark:text-slate-400" />
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
            <button
              onClick={() => setDark(!dark)}
              className="action-icon-btn border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
            >
              {dark ? (
                <Sun className="w-4.5 h-4.5" />
              ) : (
                <Moon className="w-4.5 h-4.5" />
              )}
            </button>
            {user ? (
              <>
                {/* ── Notification Bell */}
                <div className="relative">
                  <button
                    id="notif-bell-btn"
                    onClick={() => { setNotifOpen(!notifOpen); setProfileDropdownOpen(false); }}
                    className="action-icon-btn border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 relative"
                    aria-label="Notifications"
                  >
                    <Bell className="w-4.5 h-4.5" />
                    {notifications.filter(n => !n.read).length > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-0.5 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold ring-2 ring-white dark:ring-slate-950 animate-bounce">
                        {notifications.filter(n => !n.read).length > 9 ? '9+' : notifications.filter(n => !n.read).length}
                      </span>
                    )}
                  </button>
                  {notifOpen && (
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-teal-50 to-amber-50 dark:from-teal-950/40 dark:to-amber-950/20">
                        <span className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                          <Bell className="w-4 h-4 text-teal-600" /> Notifications
                          {notifications.filter(n => !n.read).length > 0 && (
                            <span className="px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold">
                              {notifications.filter(n => !n.read).length}
                            </span>
                          )}
                        </span>
                        {notifications.some(n => !n.read) && (
                          <button onClick={markAllNotifsRead} className="text-xs text-teal-600 hover:text-teal-700 dark:text-teal-400 font-medium">
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                        {notifications.length === 0 ? (
                          <div className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                            <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                            <p className="text-sm">No notifications yet</p>
                          </div>
                        ) : (
                          notifications.map(n => (
                            <button
                              key={n.id}
                              onClick={() => { markNotifRead(n.id); if (n.orderId) { setCurrentTab('dashboard'); setNotifOpen(false); } }}
                              className={`w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${ !n.read ? 'bg-teal-50/50 dark:bg-teal-950/20' : '' }`}
                            >
                              <div className="flex items-start gap-3">
                                <span className="text-lg mt-0.5 shrink-0">
                                  {n.type === 'new_order' ? '📦' : n.type === 'payment_confirmed' ? '✅' : n.type === 'order_shipped' ? '🚚' : '🔔'}
                                </span>
                                <div className="min-w-0">
                                  <p className={`text-xs font-semibold truncate ${ !n.read ? 'text-teal-700 dark:text-teal-400' : 'text-slate-800 dark:text-slate-200' }`}>
                                    {n.title}
                                  </p>
                                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{n.message}</p>
                                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                                    {new Date(n.createdAt).toLocaleString()}
                                  </p>
                                </div>
                                {!n.read && <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0 mt-1.5" />}
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
                {/* ── Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => { setProfileDropdownOpen(!profileDropdownOpen); setNotifOpen(false); }}
                    className="action-icon-btn border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
                  >
                    <User className="w-4.5 h-4.5" />
                  </button>
                  {profileDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50">
                      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          {user.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                          {user.role}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setCurrentTab("profile");
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full px-4 py-3 text-left text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center space-x-2"
                      >
                        <User className="w-4 h-4" />
                        <span>{t("navProfile")}</span>
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-3 text-left text-sm font-medium text-red-600 dark:text-red-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-b-xl flex items-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{t("navLogout")}</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <button
                onClick={() => {
                  setAuthMode("login");
                  setAuthModalOpen(true);
                }}
                className="app-btn-primary"
              >
                <LogIn className="w-4 h-4" />
                <span>{t("navLogin")}</span>
              </button>
            )}
          </div>

          <button
            onClick={() => setMobileNavOpen(true)}
            className="md:hidden action-icon-btn border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {mobileNavOpen && (
        <>
          <button
            className="mobile-sidebar-overlay"
            onClick={() => setMobileNavOpen(false)}
            aria-label="Close navigation menu"
          />
          <aside className="mobile-sidebar flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-600 dark:text-teal-400">
                  Navigation
                </p>
                <h2 className="mt-1 text-xl font-extrabold text-slate-900 dark:text-white">
                  {t("appName")}
                </h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  Browse the marketplace and manage your account easily on
                  mobile.
                </p>
              </div>
              <button
                onClick={() => setMobileNavOpen(false)}
                className="action-icon-btn border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
                aria-label="Close navigation menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {user && (
              <div className="mobile-sidebar-section">
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {user.name}
                </p>
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mt-1">
                  {user.role}
                </p>
                <div className="mt-3 space-y-2">
                  <button
                    onClick={() => {
                      setCurrentTab("profile");
                      setMobileNavOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg flex items-center space-x-2"
                  >
                    <User className="w-4 h-4" />
                    <span>{t("navProfile")}</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm font-medium text-red-600 dark:text-red-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t("navLogout")}</span>
                  </button>
                </div>
              </div>
            )}

            <div className="mobile-sidebar-section space-y-2">
              <button
                onClick={() => setCurrentTab("market")}
                className={`mobile-nav-link ${currentTab === "market" ? "mobile-nav-link-active" : ""}`}
              >
                <span>{t("navMarket")}</span>
              </button>
              <button
                onClick={() => setCurrentTab("bulletins")}
                className={`mobile-nav-link ${currentTab === "bulletins" ? "mobile-nav-link-active" : ""}`}
              >
                <span>{t("navBulletins")}</span>
                {bulletins.length > 0 && (
                  <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-amber-500 px-2 text-[10px] font-bold text-white">
                    {bulletins.length}
                  </span>
                )}
              </button>
              {user && (
                <button
                  onClick={() => setCurrentTab("dashboard")}
                  className={`mobile-nav-link ${currentTab === "dashboard" ? "mobile-nav-link-active" : ""}`}
                >
                  <span>
                    {user.role === "admin"
                      ? "Admin Panel"
                      : user.role === "farmer"
                        ? t("navDashboard")
                        : "My Orders"}
                  </span>
                </button>
              )}
            </div>

            <div className="mobile-sidebar-section space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-2">
                <Languages className="w-4 h-4" />
                <span>{t("languageLabel")}</span>
              </label>
              <select
                value={i18n.language}
                onChange={(e) => i18n.changeLanguage(e.target.value)}
                className="glass-input"
              >
                <option value="en">English</option>
                <option value="am">አማርኛ</option>
                <option value="om">Afaan Oromo</option>
                <option value="so">Soomaali</option>
              </select>
              <button
                onClick={() => setDark(!dark)}
                className="app-btn-secondary w-full"
              >
                {dark ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
                <span>{dark ? "Use light mode" : "Use dark mode"}</span>
              </button>
            </div>

            <div className="mt-auto pt-2">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="app-btn-danger w-full"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t("navLogout")}</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setAuthMode("login");
                    setAuthModalOpen(true);
                    setMobileNavOpen(false);
                  }}
                  className="app-btn-primary w-full"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{t("navLogin")}</span>
                </button>
              )}
            </div>
          </aside>
        </>
      )}

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {bulletins.slice(0, 1).map((bul) => (
          <div
            key={bul.id}
            className="mb-8 rounded-2xl bg-amber-500/10 border border-amber-500/20 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0 shadow-sm animate-pulse"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-amber-500/20 rounded-xl text-amber-600 dark:text-amber-400">
                {bul.type === "weather" ? (
                  <CloudRain className="w-5 h-5" />
                ) : (
                  <Bell className="w-5 h-5" />
                )}
              </div>
              <div>
                <p className="text-xs text-amber-700 dark:text-amber-400 font-semibold tracking-wider uppercase">
                  {bul.type === "weather"
                    ? t("weatherAlert")
                    : t("marketUpdate")}
                </p>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {bul.title}
                </p>
              </div>
            </div>
            <button
              onClick={() => setCurrentTab("bulletins")}
              className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center space-x-1 hover:underline"
            >
              <span>Read announcement details</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ))}

        {currentTab === "market" && (
          <MarketPage
            products={products}
            allReviews={allReviews}
            wishlist={wishlist}
            user={user}
            marketQualityGrades={marketQualityGrades}
            coffeeImg={coffeeImg}
            getLivestockImage={getLivestockImage}
            heroBeautiful={heroBeautiful}
            search={search}
            setSearch={setSearch}
            category={category}
            setCategory={setCategory}
            locationFilter={locationFilter}
            setLocationFilter={setLocationFilter}
            minPrice={minPrice}
            setMinPrice={setMinPrice}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            onBuy={async (product) => {
              setCheckoutProduct(product);
              setCheckoutQuantity(1);
              setCheckoutFarmerPayments({});
              setCheckoutFarmerBankAccounts([]);
              if (user) {
                setCheckoutPhone(user.phone || "");
                setCheckoutAddress(user.location || "");
              }
              if (token) {
                try {
                  const res = await fetch(`/api/farmers/${product.farmerId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                  });
                  if (res.ok) {
                    const data = await res.json();
                    console.log('Farmer data for checkout:', data);
                    setCheckoutFarmerPayments({
                      ...data.paymentMethods,
                      bankAccountDetails: data.bankAccountDetails || {}
                    });
                    setCheckoutFarmerBankAccounts(data.bankAccounts || []);
                    console.log('Checkout farmer bank accounts:', data.bankAccounts);
                    console.log('Checkout bank account details:', data.bankAccountDetails);
                  }
                } catch (e) {
                  console.error("Error fetching farmer payment details:", e);
                }
              }
            }}
            onToggleWishlist={(arg, action) =>
              action === "remove"
                ? buyerHandlers.handleRemoveFromWishlist(arg)
                : buyerHandlers.handleAddToWishlist(arg)
            }
            onDeleteProduct={productHandlers.handleDeleteProduct}
            onOpenAuth={() => {
              setAuthMode("login");
              setAuthModalOpen(true);
            }}
            t={t}
          />
        )}

        {currentTab === "bulletins" && (
          <BulletinsPage bulletins={bulletins} cropsBg={cropsBg} t={t} />
        )}

        {currentTab === "dashboard" && user?.role === "admin" && (
          <AdminDashboard
            heroBeautiful={heroBeautiful}
            adminDashboardSubTab={adminDashboardSubTab}
            setAdminDashboardSubTab={setAdminDashboardSubTab}
            adminAnalytics={adminAnalytics}
            allUsers={allUsers}
            disputes={disputes}
            qualityAudits={qualityAudits}
            auditLogs={auditLogs}
            paymentConfig={paymentConfig}
            token={token}
            fetchData={fetchData}
            user={user}
            onOpenAudit={() => setAuditModalOpen(true)}
            handleDeleteQualityAudit={adminHandlers.handleDeleteQualityAudit}
            handleResolveDispute={adminHandlers.handleResolveDispute}
            allProducts={products}
            handleHideProduct={adminHandlers.handleHideProduct}
            handleExpireProduct={adminHandlers.handleExpireProduct}
            handleDeleteProduct={adminHandlers.handleDeleteProduct}
          />
        )}

        {currentTab === "dashboard" && user?.role === "farmer" && (
          <FarmerDashboard
            heroBeautiful={heroBeautiful}
            user={user}
            orders={orders}
            products={products}
            dashboardSubTab={dashboardSubTab}
            setDashboardSubTab={setDashboardSubTab}
            cropPlans={cropPlans}
            inventoryItems={inventoryItems}
            equipmentList={equipmentList}
            storageFacilities={storageFacilities}
            batchLots={batchLots}
            qualityGrades={qualityGrades}
            certifications={certifications}
            labTests={labTests}
            loanApplications={loanApplications}
            productionCosts={productionCosts}
            insurancePolicies={insurancePolicies}
            subsidyApplications={subsidyApplications}
            auctionBids={auctionBids}
            contractFarming={contractFarming}
            bulkDiscounts={bulkDiscounts}
            advanceBookings={advanceBookings}
            cropPlanModalOpen={cropPlanModalOpen}
            setCropPlanModalOpen={setCropPlanModalOpen}
            inventoryModalOpen={inventoryModalOpen}
            setInventoryModalOpen={setInventoryModalOpen}
            equipmentModalOpen={equipmentModalOpen}
            setEquipmentModalOpen={setEquipmentModalOpen}
            storageFacilityModalOpen={storageFacilityModalOpen}
            setStorageFacilityModalOpen={setStorageFacilityModalOpen}
            batchLotModalOpen={batchLotModalOpen}
            setBatchLotModalOpen={setBatchLotModalOpen}
            qualityGradeModalOpen={qualityGradeModalOpen}
            setQualityGradeModalOpen={setQualityGradeModalOpen}
            certificationModalOpen={certificationModalOpen}
            setCertificationModalOpen={setCertificationModalOpen}
            labTestModalOpen={labTestModalOpen}
            setLabTestModalOpen={setLabTestModalOpen}
            auditModalOpen={auditModalOpen}
            setAuditModalOpen={setAuditModalOpen}
            loanModalOpen={loanModalOpen}
            setLoanModalOpen={setLoanModalOpen}
            productionCostModalOpen={productionCostModalOpen}
            setProductionCostModalOpen={setProductionCostModalOpen}
            insuranceModalOpen={insuranceModalOpen}
            setInsuranceModalOpen={setInsuranceModalOpen}
            subsidyModalOpen={subsidyModalOpen}
            setSubsidyModalOpen={setSubsidyModalOpen}
            auctionModalOpen={auctionModalOpen}
            setAuctionModalOpen={setAuctionModalOpen}
            contractModalOpen={contractModalOpen}
            setContractModalOpen={setContractModalOpen}
            bulkDiscountModalOpen={bulkDiscountModalOpen}
            setBulkDiscountModalOpen={setBulkDiscountModalOpen}
            preHarvestModalOpen={preHarvestModalOpen}
            setPreHarvestModalOpen={setPreHarvestModalOpen}
            {...farmerHandlers}
            handleAddQualityAudit={adminHandlers.handleAddQualityAudit}
            handleUpdateOrderStatus={productHandlers.handleUpdateOrderStatus}
            handleRejectOrder={productHandlers.handleRejectOrder}
            setTrackingOrder={setTrackingOrder}
            handleDeleteProduct={productHandlers.handleDeleteProduct}
            handleOpenEdit={productHandlers.handleOpenEdit}
            handleToggleVisibility={productHandlers.handleToggleVisibility}
            setAddProductOpen={setAddProductOpen}
            getFarmerSalesChartData={getFarmerSalesChartData}
            getCategoryBreakdownData={getCategoryBreakdownData}
            coffeeImg={coffeeImg}
            getLivestockImage={getLivestockImage}
          />
        )}

        {currentTab === "dashboard" && user?.role === "buyer" && (
          <BuyerDashboard
            heroBeautiful={heroBeautiful}
            user={user}
            orders={orders}
            wishlist={wishlist}
            supplierReviews={supplierReviews}
            buyerBudgets={buyerBudgets}
            buyerDashboardSubTab={buyerDashboardSubTab}
            setBuyerDashboardSubTab={setBuyerDashboardSubTab}
            handleRemoveFromWishlist={buyerHandlers.handleRemoveFromWishlist}
            handleDeleteReview={buyerHandlers.handleDeleteReview}
            setTrackingOrder={setTrackingOrder}
            handleUpdateOrderStatus={productHandlers.handleUpdateOrderStatus}
            setReviewModalOpen={setReviewModalOpen}
            setReviewOrderId={setReviewOrderId}
            setReviewFarmerId={setReviewFarmerId}
            setReviewFarmerName={setReviewFarmerName}
            setBudgetModalOpen={setBudgetModalOpen}
            getCategoryBreakdownData={getCategoryBreakdownData}
          />
        )}

        {currentTab === "profile" && user && (
          <ProfilePage
            user={user}
            profileName={profileName}
            setProfileName={setProfileName}
            profilePhone={profilePhone}
            setProfilePhone={setProfilePhone}
            profileLocation={profileLocation}
            setProfileLocation={setProfileLocation}
            profileBio={profileBio}
            setProfileBio={setProfileBio}
            profileCrops={profileCrops}
            setProfileCrops={setProfileCrops}
            profileCoords={profileCoords}
            setProfileCoords={setProfileCoords}
            profileSaved={profileSaved}
            handleProfileSave={handleProfileSave}
            profileCbeEnabled={profileCbeEnabled}
            setProfileCbeEnabled={setProfileCbeEnabled}
            profileCbeAccount={profileCbeAccount}
            initialSelectedBanks={profileSelectedBanks}
            initialBankAccountDetails={profileBankAccountDetails}
            token={token}
            setProfileCbeAccount={setProfileCbeAccount}
            profileCbePhone={profileCbePhone}
            setProfileCbePhone={setProfileCbePhone}
            profileTelebirrEnabled={profileTelebirrEnabled}
            setProfileTelebirrEnabled={setProfileTelebirrEnabled}
            profileTelebirrMerchant={profileTelebirrMerchant}
            setProfileTelebirrMerchant={setProfileTelebirrMerchant}
            profileTelebirrPhone={profileTelebirrPhone}
            setProfileTelebirrPhone={setProfileTelebirrPhone}
            profileAwashEnabled={profileAwashEnabled}
            setProfileAwashEnabled={setProfileAwashEnabled}
            profileAwashAccount={profileAwashAccount}
            setProfileAwashAccount={setProfileAwashAccount}
            profileAwashPhone={profileAwashPhone}
            setProfileAwashPhone={setProfileAwashPhone}
          />
        )}
      </main>

      <footer className="mt-auto border-t border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950/50 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
            © 2026 Hararghe Agricultural Marketplace Hub. All rights reserved.
          </p>
        </div>
      </footer>

      {/* ── Modals ── */}
      {authModalOpen && (
        <AuthModal
          authMode={authMode}
          setAuthMode={setAuthMode}
          setAuthModalOpen={setAuthModalOpen}
          authEmail={authEmail}
          setAuthEmail={setAuthEmail}
          authPassword={authPassword}
          setAuthPassword={setAuthPassword}
          authName={authName}
          setAuthName={setAuthName}
          authRole={authRole}
          setAuthRole={setAuthRole}
          authPhone={authPhone}
          setAuthPhone={setAuthPhone}
          authLocation={authLocation}
          setAuthLocation={setAuthLocation}
          authFarmName={authFarmName}
          setAuthFarmName={setAuthFarmName}
          authFarmSize={authFarmSize}
          setAuthFarmSize={setAuthFarmSize}
          authCrops={authCrops}
          setAuthCrops={setAuthCrops}
          authBusinessName={authBusinessName}
          setAuthBusinessName={setAuthBusinessName}
          authBusinessType={authBusinessType}
          setAuthBusinessType={setAuthBusinessType}
          authConfirmPassword={authConfirmPassword}
          setAuthConfirmPassword={setAuthConfirmPassword}
          authLicenseFile={authLicenseFile}
          setAuthLicenseFile={setAuthLicenseFile}
          authNationalIdFile={authNationalIdFile}
          setAuthNationalIdFile={setAuthNationalIdFile}
          authError={authError}
          handleAuthSubmit={handleAuthSubmit}
        />
      )}
      {checkoutProduct && (
        <CheckoutModal
          user={user}
          checkoutProduct={checkoutProduct}
          setCheckoutProduct={setCheckoutProduct}
          checkoutQuantity={checkoutQuantity}
          setCheckoutQuantity={setCheckoutQuantity}
          checkoutPaymentMethod={checkoutPaymentMethod}
          setCheckoutPaymentMethod={setCheckoutPaymentMethod}
          checkoutPhone={checkoutPhone}
          setCheckoutPhone={setCheckoutPhone}
          checkoutAddress={checkoutAddress}
          setCheckoutAddress={setCheckoutAddress}
          paymentConfig={paymentConfig}
          paymentError={paymentError}
          t={t}
          handleCheckoutSubmit={handleCheckoutSubmit}
          checkoutWalletType={checkoutWalletType}
          setCheckoutWalletType={setCheckoutWalletType}
          checkoutCbeAccount={checkoutCbeAccount}
          setCheckoutCbeAccount={setCheckoutCbeAccount}
          checkoutSecurityPin={checkoutSecurityPin}
          setCheckoutSecurityPin={setCheckoutSecurityPin}
          checkoutTelebirrFlow={checkoutTelebirrFlow}
          setCheckoutTelebirrFlow={setCheckoutTelebirrFlow}
          checkoutFtCode={checkoutFtCode}
          setCheckoutFtCode={setCheckoutFtCode}
          checkoutAwashPhone={checkoutAwashPhone}
          setCheckoutAwashPhone={setCheckoutAwashPhone}
          checkoutAwashPin={checkoutAwashPin}
          setCheckoutAwashPin={setCheckoutAwashPin}
          checkoutFarmerPayments={checkoutFarmerPayments}
          farmerBankAccounts={checkoutFarmerBankAccounts}
          checkoutBankAccount={checkoutBankAccount}
          setCheckoutBankAccount={setCheckoutBankAccount}
          checkoutBankPin={checkoutBankPin}
          setCheckoutBankPin={setCheckoutBankPin}
          banks={banks}
        />
      )}
      {otpModalOpen && (
        <OTPModal
          setOtpModalOpen={setOtpModalOpen}
          otpCode={otpCode}
          setOtpCode={setOtpCode}
          checkoutPhone={checkoutPhone}
          paymentError={paymentError}
          setPaymentError={setPaymentError}
          processingPayment={processingPayment}
          submitOrder={submitOrder}
          checkoutPaymentMethod={checkoutPaymentMethod}
          checkoutWalletType={checkoutWalletType}
          checkoutCbeAccount={checkoutCbeAccount}
          checkoutTelebirrFlow={checkoutTelebirrFlow}
          checkoutProduct={checkoutProduct}
          checkoutQuantity={checkoutQuantity}
          checkoutAwashPhone={checkoutAwashPhone}
          checkoutAwashPin={checkoutAwashPin}
          checkoutFarmerPayments={checkoutFarmerPayments}
          checkoutBankAccount={checkoutBankAccount}
          checkoutBankPin={checkoutBankPin}
          banks={banks}
        />
      )}
      {trackingOrder && (
        <TrackingModal
          trackingOrder={trackingOrder}
          setTrackingOrder={setTrackingOrder}
          t={t}
        />
      )}
      {addProductOpen && (
        <AddProductModal
          setAddProductOpen={setAddProductOpen}
          prodFormError={prodFormError}
          newProdName={newProdName}
          setNewProdName={setNewProdName}
          newProdCategory={newProdCategory}
          setNewProdCategory={setNewProdCategory}
          newProdType={newProdType}
          setNewProdType={setNewProdType}
          newProdPrice={newProdPrice}
          setNewProdPrice={setNewProdPrice}
          newProdQty={newProdQty}
          setNewProdQty={setNewProdQty}
          newProdUnit={newProdUnit}
          setNewProdUnit={setNewProdUnit}
          newProdHarvestDate={newProdHarvestDate}
          setNewProdHarvestDate={setNewProdHarvestDate}
          newProdLocation={newProdLocation}
          setNewProdLocation={setNewProdLocation}
          newProdDesc={newProdDesc}
          setNewProdDesc={setNewProdDesc}
          setNewProdImage={setNewProdImage}
          handleAddProduct={productHandlers.handleAddProduct}
        />
      )}
      {editProductOpen && editingProduct && (
        <EditProductModal
          setEditProductOpen={setEditProductOpen}
          editingProduct={editingProduct}
          editProdFormError={editProdFormError}
          editProdName={editProdName}
          setEditProdName={setEditProdName}
          editProdCategory={editProdCategory}
          setEditProdCategory={setEditProdCategory}
          editProdType={editProdType}
          setEditProdType={setEditProdType}
          editProdPrice={editProdPrice}
          setEditProdPrice={setEditProdPrice}
          editProdQty={editProdQty}
          setEditProdQty={setEditProdQty}
          editProdUnit={editProdUnit}
          setEditProdUnit={setEditProdUnit}
          editProdHarvestDate={editProdHarvestDate}
          setEditProdHarvestDate={setEditProdHarvestDate}
          editProdLocation={editProdLocation}
          setEditProdLocation={setEditProdLocation}
          editProdDesc={editProdDesc}
          setEditProdDesc={setEditProdDesc}
          editProdImage={editProdImage}
          setEditProdImage={setEditProdImage}
          handleUpdateProduct={productHandlers.handleUpdateProduct}
        />
      )}
      {budgetModalOpen && (
        <BudgetModal
          setBudgetModalOpen={setBudgetModalOpen}
          budgetAmount={budgetAmount}
          setBudgetAmount={setBudgetAmount}
          buyerBudgets={buyerBudgets}
          setBuyerBudgets={setBuyerBudgets}
          user={user}
        />
      )}
      {reviewModalOpen && (
        <ReviewModal
          setReviewModalOpen={setReviewModalOpen}
          reviewFarmerName={reviewFarmerName}
          reviewOrderId={reviewOrderId}
          reviewFarmerId={reviewFarmerId}
          reviewRating={reviewRating}
          setReviewRating={setReviewRating}
          reviewComment={reviewComment}
          setReviewComment={setReviewComment}
          handleAddReview={buyerHandlers.handleAddReview}
        />
      )}
      {disputeResolutionModalOpen && (
        <DisputeModal
          disputeResolutionModalOpen={disputeResolutionModalOpen}
          setDisputeResolutionModalOpen={setDisputeResolutionModalOpen}
          handleResolveDispute={adminHandlers.handleResolveDispute}
        />
      )}
    </div>
  );
}
