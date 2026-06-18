import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Eye, EyeOff } from "lucide-react";
import DashboardLayout from "../../../features/dashboard/DashboardLayout.js";
import DashboardCard from "../../../features/dashboard/components/DashboardCard.js";
import DashboardPage, { DashboardPageTitle } from "../../../features/dashboard/components/DashboardPage.js";
import Modal from "../../../features/dashboard/components/Modal.js";
import Input from "../../../components/ui/Input.js";

// ─── Shared constants (mirrors admin SettingsPage) ────────────────────────────

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

// ─── Mock store data ──────────────────────────────────────────────────────────

const MOCK_STORE = {
  storeName: "Raz3DPrints",
  email:     "raz@3dfly.com",
  plan:      "Pro Plan",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function initialsOf(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// ─── Change Password Modal ────────────────────────────────────────────────────

function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const [pwForm, setPwForm] = useState({ newPw: "", confirm: "" });

  return (
    <Modal onClose={onClose} size="sm">
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
          className="flex-1 rounded-md border border-white/10 py-2 text-sm text-zinc-300 transition-colors hover:border-white/30 hover:text-white"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 rounded-md bg-[#5ac422] py-2 text-sm font-extrabold uppercase italic tracking-wide text-black transition-all hover:brightness-110"
        >
          Save
        </button>
      </div>
    </Modal>
  );
}

// ─── Section 0: Profile Header (no card) ─────────────────────────────────────

function ProfileHeader() {
  const [photo, setPhoto]           = useState<string | null>(null);
  const [hovering, setHovering]     = useState(false);
  const [pwVisible, setPwVisible]   = useState(false);
  const [changingPw, setChangingPw] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!pwVisible) return;
    const t = setTimeout(() => setPwVisible(false), 3000);
    return () => clearTimeout(t);
  }, [pwVisible]);

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhoto(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const initials = initialsOf(MOCK_STORE.storeName);

  return (
    <>
      <div className="flex items-center gap-10 py-10">

        {/* Avatar */}
        <div
          className="relative h-32 w-32 flex-shrink-0 cursor-pointer rounded-full"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          onClick={() => fileRef.current?.click()}
        >
          {photo ? (
            <img
              src={photo}
              alt="Profile"
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-full border-2 border-[#5ac422]/40 bg-[#5ac422]/20 select-none">
              <span className="text-4xl font-bold text-[#5ac422]">{initials}</span>
            </div>
          )}

          <AnimatePresence>
            {hovering && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-full bg-black/60"
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

        {/* Store info */}
        <div className="flex min-w-0 flex-col gap-4">
          <span className="text-[36px] font-bold leading-none text-white">
            {MOCK_STORE.storeName}
          </span>
          <span className="text-lg text-zinc-400">{MOCK_STORE.email}</span>
          <span className="w-fit rounded-full border border-[#5ac422]/30 bg-[#5ac422]/15 px-4 py-1.5 text-[13px] font-bold text-[#5ac422]">
            {MOCK_STORE.plan}
          </span>

          {/* Password row */}
          <div className="flex items-center gap-3">
            <span className="text-base tracking-widest text-zinc-300">
              {pwVisible ? "pass1234" : "••••••••"}
            </span>
            <button
              type="button"
              onClick={() => setPwVisible((v) => !v)}
              className="text-zinc-500 transition-colors hover:text-zinc-300"
            >
              {pwVisible ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <button
            type="button"
            onClick={() => setChangingPw(true)}
            className="w-fit text-[15px] font-semibold text-[#5ac422] hover:underline"
          >
            Change Password
          </button>
        </div>
      </div>

      {changingPw && <ChangePasswordModal onClose={() => setChangingPw(false)} />}
    </>
  );
}

// ─── Section 1: Store Details ─────────────────────────────────────────────────

function StoreDetailsSection() {
  const [form, setForm] = useState({
    storeName: "Raz3DPrints",
    city:      "Tel Aviv",
    email:     "raz@3dfly.com",
    phone:     "+972-50-0000000",
  });
  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className={LABEL}>Store Name</label>
          <input className={INPUT} value={form.storeName} onChange={set("storeName")} placeholder="Store Name" />
        </div>
        <div>
          <label className={LABEL}>City</label>
          <input className={INPUT} value={form.city} onChange={set("city")} placeholder="City" />
        </div>
        <div>
          <label className={LABEL}>Email</label>
          <input type="email" className={INPUT} value={form.email} onChange={set("email")} placeholder="Email" />
        </div>
        <div>
          <label className={LABEL}>Phone</label>
          <input className={INPUT} value={form.phone} onChange={set("phone")} placeholder="Phone" />
        </div>
      </div>
      <div className="flex justify-end">
        <button className={SAVE_BTN}>Save</button>
      </div>
    </div>
  );
}

// ─── Section 2: Danger Zone ───────────────────────────────────────────────────

function DangerZoneSection() {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-white/50">
        Deleting your account is permanent and cannot be undone.
      </p>
      <div>
        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          className="rounded-md border border-red-500 px-5 py-2 text-sm font-bold uppercase tracking-wide text-red-500 transition-colors hover:bg-red-500 hover:text-white"
        >
          Delete Account
        </button>
      </div>

      <AnimatePresence initial={false}>
        {confirmOpen && (
          // @ts-ignore — spread works at runtime; Framer Motion accepts these props
          <motion.div {...EXPAND} className="overflow-hidden">
            <div className="flex flex-wrap items-center gap-3 rounded-lg border border-red-500/20 bg-red-500/5 p-4">
              <p className="flex-1 text-sm text-red-400">
                Are you sure? This cannot be undone.
              </p>
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="rounded-md border border-white/10 px-4 py-2 text-sm text-white/60 transition-colors hover:border-white/30 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-md bg-red-500 px-4 py-2 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-red-600"
              >
                Confirm Delete
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SellerSettingsPage() {
  return (
    <DashboardLayout role="seller">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full"
      >
        <DashboardPage header={<DashboardPageTitle>SETTINGS</DashboardPageTitle>}>

          {/* Section 0 — Profile Header (no card) */}
          <ProfileHeader />

          {/* Section 1 — Store Details */}
          <DashboardCard index={0} title="STORE DETAILS" autoHeight withBackground={false}>
            <StoreDetailsSection />
          </DashboardCard>

          {/* Section 2 — Danger Zone */}
          <DashboardCard index={1} title="DANGER ZONE" autoHeight withBackground={false}>
            <DangerZoneSection />
          </DashboardCard>

        </DashboardPage>
      </motion.div>
    </DashboardLayout>
  );
}
