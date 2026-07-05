import { useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "../../../features/dashboard/DashboardLayout.js";
import DashboardCard from "../../../features/dashboard/components/DashboardCard.js";
import DashboardPage, { DashboardPageTitle } from "../../../features/dashboard/components/DashboardPage.js";
import Modal from "../../../features/dashboard/components/Modal.js";
import Input from "../../../components/ui/Input.js";
import shopifyIcon     from "../../../assets/icons/shops/shopify-icon.svg?url";
import ebayIcon        from "../../../assets/icons/shops/ebay-icon.svg?url";
import woocommerceIcon from "../../../assets/icons/shops/woocommerce-icon.svg?url";
import wixIcon         from "../../../assets/icons/shops/wix-company-icon.svg?url";
import amazonIcon      from "../../../assets/icons/shops/amazon-icon.svg?url";

// ─── Types ────────────────────────────────────────────────────────────────────

type ConnectedStore = {
  platform: string;
  storeName: string;
  url: string;
  status: "connected" | "error";
};

type PlatformField = {
  label: string;
  key: string;
  placeholder: string;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const PLATFORM_ICONS: Record<string, string> = {
  shopify:     shopifyIcon,
  ebay:        ebayIcon,
  woocommerce: woocommerceIcon,
  wix:         wixIcon,
  amazon:      amazonIcon,
};

const PLATFORM_LABELS: Record<string, string> = {
  shopify:     "Shopify",
  ebay:        "eBay",
  woocommerce: "WooCommerce",
  wix:         "Wix",
  amazon:      "Amazon",
};

const ALL_PLATFORMS = ["shopify", "woocommerce", "ebay", "wix", "amazon"];

const PLATFORM_FIELDS: Record<string, PlatformField[]> = {
  shopify: [
    { label: "Store URL",     key: "url",      placeholder: "yourstore.myshopify.com"       },
  ],
  woocommerce: [
    { label: "Store URL",     key: "url",      placeholder: "https://yourstore.com"          },
    { label: "API Key",       key: "apiKey",   placeholder: "ck_xxxxxxxxxxxxxxxxxxxxxxxx"    },
  ],
  ebay: [
    { label: "Account Email", key: "email",    placeholder: "seller@example.com"             },
  ],
  wix: [
    { label: "Store URL",     key: "url",      placeholder: "yoursite.wixsite.com/store"     },
  ],
  amazon: [
    { label: "Seller ID",     key: "sellerId", placeholder: "AMZN-XXXX-XXXX"                },
  ],
};

const PLATFORM_INSTRUCTIONS: Record<string, string> = {
  shopify:     "Enter your Shopify store URL to begin the connection.",
  woocommerce: "Find your API Key in WooCommerce → Settings → Advanced → REST API.",
  ebay:        "Enter the email associated with your eBay seller account.",
  wix:         "Enter your Wix site URL to begin the connection.",
  amazon:      "Enter your Amazon Seller Central Seller ID.",
};

// ─── Mock data ────────────────────────────────────────────────────────────────

const initialConnected: ConnectedStore[] = [
  {
    platform:  "shopify",
    storeName: "Raz3DPrints",
    url:       "raz3dprints.myshopify.com",
    status:    "connected",
  },
];

// ─── Animation variants ───────────────────────────────────────────────────────

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const rowVariants = {
  hidden: { opacity: 0, y: 8 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.28, ease: "easeOut" } },
};

// ─── Status badge ─────────────────────────────────────────────────────────────

function ConnectionStatus({ status }: { status: ConnectedStore["status"] }) {
  if (status === "connected") {
    return (
      <span className="flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-green-500">
        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
        Connected
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1.5 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-yellow-400">
      <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
      Error
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function IntegrationPage() {
  const [connected, setConnected]   = useState<ConnectedStore[]>(initialConnected);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  const available = ALL_PLATFORMS.filter(
    (p) => !connected.some((c) => c.platform === p),
  );

  const openModal = (platform: string) => {
    setConnecting(platform);
    setFormValues({});
  };

  const closeModal = () => {
    setConnecting(null);
    setFormValues({});
  };

  const handleConnect = () => {
    if (!connecting) return;
    const fields = PLATFORM_FIELDS[connecting];
    if (!fields.every((f) => formValues[f.key]?.trim())) return;
    const storeName = formValues[fields[0].key]?.trim() || PLATFORM_LABELS[connecting];
    setConnected((prev) => [
      ...prev,
      { platform: connecting, storeName, url: formValues[fields[0].key] ?? "", status: "connected" },
    ]);
    closeModal();
  };

  const handleDisconnect = (store: ConnectedStore) => {
    if (window.confirm(`Disconnect ${PLATFORM_LABELS[store.platform]}?`)) {
      setConnected((prev) => prev.filter((c) => c !== store));
    }
  };

  const canConnect = connecting
    ? PLATFORM_FIELDS[connecting].every((f) => formValues[f.key]?.trim())
    : false;

  return (
    <DashboardLayout role="seller">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full"
      >
        <DashboardPage header={<DashboardPageTitle>INTEGRATION</DashboardPageTitle>}>

          {/* ── Connected Stores ──────────────────────────────────────────── */}
          <DashboardCard
            index={0}
            title="MY CONNECTED STORES"
            autoHeight
            withBackground={false}
          >
            {connected.length === 0 ? (
              <p className="py-8 text-center text-sm text-white/40">
                No stores connected yet.
              </p>
            ) : (
              <motion.div
                variants={listVariants}
                initial="hidden"
                animate="show"
                className="flex flex-col gap-2"
              >
                {connected.map((store, i) => (
                  <motion.div key={`${store.platform}-${i}`} variants={rowVariants}>
                    <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.07] px-4 py-4 transition-colors hover:border-white/20 hover:bg-white/[0.11]">
                      <img
                        src={PLATFORM_ICONS[store.platform]}
                        alt={PLATFORM_LABELS[store.platform]}
                        className="h-10 w-10 shrink-0 object-contain"
                      />
                      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <span className="text-[14px] font-semibold text-white">
                          {PLATFORM_LABELS[store.platform]}
                        </span>
                        <span className="truncate text-[12px] text-white/40">
                          {store.storeName} · {store.url}
                        </span>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <ConnectionStatus status={store.status} />
                        <button
                          type="button"
                          onClick={() => handleDisconnect(store)}
                          className="rounded-md border border-white/10 px-3 py-1.5 text-[12px] font-semibold uppercase tracking-wide text-white/40 transition-colors hover:border-red-400/30 hover:text-red-400"
                        >
                          Disconnect
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </DashboardCard>

          {/* ── Available Platforms ───────────────────────────────────────── */}
          <DashboardCard
            index={1}
            title="CONNECT A NEW STORE"
            autoHeight
            withBackground={false}
          >
            {available.length === 0 ? (
              <p className="py-8 text-center text-sm text-white/40">
                All platforms are connected!
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                {available.map((platform) => (
                  <div
                    key={platform}
                    className="flex flex-col items-center gap-4 rounded-xl border border-white/10 bg-white/[0.07] p-6 transition-colors hover:border-white/20"
                  >
                    <img
                      src={PLATFORM_ICONS[platform]}
                      alt={PLATFORM_LABELS[platform]}
                      className="h-12 w-12 object-contain"
                    />
                    <span className="text-base font-semibold text-white">
                      {PLATFORM_LABELS[platform]}
                    </span>
                    <button
                      type="button"
                      onClick={() => openModal(platform)}
                      className="rounded-md border border-green-500/40 bg-green-500/10 px-4 py-2 text-[12px] font-bold uppercase tracking-wide text-green-500 transition-colors hover:bg-green-500/20"
                    >
                      + Connect
                    </button>
                  </div>
                ))}
              </div>
            )}
          </DashboardCard>

        </DashboardPage>
      </motion.div>

      {/* ── ConnectModal ──────────────────────────────────────────────────── */}
      {connecting && (
        <Modal onClose={closeModal} size="md">
          <div className="flex items-center gap-3">
            <img
              src={PLATFORM_ICONS[connecting]}
              alt={PLATFORM_LABELS[connecting]}
              className="h-8 w-8 object-contain"
            />
            <h2 className="text-base font-bold uppercase tracking-widest text-white">
              Connect {PLATFORM_LABELS[connecting]}
            </h2>
          </div>

          {PLATFORM_FIELDS[connecting].map((field) => (
            <Input
              key={field.key}
              label={field.label}
              value={formValues[field.key] ?? ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormValues((prev) => ({ ...prev, [field.key]: e.target.value }))
              }
              placeholder={field.placeholder}
              wrapperClassName="w-full"
            />
          ))}

          <p className="text-[12px] leading-relaxed text-white/40">
            {PLATFORM_INSTRUCTIONS[connecting]}
          </p>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 rounded-md border border-white/10 py-2 text-sm text-white/60 transition-colors hover:border-white/30 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConnect}
              disabled={!canConnect}
              className="flex-1 rounded-md bg-green-500 py-2 text-sm font-extrabold uppercase italic tracking-wide text-black transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Connect
            </button>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
}
