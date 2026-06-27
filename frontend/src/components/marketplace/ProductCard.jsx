import { Clock, Heart, MapPin, ShoppingBag, User, Gavel, FileText, Percent, Sprout as SproutIcon } from 'lucide-react';

const gradeBadgeClasses = {
  A: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  B: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  C: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
};

export default function ProductCard({
  prod,
  user,
  wishlist,
  onToggleWishlist,
  onBuy,
  onDelete,
  getLivestockImage,
  coffeeImg,
  qualityGrade,
}) {
  const isWishlisted = wishlist.some((item) => item.productId === prod.id);
  const grade = qualityGrade?.grade?.toUpperCase();
  const isOutOfStock = prod.quantity <= 0;
  const isLowStock = prod.quantity > 0 && prod.quantity <= 5;
  
  // Advanced selling mode indicators
  const isAuction = prod.sellingMode === 'auction' && prod.auctionStatus === 'live';
  const hasBulkDiscount = prod.bulkDiscount && prod.bulkDiscount.active;
  const isContract = prod.sellingMode === 'contract';
  const isPreHarvest = prod.sellingMode === 'pre-harvest';

  return (
    <div className="group glass-card rounded-2xl overflow-hidden hover:scale-[1.025] hover:shadow-2xl hover:shadow-teal-500/10 dark:hover:shadow-teal-500/5 transition-all duration-400 flex flex-col justify-between relative">
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
        style={{ background: 'linear-gradient(135deg, rgba(20,184,166,0.07) 0%, rgba(217,119,6,0.05) 100%)' }}
      ></div>

      <div className="h-48 overflow-hidden relative">
        <img
          src={prod.imageUrl ? prod.imageUrl : (prod.category === 'Crops' ? coffeeImg : getLivestockImage(prod.type))}
          alt={prod.name}
          className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ${isOutOfStock ? 'grayscale opacity-60' : ''}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-sm uppercase tracking-wider shadow-lg">
              Sold Out
            </div>
          </div>
        )}
      </div>

      <div className="p-6 relative z-10">
        <div className="flex justify-between items-start gap-3 mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wide backdrop-blur-sm ${prod.category === 'Crops' ? 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border border-teal-500/20' : 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/20'}`}>
              {prod.category === 'Crops' ? '🌾 Crops' : '🐂 Livestock'}
            </span>
            {isAuction && (
              <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wide bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center gap-1">
                <Gavel className="w-3 h-3" />
                <span>LIVE AUCTION</span>
              </span>
            )}
            {isContract && (
              <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wide bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center gap-1">
                <FileText className="w-3 h-3" />
                <span>CONTRACT</span>
              </span>
            )}
            {isPreHarvest && (
              <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wide bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800 flex items-center gap-1">
                <SproutIcon className="w-3 h-3" />
                <span>PRE-HARVEST</span>
              </span>
            )}
            {hasBulkDiscount && (
              <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wide bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300 border border-rose-200 dark:border-rose-800 flex items-center gap-1">
                <Percent className="w-3 h-3" />
                <span>{prod.bulkDiscount.discountPercent}% OFF</span>
              </span>
            )}
            {grade && (
              <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wide ${gradeBadgeClasses[grade] || gradeBadgeClasses.C}`}>
                Grade {grade}
              </span>
            )}
            {isLowStock && !isOutOfStock && (
              <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wide bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
                Low Stock
              </span>
            )}
          </div>
          <span className="text-slate-500 dark:text-slate-400 text-[10px] font-bold flex items-center space-x-1 shrink-0">
            <Clock className="w-3.5 h-3.5" />
            <span>Harvest: {prod.harvestDate}</span>
          </span>
        </div>

        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors duration-300">
          {prod.name}
        </h3>
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

      <div
        className="relative z-10 px-6 py-4 flex items-center justify-between"
        style={{ background: 'rgba(248,250,252,0.4)', backdropFilter: 'blur(8px)', borderTop: '1px solid rgba(203,213,225,0.3)' }}
      >
        <div>
          {isAuction ? (
            <>
              <span className="text-xl font-black text-purple-700 dark:text-purple-300">{prod.currentBid || prod.startingPrice}</span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 ml-1">ETB Current Bid</span>
              <p className="text-[10px] font-bold uppercase mt-0.5 text-purple-600 dark:text-purple-400">
                {prod.auctionEndsAt ? `Ends: ${new Date(prod.auctionEndsAt).toLocaleDateString()}` : 'Live Auction'}
              </p>
            </>
          ) : isContract ? (
            <>
              <span className="text-xl font-black text-blue-700 dark:text-blue-300">{prod.agreedPrice}</span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 ml-1">ETB Contract Price</span>
              <p className="text-[10px] font-bold uppercase mt-0.5 text-blue-600 dark:text-blue-400">
                Qty: {prod.contractQuantity} {prod.unit}
              </p>
            </>
          ) : isPreHarvest ? (
            <>
              <span className="text-xl font-black text-green-700 dark:text-green-300">{prod.price}</span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 ml-1">ETB/{prod.unit}</span>
              <p className="text-[10px] font-bold uppercase mt-0.5 text-green-600 dark:text-green-400">
                {prod.depositPercent}% Deposit | Harvest: {prod.harvestDate}
              </p>
            </>
          ) : hasBulkDiscount ? (
            <>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-slate-900 dark:text-white">
                  {Math.round(prod.price * (1 - prod.bulkDiscount.discountPercent / 100))}
                </span>
                <span className="text-sm font-bold text-rose-600 dark:text-rose-400 line-through">{prod.price}</span>
              </div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 ml-1">ETB/{prod.unit}</span>
              <p className="text-[10px] font-bold uppercase mt-0.5 text-rose-600 dark:text-rose-400">
                {prod.bulkDiscount.discountPercent}% OFF on {prod.bulkDiscount.minQuantity}+ {prod.unit}
              </p>
            </>
          ) : (
            <>
              <span className="text-xl font-black text-slate-900 dark:text-white">{prod.price}</span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 ml-1">ETB/{prod.unit}</span>
              <p className={`text-[10px] font-bold uppercase mt-0.5 ${isOutOfStock ? 'text-red-600 dark:text-red-400' : 'text-teal-600 dark:text-teal-400'}`}>
                {isOutOfStock ? 'Sold Out' : `Stock: ${prod.quantity} ${prod.unit}`}
              </p>
            </>
          )}
        </div>

        {user?.role === 'farmer' ? (
          prod.farmerId === user.id ? (
            <button
              onClick={() => onDelete(prod.id)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: 'rgb(220,38,38)' }}
            >
              Delete
            </button>
          ) : null
        ) : (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onToggleWishlist(prod)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 ${isWishlisted ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'}`}
            >
              <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={() => onBuy(prod)}
              disabled={isOutOfStock}
              className={`glass-btn-primary px-4 py-2 text-xs flex items-center space-x-1.5 ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{isAuction ? 'Place Bid' : isContract ? 'View Contract' : isPreHarvest ? 'Reserve' : isOutOfStock ? 'Sold Out' : 'Buy Now'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
