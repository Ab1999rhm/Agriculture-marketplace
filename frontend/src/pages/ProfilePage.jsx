import { CheckCircle } from "lucide-react";

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
}) {
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
        onSubmit={handleProfileSave}
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

              <div className="space-y-4">
                {/* CBE Birr Setup */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/10">
                  <div className="flex items-center justify-between mb-3">
                    <label className="flex items-center space-x-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profileCbeEnabled}
                        onChange={(e) => setProfileCbeEnabled(e.target.checked)}
                        className="accent-purple-600 rounded"
                      />
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Enable CBE Birr Channel</span>
                    </label>
                    <span className="text-[9px] font-extrabold uppercase text-purple-600 px-2 py-0.5 rounded bg-purple-500/10">Commercial Bank</span>
                  </div>
                  {profileCbeEnabled && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                      <div>
                        <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">CBE Account Number</label>
                        <input
                          type="text"
                          value={profileCbeAccount}
                          onChange={(e) => setProfileCbeAccount(e.target.value.replace(/\D/g, ''))}
                          placeholder="e.g. 1000123456789"
                          className="glass-input w-full text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">CBE Wallet Phone</label>
                        <input
                          type="text"
                          value={profileCbePhone}
                          onChange={(e) => setProfileCbePhone(e.target.value)}
                          placeholder="e.g. 0912345678"
                          className="glass-input w-full text-xs"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Telebirr Setup */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/10">
                  <div className="flex items-center justify-between mb-3">
                    <label className="flex items-center space-x-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profileTelebirrEnabled}
                        onChange={(e) => setProfileTelebirrEnabled(e.target.checked)}
                        className="accent-pink-600 rounded"
                      />
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Enable telebirr Channel</span>
                    </label>
                    <span className="text-[9px] font-extrabold uppercase text-pink-600 px-2 py-0.5 rounded bg-pink-500/10">Ethio Telecom</span>
                  </div>
                  {profileTelebirrEnabled && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                      <div>
                        <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Merchant Code</label>
                        <input
                          type="text"
                          value={profileTelebirrMerchant}
                          onChange={(e) => setProfileTelebirrMerchant(e.target.value)}
                          placeholder="e.g. 889988"
                          className="glass-input w-full text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">telebirr Wallet Phone</label>
                        <input
                          type="text"
                          value={profileTelebirrPhone}
                          onChange={(e) => setProfileTelebirrPhone(e.target.value)}
                          placeholder="e.g. 0912345678"
                          className="glass-input w-full text-xs"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Awash E-Birr Setup */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/10">
                  <div className="flex items-center justify-between mb-3">
                    <label className="flex items-center space-x-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profileAwashEnabled}
                        onChange={(e) => setProfileAwashEnabled(e.target.checked)}
                        className="accent-teal-600 rounded"
                      />
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Enable Awash Birr / E-Birr Channel</span>
                    </label>
                    <span className="text-[9px] font-extrabold uppercase text-teal-600 px-2 py-0.5 rounded bg-teal-500/10">Awash Bank</span>
                  </div>
                  {profileAwashEnabled && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                      <div>
                        <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Awash Account Number</label>
                        <input
                          type="text"
                          value={profileAwashAccount}
                          onChange={(e) => setProfileAwashAccount(e.target.value)}
                          placeholder="e.g. 01304111222300"
                          className="glass-input w-full text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Awash Wallet Phone</label>
                        <input
                          type="text"
                          value={profileAwashPhone}
                          onChange={(e) => setProfileAwashPhone(e.target.value)}
                          placeholder="e.g. 0912345678"
                          className="glass-input w-full text-xs"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
        <div className="flex justify-end pt-4">
          <button type="submit" className="app-btn-primary px-6 py-3">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
