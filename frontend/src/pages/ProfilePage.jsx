import React, { useEffect, useState } from "react";
import { CheckCircle, Building2 } from "lucide-react";

// Validation functions
const validatePhone = (phone) => {
  // Ethiopian phone: 10 digits starting with 09 or +251 followed by 9 digits
  const cleaned = phone.replace(/\s/g, '');
  const ethiopianPhone = /^(?:\+251|0)?9\d{8}$/;
  return ethiopianPhone.test(cleaned);
};

export default function ProfilePage({
  user,
  profileName,
  setProfileName,
  profilePhone,
  setProfilePhone,
  profileLocation,
  setProfileLocation,
  profileBio,
  setProfileBio,
  profileCrops,
  setProfileCrops,
  profileCoords,
  setProfileCoords,
  profileSaved,
  handleProfileSave,
  profileCbeEnabled,
  setProfileCbeEnabled,
  profileCbeAccount,
  setProfileCbeAccount,
  profileCbePhone,
  setProfileCbePhone,
  profileTelebirrEnabled,
  setProfileTelebirrEnabled,
  profileTelebirrMerchant,
  setProfileTelebirrMerchant,
  profileTelebirrPhone,
  setProfileTelebirrPhone,
  profileAwashEnabled,
  setProfileAwashEnabled,
  profileAwashAccount,
  setProfileAwashAccount,
  profileAwashPhone,
  setProfileAwashPhone,
  token,
  initialSelectedBanks,
  initialBankAccountDetails,
}) {
  const [banks, setBanks] = useState([]);
  const [selectedBanks, setSelectedBanks] = useState(initialSelectedBanks || []);
  const [bankAccountDetails, setBankAccountDetails] = useState(initialBankAccountDetails || {});
  const [phoneErrors, setPhoneErrors] = useState({});

  useEffect(() => {
    fetchBanks();
  }, []);

  // Sync props to state when they change
  useEffect(() => {
    setSelectedBanks(initialSelectedBanks || []);
    setBankAccountDetails(initialBankAccountDetails || {});
  }, [initialSelectedBanks, initialBankAccountDetails]);

  const fetchBanks = async () => {
    try {
      const res = await fetch('/api/banks');
      if (res.ok) {
        const data = await res.json();
        setBanks(data.filter(b => b.active));
      }
    } catch (err) {
      console.error('Error fetching banks:', err);
    }
  };

  const toggleBankSelection = (bankId) => {
    setSelectedBanks(prev => 
      prev.includes(bankId) 
        ? prev.filter(id => id !== bankId)
        : [...prev, bankId]
    );
    // Initialize account details for newly selected bank
    if (!selectedBanks.includes(bankId)) {
      setBankAccountDetails(prev => ({
        ...prev,
        [bankId]: { accountNumber: '', phone: '', email: '' }
      }));
    }
  };

  const updateBankAccountDetail = (bankId, field, value) => {
    setBankAccountDetails(prev => ({
      ...prev,
      [bankId]: {
        ...prev[bankId],
        [field]: value
      }
    }));

    // Validate phone number
    if (field === 'phone') {
      if (value && !validatePhone(value)) {
        setPhoneErrors(prev => ({
          ...prev,
          [bankId]: 'Phone must be 10 digits starting with 09 or +251'
        }));
      } else {
        setPhoneErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[bankId];
          return newErrors;
        });
      }
    }
  };
  return (
    <div className="max-w-2xl mx-auto">
      <div className="app-section-header">
        <div>
          <h2 className="app-page-title">Profile Settings</h2>
          <p className="app-page-subtitle">
            Customize contact numbers, geographic location labels, coordinate
            tags, and crop varieties.
          </p>
        </div>
      </div>
      <form
        onSubmit={(e) => handleProfileSave(e, selectedBanks, bankAccountDetails)}
        className="glass-card rounded-2xl p-6 space-y-6"
      >
        {profileSaved && (
          <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-700 dark:text-teal-400 text-sm font-bold flex items-center space-x-2">
            <CheckCircle className="w-5 h-5" />
            <span>Profile updated successfully!</span>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-extrabold uppercase text-slate-400 mb-2">
              Display Name
            </label>
            <input
              type="text"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              required
              className="glass-input w-full"
            />
          </div>
          <div>
            <label className="block text-xs font-extrabold uppercase text-slate-400 mb-2">
              Phone Number
            </label>
            <input
              type="text"
              value={profilePhone}
              onChange={(e) => setProfilePhone(e.target.value)}
              required
              className="glass-input w-full"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-extrabold uppercase text-slate-400 mb-2">
            General Location
          </label>
          <input
            type="text"
            value={profileLocation}
            onChange={(e) => setProfileLocation(e.target.value)}
            required
            placeholder="e.g. Alem Maya, Babille, Harar City"
            className="glass-input w-full"
          />
        </div>
        {user.role === "farmer" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-400 mb-2">
                  GPS Coordinates (Latitude, Longitude)
                </label>
                <input
                  type="text"
                  value={profileCoords}
                  onChange={(e) => setProfileCoords(e.target.value)}
                  placeholder="e.g. 9.3900, 42.0800"
                  className="glass-input"
                />
              </div>
              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-400 mb-2">
                  Crops Cultivated (Comma Separated)
                </label>
                <input
                  type="text"
                  value={profileCrops}
                  onChange={(e) => setProfileCrops(e.target.value)}
                  placeholder="e.g. Coffee, Chat, Groundnuts"
                  className="glass-input"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-extrabold uppercase text-slate-400 mb-2">
                Farmer Biography
              </label>
              <textarea
                value={profileBio}
                onChange={(e) => setProfileBio(e.target.value)}
                rows="4"
                placeholder="Share a short bio about your farm..."
                className="glass-input min-h-[120px]"
              ></textarea>
            </div>

            {/* Farmer Payment Configuration Section */}
            <div className="mt-8 border-t border-slate-200/50 dark:border-slate-800/50 pt-6">
              <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">Payment Setup</h3>
              <p className="text-xs text-slate-400 mb-4">Set up the accounts you accept payments to. Buyers will send funds directly to these accounts when purchasing your products.</p>

              {/* Bank/Agent Selection */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/10 mb-4">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Your Payment Accounts
                </h4>
                <p className="text-[10px] text-slate-400 mb-3">Manage your bank/agent accounts where you receive payments from buyers.</p>
                
                {/* Currently configured banks */}
                {selectedBanks.length > 0 && (
                  <div className="space-y-3 mb-4">
                    {selectedBanks.map((bankId) => {
                      const bank = banks.find(b => b.id === bankId);
                      if (!bank) return null;
                      return (
                        <div key={bankId} className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{bank.name}</span>
                              <span className="text-[10px] text-slate-400 capitalize">({bank.type})</span>
                            </div>
                            <button
                              onClick={() => toggleBankSelection(bankId)}
                              className="text-xs text-red-600 hover:text-red-700 font-medium"
                            >
                              Delete
                            </button>
                          </div>
                          <div className="space-y-2 pl-0">
                            <div className="flex items-center space-x-2">
                              <span className="text-[10px] text-slate-400 w-20">{bank.type === 'agent' ? 'Cash:' : 'Account:'}</span>
                              <input
                                type="text"
                                value={bankAccountDetails[bankId]?.accountNumber || ''}
                                onChange={(e) => updateBankAccountDetail(bankId, 'accountNumber', e.target.value)}
                                className="glass-input flex-1 text-xs"
                              />
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-[10px] text-slate-400 w-20">Phone:</span>
                              <div className="flex-1">
                                <input
                                  type="text"
                                  value={bankAccountDetails[bankId]?.phone || ''}
                                  onChange={(e) => updateBankAccountDetail(bankId, 'phone', e.target.value)}
                                  className={`glass-input w-full text-xs ${phoneErrors[bankId] ? 'border-red-500' : ''}`}
                                />
                                {phoneErrors[bankId] && <p className="text-[8px] text-red-600 mt-1">{phoneErrors[bankId]}</p>}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-[10px] text-slate-400 w-20">Email:</span>
                              <input
                                type="email"
                                value={bankAccountDetails[bankId]?.email || ''}
                                onChange={(e) => updateBankAccountDetail(bankId, 'email', e.target.value)}
                                className="glass-input flex-1 text-xs"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Add new bank */}
                <div className="border-t border-slate-200 dark:border-slate-800 pt-3">
                  <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">Add New Payment Account</h5>
                  {banks.filter(b => !selectedBanks.includes(b.id)).length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No more banks/agents available to add.</p>
                  ) : (
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                      {banks.filter(b => !selectedBanks.includes(b.id)).map((bank) => (
                        <div key={bank.id} className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{bank.name}</span>
                              <span className="text-[10px] text-slate-400 capitalize">({bank.type})</span>
                            </div>
                            <button
                              onClick={() => toggleBankSelection(bank.id)}
                              className="app-btn-primary px-3 py-1 text-xs"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
        <div className="flex justify-end pt-4">
          <button 
            type="submit" 
            className="app-btn-primary px-6 py-3"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
