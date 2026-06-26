import { X, AlertTriangle } from 'lucide-react';

export default function CheckoutModal({
  checkoutProduct, setCheckoutProduct,
  checkoutQuantity, setCheckoutQuantity,
  checkoutPaymentMethod, setCheckoutPaymentMethod,
  checkoutPhone, setCheckoutPhone,
  checkoutAddress, setCheckoutAddress,
  paymentConfig, paymentError, t,
  handleCheckoutSubmit,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
      <div className="w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in-95 duration-200"
        style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '24px', boxShadow: '0 25px 60px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.6)' }}>
        <button onClick={() => setCheckoutProduct(null)} className="absolute right-4.5 top-4.5 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 transition-colors">
          <X className="w-4 h-4" />
        </button>
        <div className="px-6 py-8">
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">{t('checkoutTitle')}</h3>
          <p className="text-xs text-slate-400 mb-6">Confirm quantities and select payment provider.</p>
          {paymentError && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/15 border border-red-500/20 text-red-600 text-xs font-bold flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4" /><span>{paymentError}</span>
            </div>
          )}
          <form onSubmit={handleCheckoutSubmit} className="space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{checkoutProduct.name}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{checkoutProduct.price} ETB/{checkoutProduct.unit}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button type="button" onClick={() => setCheckoutQuantity(Math.max(1, checkoutQuantity - 1))} className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm">-</button>
                <span className="text-sm font-bold w-6 text-center">{checkoutQuantity}</span>
                <button type="button" onClick={() => setCheckoutQuantity(Math.min(checkoutProduct.quantity, checkoutQuantity + 1))} className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm">+</button>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-2">Payment Method</label>
              <div className="grid grid-cols-1 gap-2.5">
                {paymentConfig.cbeBirrEnabled && (
                  <label className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${checkoutPaymentMethod === 'CBE_BIRR' ? 'border-teal-500 bg-teal-500/5' : 'border-slate-200 dark:border-slate-800'}`}>
                    <div className="flex items-center space-x-2"><span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span><span className="text-xs font-bold">CBE Birr Mobile Banking (Enabled)</span></div>
                    <input type="radio" name="payment" value="CBE_BIRR" checked={checkoutPaymentMethod === 'CBE_BIRR'} onChange={() => setCheckoutPaymentMethod('CBE_BIRR')} className="accent-teal-600" />
                  </label>
                )}
                {!paymentConfig.cbeBirrEnabled && (
                  <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 text-slate-400 flex items-center space-x-2">
                    <X className="w-4 h-4 text-red-400" /><span className="text-xs font-medium">CBE Birr (Toggled Off)</span>
                  </div>
                )}
                <label className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${checkoutPaymentMethod === 'COD' ? 'border-teal-500 bg-teal-500/5' : 'border-slate-200 dark:border-slate-800'}`}>
                  <div className="flex items-center space-x-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span><span className="text-xs font-bold">{t('codPay')}</span></div>
                  <input type="radio" name="payment" value="COD" checked={checkoutPaymentMethod === 'COD'} onChange={() => setCheckoutPaymentMethod('COD')} className="accent-teal-600" />
                </label>
              </div>
            </div>
            {checkoutPaymentMethod === 'CBE_BIRR' && (
              <div><label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">CBE Birr Phone Number</label><input type="text" required value={checkoutPhone} onChange={(e) => setCheckoutPhone(e.target.value)} placeholder="e.g. 0912345678" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500" /></div>
            )}
            <div><label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Shipping Address / Pickup Hub</label><input type="text" required value={checkoutAddress} onChange={(e) => setCheckoutAddress(e.target.value)} placeholder="e.g. Alem Maya Cooperatives Hub" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500" /></div>
            <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-850">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold">{t('totalPrice')}</p>
                <p className="text-xl font-black text-slate-900 dark:text-white">{checkoutProduct.price * checkoutQuantity} ETB</p>
              </div>
              <button type="submit" className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-md shadow-teal-500/20 transition-all">Confirm Order</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
