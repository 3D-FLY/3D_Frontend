import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Eye, EyeOff, Trash2, Check, X } from "lucide-react";
import DashboardLayout from "../../../features/dashboard/DashboardLayout.js";
import DashboardCard from "../../../features/dashboard/components/DashboardCard.js";
import Input from "../../../components/ui/Input.js";

// ─── Shared constants ─────────────────────────────────────────────────────────

const INPUT =
  "w-full rounded-md border border-white/10 bg-[rgba(5,10,7,0.7)] px-3 py-2 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-[#5ac422] transition-colors";
const SAVE_BTN =
  "h-10 px-6 rounded-md bg-[#5ac422] text-[13px] font-extrabold uppercase italic tracking-wide text-black hover:brightness-110 transition-opacity";
const LABEL =
  "block text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-400 mb-1.5";

const EXPAND = {
  initial:    { height: 0, opacity: 0 },
  animate:    { height: "auto", opacity: 1 },
  exit:       { height: 0, opacity: 0 },
  transition: { duration: 0.25, ease: "easeInOut" },
};

// ─── Shared: Initials circle ──────────────────────────────────────────────────

function initialsOf(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function InitialsAvatar({ name, size = 32 }) {
  return (
    <div
      style={{ width: size, height: size, minWidth: size, fontSize: size * 0.35 }}
      className="rounded-full bg-[#5ac422]/20 border border-[#5ac422]/30 flex items-center justify-center select-none font-bold text-[#5ac422] leading-none"
    >
      {initialsOf(name)}
    </div>
  );
}

// ─── Change Password Modal ────────────────────────────────────────────────────

function ChangePasswordModal({ onClose }) {
  const [pwForm, setPwForm] = useState({ newPw: "", confirm: "" });

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-[rgba(149,149,149,0.08)] backdrop-blur-[12px]"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-[rgba(5,10,7,0.97)] p-6 flex flex-col gap-5 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>

        <h2 className="text-base font-bold uppercase tracking-widest text-white">
          Change Password
        </h2>

        <Input
          label="New Password"
          password
          placeholder="Enter new password"
          value={pwForm.newPw}
          onChange={(e) => setPwForm((f) => ({ ...f, newPw: e.target.value }))}
          wrapperClassName="w-full"
        />
        <Input
          label="Confirm Password"
          password
          placeholder="Confirm new password"
          value={pwForm.confirm}
          onChange={(e) => setPwForm((f) => ({ ...f, confirm: e.target.value }))}
          wrapperClassName="w-full"
        />

        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-md border border-white/10 py-2 text-sm text-zinc-300 hover:text-white hover:border-white/30 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-md bg-[#5ac422] py-2 text-sm font-extrabold uppercase italic tracking-wide text-black hover:brightness-110 transition-all"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Section 1: Profile Header (no card) ─────────────────────────────────────

function ProfileHeader() {
  const [photo, setPhoto]         = useState(null);
  const [hovering, setHovering]   = useState(false);
  const [pwVisible, setPwVisible] = useState(false);
  const [changingPw, setChangingPw] = useState(false);
  const fileRef = useRef(null);

  // auto-hide the plain-text password after 3 s
  useEffect(() => {
    if (!pwVisible) return;
    const t = setTimeout(() => setPwVisible(false), 3000);
    return () => clearTimeout(t);
  }, [pwVisible]);

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhoto(ev.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <>
    <div className="flex items-center gap-10 py-10">

      {/* Avatar */}
      <div
        className="relative flex-shrink-0 w-32 h-32 rounded-full cursor-pointer"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onClick={() => fileRef.current?.click()}
      >
        {photo ? (
          <img
            src={photo}
            alt="Profile"
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-[#5ac422]/20 border-2 border-[#5ac422]/40 flex items-center justify-center select-none">
            <span className="text-[#5ac422] font-bold text-4xl">RM</span>
          </div>
        )}
        <AnimatePresence>
          {hovering && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center pointer-events-none"
            >
              <Camera size={28} className="text-white" />
            </motion.div>
          )}
        </AnimatePresence>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handlePhoto}
        />
      </div>

      {/* User info */}
      <div className="flex flex-col gap-4 min-w-0">
        <span className="text-white font-bold text-[36px] leading-none">Raz Malka</span>
        <span className="text-zinc-400 text-lg">raz@3dfly.io</span>
        <span className="rounded-full border border-[#5ac422]/30 bg-[#5ac422]/15 px-4 py-1.5 text-[13px] font-bold text-[#5ac422] w-fit">
          Super Admin
        </span>

        {/* Password display row */}
        <div className="flex items-center gap-3">
          <span className="text-base text-zinc-300 tracking-widest">
            {pwVisible ? "pass1234" : "••••••••"}
          </span>
          <button
            type="button"
            onClick={() => setPwVisible((v) => !v)}
            className="text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            {pwVisible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {/* Change password button */}
        <button
          type="button"
          onClick={() => setChangingPw(true)}
          className="text-[15px] font-semibold text-[#5ac422] hover:underline w-fit"
        >
          Change Password
        </button>
      </div>
    </div>

    {changingPw && <ChangePasswordModal onClose={() => setChangingPw(false)} />}
    </>
  );
}

// ─── Section 2: Admin Users ───────────────────────────────────────────────────

const INITIAL_ADMINS = [
  { id: 1, name: "Raz Malka", email: "raz@3dfly.io",   role: "Super Admin" },
  { id: 2, name: "Rotem",     email: "rotem@3dfly.io", role: "Admin" },
];

function AdminUsersSection() {
  const [admins, setAdmins]       = useState(INITIAL_ADMINS);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [invite, setInvite]       = useState({ email: "", role: "Admin" });

  const setField = (k) => (e) => setInvite((f) => ({ ...f, [k]: e.target.value }));

  const handleSend = () => {
    setInviteOpen(false);
    setInvite({ email: "", role: "Admin" });
  };

  return (
    <div className="flex flex-col gap-5">

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              {["", "Name", "Email", "Role", "Actions"].map((h) => (
                <th
                  key={h}
                  className="pb-2.5 pr-4 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-400 last:pr-0"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr
                key={admin.id}
                className="border-b border-white/5 transition-colors hover:bg-white/[0.02]"
              >
                <td className="py-3 pr-3">
                  <InitialsAvatar name={admin.name} size={32} />
                </td>
                <td className="py-3 pr-4 font-medium text-white whitespace-nowrap">
                  {admin.name}
                </td>
                <td className="py-3 pr-4 text-zinc-400">{admin.email}</td>
                <td className="py-3 pr-4">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[12px] font-bold whitespace-nowrap ${
                      admin.role === "Super Admin"
                        ? "border border-[#5ac422]/30 bg-[#5ac422]/15 text-[#5ac422]"
                        : "border border-white/10 bg-white/5 text-zinc-300"
                    }`}
                  >
                    {admin.role}
                  </span>
                </td>
                <td className="py-3">
                  <button
                    onClick={() => setAdmins((a) => a.filter((x) => x.id !== admin.id))}
                    disabled={admin.role === "Super Admin"}
                    title={admin.role === "Super Admin" ? "Cannot remove Super Admin" : "Remove"}
                    className="rounded-md p-1.5 text-zinc-600 transition-colors hover:bg-red-400/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-zinc-600"
                  >
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invite toggle */}
      <div>
        <button
          onClick={() => setInviteOpen((o) => !o)}
          className="h-9 rounded-md border border-[#5ac422]/50 px-5 text-[13px] font-bold italic uppercase tracking-wide text-[#5ac422] transition-colors hover:bg-[#5ac422]/10"
        >
          {inviteOpen ? "Cancel" : "+ Invite Admin"}
        </button>
      </div>

      {/* Animated invite form */}
      <AnimatePresence initial={false}>
        {inviteOpen && (
          <motion.div {...EXPAND} className="overflow-hidden">
            <div className="flex flex-wrap items-end gap-3 rounded-lg border border-white/10 bg-white/[0.02] p-4">
              <div>
                <label className={LABEL}>Email</label>
                <input
                  type="email"
                  className={INPUT}
                  style={{ width: "240px" }}
                  value={invite.email}
                  onChange={setField("email")}
                  placeholder="new.admin@example.com"
                  autoFocus
                />
              </div>
              <div>
                <label className={LABEL}>Role</label>
                <select
                  className={INPUT}
                  style={{ width: "150px" }}
                  value={invite.role}
                  onChange={setField("role")}
                >
                  <option value="Admin">Admin</option>
                  <option value="Super Admin">Super Admin</option>
                </select>
              </div>
              <button className={SAVE_BTN} onClick={handleSend}>
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Section 3: Notifications ─────────────────────────────────────────────────

const NOTIF_ITEMS = [
  { id: "new_order",         label: "New order received" },
  { id: "supplier_rejected", label: "Supplier rejected an order" },
  { id: "issue_opened",      label: "Issue opened on an order" },
  { id: "order_delayed",     label: "Order is delayed" },
  { id: "new_store",         label: "New store registered" },
];

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 focus:outline-none ${
        checked
          ? "border-[#5ac422] bg-[#5ac422]"
          : "border-white/10 bg-white/10"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function NotificationsSection() {
  const [toggles, setToggles] = useState(() =>
    Object.fromEntries(NOTIF_ITEMS.map((n) => [n.id, true]))
  );

  return (
    <div className="flex flex-col divide-y divide-white/5">
      {NOTIF_ITEMS.map(({ id, label }) => (
        <div key={id} className="flex items-center justify-between py-3">
          <span className="text-sm text-white">{label}</span>
          <Toggle
            checked={toggles[id]}
            onChange={(v) => setToggles((t) => ({ ...t, [id]: v }))}
          />
        </div>
      ))}
    </div>
  );
}

// ─── Section 4: Platform ──────────────────────────────────────────────────────

function PlatformSection() {
  const [form, setForm] = useState({ name: "3D Fly", currency: "USD", language: "English" });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className={LABEL}>Platform Name</label>
          <input className={INPUT} value={form.name} onChange={set("name")} placeholder="Platform Name" />
        </div>
        <div>
          <label className={LABEL}>Default Currency</label>
          <select className={INPUT} value={form.currency} onChange={set("currency")}>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="ILS">ILS</option>
          </select>
        </div>
        <div>
          <label className={LABEL}>Language</label>
          <select className={INPUT} value={form.language} onChange={set("language")}>
            <option value="English">English</option>
            <option value="Hebrew">Hebrew</option>
          </select>
        </div>
      </div>
      <div className="flex justify-end">
        <button className={SAVE_BTN}>Save</button>
      </div>
    </div>
  );
}

// ─── Section 5: Roles & Permissions ──────────────────────────────────────────

const PERMISSIONS = [
  "View Orders",
  "Edit Orders",
  "Manage Suppliers",
  "Manage Users",
  "Access Billing",
  "Change Settings",
];

const ROLES_PERMS = {
  "Super Admin": {
    "View Orders": true,
    "Edit Orders": true,
    "Manage Suppliers": true,
    "Manage Users": true,
    "Access Billing": true,
    "Change Settings": true,
  },
  Admin: {
    "View Orders": true,
    "Edit Orders": true,
    "Manage Suppliers": true,
    "Manage Users": false,
    "Access Billing": false,
    "Change Settings": false,
  },
};

function RolesPermissionsSection() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10">
            <th className="w-36 pb-2.5 pr-4 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-400">
              Role
            </th>
            {PERMISSIONS.map((p) => (
              <th
                key={p}
                className="pb-2.5 px-2 text-center text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-400"
              >
                {p}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.entries(ROLES_PERMS).map(([role, perms]) => (
            <tr key={role} className="border-b border-white/5">
              <td className="py-3 pr-4 font-medium text-white">{role}</td>
              {PERMISSIONS.map((p) => (
                <td key={p} className="py-3 px-2 text-center">
                  {perms[p] ? (
                    <Check size={15} className="inline-block text-[#5ac422]" strokeWidth={2.5} />
                  ) : (
                    <X size={15} className="inline-block text-red-400" strokeWidth={2.5} />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  return (
    <DashboardLayout role="admin">
      <div className="w-full flex flex-col gap-6">

        {/* Page title */}
        <h1 className="text-[clamp(18px,2vw,24px)] font-semibold text-white">Settings</h1>

        {/* Section 1 — no card */}
        <ProfileHeader />

        {/* Section 2 */}
        <DashboardCard index={0} title="Admin Users" autoHeight>
          <AdminUsersSection />
        </DashboardCard>

        {/* Section 3 */}
        <DashboardCard index={1} title="Notifications" autoHeight>
          <NotificationsSection />
        </DashboardCard>

        {/* Section 4 */}
        <DashboardCard index={2} title="Platform" autoHeight>
          <PlatformSection />
        </DashboardCard>

        {/* Section 5 */}
        <DashboardCard index={3} title="Roles & Permissions" autoHeight>
          <RolesPermissionsSection />
        </DashboardCard>

      </div>
    </DashboardLayout>
  );
}
