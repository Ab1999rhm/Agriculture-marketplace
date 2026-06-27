import { X, AlertTriangle, Upload } from 'lucide-react';

export default function AuthModal({
  authMode, setAuthMode,
  setAuthModalOpen,
  authEmail, setAuthEmail,
  authPassword, setAuthPassword,
  authName, setAuthName,
  authRole, setAuthRole,
  authPhone, setAuthPhone,
  authLocation, setAuthLocation,
  authFarmName, setAuthFarmName,
  authFarmSize, setAuthFarmSize,
  authCrops, setAuthCrops,
  authBusinessName, setAuthBusinessName,
  authBusinessType, setAuthBusinessType,
  authConfirmPassword, setAuthConfirmPassword,
  authLicenseFile, setAuthLicenseFile,
  authError,
  handleAuthSubmit,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-md">
      <div className="w-full max-w-md overflow-y-auto max-h-[90vh] relative animate-in fade-in zoom-in-95 duration-200 bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-600 rounded-3xl shadow-2xl">
        <button onClick={() => setAuthModalOpen(false)} className="absolute right-4.5 top-4.5 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 transition-colors z-10">
          <X className="w-4 h-4" />
        </button>
        <div className="px-6 py-8">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white text-center mb-6">
            {authMode === 'login' ? 'Sign In to access your dashboard' : 'Register Account'}
          </h3>
          {authError && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/15 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4" /><span>{authError}</span>
            </div>
          )}
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {authMode === 'register' && (
              <div className="flex space-x-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-2">
                <button type="button" onClick={() => setAuthRole('buyer')} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${authRole === 'buyer' ? 'bg-white dark:bg-slate-900 shadow-sm text-teal-700 dark:text-teal-400' : 'text-slate-600 dark:text-slate-400'}`}>Buyer</button>
                <button type="button" onClick={() => setAuthRole('farmer')} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${authRole === 'farmer' ? 'bg-white dark:bg-slate-900 shadow-sm text-teal-700 dark:text-teal-400' : 'text-slate-600 dark:text-slate-400'}`}>Farmer</button>
              </div>
            )}
            {authMode === 'register' && (
              <>
                <div><label className="block text-[10px] font-extrabold uppercase text-slate-600 dark:text-slate-400 mb-1">Full Name</label><input type="text" required value={authName} onChange={(e) => setAuthName(e.target.value)} placeholder="e.g. Kenenisa Jila" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500" /></div>
                <div><label className="block text-[10px] font-extrabold uppercase text-slate-600 dark:text-slate-400 mb-1">Phone Number</label><input type="text" required value={authPhone} onChange={(e) => setAuthPhone(e.target.value)} placeholder="e.g. 0911223344" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500" /></div>
                <div><label className="block text-[10px] font-extrabold uppercase text-slate-600 dark:text-slate-400 mb-1">Location/Region</label><input type="text" required value={authLocation} onChange={(e) => setAuthLocation(e.target.value)} placeholder="e.g. Hararghe, Alem Maya" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500" /></div>
                {authRole === 'farmer' && (
                  <>
                    <div><label className="block text-[10px] font-extrabold uppercase text-slate-600 dark:text-slate-400 mb-1">Farm Name (Optional)</label><input type="text" value={authFarmName || ''} onChange={(e) => setAuthFarmName && setAuthFarmName(e.target.value)} placeholder="e.g. Green Valley Farm" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500" /></div>
                    <div><label className="block text-[10px] font-extrabold uppercase text-slate-600 dark:text-slate-400 mb-1">Farm Size (Hectares)</label><input type="number" step="0.1" value={authFarmSize || ''} onChange={(e) => setAuthFarmSize && setAuthFarmSize(e.target.value)} placeholder="e.g. 5.5" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500" /></div>
                    <div><label className="block text-[10px] font-extrabold uppercase text-slate-600 dark:text-slate-400 mb-1">Primary Crops</label><input type="text" value={authCrops || ''} onChange={(e) => setAuthCrops && setAuthCrops(e.target.value)} placeholder="e.g. Coffee, Chat, Vegetables" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500" /></div>
                  </>
                )}
                {authRole === 'buyer' && (
                  <>
                    <div><label className="block text-[10px] font-extrabold uppercase text-slate-600 dark:text-slate-400 mb-1">Business Name (Optional)</label><input type="text" value={authBusinessName || ''} onChange={(e) => setAuthBusinessName && setAuthBusinessName(e.target.value)} placeholder="e.g. Hararghe Trading Co." className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500" /></div>
                    <div><label className="block text-[10px] font-extrabold uppercase text-slate-600 dark:text-slate-400 mb-1">Business Type</label><select value={authBusinessType || 'retailer'} onChange={(e) => setAuthBusinessType && setAuthBusinessType(e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500">
                      <option value="retailer">Retailer</option>
                      <option value="wholesaler">Wholesaler</option>
                      <option value="processor">Processor</option>
                      <option value="exporter">Exporter</option>
                      <option value="individual">Individual Buyer</option>
                    </select></div>
                    <div><label className="block text-[10px] font-extrabold uppercase text-slate-600 dark:text-slate-400 mb-1">Business License (Optional)</label><div className="relative">
                      <input type="file" accept="image/*,.pdf" onChange={(e) => setAuthLicenseFile && setAuthLicenseFile(e.target.files[0])} className="hidden" id="license-upload" />
                      <label htmlFor="license-upload" className="w-full bg-white dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl px-4 py-4 text-xs text-slate-600 dark:text-slate-400 cursor-pointer hover:border-teal-500 dark:hover:border-teal-400 transition-colors flex flex-col items-center justify-center space-y-2">
                        <Upload className="w-6 h-6 text-slate-400" />
                        <span className="text-center">{authLicenseFile ? authLicenseFile.name : 'Click to upload license (PDF/Image)'}</span>
                      </label>
                    </div></div>
                  </>
                )}
              </>
            )}
            <div><label className="block text-[10px] font-extrabold uppercase text-slate-600 dark:text-slate-400 mb-1">Email Address</label><input type="email" required value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} placeholder="name@domain.com" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500" /></div>
            <div><label className="block text-[10px] font-extrabold uppercase text-slate-600 dark:text-slate-400 mb-1">Password</label><input type="password" required value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} placeholder="••••••••" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500" /></div>
            {authMode === 'register' && (
              <div><label className="block text-[10px] font-extrabold uppercase text-slate-600 dark:text-slate-400 mb-1">Confirm Password</label><input type="password" required value={authConfirmPassword || ''} onChange={(e) => setAuthConfirmPassword && setAuthConfirmPassword(e.target.value)} placeholder="••••••••" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500" /></div>
            )}
            <button type="submit" className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-sm shadow-md shadow-teal-500/20 transition-all pt-2.5 mt-4">
              {authMode === 'login' ? 'Sign In' : 'Register Account'}
            </button>
          </form>
          <div className="mt-6 text-center text-xs">
            <span className="text-slate-600 dark:text-slate-400">{authMode === 'login' ? "Don't have an account? " : 'Already have an account? '}</span>
            <button onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} className="font-bold text-teal-600 dark:text-teal-400 hover:underline">
              {authMode === 'login' ? 'Register here' : 'Sign in here'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
