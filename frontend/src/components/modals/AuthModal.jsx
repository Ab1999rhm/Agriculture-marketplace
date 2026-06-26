import { X, AlertTriangle } from 'lucide-react';

export default function AuthModal({
  authMode, setAuthMode,
  setAuthModalOpen,
  authEmail, setAuthEmail,
  authPassword, setAuthPassword,
  authName, setAuthName,
  authRole, setAuthRole,
  authPhone, setAuthPhone,
  authLocation, setAuthLocation,
  authError,
  handleAuthSubmit,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
      <div className="w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in-95 duration-200"
        style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '24px', boxShadow: '0 25px 60px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.6)' }}>
        <button onClick={() => setAuthModalOpen(false)} className="absolute right-4.5 top-4.5 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 transition-colors">
          <X className="w-4 h-4" />
        </button>
        <div className="px-6 py-8">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white text-center mb-6">
            {authMode === 'login' ? 'Sign In to Marketplace' : 'Register Account'}
          </h3>
          {authError && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/15 border border-red-500/20 text-red-600 text-xs font-bold flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4" /><span>{authError}</span>
            </div>
          )}
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div className="flex space-x-2 p-1 bg-slate-100 dark:bg-slate-950 rounded-xl mb-2">
              {authMode === 'register' && (
                <>
                  <button type="button" onClick={() => setAuthRole('buyer')} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${authRole === 'buyer' ? 'bg-white dark:bg-slate-900 shadow-sm text-teal-700 dark:text-teal-400' : 'text-slate-500'}`}>Buyer</button>
                  <button type="button" onClick={() => setAuthRole('farmer')} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${authRole === 'farmer' ? 'bg-white dark:bg-slate-900 shadow-sm text-teal-700 dark:text-teal-400' : 'text-slate-500'}`}>Farmer</button>
                </>
              )}
              {authMode === 'login' && (
                <>
                  <button type="button" onClick={() => setAuthRole('buyer')} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${authRole === 'buyer' ? 'bg-white dark:bg-slate-900 shadow-sm text-teal-700 dark:text-teal-400' : 'text-slate-500'}`}>Buyer</button>
                  <button type="button" onClick={() => setAuthRole('farmer')} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${authRole === 'farmer' ? 'bg-white dark:bg-slate-900 shadow-sm text-teal-700 dark:text-teal-400' : 'text-slate-500'}`}>Farmer</button>
                  <button type="button" onClick={() => setAuthRole('admin')} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${authRole === 'admin' ? 'bg-white dark:bg-slate-900 shadow-sm text-indigo-700 dark:text-indigo-400' : 'text-slate-500'}`}>Admin</button>
                </>
              )}
            </div>
            {authMode === 'register' && (
              <>
                <div><label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Full Name</label><input type="text" required value={authName} onChange={(e) => setAuthName(e.target.value)} placeholder="e.g. Kenenisa Jila" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500" /></div>
                <div><label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Phone Number</label><input type="text" required value={authPhone} onChange={(e) => setAuthPhone(e.target.value)} placeholder="e.g. 0911223344" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500" /></div>
                <div><label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Location</label><input type="text" required value={authLocation} onChange={(e) => setAuthLocation(e.target.value)} placeholder="e.g. Alem Maya" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500" /></div>
              </>
            )}
            <div><label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Email Address</label><input type="email" required value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} placeholder="name@domain.com" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500" /></div>
            <div><label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Password</label><input type="password" required value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} placeholder="••••••••" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500" /></div>
            <button type="submit" className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-sm shadow-md shadow-teal-500/20 transition-all pt-2.5 mt-4">
              {authMode === 'login' ? 'Sign In' : 'Register Account'}
            </button>
          </form>
          <div className="mt-6 text-center text-xs">
            <span className="text-slate-400 dark:text-slate-500">{authMode === 'login' ? "Don't have an account? " : 'Already have an account? '}</span>
            <button onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} className="font-bold text-teal-600 dark:text-teal-400 hover:underline">
              {authMode === 'login' ? 'Register here' : 'Sign in here'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
