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
  Plus,
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

  // ── Theme ──────────────────────────────────────────────────────────────
  const [dark, setDark] = useState(
    () => localStorage.getItem("theme") === "dark",
  );
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  // ── Auth ───────────────────────────────────────────────────────────────
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
  const [authError, setAuthError] = useState("");

  // ── Navigation ─────────────────────────────────────────────────────────
  const [currentTab, setCurrentTab] = useState("market");
  const [dashboardSubTab, setDashboardSubTab] = useState("overview");
  const [buyerDashboardSubTab, setBuyerDashboardSubTab] = useState("overview");
  const [adminDashboardSubTab, setAdminDashboardSubTab] = useState("overview");

  // ── Catalog & Market ───────────────────────────────────────────────────
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

  // ── Admin ──────────────────────────────────────────────────────────────
  const [allUsers, setAllUsers] = useState([]);
  const [adminAnalytics, setAdminAnalytics] = useState(null);
  const [disputes, setDisputes] = useState([]);
  const [qualityAudits, setQualityAudits] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  // ── Farmer State ───────────────────────────────────────────────────────
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

  // ── Buyer State ────────────────────────────────────────────────────────
  const [wishlist, setWishlist] = useState([]);
  const [supplierReviews, setSupplierReviews] = useState([]);
  const [buyerBudgets, setBuyerBudgets] = useState([]);

  // ── Profile ────────────────────────────────────────────────────────────
  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileLocation, setProfileLocation] = useState("");
  const [profileBio, setProfileBio] = useState("");
  const [profileCrops, setProfileCrops] = useState("");
  const [profileCoords, setProfileCoords] = useState("");
  const [profileSaved, setProfileSaved] = useState(false);

  // ── Checkout ───────────────────────────────────────────────────────────
  const [checkoutProduct, setCheckoutProduct] = useState(null);
  const [checkoutQuantity, setCheckoutQuantity] = useState(1);
  const [checkoutPaymentMethod, setCheckoutPaymentMethod] =
    useState("CBE_BIRR");
  const [checkoutPhone, setCheckoutPhone] = useState("");
  const [checkoutAddress, setCheckoutAddress] = useState("");
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [processingPayment, setProcessingPayment] = useState(false);

  // ── UI Modal State ─────────────────────────────────────────────────────
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

  // ── Add/Edit product fields ────────────────────────────────────────────
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

  // ── Farmer modal open/close state ──────────────────────────────────────
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

  // ── Data Fetching ──────────────────────────────────────────────────────
  const fetchData = async () => {
    try {
      const q = new URLSearchParams();
      if (category) q.append("category", category);
      if (locationFilter) q.append("location", locationFilter);
      if (minPrice) q.append("minPrice", minPrice);
      if (maxPrice) q.append("maxPrice", maxPrice);
      if (search) q.append("search", search);

      const [prodRes, bulRes, payConfRes] = await Promise.all([
        fetch(`/api/products?${q.toString()}`),
        fetch("/api/bulletins"),
        fetch("/api/payments/config"),
      ]);
      if (prodRes.ok) setProducts(await prodRes.json());
      if (bulRes.ok) setBulletins(await bulRes.json());
      if (payConfRes.ok) setPaymentConfig(await payConfRes.json());

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

  // ── Auth Handlers ──────────────────────────────────────────────────────
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    const endpoint =
      authMode === "login" ? "/api/auth/login" : "/api/auth/register";
    const payload =
      authMode === "login"
        ? { email: authEmail, password: authPassword, role: authRole }
        : {
            email: authEmail,
            password: authPassword,
            name: authName,
            role: authRole,
            phone: authPhone,
            location: authLocation,
          };
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
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

  // ── Profile ────────────────────────────────────────────────────────────
  const handleProfileSave = async (e) => {
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
          }
        : { name: profileName, phone: profilePhone, location: profileLocation };
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
        const updatedUser = {
          ...user,
          name: data.name,
          phone: data.phone,
          location: data.location,
        };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setProfileSaved(true);
        setTimeout(() => setProfileSaved(false), 3000);
        confetti({ particleCount: 30, spread: 40 });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ── Checkout ───────────────────────────────────────────────────────────
  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setPaymentError("");
    if (checkoutPaymentMethod === "CBE_BIRR") {
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
        if (checkoutPaymentMethod === "CBE_BIRR") {
          await fetch("/api/payments/initiate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              orderId: orderData.id,
              phoneNumber: checkoutPhone,
              amount: checkoutProduct.price * checkoutQuantity,
            }),
          });
        }
        setOrders((prev) => [...prev, orderData]);
        setCheckoutProduct(null);
        setOtpModalOpen(false);
        setOtpCode("");
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

  // ── Custom Hooks (handlers) ────────────────────────────────────────────
  const farmerHandlers = useFarmerHandlers({
    token,
    user,
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
  });

  const adminHandlers = useAdminHandlers({
    token,
    user,
    qualityAudits,
    setQualityAudits,
    disputes,
    setDisputes,
    fetchData,
  });

  // ── Chart Data ─────────────────────────────────────────────────────────
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

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-500 overflow-x-hidden relative">
      {/* Ambient glows */}
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => setCurrentTab("market")}
          >
            <div className="w-10 h-10 rounded-xl bg-teal-600 dark:bg-teal-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-teal-600 to-amber-600 dark:from-teal-400 dark:to-amber-500 bg-clip-text text-transparent m-0 tracking-tight leading-none">
                {t("appName")}
              </h1>
              <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium hidden sm:block">
                {t("slogan")}
              </p>
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-1">
            {[
              { key: "market", label: t("navMarket") },
              {
                key: "bulletins",
                label: t("navBulletins"),
                badge: bulletins.length > 0,
              },
              ...(user
                ? [
                    {
                      key: "dashboard",
                      label:
                        user.role === "admin"
                          ? "Admin Panel"
                          : user.role === "farmer"
                            ? t("navDashboard")
                            : "My Orders",
                    },
                  ]
                : []),
              ...(user ? [{ key: "profile", label: t("navProfile") }] : []),
            ].map((nav) => (
              <button
                key={nav.key}
                onClick={() => setCurrentTab(nav.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all relative ${currentTab === nav.key ? "bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400" : "text-slate-700 hover:text-teal-600 dark:text-slate-300 dark:hover:text-teal-400"}`}
              >
                {nav.label}
                {nav.badge && (
                  <span className="absolute top-1.5 right-1 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-white dark:ring-slate-950 animate-pulse"></span>
                )}
              </button>
            ))}
          </nav>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold">
                {t("languageLabel")}:
              </span>
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
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
            >
              {dark ? (
                <Sun className="w-4.5 h-4.5" />
              ) : (
                <Moon className="w-4.5 h-4.5" />
              )}
            </button>
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-400 hidden lg:inline-block">
                  {user.name} ({user.role})
                </span>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/40 dark:text-red-400 dark:border-red-950/30 transition-all flex items-center space-x-1"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-xs font-semibold hidden md:inline">
                    {t("navLogout")}
                  </span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setAuthMode("login");
                  setAuthModalOpen(true);
                }}
                className="px-4.5 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm shadow-md shadow-teal-500/20 flex items-center space-x-2 transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>{t("navLogin")}</span>
              </button>
            )}
          </div>
        </div>
      </header>

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
            onBuy={(product) => {
              setCheckoutProduct(product);
              setCheckoutQuantity(1);
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
          />
        )}
      </main>

      <footer className="mt-auto border-t border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950/50 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
            © 2026 Hararghe Agricultural Marketplace Hub. Powered by Node.js &
            React.
          </p>
        </div>
      </footer>

      {/* Modals */}
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
          authError={authError}
          handleAuthSubmit={handleAuthSubmit}
        />
      )}
      {checkoutProduct && (
        <CheckoutModal
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
