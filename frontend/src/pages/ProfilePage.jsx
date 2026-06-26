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
