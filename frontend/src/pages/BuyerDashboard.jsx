import { Plus, Truck, MapPin, TrendingUp, Clock, X } from "lucide-react";
import { Doughnut } from "react-chartjs-2";

export default function BuyerDashboard({
  heroBeautiful,
  user,
  orders,
  wishlist,
  supplierReviews,
  buyerBudgets,
  buyerDashboardSubTab,
  setBuyerDashboardSubTab,
  handleRemoveFromWishlist,
  handleDeleteReview,
  setTrackingOrder,
  handleUpdateOrderStatus,
  setReviewModalOpen,
  setReviewOrderId,
  setReviewFarmerId,
  setReviewFarmerName,
  setBudgetModalOpen,
  getCategoryBreakdownData,
}) {
  const subTabLabel = {
    overview: "Purchase Overview",
    wishlist: "My Wishlist",
    reviews: "Supplier Reviews",
    financial: "Financial Management",
  };
  const subTabDesc = {
    overview: "Your agricultural procurement summary",
    wishlist: "Save products for later purchase",
    reviews: "Rate and review your suppliers",
    financial: "Manage budgets, invoices, and expenses",
  };

  return (
    <div>
      <div className="page-hero">
        <img
          src={heroBeautiful}
          alt="Buyer dashboard"
          className="w-full h-full object-cover"
        />
        <div className="page-hero-overlay"></div>
        <div className="page-hero-content">
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

      <div className="app-tab-bar">
        <div className="app-tab-list">
          {["overview", "wishlist", "reviews", "financial"].map((tab) => (
            <button
              key={tab}
              onClick={() => setBuyerDashboardSubTab(tab)}
              className={`app-tab-btn ${buyerDashboardSubTab === tab ? "app-tab-btn-active" : ""}`}
            >
              {tab === "overview"
                ? "Overview"
                : tab === "wishlist"
                  ? "Wishlist"
                  : tab === "reviews"
                    ? "Supplier Reviews"
                    : "Financial Management"}
            </button>
          ))}
        </div>
      </div>

      <div className="app-section-header md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="app-page-title">
            {subTabLabel[buyerDashboardSubTab]}
          </h2>
          <p className="app-page-subtitle">
            {subTabDesc[buyerDashboardSubTab]}
          </p>
        </div>
      </div>

      {buyerDashboardSubTab === "overview" && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: "Total Orders",
              value: orders.length,
              sub: "All time purchases",
              subColor: "text-teal-500 dark:text-teal-400",
              bg: "rgba(20,184,166,0.12)",
            },
            {
              label: "Total Spent",
              value: `${orders.reduce((acc, o) => acc + (o.paymentStatus === "paid" ? o.totalPrice : 0), 0)} ETB`,
              sub: "Paid orders only",
              subColor: "text-amber-500 dark:text-amber-400",
              bg: "rgba(217,119,6,0.12)",
            },
            {
              label: "CBE Birr Payments",
              value: orders.filter((o) => o.paymentMethod === "CBE_BIRR")
                .length,
              sub: "Mobile transfers",
              subColor: "text-indigo-500 dark:text-indigo-400",
              bg: "rgba(99,102,241,0.12)",
            },
            {
              label: "Pending Orders",
              value:
                orders.filter((o) => o.status === "pending").length +
                " Awaiting",
              sub: "Processing orders",
              subColor: "text-slate-500 dark:text-slate-400",
              bg: "rgba(20,184,166,0.1)",
            },
          ].map((card) => (
            <div
              key={card.label}
              className="glass-card rounded-2xl p-5 relative overflow-hidden"
            >
              <div
                className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl"
                style={{ background: card.bg }}
              ></div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                {card.label}
              </p>
              <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                {card.value}
              </p>
              <p className={`text-[10px] font-semibold mt-1 ${card.subColor}`}>
                {card.sub}
              </p>
            </div>
          ))}
        </div>
      )}

      {buyerDashboardSubTab === "wishlist" && (
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
            My Wishlist
          </h3>
          {wishlist.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <p>No items in your wishlist</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlist.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl"
                >
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    {item.productName}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {item.price} ETB
                  </p>
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

      {buyerDashboardSubTab === "reviews" && (
        <div className="glass-card rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Supplier Reviews
            </h3>
            <button
              onClick={() => setReviewModalOpen(true)}
              className="app-btn-primary"
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
              {supplierReviews.map((review) => (
                <div
                  key={review.id}
                  className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl flex justify-between items-center"
                >
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">
                      {review.supplierName}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Rating: {review.rating}/5 | {review.date}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      {review.comment}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {buyerDashboardSubTab === "financial" && (
        <div className="space-y-8">
          <div className="glass-card rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Budget Management
              </h3>
              <button
                onClick={() => setBudgetModalOpen(true)}
                className="app-btn-primary"
              >
                <Plus className="w-4 h-4" />
                <span>Set Budget</span>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Monthly Budget
                </p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">
                  {buyerBudgets.length > 0
                    ? buyerBudgets[0].amount + " ETB"
                    : "0 ETB"}
                </p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Spent This Month
                </p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">
                  {orders
                    .filter((o) => o.paymentStatus === "paid")
                    .reduce((sum, o) => sum + o.totalPrice, 0)}{" "}
                  ETB
                </p>
              </div>
            </div>
          </div>
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
              Invoice Management
            </h3>
            {orders.filter((o) => o.paymentStatus === "paid").length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <p>No invoices available</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders
                  .filter((o) => o.paymentStatus === "paid")
                  .map((order) => (
                    <div
                      key={order.id}
                      className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl flex justify-between items-center"
                    >
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">
                          Invoice #{order.id}
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {order.productName} | {order.quantity}{" "}
                          {order.productUnit} | {order.totalPrice} ETB
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-500">
                          Date: {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold ${order.status === "delivered" ? "bg-green-500/15 text-green-600" : "bg-amber-500/15 text-amber-600"}`}
                      >
                        {order.status}
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {buyerDashboardSubTab === "overview" && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2 glass-card rounded-2xl p-6 relative overflow-hidden">
              <div
                className="absolute -top-6 -right-6 w-32 h-32 rounded-full blur-3xl"
                style={{ background: "rgba(217,119,6,0.1)" }}
              ></div>
              <h3 className="text-md font-bold mb-4 flex items-center">
                <div className="w-7 h-7 rounded-lg bg-amber-500/15 flex items-center justify-center mr-2">
                  <TrendingUp className="w-4 h-4 text-amber-500" />
                </div>
                <span className="text-slate-900 dark:text-slate-100">
                  Purchase History by Category
                </span>
              </h3>
              <div className="h-64">
                <Doughnut
                  data={getCategoryBreakdownData()}
                  options={{ responsive: true, maintainAspectRatio: false }}
                />
              </div>
            </div>
            <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
              <div
                className="absolute -top-6 -right-6 w-32 h-32 rounded-full blur-3xl"
                style={{ background: "rgba(20,184,166,0.1)" }}
              ></div>
              <h3 className="text-md font-bold mb-4 flex items-center">
                <div className="w-7 h-7 rounded-lg bg-teal-500/15 flex items-center justify-center mr-2">
                  <MapPin className="w-4 h-4 text-teal-500" />
                </div>
                <span className="text-slate-900 dark:text-slate-100">
                  Purchase by Location
                </span>
              </h3>
              <div className="space-y-3">
                {["Alem Maya", "Babille", "Harar City"].map((location) => {
                  const locationOrders = orders.filter(
                    (o) => o.productLocation === location,
                  );
                  const locationTotal = locationOrders.reduce(
                    (sum, o) => sum + o.totalPrice,
                    0,
                  );
                  return (
                    <div
                      key={location}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {location}
                      </span>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {locationTotal} ETB
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 overflow-hidden mb-8">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              My Orders
            </h3>
            <div className="overflow-x-auto">
              <table className="app-data-table border-collapse">
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
                  {orders.map((ord) => (
                    <tr
                      key={ord.id}
                      className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-900/30"
                    >
                      <td className="py-4 px-4 font-mono text-xs">{ord.id}</td>
                      <td className="py-4 px-4">{ord.productName}</td>
                      <td className="py-4 px-4">{ord.farmerName}</td>
                      <td className="py-4 px-4">
                        {ord.quantity} {ord.productUnit}
                      </td>
                      <td className="py-4 px-4 font-black">
                        {ord.totalPrice} ETB
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${ord.status === "delivered" ? "bg-green-500/15 text-green-600" : ord.status === "shipped" ? "bg-blue-500/15 text-blue-600" : ord.status === "cancelled" ? "bg-red-500/15 text-red-600" : "bg-amber-500/15 text-amber-600"}`}
                        >
                          {ord.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`text-[10px] font-bold ${ord.paymentStatus === "paid" ? "text-teal-600 dark:text-teal-400" : "text-slate-400"}`}
                        >
                          {ord.paymentStatus === "paid" ? "Paid" : "Unpaid"} (
                          {ord.paymentMethod?.replace("_", " ")})
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
                        {ord.status === "pending" && (
                          <button
                            onClick={() =>
                              handleUpdateOrderStatus(ord.id, "cancelled")
                            }
                            className="px-2.5 py-1.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/50 text-xs font-bold"
                          >
                            Cancel
                          </button>
                        )}
                        {ord.status === "delivered" &&
                          !supplierReviews.some(
                            (r) => r.orderId === ord.id,
                          ) && (
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
                      <td
                        colSpan="8"
                        className="py-12 text-center text-slate-400"
                      >
                        No orders placed yet. Start shopping in the marketplace!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
