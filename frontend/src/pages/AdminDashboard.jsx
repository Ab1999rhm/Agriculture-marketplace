import React from "react";
import { Plus, X, ShoppingBag, Eye, EyeOff, Trash2, Check, X as XIcon, FileText, Building, Sprout, Search, ChevronLeft, ChevronRight, Building2 } from "lucide-react";
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
  const [banks, setBanks] = React.useState([]);
  const [transactions, setTransactions] = React.useState([]);
  const [transactionPage, setTransactionPage] = React.useState(1);
  const [transactionSearch, setTransactionSearch] = React.useState('');
  const [transactionTotal, setTransactionTotal] = React.useState(0);
  const [transactionTotalPages, setTransactionTotalPages] = React.useState(1);
  const [editingBank, setEditingBank] = React.useState(null);
  const [bankForm, setBankForm] = React.useState({ name: '', type: 'bank' });
  const [viewingUser, setViewingUser] = React.useState(null);

  // Fetch banks and transactions on mount
  React.useEffect(() => {
    fetchBanks();
    fetchTransactions();
  }, []);

  // Fetch transactions when page or search changes
  React.useEffect(() => {
    fetchTransactions();
  }, [transactionPage, transactionSearch]);

  const fetchBanks = async () => {
    try {
      const res = await fetch('/api/admin/banks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setBanks(await res.json());
    } catch (err) {
      console.error('Error fetching banks:', err);
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await fetch(`/api/admin/transactions?page=${transactionPage}&limit=8&search=${transactionSearch}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTransactions(data.transactions);
        setTransactionTotal(data.total);
        setTransactionTotalPages(data.totalPages);
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
  };

  const handleAddBank = async () => {
    try {
      const res = await fetch('/api/admin/banks', {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bankForm)
      });
      if (res.ok) {
        fetchBanks();
        setBankForm({ name: '', type: 'bank', accountNumber: '', branch: '', phone: '', email: '' });
        confetti({ particleCount: 30, spread: 40 });
      }
    } catch (err) {
      console.error('Error adding bank:', err);
    }
  };

  const handleEditBank = (bank) => {
    setEditingBank(bank);
    setBankForm(bank);
  };

  const handleUpdateBank = async () => {
    try {
      const res = await fetch(`/api/admin/banks/${editingBank.id}`, {
        method: 'PUT',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bankForm)
      });
      if (res.ok) {
        fetchBanks();
        setEditingBank(null);
        setBankForm({ name: '', type: 'bank', accountNumber: '', branch: '', phone: '', email: '' });
        confetti({ particleCount: 30, spread: 40 });
      }
    } catch (err) {
      console.error('Error updating bank:', err);
    }
  };

  const handleDeleteBank = async (id) => {
    try {
      const res = await fetch(`/api/admin/banks/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchBanks();
    } catch (err) {
      console.error('Error deleting bank:', err);
    }
  };
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
                    <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                      {order.paymentMethod?.replace("_", " ")}
                    </p>
                    {order.paymentDetails?.ftCode && (
                      <p className="text-[9px] font-mono text-pink-600 dark:text-pink-400 font-bold">
                        Ref: {order.paymentDetails.ftCode}
                      </p>
                    )}
                    {order.paymentDetails?.cbeAccount && (
                      <p className="text-[9px] font-mono text-slate-400">
                        Acct: {order.paymentDetails.cbeAccount}
                      </p>
                    )}
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
                  <th className="py-3 px-4">Farm Info</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                {allUsers.filter(u => u.role !== 'admin').map((u) => (
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
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          u.rejected ? "bg-red-500/15 text-red-600" :
                          u.suspended ? "bg-red-500/15 text-red-600" : 
                          !u.approved && u.role !== "admin" ? "bg-amber-500/15 text-amber-600" :
                          "bg-green-500/15 text-green-600"
                        }`}
                      >
                        {u.rejected ? "Rejected" : u.suspended ? "Suspended" : !u.approved && u.role !== "admin" ? "Pending" : "Active"}
                      </span>
                    </td>
                    <td className="py-4 px-4 flex justify-center items-center space-x-2">
                      <button
                        onClick={() => setViewingUser(u)}
                        className="px-2.5 py-1.5 rounded bg-slate-600 hover:bg-slate-700 text-white text-xs font-bold flex items-center space-x-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View</span>
                      </button>
                      {u.rejected ? (
                        <span className="px-2.5 py-1.5 rounded bg-red-600 text-white text-xs font-bold flex items-center space-x-1">
                          <XIcon className="w-3 h-3" />
                          <span>Rejected</span>
                        </span>
                      ) : !u.approved && u.role === "farmer" && (
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
                              if (res.ok) {
                                fetchData();
                                confetti({ particleCount: 30, spread: 40 });
                              }
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
                      {u.role !== "admin" && (
                        <button
                          onClick={async () => {
                            if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
                              const res = await fetch(
                                `/api/admin/users/${u.id}`,
                                {
                                  method: "DELETE",
                                  headers: { Authorization: `Bearer ${token}` },
                                },
                              );
                              if (res.ok) fetchData();
                            }
                          }}
                          className="px-2.5 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center space-x-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
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
          {/* Bank/Agent Management */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Bank & Agent Management
              </h3>
            </div>
            
            {/* Add/Edit Bank Form */}
            <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
              <h4 className="font-bold text-slate-900 dark:text-white mb-4">
                {editingBank ? 'Edit Bank/Agent' : 'Add New Bank/Agent'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Bank/Agent Name"
                  value={bankForm.name}
                  onChange={(e) => setBankForm({...bankForm, name: e.target.value})}
                  className="glass-input"
                />
                <select
                  value={bankForm.type}
                  onChange={(e) => setBankForm({...bankForm, type: e.target.value})}
                  className="glass-input"
                >
                  <option value="bank">Bank</option>
                  <option value="agent">Agent</option>
                </select>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={editingBank ? handleUpdateBank : handleAddBank}
                  className="app-btn-primary"
                >
                  {editingBank ? 'Update' : 'Add'} Bank/Agent
                </button>
                {editingBank && (
                  <button
                    onClick={() => {
                      setEditingBank(null);
                      setBankForm({ name: '', type: 'bank' });
                    }}
                    className="app-btn-secondary"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            {/* Banks List */}
            <div className="overflow-x-auto">
              <table className="app-data-table border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-xs text-slate-400 font-bold uppercase">
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                  {banks.map((bank) => (
                    <tr
                      key={bank.id}
                      className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-900/30"
                    >
                      <td className="py-4 px-4">{bank.name}</td>
                      <td className="py-4 px-4 capitalize">{bank.type}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${bank.active ? 'bg-green-500/15 text-green-600' : 'bg-red-500/15 text-red-600'}`}>
                          {bank.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-4 px-4 flex justify-center items-center space-x-2">
                        <button
                          onClick={() => handleEditBank(bank)}
                          className="px-2.5 py-1.5 rounded bg-slate-600 hover:bg-slate-700 text-white text-xs font-bold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteBank(bank.id)}
                          className="px-2.5 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Transaction Logs */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Transaction History
              </h3>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    value={transactionSearch}
                    onChange={(e) => {
                      setTransactionSearch(e.target.value);
                      setTransactionPage(1);
                    }}
                    className="glass-input pl-10"
                  />
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="app-data-table border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-xs text-slate-400 font-bold uppercase">
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Farmer</th>
                    <th className="py-3 px-4">Buyer</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Bank/Agent</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                  {transactions.map((txn) => (
                    <tr
                      key={txn.id}
                      className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-900/30"
                    >
                      <td className="py-4 px-4 font-mono text-xs">{txn.orderId}</td>
                      <td className="py-4 px-4">{txn.farmerName}</td>
                      <td className="py-4 px-4">{txn.buyerName}</td>
                      <td className="py-4 px-4">{txn.amount} ETB</td>
                      <td className="py-4 px-4">{txn.bankName}</td>
                      <td className="py-4 px-4">{new Date(txn.createdAt).toLocaleString()}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${txn.status === 'completed' ? 'bg-green-500/15 text-green-600' : 'bg-amber-500/15 text-amber-600'}`}>
                          {txn.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Showing {((transactionPage - 1) * 8) + 1} to {Math.min(transactionPage * 8, transactionTotal)} of {transactionTotal} transactions
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTransactionPage(Math.max(1, transactionPage - 1))}
                  disabled={transactionPage === 1}
                  className="px-3 py-1.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Page {transactionPage} of {transactionTotalPages}
                </span>
                <button
                  onClick={() => setTransactionPage(Math.min(transactionTotalPages, transactionPage + 1))}
                  disabled={transactionPage === transactionTotalPages}
                  className="px-3 py-1.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Audit Logs */}
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

      {/* User Detail Modal */}
      {viewingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-md">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-600 rounded-3xl shadow-2xl">
            <div className="px-6 py-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  User Details
                </h3>
                <button
                  onClick={() => setViewingUser(null)}
                  className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase text-slate-600 dark:text-slate-400 mb-1">Name</label>
                    <p className="text-sm text-slate-900 dark:text-slate-100">{viewingUser.name}</p>
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase text-slate-600 dark:text-slate-400 mb-1">Role</label>
                    <p className="text-sm text-slate-900 dark:text-slate-100 capitalize">{viewingUser.role}</p>
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase text-slate-600 dark:text-slate-400 mb-1">Email</label>
                    <p className="text-sm text-slate-900 dark:text-slate-100">{viewingUser.email}</p>
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase text-slate-600 dark:text-slate-400 mb-1">Phone</label>
                    <p className="text-sm text-slate-900 dark:text-slate-100">{viewingUser.phone || 'N/A'}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-extrabold uppercase text-slate-600 dark:text-slate-400 mb-1">Location</label>
                    <p className="text-sm text-slate-900 dark:text-slate-100">{viewingUser.location || 'N/A'}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-extrabold uppercase text-slate-600 dark:text-slate-400 mb-1">National ID</label>
                    {viewingUser.nationalIdFile ? (
                      <button
                        onClick={() => window.open(`http://localhost:8080${viewingUser.nationalIdFile}`, '_blank')}
                        className="flex items-center space-x-2 text-teal-600 hover:text-teal-700 text-sm font-medium"
                      >
                        <FileText className="w-4 h-4" />
                        <span>View National ID</span>
                      </button>
                    ) : (
                      <p className="text-sm text-slate-400">Not uploaded</p>
                    )}
                  </div>
                </div>

                {viewingUser.role === 'farmer' && (
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-4">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Farm Information</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-extrabold uppercase text-slate-600 dark:text-slate-400 mb-1">Farm Name</label>
                        <p className="text-sm text-slate-900 dark:text-slate-100">{viewingUser.farmName || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="block text-[10px] font-extrabold uppercase text-slate-600 dark:text-slate-400 mb-1">Farm Size</label>
                        <p className="text-sm text-slate-900 dark:text-slate-100">{viewingUser.farmSize ? `${viewingUser.farmSize} ha` : 'N/A'}</p>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[10px] font-extrabold uppercase text-slate-600 dark:text-slate-400 mb-1">Primary Crops</label>
                        <p className="text-sm text-slate-900 dark:text-slate-100">{viewingUser.crops || 'N/A'}</p>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[10px] font-extrabold uppercase text-slate-600 dark:text-slate-400 mb-1">Bio</label>
                        <p className="text-sm text-slate-900 dark:text-slate-100">{viewingUser.bio || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-4">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Status & Actions</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          viewingUser.rejected ? "bg-red-500/15 text-red-600" :
                          viewingUser.suspended ? "bg-red-500/15 text-red-600" : 
                          !viewingUser.approved && viewingUser.role !== "admin" ? "bg-amber-500/15 text-amber-600" :
                          "bg-green-500/15 text-green-600"
                        }`}
                      >
                        {viewingUser.rejected ? "Rejected" : viewingUser.suspended ? "Suspended" : !viewingUser.approved && viewingUser.role !== "admin" ? "Pending" : "Active"}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      {!viewingUser.rejected && !viewingUser.approved && viewingUser.role === "farmer" && (
                        <>
                          <button
                            onClick={async () => {
                              const res = await fetch(
                                `/api/admin/users/${viewingUser.id}/approve`,
                                {
                                  method: "PUT",
                                  headers: { Authorization: `Bearer ${token}` },
                                },
                              );
                              if (res.ok) {
                                fetchData();
                                setViewingUser(null);
                                confetti({ particleCount: 30, spread: 40 });
                              }
                            }}
                            className="px-4 py-2 rounded bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center space-x-1"
                          >
                            <Check className="w-3 h-3" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={async () => {
                              const res = await fetch(
                                `/api/admin/users/${viewingUser.id}/reject`,
                                {
                                  method: "PUT",
                                  headers: { Authorization: `Bearer ${token}` },
                                },
                              );
                              if (res.ok) {
                                fetchData();
                                setViewingUser(null);
                                confetti({ particleCount: 30, spread: 40 });
                              }
                            }}
                            className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center space-x-1"
                          >
                            <XIcon className="w-3 h-3" />
                            <span>Reject</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
