import { Search, Tag, MapPin, AlertTriangle } from 'lucide-react';
import ProductCard from '../components/marketplace/ProductCard';

export default function MarketPage({
  products, wishlist, user, marketQualityGrades,
  coffeeImg, getLivestockImage,
  search, setSearch, category, setCategory,
  locationFilter, setLocationFilter,
  minPrice, setMinPrice, maxPrice, setMaxPrice,
  heroBeautiful,
  onBuy, onToggleWishlist, onDeleteProduct, onOpenAuth,
  t,
}) {
  return (
    <div>
      <div className="relative rounded-3xl overflow-hidden mb-8 h-64 md:h-80">
        <img src={heroBeautiful} alt="Agricultural fields" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/80 via-teal-800/60 to-transparent"></div>
        <div className="absolute inset-0 flex items-center px-8 md:px-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-3">Agricultural Marketplace</h2>
            <p className="text-teal-100 text-sm md:text-base">Direct purchase of fresh highland crops and livestock from Hararghe's local farmers.</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Featured Products</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Browse our selection of quality agricultural products</p>
        </div>
        <div className="flex space-x-3">
          <div className="glass-card rounded-xl px-4 py-2.5 flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400/20 to-teal-600/20 border border-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Coffee Price</p>
              <p className="text-sm font-extrabold bg-gradient-to-r from-teal-600 to-teal-800 dark:from-teal-300 dark:to-teal-500 bg-clip-text text-transparent">350 ETB/kg</p>
            </div>
          </div>
          <div className="glass-card rounded-xl px-4 py-2.5 flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-600/20 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Active Hubs</p>
              <p className="text-sm font-extrabold bg-gradient-to-r from-amber-600 to-amber-800 dark:from-amber-300 dark:to-amber-500 bg-clip-text text-transparent">Babille, Alem Maya</p>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-5 mb-8 flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('searchPlaceholder')} className="glass-input w-full pl-11 pr-4" />
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="glass-input cursor-pointer dark:text-slate-300">
            <option value="">{t('filterCategory')}: All</option>
            <option value="Crops">Crops</option>
            <option value="Livestock">Livestock</option>
          </select>
          <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} className="glass-input cursor-pointer dark:text-slate-300">
            <option value="">{t('filterLocation')}: All Locations</option>
            <option value="Alem Maya">Alem Maya</option>
            <option value="Babille">Babille</option>
            <option value="Harar City">Harar City</option>
          </select>
          <div className="flex items-center space-x-2">
            <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="Min" className="glass-input w-24" />
            <span className="text-slate-500 font-bold">–</span>
            <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Max" className="glass-input w-24" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.filter((p) => !p.hidden).map((prod) => (
          <ProductCard
            key={prod.id}
            prod={prod}
            user={user}
            wishlist={wishlist}
            onDelete={onDeleteProduct}
            getLivestockImage={getLivestockImage}
            coffeeImg={coffeeImg}
            qualityGrade={marketQualityGrades.find((grade) => grade.productName?.trim().toLowerCase() === prod.name?.trim().toLowerCase())}
            onToggleWishlist={(product) => {
              if (!user) { onOpenAuth(); return; }
              const isInWishlist = wishlist.some((w) => w.productId === product.id);
              if (isInWishlist) {
                const wishlistItem = wishlist.find((w) => w.productId === product.id);
                onToggleWishlist(wishlistItem.id, 'remove');
              } else {
                onToggleWishlist(product, 'add');
              }
            }}
            onBuy={(product) => {
              if (!user) { onOpenAuth(); return; }
              onBuy(product);
            }}
          />
        ))}
        {products.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <div className="glass-card w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-5">
              <AlertTriangle className="w-10 h-10 text-slate-300 dark:text-slate-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No Listings Found</h3>
            <p className="text-slate-400 text-sm mt-1">Try modifying your filters or search keywords.</p>
          </div>
        )}
      </div>
    </div>
  );
}
