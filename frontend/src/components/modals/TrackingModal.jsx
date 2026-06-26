import { X, Truck } from 'lucide-react';

export default function TrackingModal({ trackingOrder, setTrackingOrder, t }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
      <div className="w-full max-w-md overflow-hidden relative p-6 animate-in fade-in zoom-in-95 duration-200"
        style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '24px', boxShadow: '0 25px 60px rgba(0,0,0,0.15)' }}>
        <button onClick={() => setTrackingOrder(null)} className="absolute right-4.5 top-4.5 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 transition-colors">
          <X className="w-4 h-4" />
        </button>
        <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">{t('viewLogistics')}</h3>
        <p className="text-xs text-slate-400 mb-6">Real-time GPS carrier route statuses.</p>
        <div className="space-y-6">
          <div className="p-4 rounded-2xl grid grid-cols-2 gap-4 text-xs font-semibold text-slate-600 dark:text-slate-300"
            style={{ background: 'rgba(248,250,252,0.5)', border: '1px solid rgba(203,213,225,0.4)', backdropFilter: 'blur(8px)' }}>
            <div><span className="text-[10px] text-slate-400 uppercase block">Tracking Number</span><span className="font-mono text-slate-800 dark:text-white">{trackingOrder.logistics?.trackingNumber}</span></div>
            <div><span className="text-[10px] text-slate-400 uppercase block">Carrier</span><span>{trackingOrder.logistics?.carrier}</span></div>
            <div><span className="text-[10px] text-slate-400 uppercase block">Estimated Delivery</span><span>{trackingOrder.logistics?.estimatedDelivery}</span></div>
            <div><span className="text-[10px] text-slate-400 uppercase block">Pickup Point</span><span>{trackingOrder.logistics?.pickupPoint}</span></div>
          </div>
          <div className="relative pl-6 space-y-6 border-l-2 border-slate-200 dark:border-slate-800 ml-3">
            {[
              { label: 'Order Confirmed', detail: 'Payment validated, packaging listing products.', active: ['pending','confirmed','shipped','delivered'].includes(trackingOrder.status) },
              { label: 'In Transit', detail: 'Courier dispatched. Package currently en-route.', active: ['shipped','delivered'].includes(trackingOrder.status) },
              { label: 'Delivered', detail: 'Arrived at hub/destination. Disbursed to customer.', active: trackingOrder.status === 'delivered' },
            ].map((step) => (
              <div key={step.label} className="relative">
                <span className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full border-2 ${step.active ? 'bg-teal-500 border-teal-500' : 'bg-white border-slate-300'}`}></span>
                <h4 className="text-xs font-bold text-slate-950 dark:text-white">{step.label}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">{step.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
