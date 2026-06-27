import { Plus, X, ShoppingBag, Eye, EyeOff, Trash2, Check, X as XIcon, FileText, Building, Sprout } from "lucide-react";
import confetti from "canvas-confetti";

export default function AdminDashboard({
  heroBeautiful,
  adminDashboardSubTab,
  setAdminDashboardSubTab,
  adminAnalytics,
  allUsers,
  disputes,
  qualityAudits,
  auditLogs,
  paymentConfig,
  token,
  fetchData,
  user,
  onOpenAudit,
  handleDeleteQualityAudit,
  handleResolveDispute,
  allProducts,
  handleHideProduct,
  handleExpireProduct,
  handleDeleteProduct,
}) {
  return (
    <div>
      <div className="page-hero">
        <img
          src={heroBeautiful}
          alt="Admin dashboard"
          className="w-full h-full object-cover"
        />
        <div className="page-hero-overlay"></div>
        <div className="page-hero-content">
          <div className="max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-2">
              Admin Control Panel
            </h2>
            <p className="text-teal-100 text-sm mb-1">
              Manage users, monitor marketplace, publish bulletins, and oversee
              system analytics.
            </p>
            <p className="text-white/80 text-xs italic">
              "Empowering agriculture through innovation and trust."
            </p>
          </div>
        </div>
      </div>

      <div className="app-tab-bar">
        <div className="app-tab-list">
          {["overview", "users", "products", "quality", "disputes", "system"].map((tab) => (
            <button
              key={tab}
              onClick={() => setAdminDashboardSubTab(tab)}
              className={`app-tab-btn ${adminDashboardSubTab === tab ? "app-tab-btn-active" : ""}`}
            >
              {tab === "overview"
                ? "Overview"
                : tab === "users"
                  ? "User Management"
                  : tab === "products"
                    ? "Product Management"
                    : tab === "quality"
                      ? "Quality Control"
                      : tab === "disputes"
                        ? "Dispute Resolution"
                        : "System Configuration"}
            </button>
          ))}
        </div>
      </div>

      {adminDashboardSubTab === "overview" && adminAnalytics && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                label: "Total Users",
                value: adminAnalytics.users.total,
                sub: `${adminAnalytics.users.farmers} Farmers, ${adminAnalytics.users.buyers} Buyers`,
                color: "rgba(99,102,241,0.12)",
                textColor: "text-indigo-500 dark:text-indigo-400",
              },
              {
                label: "Total Products",
                value: adminAnalytics.products.total,
                sub: `${adminAnalytics.products.crops} Crops, ${adminAnalytics.products.livestock} Livestock`,
                color: "rgba(20,184,166,0.12)",
                textColor: "text-teal-500 dark:text-teal-400",
              },
              {
                label: "Total Orders",
                value: adminAnalytics.orders.total,
                sub: `${adminAnalytics.orders.paid} Paid · ${adminAnalytics.orders.revenue} ETB Revenue`,
                color: "rgba(217,119,6,0.12)",
                textColor: "text-amber-500 dark:text-amber-400",
              },
              {
                label: "Active Disputes",
                value: disputes.length,
                sub: "Require attention",
                color: "rgba(239,68,68,0.12)",
                textColor: "text-red-500 dark:text-red-400",
              },
            ].map((card) => (
              <div
                key={card.label}
                className="glass-card rounded-2xl p-5 relative overflow-hidden"
              >
                <div
                  className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl"
                  style={{ background: card.color }}
                ></div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                  {card.label}
                </p>
                <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                  {card.value}
                </p>
                <p
                  className={`text-[10px] font-semibold mt-1 ${card.textColor}`}
                >
                  {card.sub}
                </p>
              </div>
            ))}
          </div>
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
              Recent Orders Activity
            </h3>
            <div className="space-y-4">
              {adminAnalytics.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-teal-500/15 flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5 text-teal-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {order.productName}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {order.id} · {order.createdAt}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900 dark:text-white">
                      {order.totalPrice} ETB
                    </p>
                    <p
                      className={`text-[10px] font-bold ${order.paymentStatus === "paid" ? "text-teal-600" : "text-amber-600"}`}
                    >
                      {order.paymentStatus.toUpperCase()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {adminDashboardSubTab === "users" && (
        <div className="glass-card rounded-2xl p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              User Management
            </h3>
            <select className="glass-input text-xs">
              <option>All Roles</option>
              <option>Farmers</option>
              <option>Buyers</option>
              <option>Admins</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="app-data-table border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-xs text-slate-400 font-bold uppercase">
                  <th className="py-3 px-4">User ID</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Business/Farm Info</th>
                  <th className="py-3 px-4">License</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                {allUsers.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-900/30"
                  >
                    <td className="py-4 px-4 font-mono text-xs">
                      {u.id.substring(0, 8)}...
                    </td>
                    <td className="py-4 px-4">{u.name}</td>
                    <td className="py-4 px-4">{u.email}</td>
                    <td className="py-4 px-4">{u.phone || "N/A"}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${u.role === "admin" ? "bg-indigo-500/15 text-indigo-600" : u.role === "farmer" ? "bg-teal-500/15 text-teal-600" : "bg-amber-500/15 text-amber-600"}`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4 px-4">{u.location || "N/A"}</td>
                    <td className="py-4 px-4">
                      {u.role === "farmer" ? (
                        <div className="text-xs">
                          <div className="flex items-center space-x-1">
                            <Sprout className="w-3 h-3" />
                            <span>{u.farmName || "N/A"}</span>
                          </div>
                          <div className="text-slate-400">{u.farmSize ? `${u.farmSize} ha` : ""}</div>
                          <div className="text-slate-400">{u.crops || ""}</div>
                        </div>
                      ) : u.role === "buyer" ? (
                        <div className="text-xs">
                          <div className="flex items-center space-x-1">
                            <Building className="w-3 h-3" />
                            <span>{u.businessName || "N/A"}</span>
                          </div>
                          <div className="text-slate-400">{u.businessType || ""}</div>
                        </div>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {u.licenseFile ? (
                        <button
                          onClick={() => window.open(u.licenseFile, '_blank')}
                          className="flex items-center space-x-1 text-teal-600 hover:text-teal-700 text-xs"
                        >
                          <FileText className="w-3 h-3" />
                          <span>View</span>
                        </button>
                      ) : (
                        <span className="text-slate-400 text-xs">None</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          !u.approved ? "bg-amber-500/15 text-amber-600" : 
                          u.suspended ? "bg-red-500/15 text-red-600" : 
                          "bg-green-500/15 text-green-600"
                        }`}
                      >
                        {!u.approved ? "Pending" : u.suspended ? "Suspended" : "Active"}
                      </span>
                    </td>
                    <td className="py-4 px-4 flex justify-center items-center space-x-2">
                      {!u.approved && u.role !== "admin" && (
                        <>
                          <button
                            onClick={async () => {
                              const res = await fetch(
                                `/api/admin/users/${u.id}/approve`,
                                {
                                  method: "PUT",
                                  headers: { Authorization: `Bearer ${token}` },
                                },
                              );
                              if (res.ok) {
                                fetchData();
                                confetti({ particleCount: 30, spread: 40 });
                              }
                            }}
                            className="px-2.5 py-1.5 rounded bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center space-x-1"
                          >
                            <Check className="w-3 h-3" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={async () => {
                              const res = await fetch(
                                `/api/admin/users/${u.id}/reject`,
                                {
                                  method: "PUT",
                                  headers: { Authorization: `Bearer ${token}` },
                                },
                              );
                              if (res.ok) fetchData();
                            }}
                            className="px-2.5 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center space-x-1"
                          >
                            <XIcon className="w-3 h-3" />
                            <span>Reject</span>
                          </button>
                        </>
                      )}
                      {u.approved && !u.suspended && u.role !== "admin" && (
                        <button
                          onClick={async () => {
                            const res = await fetch(
                              `/api/admin/users/${u.id}/suspend`,
                              {
                                method: "PUT",
                                headers: { Authorization: `Bearer ${token}` },
                              },
                            );
                            if (res.ok) fetchData();
                          }}
                          className="px-2.5 py-1.5 rounded bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold"
                        >
                          Suspend
                        </button>
                      )}
                      {u.suspended && u.role !== "admin" && (
                        <button
                          onClick={async () => {
                            const res = await fetch(
                              `/api/admin/users/${u.id}/activate`,
                              {
                                method: "PUT",
                                headers: { Authorization: `Bearer ${token}` },
                              },
                            );
                            if (res.ok) fetchData();
                          }}
                          className="px-2.5 py-1.5 rounded bg-green-600 hover:bg-green-700 text-white text-xs font-bold"
                        >
                          Activate
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

      {adminDashboardSubTab === "products" && (
        <div className="glass-card rounded-2xl p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Product Management
            </h3>
            <select className="glass-input text-xs">
              <option>All Products</option>
              <option>Crops</option>
              <option>Livestock</option>
              <option>Equipment</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="app-data-table border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-xs text-slate-400 font-bold uppercase">
                  <th className="py-3 px-4">Product ID</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Farmer</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Quantity</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                {allProducts && allProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-900/30"
                  >
                    <td className="py-4 px-4 font-mono text-xs">
                      {product.id.substring(0, 8)}...
                    </td>
                    <td className="py-4 px-4">{product.name}</td>
                    <td className="py-4 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {product.category}
                      </span>
                    </td>
                    <td className="py-4 px-4">{product.farmerName || "N/A"}</td>
                    <td className="py-4 px-4">{product.price} ETB</td>
                    <td className="py-4 px-4">{product.quantity || 0}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          product.hidden ? "bg-slate-500/15 text-slate-600" : 
                          product.expired ? "bg-red-500/15 text-red-600" : 
                          product.quantity === 0 ? "bg-amber-500/15 text-amber-600" :
                          "bg-green-500/15 text-green-600"
                        }`}
                      >
                        {product.hidden ? "Hidden" : product.expired ? "Expired" : product.quantity === 0 ? "Out of Stock" : "Active"}
                      </span>
                    </td>
                    <td className="py-4 px-4 flex justify-center items-center space-x-2">
                      {!product.hidden && (
                        <button
                          onClick={() => handleHideProduct && handleHideProduct(product.id)}
                          className="px-2.5 py-1.5 rounded bg-slate-600 hover:bg-slate-700 text-white text-xs font-bold flex items-center space-x-1"
                          title="Hide product"
                        >
                          <EyeOff className="w-3 h-3" />
                          <span>Hide</span>
                        </button>
                      )}
                      {product.hidden && (
                        <button
                          onClick={() => handleHideProduct && handleHideProduct(product.id)}
                          className="px-2.5 py-1.5 rounded bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center space-x-1"
                          title="Show product"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Show</span>
                        </button>
                      )}
                      {!product.expired && (
                        <button
                          onClick={() => handleExpireProduct && handleExpireProduct(product.id)}
                          className="px-2.5 py-1.5 rounded bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center space-x-1"
                          title="Expire product"
                        >
                          <XIcon className="w-3 h-3" />
                          <span>Expire</span>
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteProduct && handleDeleteProduct(product.id)}
                        className="px-2.5 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center space-x-1"
                        title="Delete product"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {adminDashboardSubTab === "quality" && (
        <div className="glass-card rounded-2xl p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Quality Audits
            </h3>
            <button onClick={onOpenAudit} className="app-btn-primary">
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
              {qualityAudits.map((audit) => (
                <div
                  key={audit.id}
                  className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl flex justify-between items-center"
                >
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">
                      {audit.target} - {audit.type}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Scheduled: {audit.scheduledDate} | Status: {audit.status}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteQualityAudit(audit.id)}
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

      {adminDashboardSubTab === "disputes" && (
        <div className="glass-card rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
            Dispute Resolution
          </h3>
          {disputes.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <p>No active disputes</p>
            </div>
          ) : (
            <div className="space-y-4">
              {disputes.map((dispute) => (
                <div
                  key={dispute.id}
                  className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">
                        Dispute #{dispute.id}
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Type: {dispute.type} | Status: {dispute.status}
                      </p>
                    </div>
                    {dispute.status !== "resolved" && (
                      <button
                        onClick={() =>
                          handleResolveDispute(dispute.id, {
                            resolution: "Resolved by admin",
                            resolvedBy: user.name,
                          })
                        }
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg"
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {dispute.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {adminDashboardSubTab === "system" && (
        <div className="space-y-8">
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
              Payment Gateway Configuration
            </h3>
            <div className="space-y-4">
              {[
                {
                  name: "CBE Birr",
                  desc: "Commercial Bank of Ethiopia mobile payment",
                  enabled: paymentConfig.cbeBirrEnabled,
                },
                {
                  name: "Telebirr",
                  desc: "Ethio Telecom mobile payment",
                  enabled: paymentConfig.telebirrEnabled,
                },
                {
                  name: "Cash on Delivery",
                  desc: "Pay upon delivery option",
                  enabled: paymentConfig.codEnabled,
                },
              ].map((gw) => (
                <div
                  key={gw.name}
                  className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl"
                >
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">
                      {gw.name}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {gw.desc}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${gw.enabled ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                  >
                    {gw.enabled ? "Enabled" : "Disabled"}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
              Audit Logs
            </h3>
            {auditLogs.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <p>No audit logs available</p>
              </div>
            ) : (
              <div className="space-y-4">
                {auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl"
                  >
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {log.action} by {log.user} at {log.timestamp}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
