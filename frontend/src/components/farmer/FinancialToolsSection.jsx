import { DollarSign, Plus, TrendingUp, X, Pencil } from "lucide-react";

const COST_CATEGORIES = [
  "Seed",
  "Fertilizer",
  "Labor",
  "Equipment",
  "Transport",
  "Other",
];

const ActionButtons = ({ onEdit, onDelete }) => (
  <div className="flex items-center gap-1 shrink-0">
    {onEdit && (
      <button
        onClick={onEdit}
        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
      >
        <Pencil className="w-4 h-4" />
      </button>
    )}
    <button
      onClick={onDelete}
      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
    >
      <X className="w-4 h-4" />
    </button>
  </div>
);

export default function FinancialToolsSection({
  orders,
  loanApplications,
  productionCosts,
  insurancePolicies,
  subsidyApplications,
  onOpenLoan,
  onOpenProductionCost,
  onOpenInsurance,
  onOpenSubsidy,
  onDeleteLoan,
  onDeleteProductionCost,
  onDeleteInsurance,
  onDeleteSubsidy,
  onEditLoan,
  onEditProductionCost,
  onEditInsurance,
  onEditSubsidy,
}) {
  const paidOrders = orders.filter((o) => o.paymentStatus === "paid");
  const revenue = paidOrders.reduce(
    (sum, o) => sum + (Number(o.totalPrice) || 0),
    0,
  );
  const totalCosts = productionCosts.reduce(
    (sum, c) => sum + (Number(c.amount) || 0),
    0,
  );
  const profitLoss = revenue - totalCosts;

  const costByCategory = COST_CATEGORIES.reduce((acc, cat) => {
    acc[cat] = productionCosts
      .filter((c) => (c.category || "Other") === cat)
      .reduce((s, c) => s + (Number(c.amount) || 0), 0);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {/* P&L Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Paid Revenue
          </p>
          <p className="mt-2 text-2xl font-black text-teal-600 dark:text-teal-400">
            {revenue.toLocaleString()} ETB
          </p>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Recorded Costs
          </p>
          <p className="mt-2 text-2xl font-black text-amber-600 dark:text-amber-400">
            {totalCosts.toLocaleString()} ETB
          </p>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Profit / Loss
          </p>
          <p
            className={`mt-2 text-2xl font-black ${profitLoss >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
          >
            {profitLoss.toLocaleString()} ETB
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Revenue from paid orders minus entered costs
          </p>
        </div>
      </div>

      {/* Production Costs */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6 gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-teal-600" />
              Production Costs
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Track actual farming expenses
            </p>
          </div>
          <button
            onClick={onOpenProductionCost}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl flex items-center space-x-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Cost</span>
          </button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {COST_CATEGORIES.map((cat) => (
            <div
              key={cat}
              className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl"
            >
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {cat}
              </p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">
                {costByCategory[cat].toLocaleString()} ETB
              </p>
            </div>
          ))}
        </div>
        {productionCosts.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <p>No production costs entered yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {productionCosts.map((cost) => (
              <div
                key={cost.id}
                className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl flex justify-between items-start gap-4"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h4 className="font-bold text-slate-900 dark:text-white">
                      {cost.item || cost.description || cost.category}
                    </h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {cost.category || "Other"}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {Number(cost.amount || 0).toLocaleString()} ETB{" "}
                    {cost.date ? `| ${cost.date}` : ""}
                  </p>
                  {cost.notes && (
                    <p className="text-xs text-slate-500 mt-1">{cost.notes}</p>
                  )}
                </div>
                <ActionButtons
                  onEdit={
                    onEditProductionCost
                      ? () => onEditProductionCost(cost)
                      : null
                  }
                  onDelete={() => onDeleteProductionCost(cost.id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Loan Applications */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6 gap-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Loan Applications
          </h3>
          <button
            onClick={onOpenLoan}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl flex items-center space-x-2 shrink-0"
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
            {loanApplications.map((loan) => (
              <div
                key={loan.id}
                className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl flex justify-between items-start gap-4"
              >
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    {loan.loanType} -{" "}
                    {Number(loan.amount || 0).toLocaleString()} ETB
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Status: {loan.status} | Applied: {loan.applicationDate}
                  </p>
                </div>
                <ActionButtons
                  onEdit={onEditLoan ? () => onEditLoan(loan) : null}
                  onDelete={() => onDeleteLoan(loan.id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Insurance & Subsidies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6 gap-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Insurance Policies
            </h3>
            <button
              onClick={onOpenInsurance}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl flex items-center space-x-2 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Policy</span>
            </button>
          </div>
          {insurancePolicies.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <p>No insurance policies added</p>
            </div>
          ) : (
            <div className="space-y-4">
              {insurancePolicies.map((policy) => (
                <div
                  key={policy.id}
                  className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl flex justify-between items-start gap-4"
                >
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">
                      {policy.provider}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {policy.policyType} | Premium:{" "}
                      {Number(policy.premium || 0).toLocaleString()} ETB
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Coverage: {policy.coverage || "N/A"} | Expiry:{" "}
                      {policy.expiryDate || "N/A"}
                    </p>
                  </div>
                  <ActionButtons
                    onEdit={
                      onEditInsurance ? () => onEditInsurance(policy) : null
                    }
                    onDelete={() => onDeleteInsurance(policy.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-card rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6 gap-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Subsidy Applications
            </h3>
            <button
              onClick={onOpenSubsidy}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl flex items-center space-x-2 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Apply</span>
            </button>
          </div>
          {subsidyApplications.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <p>No subsidy applications submitted</p>
            </div>
          ) : (
            <div className="space-y-4">
              {subsidyApplications.map((sub) => (
                <div
                  key={sub.id}
                  className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl flex justify-between items-start gap-4"
                >
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">
                      {sub.programName}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Requested: {Number(sub.amount || 0).toLocaleString()} ETB
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Status: {sub.status || "pending"} | Submitted:{" "}
                      {sub.applicationDate || sub.createdAt || "N/A"}
                    </p>
                  </div>
                  <ActionButtons
                    onEdit={onEditSubsidy ? () => onEditSubsidy(sub) : null}
                    onDelete={() => onDeleteSubsidy(sub.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Payment History */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-teal-600" />
          Payment History
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40">
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4">Buyer</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {paidOrders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-10 text-center text-slate-400">
                    No paid orders yet
                  </td>
                </tr>
              ) : (
                paidOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900 dark:text-white">
                        {order.productName}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {order.id}
                      </p>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      {order.buyerName}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">
                      {Number(order.totalPrice || 0).toLocaleString()} ETB
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      {(order.paymentMethod || "N/A").replaceAll("_", " ")}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                        Paid
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
