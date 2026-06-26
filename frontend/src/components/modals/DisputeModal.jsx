import { X } from 'lucide-react';

export default function DisputeModal({
  disputeResolutionModalOpen,
  setDisputeResolutionModalOpen,
  handleResolveDispute,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
      <div className="w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in-95 duration-200"
        style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '24px', boxShadow: '0 25px 60px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.6)' }}>
        <button onClick={() => setDisputeResolutionModalOpen(false)} className="absolute right-4.5 top-4.5 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 transition-colors"><X className="w-4 h-4" /></button>
        <div className="px-6 py-8">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white text-center mb-6">Resolve Dispute</h3>
          <form onSubmit={async (e) => {
            e.preventDefault();
            await handleResolveDispute(disputeResolutionModalOpen, e.target.resolution.value);
            setDisputeResolutionModalOpen(false);
          }} className="space-y-4">
            <div>
              <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Resolution</label>
              <textarea name="resolution" required className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="Resolution details..."></textarea>
            </div>
            <div className="flex justify-end pt-4 space-x-2">
              <button type="button" onClick={() => setDisputeResolutionModalOpen(false)} className="px-4.5 py-2.5 border border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-450 font-bold text-xs rounded-xl">Cancel</button>
              <button type="submit" className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-500/20 transition-all">Resolve</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
