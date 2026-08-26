import { useState } from "react";
import {
  User,
  Bell,
  Shield,
  PhoneCall,
  Save,
  Globe,
  Mail,
  Lock,
} from "lucide-react";

function Settings() {
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    {
      id: "profile",
      label: "Profile",
      icon: User,
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
    },
    {
      id: "security",
      label: "Security",
      icon: Shield,
    },
    {
      id: "ai",
      label: "AI & Calls",
      icon: PhoneCall,
    },
  ];

  return (
    <div className="space-y-6">

      {/* Header */}

      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Settings
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage your account and recruitment platform settings.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">

        {/* Tabs */}

        <div className="h-fit rounded-xl border border-slate-200 bg-white p-2 shadow-sm">

          <nav className="space-y-1">

            {tabs.map((tab) => {
              const Icon = tab.icon;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                    activeTab === tab.id
                      ? "bg-indigo-600 text-white"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}

          </nav>

        </div>

        {/* Content */}

        <div className="lg:col-span-3">

          {activeTab === "profile" && <ProfileSettings />}

          {activeTab === "notifications" && (
            <NotificationSettings />
          )}

          {activeTab === "security" && <SecuritySettings />}

          {activeTab === "ai" && <AISettings />}

        </div>

      </div>

    </div>
  );
}

/* =================================
   PROFILE
================================= */

function ProfileSettings() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">

      <div className="border-b border-slate-200 p-6">
        <h2 className="font-semibold text-slate-900">
          Profile Settings
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Update your personal account information.
        </p>
      </div>

      <div className="grid gap-5 p-6 md:grid-cols-2">

        <Input
          label="First Name"
          value="Chetan"
        />

        <Input
          label="Last Name"
          value="Ubarhande"
        />

        <Input
          label="Email"
          value="chetan@example.com"
          icon={Mail}
        />

        <Input
          label="Phone"
          value="+91 9876543210"
        />

        <Input
          label="Role"
          value="Recruitment Manager"
          disabled
        />

        <Input
          label="Location"
          value="Pune, India"
          icon={Globe}
        />

      </div>

      <div className="flex justify-end border-t border-slate-200 p-6">

        <button
          type="button"
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
        >
          <Save size={17} />
          Save Changes
        </button>

      </div>

    </div>
  );
}

/* =================================
   NOTIFICATIONS
================================= */

function NotificationSettings() {
  const [settings, setSettings] = useState({
    email: true,
    interviews: true,
    aiCalls: true,
    candidates: false,
    jobs: true,
  });

  const toggle = (key) => {
    setSettings({
      ...settings,
      [key]: !settings[key],
    });
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">

      <div className="border-b border-slate-200 p-6">
        <h2 className="font-semibold text-slate-900">
          Notification Settings
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Choose which notifications you want to receive.
        </p>
      </div>

      <div className="divide-y divide-slate-100">

        <ToggleRow
          title="Email Notifications"
          description="Receive important platform notifications by email."
          checked={settings.email}
          onChange={() => toggle("email")}
        />

        <ToggleRow
          title="Interview Reminders"
          description="Receive reminders before scheduled interviews."
          checked={settings.interviews}
          onChange={() => toggle("interviews")}
        />

        <ToggleRow
          title="AI Call Updates"
          description="Receive notifications when AI calls are completed."
          checked={settings.aiCalls}
          onChange={() => toggle("aiCalls")}
        />

        <ToggleRow
          title="Candidate Updates"
          description="Receive updates when candidate profiles change."
          checked={settings.candidates}
          onChange={() => toggle("candidates")}
        />

        <ToggleRow
          title="Job Notifications"
          description="Receive notifications for new job orders."
          checked={settings.jobs}
          onChange={() => toggle("jobs")}
        />

      </div>

    </div>
  );
}

/* =================================
   SECURITY
================================= */

function SecuritySettings() {
  return (
    <div className="space-y-6">

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900">
            Change Password
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Keep your account secure with a strong password.
          </p>
        </div>

        <div className="space-y-5 p-6">

          <Input
            label="Current Password"
            type="password"
            icon={Lock}
          />

          <Input
            label="New Password"
            type="password"
            icon={Lock}
          />

          <Input
            label="Confirm Password"
            type="password"
            icon={Lock}
          />

        </div>

        <div className="flex justify-end border-t border-slate-200 p-6">

          <button
            type="button"
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
          >
            <Save size={17} />
            Update Password
          </button>

        </div>

      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">

        <div className="flex gap-3">

          <Shield className="shrink-0 text-amber-600" />

          <div>

            <h3 className="font-medium text-amber-800">
              Two-Factor Authentication
            </h3>

            <p className="mt-1 text-sm text-amber-700">
              Add an extra layer of security to your account.
            </p>

            <button
              type="button"
              className="mt-3 rounded-lg bg-white px-4 py-2 text-sm font-medium text-amber-700 shadow-sm hover:bg-amber-100"
            >
              Enable 2FA
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

/* =================================
   AI SETTINGS
================================= */

function AISettings() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">

      <div className="border-b border-slate-200 p-6">

        <h2 className="font-semibold text-slate-900">
          AI & Call Settings
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Configure AI recruitment and voice call settings.
        </p>

      </div>

      <div className="space-y-6 p-6">

        <div>

          <label className="mb-2 block text-sm font-medium text-slate-700">
            AI Provider
          </label>

          <select className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 md:max-w-md">
            <option>OpenAI</option>
            <option>Google AI</option>
            <option>Custom AI</option>
          </select>

        </div>

        <div>

          <label className="mb-2 block text-sm font-medium text-slate-700">
            Voice Language
          </label>

          <select className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500 md:max-w-md">
            <option>English</option>
            <option>Hindi</option>
            <option>Marathi</option>
          </select>

        </div>

        <ToggleRow
          title="Enable AI Screening"
          description="Allow AI to conduct initial candidate screening."
          checked={true}
          onChange={() => {}}
        />

        <ToggleRow
          title="Automatic Call Recording"
          description="Record AI recruitment calls for review."
          checked={true}
          onChange={() => {}}
        />

        <ToggleRow
          title="Automatic Transcription"
          description="Generate transcripts after completed calls."
          checked={true}
          onChange={() => {}}
        />

      </div>

      <div className="flex justify-end border-t border-slate-200 p-6">

        <button
          type="button"
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
        >
          <Save size={17} />
          Save Settings
        </button>

      </div>

    </div>
  );
}

/* =================================
   INPUT
================================= */

function Input({
  label,
  value = "",
  type = "text",
  icon: Icon,
  disabled = false,
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <div className="relative">

        {Icon && (
          <Icon
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
        )}

        <input
          type={type}
          defaultValue={value}
          disabled={disabled}
          className={`w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 ${
            Icon ? "pl-10" : ""
          } ${
            disabled
              ? "cursor-not-allowed bg-slate-50 text-slate-400"
              : ""
          }`}
        />

      </div>

    </div>
  );
}

/* =================================
   TOGGLE
================================= */

function ToggleRow({
  title,
  description,
  checked,
  onChange,
}) {
  return (
    <div className="flex items-center justify-between gap-5 p-6">

      <div>

        <p className="text-sm font-medium text-slate-800">
          {title}
        </p>

        <p className="mt-1 text-sm text-slate-500">
          {description}
        </p>

      </div>

      <button
        type="button"
        onClick={onChange}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked
            ? "bg-indigo-600"
            : "bg-slate-300"
        }`}
      >

        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
            checked
              ? "left-6"
              : "left-1"
          }`}
        />

      </button>

    </div>
  );
}

export default Settings;