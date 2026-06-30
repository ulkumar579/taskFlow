import { Bell, Calendar, Check, Globe, Lock, Mail, MapPin, Palette, Phone, User } from "lucide-react";
import { useRef, useState } from "react";
import PreferenceRow from "./PreferenceRow";

const ProfileSettings = () => {
  // ── Profile form state ──
  const [profile, setProfile] = useState({
    fullName: "John Doe",
    jobTitle: "Product Manager",
    email: "john.doe@company.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
  });
  const [savedProfile, setSavedProfile] = useState(profile); // last saved snapshot
  const [avatar, setAvatar] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef(null);

  // ── Preferences state ──
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklySummary: true,
    darkMode: false,
    language: "English",
  });

  // ── Has unsaved changes? ──
  const hasChanges = JSON.stringify(profile) !== JSON.stringify(savedProfile);

  const handleFieldChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoClick = () => fileInputRef.current?.click();

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setAvatar(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    // simulate API call
    await new Promise((res) => setTimeout(res, 800));
    setSavedProfile(profile);
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const updatePreference = (key, value) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">


      {/* Content */}
      <div className="max-w-4xl mx-auto px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-500 mt-1 mb-6">Manage your account settings and preferences</p>

        {/* Profile Form Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <div className="flex gap-8">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-3">
              <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden">
                {avatar
                  ? <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                  : <User className="w-10 h-10 text-indigo-400" />}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
              <button
                onClick={handlePhotoClick}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                Change Photo
              </button>
            </div>

            {/* Fields */}
            <div className="flex-1 grid grid-cols-2 gap-x-6 gap-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">Full Name</label>
                <input
                  value={profile.fullName}
                  onChange={(e) => handleFieldChange("fullName", e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">Job Title</label>
                <input
                  value={profile.jobTitle}
                  onChange={(e) => handleFieldChange("jobTitle", e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleFieldChange("email", e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">Phone</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    value={profile.phone}
                    onChange={(e) => handleFieldChange("phone", e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-900 mb-1.5">Location</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    value={profile.location}
                    onChange={(e) => handleFieldChange("location", e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-100">
            {saveSuccess && (
              <span className="text-sm text-green-600 font-medium flex items-center gap-1.5">
                <Check className="w-4 h-4" /> Changes saved
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition ${
                hasChanges && !isSaving
                  ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-600/30"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Activity Stats */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mt-6">
          <h2 className="text-lg font-bold text-gray-900 mb-5">Activity Stats</h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-xl p-5 text-center">
              <div className="text-3xl font-bold text-indigo-600">24</div>
              <div className="text-sm text-gray-500 mt-1">Tasks Completed</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-5 text-center">
              <div className="text-3xl font-bold text-indigo-600">8</div>
              <div className="text-sm text-gray-500 mt-1">Projects</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-5 text-center">
              <div className="text-3xl font-bold text-indigo-600">156</div>
              <div className="text-sm text-gray-500 mt-1">Total Tasks</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-5 text-center">
              <div className="text-3xl font-bold text-indigo-600">92%</div>
              <div className="text-sm text-gray-500 mt-1">Completion Rate</div>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mt-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Preferences</h2>

          <PreferenceRow
            icon={Bell}
            title="Email Notifications"
            description="Receive email updates about your tasks"
            checked={preferences.emailNotifications}
            onChange={(v) => updatePreference("emailNotifications", v)}
          />
          <PreferenceRow
            icon={Bell}
            title="Push Notifications"
            description="Get push notifications on your device"
            checked={preferences.pushNotifications}
            onChange={(v) => updatePreference("pushNotifications", v)}
          />
          <PreferenceRow
            icon={Calendar}
            title="Weekly Summary"
            description="Receive weekly activity summaries"
            checked={preferences.weeklySummary}
            onChange={(v) => updatePreference("weeklySummary", v)}
          />
          <PreferenceRow
            icon={Palette}
            title="Dark Mode"
            description="Use dark theme"
            checked={preferences.darkMode}
            onChange={(v) => updatePreference("darkMode", v)}
          />

          {/* Language - select instead of toggle */}
          <div className="flex items-center justify-between py-5">
            <div className="flex items-start gap-3">
              <Globe className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-gray-900">Language</p>
                <p className="text-sm text-gray-500 mt-0.5">Select your preferred language</p>
              </div>
            </div>
            <select
              value={preferences.language}
              onChange={(e) => updatePreference("language", e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
              <option>Hindi</option>
            </select>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mt-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Security</h2>

          <div className="flex items-center justify-between py-5 border-b border-gray-100">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-gray-900">Password</p>
                <p className="text-sm text-gray-500 mt-0.5">Last changed 3 months ago</p>
              </div>
            </div>
            <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
              Change Password
            </button>
          </div>

          <div className="flex items-center justify-between py-5">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-gray-900">Two-Factor Authentication</p>
                <p className="text-sm text-gray-500 mt-0.5">Add an extra layer of security</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition">
              Enable
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileSettings