import { Plus, X, Pencil } from "lucide-react";

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

export default function AdvancedSellingSection({
  auctionBids,
  contractFarming,
  bulkDiscounts,
  advanceBookings,
  onOpenAuction,
  onOpenContract,
  onOpenBulkDiscount,
  onOpenPreHarvest,
  onDeleteAuction,
  onDeleteContract,
  onDeleteBulkDiscount,
  onDeletePreHarvest,
  onEditAuction,
  onEditContract,
  onEditBulkDiscount,
  onEditPreHarvest,
}) {
  const cards = [
    {
      title: "Auction/Bidding",
      description: "List products for competitive bidding",
      buttonLabel: "Start Auction",
      onClick: onOpenAuction,
    },
    {
      title: "Contract Farming",
      description: "Secure advance bookings with buyers",
      buttonLabel: "Create Contract",
      onClick: onOpenContract,
    },
    {
      title: "Bulk Discounts",
      description: "Set volume-based pricing tiers",
      buttonLabel: "Configure Discounts",
      onClick: onOpenBulkDiscount,
    },
    {
      title: "Pre-Harvest Sales",
      description: "Sell before harvest for guaranteed income",
      buttonLabel: "List Pre-Sale",
      onClick: onOpenPreHarvest,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Quick-launch cards */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
          Advanced Selling Options
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card) => (
            <div
              key={card.title}
              className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700"
            >
              <h4 className="font-bold text-slate-900 dark:text-white mb-2">
                {card.title}
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                {card.description}
              </p>
              <button
                onClick={card.onClick}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>{card.buttonLabel}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Live Auctions & Contracts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
            Live Auctions
          </h3>
          {auctionBids.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <p>No auctions created yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {auctionBids.map((auction) => (
                <div
                  key={auction.id}
                  className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl flex justify-between items-start gap-4"
                >
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">
                      {auction.product}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Starting:{" "}
                      {Number(auction.startingPrice || 0).toLocaleString()} ETB
                      | Min Bid: {Number(auction.minBid || 0).toLocaleString()}{" "}
                      ETB
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Duration: {auction.duration} | Status: {auction.status}
                    </p>
                  </div>
                  <ActionButtons
                    onEdit={onEditAuction ? () => onEditAuction(auction) : null}
                    onDelete={() => onDeleteAuction(auction.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
            Contract Farming
          </h3>
          {contractFarming.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <p>No contract farming deals yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {contractFarming.map((contract) => (
                <div
                  key={contract.id}
                  className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl flex justify-between items-start gap-4"
                >
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">
                      {contract.buyer} — {contract.product}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Qty: {contract.quantity} | Price:{" "}
                      {Number(contract.agreedPrice || 0).toLocaleString()} ETB
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Delivery: {contract.deliveryDate} | Status:{" "}
                      {contract.status}
                    </p>
                  </div>
                  <ActionButtons
                    onEdit={
                      onEditContract ? () => onEditContract(contract) : null
                    }
                    onDelete={() => onDeleteContract(contract.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bulk Discounts & Pre-Harvest */}
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
            Bulk Discounts
          </h3>
          {bulkDiscounts.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <p>No bulk discounts configured</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bulkDiscounts.map((discount) => (
                <div
                  key={discount.id}
                  className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl flex justify-between items-start gap-4"
                >
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">
                      {discount.product}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Minimum Qty: {discount.minQuantity} | Discount:{" "}
                      {discount.discountPercent}%
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Status: {discount.active ? "Active" : "Inactive"}
                    </p>
                  </div>
                  <ActionButtons
                    onEdit={
                      onEditBulkDiscount
                        ? () => onEditBulkDiscount(discount)
                        : null
                    }
                    onDelete={() => onDeleteBulkDiscount(discount.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
            Pre-Harvest Sales
          </h3>
          {advanceBookings.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <p>No pre-harvest sales listed</p>
            </div>
          ) : (
            <div className="space-y-4">
              {advanceBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl flex justify-between items-start gap-4"
                >
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">
                      {booking.crop}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Harvest: {booking.harvestDate} | Qty: {booking.quantity}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Price: {Number(booking.price || 0).toLocaleString()} ETB |
                      Deposit: {booking.depositPercent}%
                    </p>
                  </div>
                  <ActionButtons
                    onEdit={
                      onEditPreHarvest ? () => onEditPreHarvest(booking) : null
                    }
                    onDelete={() => onDeletePreHarvest(booking.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
