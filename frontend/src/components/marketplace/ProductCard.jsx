import { Clock, Heart, MapPin, ShoppingBag, User } from 'lucide-react';

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
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
      </div>

      <div className="p-6 relative z-10">
        <div className="flex justify-between items-start gap-3 mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wide backdrop-blur-sm ${prod.category === 'Crops' ? 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border border-teal-500/20' : 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/20'}`}>
              {prod.category === 'Crops' ? '🌾 Crops' : '🐂 Livestock'}
            </span>
            {grade && (
              <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wide ${gradeBadgeClasses[grade] || gradeBadgeClasses.C}`}>
                Grade {grade}
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
          <span className="text-xl font-black text-slate-900 dark:text-white">{prod.price}</span>
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 ml-1">ETB/{prod.unit}</span>
          <p className="text-[10px] text-teal-600 dark:text-teal-400 font-bold uppercase mt-0.5">Stock: {prod.quantity} {prod.unit}</p>
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
              className="glass-btn-primary px-4 py-2 text-xs flex items-center space-x-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Buy Now</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
