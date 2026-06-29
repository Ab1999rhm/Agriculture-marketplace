import { X, Truck, Package, CheckCircle, Clock, MapPin } from 'lucide-react';

export default function TrackingModal({ trackingOrder, setTrackingOrder, t }) {
  const status = trackingOrder.status;
  const logStatus = trackingOrder.logistics?.status;

  const steps = [
    {
      key: 'pending',
      label: 'Order Placed',
      detail: 'Order received and awaiting payment confirmation from the farmer.',
      icon: Clock,
      active: ['pending', 'confirmed', 'shipped', 'delivered'].includes(status),
      current: status === 'pending',
    },
    {
      key: 'confirmed',
      label: 'Payment Confirmed',
      detail: 'Payment validated by farmer. Product is being packaged and prepared.',
      icon: CheckCircle,
      active: ['confirmed', 'shipped', 'delivered'].includes(status),
      current: status === 'confirmed' && logStatus !== 'ready_for_pickup',
    },
    {
      key: 'ready_for_pickup',
      label: 'Ready for Pickup / Dispatch',
      detail: 'Package is at the cooperative hub and ready for courier pickup.',
      icon: Package,
      active: ['confirmed', 'shipped', 'delivered'].includes(status),
      current: status === 'confirmed' && logStatus === 'ready_for_pickup',
    },
    {
      key: 'shipped',
      label: 'In Transit',
      detail: 'Courier dispatched. Package is currently en-route to the destination.',
      icon: Truck,
      active: ['shipped', 'delivered'].includes(status),
      current: status === 'shipped',
    },
    {
      key: 'delivered',
      label: 'Delivered',
      detail: 'Arrived at hub / destination and disbursed to the customer.',
      icon: MapPin,
      active: status === 'delivered',
      current: status === 'delivered',
    },
  ];

  const statusColors = {
    pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
    confirmed: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400',
    shipped: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
    delivered: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
  };
  const statusLabel = {
    pending: '\u23f3 Pending',
    confirmed: '\u2705 Confirmed',
    shipped: '\ud83d\ude9a In Transit',
    delivered: '\ud83d\udcec Delivered',
    cancelled: '\u274c Cancelled',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-md">
      <div className="w-full max-w-md overflow-hidden relative p-6 animate-in fade-in zoom-in-95 duration-200 bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-600 rounded-3xl shadow-2xl">
        <button
          onClick={() => setTrackingOrder(null)}
          className="absolute right-4 top-4 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center shadow-md shadow-teal-500/20">
            <Truck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white leading-none">{t('viewLogistics')}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Real-time GPS carrier route statuses.</p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="mb-4 mt-3">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${statusColors[status] || statusColors.pending}`}>
            {statusLabel[status] || status}
          </span>
        </div>

        {/* Info Grid */}
        <div className="p-4 rounded-2xl grid grid-cols-2 gap-4 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-6">
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase block mb-0.5">Tracking Number</span>
            <span className="font-mono text-slate-900 dark:text-white">{trackingOrder.logistics?.trackingNumber || '\u2014'}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase block mb-0.5">Carrier</span>
            <span className="text-slate-900 dark:text-white">{trackingOrder.logistics?.carrier || '\u2014'}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase block mb-0.5">Estimated Delivery</span>
            <span className="text-slate-900 dark:text-white">{trackingOrder.logistics?.estimatedDelivery || '\u2014'}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase block mb-0.5">Pickup Point</span>
            <span className="text-slate-900 dark:text-white">{trackingOrder.logistics?.pickupPoint || '\u2014'}</span>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative pl-8 space-y-5 border-l-2 border-slate-200 dark:border-slate-700 ml-3">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.key} className="relative">
                {/* Timeline node */}
                <span
                  className={[
                    'absolute -left-[37px] top-0.5 w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all duration-300',
                    step.active
                      ? 'bg-teal-500 border-teal-500 text-white shadow-md shadow-teal-400/30'
                      : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-400',
                    step.current ? 'ring-4 ring-teal-200 dark:ring-teal-800 animate-pulse' : '',
                  ].join(' ')}
                >
                  <Icon className="w-2.5 h-2.5" strokeWidth={2.5} />
                </span>

                <div className={step.current ? 'opacity-100' : step.active ? 'opacity-90' : 'opacity-40'}>
                  <h4 className={`text-xs font-bold flex items-center gap-1.5 ${step.current ? 'text-teal-600 dark:text-teal-400' : 'text-slate-900 dark:text-white'}`}>
                    {step.label}
                    {step.current && (
                      <span className="px-1.5 py-0.5 text-[9px] rounded-full bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400 font-bold uppercase tracking-wide">
                        Current
                      </span>
                    )}
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{step.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
