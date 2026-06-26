import { X } from 'lucide-react';

export default function ModalShell({ title, subtitle, onClose, maxWidth = 'max-w-md', children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
      <div className={`w-full ${maxWidth} overflow-y-auto max-h-[90vh] relative animate-in fade-in zoom-in-95 duration-200`} style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '24px', boxShadow: '0 25px 60px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.6)' }}>
        <button onClick={onClose} className="absolute right-4.5 top-4.5 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 transition-colors z-10">
          <X className="w-4 h-4" />
        </button>
        <div className="px-6 py-8">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white text-center mb-2">{title}</h3>
          {subtitle && <p className="text-xs text-slate-400 text-center mb-6">{subtitle}</p>}
          {children}
        </div>
      </div>
    </div>
  );
}
