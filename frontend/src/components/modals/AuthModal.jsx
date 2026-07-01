import { X, AlertTriangle, Upload } from 'lucide-react';
import { useState } from 'react';

// Validation functions
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePhone = (phone) => {
  // Ethiopian phone: 10 digits starting with 09 or +251 followed by 9 digits
  const cleaned = phone.replace(/\s/g, '');
  const ethiopianPhone = /^(?:\+251|0)?9\d{8}$/;
  return ethiopianPhone.test(cleaned);
};

const getPasswordStrength = (password) => {
  if (!password) return { strength: 'none', score: 0 };
  
  let score = 0;
  let hasLower = /[a-z]/.test(password);
  let hasUpper = /[A-Z]/.test(password);
  let hasNumber = /[0-9]/.test(password);
  let hasSpecial = /[^a-zA-Z0-9]/.test(password);
  
  // Length scoring
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  
  // Character variety scoring
  if (hasLower) score += 1;
  if (hasUpper) score += 1;
  if (hasNumber) score += 1;
  if (hasSpecial) score += 1;
  
  // Bonus for variety
  if (hasLower && hasUpper && hasNumber && hasSpecial) score += 1;
  
  if (score <= 3) return { strength: 'weak', score, color: 'red' };
  if (score <= 5) return { strength: 'medium', score, color: 'yellow' };
  return { strength: 'strong', score, color: 'green' };
};

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
  authNationalIdFile, setAuthNationalIdFile,
  authError,
  handleAuthSubmit,
}) {
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const passwordStrength = getPasswordStrength(authPassword);

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setAuthEmail(email);
    if (email && !validateEmail(email)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const handlePhoneChange = (e) => {
    const phone = e.target.value;
    setAuthPhone(phone);
    if (phone && !validatePhone(phone)) {
      setPhoneError('Phone must be 10 digits starting with 09 or +251');
    } else {
      setPhoneError('');
    }
  };

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
                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-slate-600 dark:text-slate-400 mb-1">Phone Number</label>
                  <input 
                    type="text" 
                    required 
                    value={authPhone} 
                    onChange={handlePhoneChange} 
                    placeholder="e.g. 0911223344 or +251911223344" 
                    className={`w-full bg-white dark:bg-slate-900 border rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 ${phoneError ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-700 focus:ring-teal-500'}`}
                  />
                  {phoneError && <p className="text-[9px] text-red-600 mt-1">{phoneError}</p>}
                </div>
                <div><label className="block text-[10px] font-extrabold uppercase text-slate-600 dark:text-slate-400 mb-1">Location/Region</label><input type="text" required value={authLocation} onChange={(e) => setAuthLocation(e.target.value)} placeholder="e.g. Hararghe, Alem Maya" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500" /></div>
                {authRole === 'farmer' && (
                  <>
                    <div><label className="block text-[10px] font-extrabold uppercase text-slate-600 dark:text-slate-400 mb-1">Farm Name (Optional)</label><input type="text" value={authFarmName || ''} onChange={(e) => setAuthFarmName && setAuthFarmName(e.target.value)} placeholder="e.g. Green Valley Farm" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500" /></div>
                    <div><label className="block text-[10px] font-extrabold uppercase text-slate-600 dark:text-slate-400 mb-1">Farm Size (Hectares)</label><input type="number" step="0.1" value={authFarmSize || ''} onChange={(e) => setAuthFarmSize && setAuthFarmSize(e.target.value)} placeholder="e.g. 5.5" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500" /></div>
                    <div><label className="block text-[10px] font-extrabold uppercase text-slate-600 dark:text-slate-400 mb-1">Primary Crops</label><input type="text" value={authCrops || ''} onChange={(e) => setAuthCrops && setAuthCrops(e.target.value)} placeholder="e.g. Coffee, Chat, Vegetables" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500" /></div>
                  </>
                )}
              </>
            )}
            {authMode === 'register' && (
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-slate-600 dark:text-slate-400 mb-1">National ID (Required)</label>
                <div className="relative">
                  <input type="file" accept="image/*,.pdf" onChange={(e) => setAuthNationalIdFile && setAuthNationalIdFile(e.target.files[0])} className="hidden" id="national-id-upload" />
                  <label htmlFor="national-id-upload" className="w-full bg-white dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl px-4 py-4 text-xs text-slate-600 dark:text-slate-400 cursor-pointer hover:border-teal-500 dark:hover:border-teal-400 transition-colors flex flex-col items-center justify-center space-y-2">
                    <Upload className="w-6 h-6 text-slate-400" />
                    <span className="text-center">{authNationalIdFile ? authNationalIdFile.name : 'Click to upload national ID (PDF/Image)'}</span>
                  </label>
                </div>
              </div>
            )}
            <div>
              <label className="block text-[10px] font-extrabold uppercase text-slate-600 dark:text-slate-400 mb-1">Email Address</label>
              <input 
                type="email" 
                required 
                value={authEmail} 
                onChange={handleEmailChange} 
                placeholder="name@domain.com" 
                className={`w-full bg-white dark:bg-slate-900 border rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 ${emailError ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-700 focus:ring-teal-500'}`}
              />
              {emailError && <p className="text-[9px] text-red-600 mt-1">{emailError}</p>}
            </div>
            <div>
              <label className="block text-[10px] font-extrabold uppercase text-slate-600 dark:text-slate-400 mb-1">Password</label>
              <input 
                type="password" 
                required 
                value={authPassword} 
                onChange={(e) => setAuthPassword(e.target.value)} 
                placeholder="••••••••" 
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              {authMode === 'register' && authPassword && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          passwordStrength.strength === 'weak' ? 'bg-red-500' :
                          passwordStrength.strength === 'medium' ? 'bg-yellow-500' :
                          passwordStrength.strength === 'strong' ? 'bg-green-500' : ''
                        }`}
                        style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                      />
                    </div>
                    <span className={`text-[9px] font-bold uppercase ${
                      passwordStrength.strength === 'weak' ? 'text-red-600' :
                      passwordStrength.strength === 'medium' ? 'text-yellow-600' :
                      passwordStrength.strength === 'strong' ? 'text-green-600' : 'text-slate-400'
                    }`}>
                      {passwordStrength.strength}
                    </span>
                  </div>
                  <p className="text-[8px] text-slate-400 mt-1">Use 8+ chars with mix of letters, numbers & symbols</p>
                </div>
              )}
            </div>
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
