import { X } from 'lucide-react';

export default function ModalShell({ title, subtitle, onClose, maxWidth = 'max-w-md', children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-md" style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
      <div className={`w-full ${maxWidth} overflow-y-auto max-h-[90vh] relative animate-in fade-in zoom-in-95 duration-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-2xl`}>
        <button onClick={onClose} className="absolute right-4.5 top-4.5 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 transition-colors z-10">
          <X className="w-4 h-4" />
        </button>
        <div className="px-6 py-8">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white text-center mb-2">{title}</h3>
          {subtitle && <p className="text-xs text-slate-600 dark:text-slate-300 text-center mb-6">{subtitle}</p>}
          {children}
        </div>
      </div>
    </div>
  );
}
