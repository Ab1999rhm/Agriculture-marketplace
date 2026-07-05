import { Plus, Truck, MapPin, TrendingUp, Clock, X, Gavel, FileText, Sprout as SproutIcon } from "lucide-react";
import { Doughnut } from "react-chartjs-2";
import { useTranslation } from "react-i18next";

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
  auctions = [],
  contracts = [],
  preHarvestSales = [],
}) {
  const { t } = useTranslation();
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
              {t("buyerDashboardTitle")}
            </h2>
            <p className="text-amber-100 text-sm mb-1">
              {t("buyerDashboardSubtitle")}
            </p>
            <p className="text-white/80 text-xs italic">
              {t("buyerDashboardTagline")}
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
                ? t("tabOverview")
                : tab === "wishlist"
                  ? t("tabWishlist")
                  : tab === "reviews"
                    ? t("tabReviews")
                    : t("tabFinancial")}
            </button>
          ))}
          <button
            onClick={() => setBuyerDashboardSubTab("bids")}
            className={`app-tab-btn ${buyerDashboardSubTab === "bids" ? "app-tab-btn-active" : ""}`}
          >
            <Gavel className="w-4 h-4" />
            <span>My Bids</span>
          </button>
          <button
            onClick={() => setBuyerDashboardSubTab("contracts")}
            className={`app-tab-btn ${buyerDashboardSubTab === "contracts" ? "app-tab-btn-active" : ""}`}
          >
            <FileText className="w-4 h-4" />
            <span>My Contracts</span>
          </button>
          <button
            onClick={() => setBuyerDashboardSubTab("reservations")}
            className={`app-tab-btn ${buyerDashboardSubTab === "reservations" ? "app-tab-btn-active" : ""}`}
          >
            <SproutIcon className="w-4 h-4" />
            <span>My Reservations</span>
          </button>
        </div>
      </div>

      <div className="app-section-header md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="app-page-title">
            {buyerDashboardSubTab === "overview" ? t("overviewTitle")
              : buyerDashboardSubTab === "wishlist" ? t("wishlistTitle")
              : buyerDashboardSubTab === "reviews" ? t("reviewsTitle")
              : buyerDashboardSubTab === "bids" ? "My Auction Bids"
              : buyerDashboardSubTab === "contracts" ? "My Contracts"
              : buyerDashboardSubTab === "reservations" ? "My Pre-Harvest Reservations"
              : t("financialTitle")}
          </h2>
          <p className="app-page-subtitle">
            {buyerDashboardSubTab === "overview" ? t("overviewDesc")
              : buyerDashboardSubTab === "wishlist" ? t("wishlistDesc")
              : buyerDashboardSubTab === "reviews" ? t("reviewsDesc")
              : buyerDashboardSubTab === "bids" ? "Track your auction bids and their status"
              : buyerDashboardSubTab === "contracts" ? "View your contract farming agreements"
              : buyerDashboardSubTab === "reservations" ? "Manage your pre-harvest reservations"
              : t("financialDesc")}
          </p>
        </div>
      </div>

      {buyerDashboardSubTab === "overview" && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: t("totalOrders"),
              value: orders.length,
              sub: t("allTimePurchases"),
              subColor: "text-teal-500 dark:text-teal-400",
              bg: "rgba(20,184,166,0.12)",
            },
            {
              label: t("totalSpent"),
              value: `${orders.reduce((acc, o) => acc + (o.paymentStatus === "paid" ? o.totalPrice : 0), 0)} ETB`,
              sub: t("paidOrdersOnly"),
              subColor: "text-amber-500 dark:text-amber-400",
              bg: "rgba(217,119,6,0.12)",
            },
            {
              label: t("cbeBirrPayments"),
              value: orders.filter((o) => o.paymentMethod === "CBE_BIRR").length,
              sub: t("mobileTransfers"),
              subColor: "text-indigo-500 dark:text-indigo-400",
              bg: "rgba(99,102,241,0.12)",
            },
            {
              label: t("pendingOrders"),
              value: orders.filter((o) => o.status === "pending").length + " " + t("awaiting"),
              sub: t("processingOrders"),
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
            {t("myWishlist")}
          </h3>
          {wishlist.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <p>{t("noItemsInWishlist")}</p>
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
                    {t("remove")}
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
              {t("reviewsTitle")}
            </h3>
            <button
              onClick={() => setReviewModalOpen(true)}
              className="app-btn-primary"
            >
              <Plus className="w-4 h-4" />
              <span>{t("addReview")}</span>
            </button>
          </div>
          {supplierReviews.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <p>{t("noReviewsYet")}</p>
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
                      {t("rating")}: {review.rating}/5 | {review.date}
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
                {t("budgetManagement")}
              </h3>
              <button
                onClick={() => setBudgetModalOpen(true)}
                className="app-btn-primary"
              >
                <Plus className="w-4 h-4" />
                <span>{t("setBudget")}</span>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {t("monthlyBudget")}
                </p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">
                  {buyerBudgets.length > 0
                    ? buyerBudgets[0].amount + " ETB"
                    : "0 ETB"}
                </p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {t("spentThisMonth")}
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
              {t("invoiceManagement")}
            </h3>
            {orders.filter((o) => o.paymentStatus === "paid").length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <p>{t("noInvoices")}</p>
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
                          {t("invoice")} #{order.id}
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {order.productName} | {order.quantity}{" "}
                          {order.productUnit} | {order.totalPrice} ETB
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-500">
                          {t("date")}: {new Date(order.createdAt).toLocaleDateString()}
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

      {buyerDashboardSubTab === "bids" && (
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">My Auction Bids</h3>
          {auctions.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <p className="text-sm">You haven't placed any bids yet.</p>
              <p className="text-xs mt-1">Browse the marketplace for live auctions!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {auctions.map((auction) => {
                const myBid = (auction.bids || []).filter(b => b.bidderId === user?.id).sort((a, b) => b.amount - a.amount)[0];
                const isWinning = myBid && myBid.amount === auction.currentBid;
                return (
                  <div key={auction.id} className={`p-4 rounded-xl flex justify-between items-start gap-4 ${isWinning ? 'bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800' : 'bg-slate-50 dark:bg-slate-900/50'}`}>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">{auction.product}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Your Bid: {myBid ? `${myBid.amount.toLocaleString()} ETB` : 'No bid placed'}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Current: {auction.currentBid?.toLocaleString()} ETB | Status: {auction.auctionStatus || auction.status}
                      </p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase ${isWinning ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                      {isWinning ? 'Winning' : 'Outbid'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {buyerDashboardSubTab === "contracts" && (
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">My Contracts</h3>
          {contracts.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <p className="text-sm">No contracts found.</p>
              <p className="text-xs mt-1">Browse the marketplace for contract farming opportunities!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {contracts.map((contract) => (
                <div key={contract.id} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl flex justify-between items-start gap-4">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{contract.product}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Qty: {contract.quantity} | Price: {Number(contract.agreedPrice || 0).toLocaleString()} ETB
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Due: {contract.deliveryDate} | Farmer: {contract.farmerName || 'N/A'}
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase ${
                    contract.status === 'accepted' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                    contract.status === 'rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                    contract.status === 'completed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                  }`}>
                    {contract.status || 'pending'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {buyerDashboardSubTab === "reservations" && (
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">My Pre-Harvest Reservations</h3>
          {preHarvestSales.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <p className="text-sm">No reservations yet.</p>
              <p className="text-xs mt-1">Reserve produce before harvest from the marketplace!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {preHarvestSales.map((sale) => (
                <div key={sale.id} className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl flex justify-between items-start gap-4">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{sale.crop}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Qty: {sale.quantity} | Price: {Number(sale.price || 0).toLocaleString()} ETB
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Harvest: {sale.harvestDate} | Deposit: {sale.depositPercent}%
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Status: {sale.status || 'open'}
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase ${
                    sale.status === 'reserved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                    sale.status === 'confirmed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                    sale.status === 'delivered' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
                    sale.status === 'cancelled' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                  }`}>
                    {sale.status || 'open'}
                  </span>
                </div>
              ))}
            </div>
          )}
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
                  {t("purchaseHistoryByCategory")}
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
                  {t("purchaseByLocation")}
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
              {t("myOrders")}
            </h3>
            <div className="overflow-x-auto">
              <table className="app-data-table border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-xs text-slate-400 dark:text-slate-500 font-bold uppercase">
                    <th className="py-3 px-4">{t("orderId")}</th>
                    <th className="py-3 px-4">{t("product")}</th>
                    <th className="py-3 px-4">{t("farmer")}</th>
                    <th className="py-3 px-4">{t("quantity")}</th>
                    <th className="py-3 px-4">{t("total")}</th>
                    <th className="py-3 px-4">{t("status")}</th>
                    <th className="py-3 px-4">{t("payment")}</th>
                    <th className="py-3 px-4 text-center">{t("actions")}</th>
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
                        <div>
                          <span
                            className={`text-[10px] font-extrabold uppercase ${ord.paymentStatus === "paid" ? "text-teal-600 dark:text-teal-400" : "text-slate-400"}`}
                          >
                            {ord.paymentStatus === "paid" ? t("paid") : t("unpaid")}
                          </span>
                          <span className="text-[10px] text-slate-500 block font-semibold">
                            {ord.paymentMethod?.replace("_", " ")}
                          </span>
                          {ord.paymentDetails && (
                            <div className="text-[9px] text-slate-400 dark:text-slate-500 font-mono mt-0.5 space-y-0.5">
                              {ord.paymentDetails.walletType && (
                                <p>{t("mode")}: {ord.paymentDetails.walletType === 'savings' ? t("savings") : t("wallet")}</p>
                              )}
                              {ord.paymentDetails.cbeAccount && (
                                <p className="truncate max-w-[100px]" title={ord.paymentDetails.cbeAccount}>{t("acct")}: {ord.paymentDetails.cbeAccount}</p>
                              )}
                              {ord.paymentDetails.ftCode && (
                                <p className="text-pink-600 dark:text-pink-400 font-bold truncate max-w-[100px]" title={ord.paymentDetails.ftCode}>{t("ref")}: {ord.paymentDetails.ftCode}</p>
                              )}
                            </div>
                          )}
                          {ord.transactionId && !ord.paymentDetails?.ftCode && (
                            <span className="text-[9px] font-mono text-slate-400 block truncate max-w-[100px]" title={ord.transactionId}>
                              {t("txn")}: {ord.transactionId.substring(0, 12)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 flex justify-center items-center space-x-2">
                        <button
                          onClick={() => setTrackingOrder(ord)}
                          className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center space-x-1"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>{t("track")}</span>
                        </button>
                        {ord.status === "pending" && (
                          <button
                            onClick={() =>
                              handleUpdateOrderStatus(ord.id, "cancelled")
                            }
                            className="px-2.5 py-1.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/50 text-xs font-bold"
                          >
                            {t("cancel")}
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
                              {t("review")}
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
                        {t("noOrdersYet")}
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
