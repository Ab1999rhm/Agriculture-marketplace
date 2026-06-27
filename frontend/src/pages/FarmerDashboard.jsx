import { useState } from "react";
import {
  Plus,
  ShoppingBag,
  DollarSign,
  AlertTriangle,
  Package,
  Truck,
  Pencil,
  Eye,
  EyeOff,
  X,
  XCircle,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { Line, Doughnut } from "react-chartjs-2";
import ProductionInventorySection from "../components/farmer/ProductionInventorySection";
import QualityCertificationSection from "../components/farmer/QualityCertificationSection";
import FinancialToolsSection from "../components/farmer/FinancialToolsSection";
import AdvancedSellingSection from "../components/farmer/AdvancedSellingSection";
import FarmerDashboardModals from "../components/farmer/FarmerDashboardModals";

export default function FarmerDashboard({
  heroBeautiful,
  user,
  orders,
  products,
  dashboardSubTab,
  setDashboardSubTab,
  // data
  cropPlans,
  inventoryItems,
  equipmentList,
  storageFacilities,
  batchLots,
  qualityGrades,
  certifications,
  labTests,
  loanApplications,
  productionCosts,
  insurancePolicies,
  subsidyApplications,
  auctionBids,
  contractFarming,
  bulkDiscounts,
  advanceBookings,
  // modal open/close flags + setters passed from App.jsx
  cropPlanModalOpen,
  setCropPlanModalOpen,
  inventoryModalOpen,
  setInventoryModalOpen,
  equipmentModalOpen,
  setEquipmentModalOpen,
  storageFacilityModalOpen,
  setStorageFacilityModalOpen,
  batchLotModalOpen,
  setBatchLotModalOpen,
  qualityGradeModalOpen,
  setQualityGradeModalOpen,
  certificationModalOpen,
  setCertificationModalOpen,
  labTestModalOpen,
  setLabTestModalOpen,
  auditModalOpen,
  setAuditModalOpen,
  loanModalOpen,
  setLoanModalOpen,
  productionCostModalOpen,
  setProductionCostModalOpen,
  insuranceModalOpen,
  setInsuranceModalOpen,
  subsidyModalOpen,
  setSubsidyModalOpen,
  auctionModalOpen,
  setAuctionModalOpen,
  contractModalOpen,
  setContractModalOpen,
  bulkDiscountModalOpen,
  setBulkDiscountModalOpen,
  preHarvestModalOpen,
  setPreHarvestModalOpen,
  // CRUD handlers (spread from farmerHandlers + extra)
  handleAddCropPlan,
  handleUpdateCropPlan,
  handleDeleteCropPlan,
  handleAddInventory,
  handleUpdateInventory,
  handleDeleteInventory,
  handleAddEquipment,
  handleUpdateEquipment,
  handleDeleteEquipment,
  handleAddStorageFacility,
  handleUpdateStorageFacility,
  handleDeleteStorageFacility,
  handleAddBatchLot,
  handleUpdateBatchLot,
  handleDeleteBatchLot,
  handleAddQualityGrade,
  handleUpdateQualityGrade,
  handleDeleteQualityGrade,
  handleAddCertification,
  handleUpdateCertification,
  handleDeleteCertification,
  handleAddLabTest,
  handleUpdateLabTest,
  handleDeleteLabTest,
  handleAddLoanApplication,
  handleUpdateLoanApplication,
  handleDeleteLoanApplication,
  handleAddProductionCost,
  handleUpdateProductionCost,
  handleDeleteProductionCost,
  handleAddInsurance,
  handleUpdateInsurance,
  handleDeleteInsurance,
  handleAddSubsidy,
  handleUpdateSubsidy,
  handleDeleteSubsidy,
  handleAddAuction,
  handleUpdateAuction,
  handleDeleteAuction,
  handleAddContract,
  handleUpdateContract,
  handleDeleteContract,
  handleAddBulkDiscount,
  handleUpdateBulkDiscount,
  handleDeleteBulkDiscount,
  handleAddPreHarvest,
  handleUpdatePreHarvest,
  handleDeletePreHarvest,
  handleAddQualityAudit,
  // product / order
  handleUpdateOrderStatus,
  handleRejectOrder,
  setTrackingOrder,
  handleDeleteProduct,
  handleOpenEdit,
  handleToggleVisibility,
  setAddProductOpen,
  // charts
  getFarmerSalesChartData,
  getCategoryBreakdownData,
  coffeeImg,
  getLivestockImage,
}) {
  /* ── Local editing state ── each is null (add mode) or the item being edited ── */
  const [editingCropPlan, setEditingCropPlan] = useState(null);
  const [editingInventory, setEditingInventory] = useState(null);
  const [editingEquipment, setEditingEquipment] = useState(null);
  const [editingStorageFacility, setEditingStorageFacility] = useState(null);
  const [editingBatchLot, setEditingBatchLot] = useState(null);
  const [editingQualityGrade, setEditingQualityGrade] = useState(null);
  const [editingCertification, setEditingCertification] = useState(null);
  const [editingLabTest, setEditingLabTest] = useState(null);
  const [editingLoan, setEditingLoan] = useState(null);
  const [editingProductionCost, setEditingProductionCost] = useState(null);
  const [editingInsurance, setEditingInsurance] = useState(null);
  const [editingSubsidy, setEditingSubsidy] = useState(null);
  const [editingAuction, setEditingAuction] = useState(null);
  const [editingContract, setEditingContract] = useState(null);
  const [editingBulkDiscount, setEditingBulkDiscount] = useState(null);
  const [editingPreHarvest, setEditingPreHarvest] = useState(null);

  /* ── Helper: open a modal in edit mode ── */
  const openEdit = (item, setEditing, setModalOpen) => {
    setEditing(item);
    setModalOpen(true);
  };

  const subTabLabel = {
    overview: "Sales Overview",
    production: "Production & Inventory Management",
    quality: "Quality & Certification",
    financial: "Financial Tools",
    selling: "Advanced Selling",
  };
  const subTabDesc = {
    overview: "Track your product performance and order management",
    production: "Manage crop planning, inventory, equipment, and storage",
    quality: "Quality grading, certifications, and lab test management",
    financial: "Production costs, loans, insurance, and subsidies",
    selling: "Auctions, contracts, and bulk selling options",
  };

  return (
    <div>
      {/* Header banner */}
      <div className="page-hero">
        <img
          src={heroBeautiful}
          alt="Farmer dashboard"
          className="w-full h-full object-cover"
        />
        <div className="page-hero-overlay"></div>
        <div className="page-hero-content">
          <div className="max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-2">
              Farmer Dashboard
            </h2>
            <p className="text-teal-100 text-sm mb-1">
              Manage your products, track orders, and monitor your sales
              performance.
            </p>
            <p className="text-white/80 text-xs italic">
              "Growing success, one harvest at a time."
            </p>
          </div>
        </div>
      </div>

      {/* Sub-nav */}
      <div className="app-tab-bar">
        <div className="app-tab-list">
          {["overview", "production", "quality", "financial", "selling"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setDashboardSubTab(tab)}
                className={`app-tab-btn ${dashboardSubTab === tab ? "app-tab-btn-active" : ""}`}
              >
                {tab === "overview"
                  ? "Overview"
                  : tab === "production"
                    ? "Production & Inventory"
                    : tab === "quality"
                      ? "Quality & Certification"
                      : tab === "financial"
                        ? "Financial Tools"
                        : "Advanced Selling"}
              </button>
            ),
          )}
        </div>
      </div>

      {/* Title row */}
      <div className="app-section-header md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="app-page-title">{subTabLabel[dashboardSubTab]}</h2>
          <p className="app-page-subtitle">{subTabDesc[dashboardSubTab]}</p>
        </div>
        {dashboardSubTab === "overview" && (
          <button
            onClick={() => setAddProductOpen(true)}
            className="app-btn-primary mt-4 md:mt-0 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>List New Product</span>
          </button>
        )}
      </div>

      {/* ── Overview ── */}
      {dashboardSubTab === "overview" && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: "Total Orders",
                value: orders.length,
                icon: <ShoppingBag className="w-4 h-4 text-teal-600" />,
                bg: "bg-teal-500/10",
                sub: "All time",
                subColor: "text-teal-500",
              },
              {
                label: "Total Earnings",
                value: `${orders.reduce((a, o) => a + (o.paymentStatus === "paid" ? o.totalPrice : 0), 0).toLocaleString()} ETB`,
                icon: <DollarSign className="w-4 h-4 text-amber-600" />,
                bg: "bg-amber-500/10",
                sub: "Paid invoices only",
                subColor: "text-amber-500",
              },
              {
                label: "Pending Orders",
                value: orders.filter((o) => o.status === "pending").length,
                icon: <AlertTriangle className="w-4 h-4 text-orange-600" />,
                bg: "bg-orange-500/10",
                sub: "Awaiting action",
                subColor: "text-orange-500",
              },
              {
                label: "Active Listings",
                value: products.filter(
                  (p) => p.farmerId === user.id && !p.hidden,
                ).length,
                icon: <Package className="w-4 h-4 text-indigo-600" />,
                bg: "bg-indigo-500/10",
                sub: "Visible in market",
                subColor: "text-indigo-500",
              },
            ].map((card) => (
              <div
                key={card.label}
                className="glass-card rounded-2xl p-5 flex flex-col gap-1 shadow-sm"
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                    {card.label}
                  </p>
                  <div
                    className={`w-8 h-8 rounded-xl ${card.bg} flex items-center justify-center`}
                  >
                    {card.icon}
                  </div>
                </div>
                <p className="text-2xl font-black text-slate-900 dark:text-white">
                  {card.value}
                </p>
                <p className={`text-[10px] font-semibold ${card.subColor}`}>
                  {card.sub}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 glass-card rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-teal-500" />
                Monthly Sales Activity
              </h3>
              <div className="h-52">
                <Line
                  data={getFarmerSalesChartData()}
                  options={{ responsive: true, maintainAspectRatio: false }}
                />
              </div>
            </div>
            <div className="glass-card rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-500" />
                Category Breakdown
              </h3>
              <div className="h-52 flex justify-center">
                <Doughnut
                  data={getCategoryBreakdownData()}
                  options={{ responsive: true, maintainAspectRatio: false }}
                />
              </div>
            </div>
          </div>

          {/* My Listings */}
          <div className="glass-card rounded-2xl shadow-sm overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Package className="w-4 h-4 text-teal-500" />
                  My Listings
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Manage, edit, hide, or delete your products
                </p>
              </div>
              <button
                onClick={() => setAddProductOpen(true)}
                className="app-btn-primary shrink-0 px-4 py-2 text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Product</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="app-data-table">
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
                  {products.filter((p) => p.farmerId === user.id).length ===
                  0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="py-12 text-center text-slate-400 text-sm"
                      >
                        No products listed yet. Click "Add Product" to start.
                      </td>
                    </tr>
                  ) : (
                    products
                      .filter((p) => p.farmerId === user.id)
                      .map((prod) => (
                        <tr
                          key={prod.id}
                          className={`transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40 ${prod.hidden ? "opacity-50" : ""}`}
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800">
                                <img
                                  src={
                                    prod.imageUrl ||
                                    (prod.category === "Crops"
                                      ? coffeeImg
                                      : getLivestockImage(prod.type))
                                  }
                                  alt={prod.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                                  {prod.name}
                                </p>
                                <p className="text-[10px] text-slate-400">
                                  {prod.type}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 hidden sm:table-cell">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${prod.category === "Crops" ? "bg-teal-500/10 text-teal-700 dark:text-teal-400" : "bg-amber-500/10 text-amber-700 dark:text-amber-400"}`}
                            >
                              {prod.category}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm font-bold text-slate-800 dark:text-slate-200">
                            {prod.price?.toLocaleString()} ETB/{prod.unit}
                          </td>
                          <td className="py-3 px-4 hidden md:table-cell text-sm text-slate-600 dark:text-slate-300">
                            {prod.quantity} {prod.unit}
                          </td>
                          <td className="py-3 px-4 hidden lg:table-cell text-xs text-slate-500 dark:text-slate-400">
                            {prod.location}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {prod.hidden ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400">
                                Hidden
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-green-500/10 text-green-700 dark:text-green-400">
                                Live
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => handleOpenEdit(prod)}
                                title="Edit"
                                className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 transition-colors"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleToggleVisibility(prod)}
                                title={prod.hidden ? "Show" : "Hide"}
                                className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                              >
                                {prod.hidden ? (
                                  <Eye className="w-3.5 h-3.5" />
                                ) : (
                                  <EyeOff className="w-3.5 h-3.5" />
                                )}
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(prod.id)}
                                title="Delete"
                                className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-500 transition-colors"
                              >
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

          {/* Order Management */}
          <div className="glass-card rounded-2xl shadow-sm overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Truck className="w-4 h-4 text-teal-500" />
                  Order Management
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Confirm, ship, deliver, or reject unpaid orders
                </p>
              </div>
              <span className="flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                <AlertTriangle className="w-3 h-3" />
                {orders.filter((o) => o.status === "pending").length} Pending
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="app-data-table">
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
                    <tr>
                      <td
                        colSpan="6"
                        className="py-12 text-center text-slate-400 text-sm"
                      >
                        No orders yet.
                      </td>
                    </tr>
                  ) : (
                    orders.map((ord) => (
                      <tr
                        key={ord.id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <p className="font-bold text-slate-900 dark:text-white text-xs leading-tight">
                            {ord.productName}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                            {ord.id}
                          </p>
                        </td>
                        <td className="py-3 px-4 hidden sm:table-cell text-slate-600 dark:text-slate-300">
                          {ord.buyerName}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">
                          {ord.totalPrice?.toLocaleString()} ETB
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${ord.paymentStatus === "paid" ? "bg-teal-500/10 text-teal-700 dark:text-teal-400" : "bg-red-500/10 text-red-600 dark:text-red-400"}`}
                          >
                            {ord.paymentStatus === "paid"
                              ? "✓ Paid"
                              : "✗ Unpaid"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${ord.status === "delivered" ? "bg-green-500/15 text-green-700" : ord.status === "shipped" ? "bg-blue-500/15 text-blue-700" : ord.status === "confirmed" ? "bg-indigo-500/15 text-indigo-700" : ord.status === "cancelled" ? "bg-slate-200 text-slate-500" : "bg-orange-500/15 text-orange-700"}`}
                          >
                            {ord.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center gap-1 flex-wrap">
                            <button
                              onClick={() => setTrackingOrder(ord)}
                              title="Track"
                              className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                            >
                              <Truck className="w-3.5 h-3.5" />
                            </button>
                            {ord.status === "pending" && (
                              <button
                                onClick={() =>
                                  handleUpdateOrderStatus(ord.id, "confirmed")
                                }
                                className="app-btn-primary px-2 py-1 text-[10px]"
                              >
                                Confirm
                              </button>
                            )}
                            {ord.status === "confirmed" && (
                              <button
                                onClick={() =>
                                  handleUpdateOrderStatus(ord.id, "shipped")
                                }
                                className="px-2 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold"
                              >
                                Ship
                              </button>
                            )}
                            {ord.status === "shipped" && (
                              <button
                                onClick={() =>
                                  handleUpdateOrderStatus(ord.id, "delivered")
                                }
                                className="px-2 py-1 rounded-lg bg-green-600 hover:bg-green-700 text-white text-[10px] font-bold"
                              >
                                Delivered
                              </button>
                            )}
                            {(ord.status === "pending" ||
                              ord.status === "confirmed") &&
                              ord.paymentStatus !== "paid" && (
                                <button
                                  onClick={() => handleRejectOrder(ord.id)}
                                  title="Reject"
                                  className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-900/20 text-red-500 transition-colors"
                                >
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

      {/* ── Production & Inventory ── */}
      {dashboardSubTab === "production" && (
        <ProductionInventorySection
          cropPlans={cropPlans}
          inventoryItems={inventoryItems}
          equipmentList={equipmentList}
          storageFacilities={storageFacilities}
          batchLots={batchLots}
          onOpenCropPlan={() => setCropPlanModalOpen(true)}
          onOpenInventory={() => setInventoryModalOpen(true)}
          onOpenEquipment={() => setEquipmentModalOpen(true)}
          onOpenStorage={() => setStorageFacilityModalOpen(true)}
          onOpenBatch={() => setBatchLotModalOpen(true)}
          onDeleteCropPlan={handleDeleteCropPlan}
          onDeleteInventory={handleDeleteInventory}
          onDeleteEquipment={handleDeleteEquipment}
          onDeleteStorage={handleDeleteStorageFacility}
          onDeleteBatch={handleDeleteBatchLot}
          onEditCropPlan={(item) =>
            openEdit(item, setEditingCropPlan, setCropPlanModalOpen)
          }
          onEditInventory={(item) =>
            openEdit(item, setEditingInventory, setInventoryModalOpen)
          }
          onEditEquipment={(item) =>
            openEdit(item, setEditingEquipment, setEquipmentModalOpen)
          }
          onEditStorage={(item) =>
            openEdit(
              item,
              setEditingStorageFacility,
              setStorageFacilityModalOpen,
            )
          }
          onEditBatch={(item) =>
            openEdit(item, setEditingBatchLot, setBatchLotModalOpen)
          }
        />
      )}

      {/* ── Quality & Certification ── */}
      {dashboardSubTab === "quality" && (
        <QualityCertificationSection
          qualityGrades={qualityGrades}
          certifications={certifications}
          labTests={labTests}
          onOpenQualityGrade={() => setQualityGradeModalOpen(true)}
          onOpenCertification={() => setCertificationModalOpen(true)}
          onOpenLabTest={() => setLabTestModalOpen(true)}
          onOpenAudit={() => setAuditModalOpen(true)}
          onDeleteQualityGrade={handleDeleteQualityGrade}
          onDeleteCertification={handleDeleteCertification}
          onDeleteLabTest={handleDeleteLabTest}
          onEditQualityGrade={(item) =>
            openEdit(item, setEditingQualityGrade, setQualityGradeModalOpen)
          }
          onEditCertification={(item) =>
            openEdit(item, setEditingCertification, setCertificationModalOpen)
          }
          onEditLabTest={(item) =>
            openEdit(item, setEditingLabTest, setLabTestModalOpen)
          }
        />
      )}

      {/* ── Financial Tools ── */}
      {dashboardSubTab === "financial" && (
        <FinancialToolsSection
          orders={orders}
          loanApplications={loanApplications}
          productionCosts={productionCosts}
          insurancePolicies={insurancePolicies}
          subsidyApplications={subsidyApplications}
          onOpenLoan={() => setLoanModalOpen(true)}
          onOpenProductionCost={() => setProductionCostModalOpen(true)}
          onOpenInsurance={() => setInsuranceModalOpen(true)}
          onOpenSubsidy={() => setSubsidyModalOpen(true)}
          onDeleteLoan={handleDeleteLoanApplication}
          onDeleteProductionCost={handleDeleteProductionCost}
          onDeleteInsurance={handleDeleteInsurance}
          onDeleteSubsidy={handleDeleteSubsidy}
          onEditLoan={(item) =>
            openEdit(item, setEditingLoan, setLoanModalOpen)
          }
          onEditProductionCost={(item) =>
            openEdit(item, setEditingProductionCost, setProductionCostModalOpen)
          }
          onEditInsurance={(item) =>
            openEdit(item, setEditingInsurance, setInsuranceModalOpen)
          }
          onEditSubsidy={(item) =>
            openEdit(item, setEditingSubsidy, setSubsidyModalOpen)
          }
        />
      )}

      {/* ── Advanced Selling ── */}
      {dashboardSubTab === "selling" && (
        <AdvancedSellingSection
          auctionBids={auctionBids}
          contractFarming={contractFarming}
          bulkDiscounts={bulkDiscounts}
          advanceBookings={advanceBookings}
          onOpenAuction={() => setAuctionModalOpen(true)}
          onOpenContract={() => setContractModalOpen(true)}
          onOpenBulkDiscount={() => setBulkDiscountModalOpen(true)}
          onOpenPreHarvest={() => setPreHarvestModalOpen(true)}
          onDeleteAuction={handleDeleteAuction}
          onDeleteContract={handleDeleteContract}
          onDeleteBulkDiscount={handleDeleteBulkDiscount}
          onDeletePreHarvest={handleDeletePreHarvest}
          onEditAuction={(item) =>
            openEdit(item, setEditingAuction, setAuctionModalOpen)
          }
          onEditContract={(item) =>
            openEdit(item, setEditingContract, setContractModalOpen)
          }
          onEditBulkDiscount={(item) =>
            openEdit(item, setEditingBulkDiscount, setBulkDiscountModalOpen)
          }
          onEditPreHarvest={(item) =>
            openEdit(item, setEditingPreHarvest, setPreHarvestModalOpen)
          }
        />
      )}

      {/* ── All modals (add + edit) ── */}
      <FarmerDashboardModals
        cropPlanModalOpen={cropPlanModalOpen}
        inventoryModalOpen={inventoryModalOpen}
        equipmentModalOpen={equipmentModalOpen}
        qualityGradeModalOpen={qualityGradeModalOpen}
        certificationModalOpen={certificationModalOpen}
        loanModalOpen={loanModalOpen}
        auditModalOpen={auditModalOpen}
        storageFacilityModalOpen={storageFacilityModalOpen}
        batchLotModalOpen={batchLotModalOpen}
        labTestModalOpen={labTestModalOpen}
        insuranceModalOpen={insuranceModalOpen}
        subsidyModalOpen={subsidyModalOpen}
        productionCostModalOpen={productionCostModalOpen}
        auctionModalOpen={auctionModalOpen}
        contractModalOpen={contractModalOpen}
        bulkDiscountModalOpen={bulkDiscountModalOpen}
        preHarvestModalOpen={preHarvestModalOpen}
        setCropPlanModalOpen={setCropPlanModalOpen}
        setInventoryModalOpen={setInventoryModalOpen}
        setEquipmentModalOpen={setEquipmentModalOpen}
        setQualityGradeModalOpen={setQualityGradeModalOpen}
        setCertificationModalOpen={setCertificationModalOpen}
        setLoanModalOpen={setLoanModalOpen}
        setAuditModalOpen={setAuditModalOpen}
        setStorageFacilityModalOpen={setStorageFacilityModalOpen}
        setBatchLotModalOpen={setBatchLotModalOpen}
        setLabTestModalOpen={setLabTestModalOpen}
        setInsuranceModalOpen={setInsuranceModalOpen}
        setSubsidyModalOpen={setSubsidyModalOpen}
        setProductionCostModalOpen={setProductionCostModalOpen}
        setAuctionModalOpen={setAuctionModalOpen}
        setContractModalOpen={setContractModalOpen}
        setBulkDiscountModalOpen={setBulkDiscountModalOpen}
        setPreHarvestModalOpen={setPreHarvestModalOpen}
        editingCropPlan={editingCropPlan}
        editingInventory={editingInventory}
        editingEquipment={editingEquipment}
        editingQualityGrade={editingQualityGrade}
        editingCertification={editingCertification}
        editingLoan={editingLoan}
        editingStorageFacility={editingStorageFacility}
        editingBatchLot={editingBatchLot}
        editingLabTest={editingLabTest}
        editingInsurance={editingInsurance}
        editingSubsidy={editingSubsidy}
        editingProductionCost={editingProductionCost}
        editingAuction={editingAuction}
        editingContract={editingContract}
        editingBulkDiscount={editingBulkDiscount}
        editingPreHarvest={editingPreHarvest}
        setEditingCropPlan={setEditingCropPlan}
        setEditingInventory={setEditingInventory}
        setEditingEquipment={setEditingEquipment}
        setEditingQualityGrade={setEditingQualityGrade}
        setEditingCertification={setEditingCertification}
        setEditingLoan={setEditingLoan}
        setEditingStorageFacility={setEditingStorageFacility}
        setEditingBatchLot={setEditingBatchLot}
        setEditingLabTest={setEditingLabTest}
        setEditingInsurance={setEditingInsurance}
        setEditingSubsidy={setEditingSubsidy}
        setEditingProductionCost={setEditingProductionCost}
        setEditingAuction={setEditingAuction}
        setEditingContract={setEditingContract}
        setEditingBulkDiscount={setEditingBulkDiscount}
        setEditingPreHarvest={setEditingPreHarvest}
        handleAddCropPlan={handleAddCropPlan}
        handleAddInventory={handleAddInventory}
        handleAddEquipment={handleAddEquipment}
        handleAddQualityGrade={handleAddQualityGrade}
        handleAddCertification={handleAddCertification}
        handleAddLoanApplication={handleAddLoanApplication}
        handleAddQualityAudit={handleAddQualityAudit}
        handleAddStorageFacility={handleAddStorageFacility}
        handleAddBatchLot={handleAddBatchLot}
        handleAddLabTest={handleAddLabTest}
        handleAddInsurance={handleAddInsurance}
        handleAddSubsidy={handleAddSubsidy}
        handleAddProductionCost={handleAddProductionCost}
        handleAddAuction={handleAddAuction}
        handleAddContract={handleAddContract}
        handleAddBulkDiscount={handleAddBulkDiscount}
        handleAddPreHarvest={handleAddPreHarvest}
        handleUpdateCropPlan={handleUpdateCropPlan}
        handleUpdateInventory={handleUpdateInventory}
        handleUpdateEquipment={handleUpdateEquipment}
        handleUpdateQualityGrade={handleUpdateQualityGrade}
        handleUpdateCertification={handleUpdateCertification}
        handleUpdateLoanApplication={handleUpdateLoanApplication}
        handleUpdateStorageFacility={handleUpdateStorageFacility}
        handleUpdateBatchLot={handleUpdateBatchLot}
        handleUpdateLabTest={handleUpdateLabTest}
        handleUpdateInsurance={handleUpdateInsurance}
        handleUpdateSubsidy={handleUpdateSubsidy}
        handleUpdateProductionCost={handleUpdateProductionCost}
        handleUpdateAuction={handleUpdateAuction}
        handleUpdateContract={handleUpdateContract}
        handleUpdateBulkDiscount={handleUpdateBulkDiscount}
        handleUpdatePreHarvest={handleUpdatePreHarvest}
        products={products.filter((p) => p.farmerId === user?.id)}
      />
    </div>
  );
}
