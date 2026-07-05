import { useState, useMemo, useEffect, type ReactNode } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { MoreHorizontal, Package } from "lucide-react";
import DashboardLayout from "../../../features/dashboard/DashboardLayout.js";
import DashboardCard from "../../../features/dashboard/components/DashboardCard.js";
import DashboardPage, { DashboardPageTitle } from "../../../features/dashboard/components/DashboardPage.js";
import Modal from "../../../features/dashboard/components/Modal.js";
import Input from "../../../components/ui/Input.js";
import { getProducts, saveProducts, type Product, type ProductForm } from "./mockProducts.js";
import shopifyIcon     from "../../../assets/icons/shops/shopify-icon.svg?url";
import ebayIcon        from "../../../assets/icons/shops/ebay-icon.svg?url";
import woocommerceIcon from "../../../assets/icons/shops/woocommerce-icon.svg?url";
import wixIcon         from "../../../assets/icons/shops/wix-company-icon.svg?url";
import amazonIcon      from "../../../assets/icons/shops/amazon-icon.svg?url";
import etsyIcon        from "../../../assets/icons/shops/etsy-icon.svg?url";

// ─── Platform constants ───────────────────────────────────────────────────────

const PLATFORM_ICONS: Record<string, string> = {
  shopify: shopifyIcon, ebay: ebayIcon, woocommerce: woocommerceIcon,
  wix: wixIcon, amazon: amazonIcon, etsy: etsyIcon,
};

const PLATFORM_LABELS: Record<string, string> = {
  shopify: "Shopify", ebay: "eBay", woocommerce: "WooCommerce",
  wix: "Wix", amazon: "Amazon", etsy: "Etsy",
};

const STORE_OPTIONS = ["shopify", "woocommerce", "ebay", "wix", "amazon"] as const;

// ─── Framer Motion variants ───────────────────────────────────────────────────

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

// ─── EditProductModal ─────────────────────────────────────────────────────────

export interface EditProductModalProps {
  product?: Product;
  onSave: (form: ProductForm) => void;
  onClose: () => void;
}

export function EditProductModal({ product, onSave, onClose }: EditProductModalProps) {
  const [form, setForm] = useState<ProductForm>({
    name:   product?.name  ?? "",
    sku:    product?.sku   ?? "",
    cost:   product?.cost  != null ? String(product.cost)  : "",
    price:  product?.price != null ? String(product.price) : "",
    stores: product?.stores ?? [],
  });

  const setField =
    (key: keyof Omit<ProductForm, "stores">) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const toggleStore = (store: string) =>
    setForm((f) => ({
      ...f,
      stores: f.stores.includes(store)
        ? f.stores.filter((s) => s !== store)
        : [...f.stores, store],
    }));

  return (
    <Modal onClose={onClose}>
      <h2 className="text-base font-bold uppercase tracking-widest text-white">
        {product ? `Edit: ${product.name}` : "Add Product"}
      </h2>

      <Input label="Product Name" value={form.name}  onChange={setField("name")}  placeholder="e.g. SoldierXPT" wrapperClassName="w-full" />
      <Input label="SKU"          value={form.sku}   onChange={setField("sku")}   placeholder="#001"             wrapperClassName="w-full" />

      <div className="grid grid-cols-2 gap-3">
        <Input label="Cost ($)"  type="number" value={form.cost}  onChange={setField("cost")}  placeholder="0.00" wrapperClassName="w-full" />
        <Input label="Price ($)" type="number" value={form.price} onChange={setField("price")} placeholder="0.00" wrapperClassName="w-full" />
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-[#5ac422] text-sm font-medium uppercase tracking-widest select-none">
          Connected Stores
        </span>
        <div className="flex flex-wrap gap-2 pl-5">
          {STORE_OPTIONS.map((store) => {
            const active = form.stores.includes(store);
            return (
              <button
                key={store}
                type="button"
                onClick={() => toggleStore(store)}
                className={[
                  "rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wide transition-colors",
                  active
                    ? "border-[#5ac422]/40 bg-[#5ac422]/15 text-[#5ac422]"
                    : "border-white/10 bg-transparent text-zinc-400 hover:border-white/20 hover:text-zinc-200",
                ].join(" ")}
              >
                {PLATFORM_LABELS[store]}
              </button>
            );
          })}
        </div>
      </div>

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
          onClick={() => { if (form.name.trim()) onSave(form); }}
          className="flex-1 rounded-md bg-[#5ac422] py-2 text-sm font-extrabold uppercase italic tracking-wide text-black hover:brightness-110 transition-all"
        >
          Save
        </button>
      </div>
    </Modal>
  );
}

// ─── Color map + dot ─────────────────────────────────────────────────────────

const COLOR_CSS: Record<string, string> = {
  black: "#111827", white: "#f9fafb", gray: "#9ca3af", grey: "#9ca3af",
  red: "#ef4444",   blue: "#3b82f6",  yellow: "#eab308", green: "#22c55e",
  orange: "#f97316", silver: "#d1d5db", pink: "#ec4899", purple: "#a855f7",
  brown: "#b45309",
};

function ColorDot({ color }: { color: string }) {
  const css = COLOR_CSS[color.toLowerCase()];
  return (
    <div className="group relative">
      {css ? (
        <span
          className="inline-block h-4 w-4 cursor-default rounded-full border border-white/20"
          style={{ backgroundColor: css }}
        />
      ) : (
        <span className="cursor-default rounded-full border border-white/10 bg-white/5 px-1.5 py-0.5 text-[9px] font-medium text-zinc-300">
          {color}
        </span>
      )}
      <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 hidden -translate-x-1/2 group-hover:block">
        <div className="rounded-md border border-white/10 bg-[rgba(5,10,7,0.95)] px-2 py-1 text-[10px] font-medium whitespace-nowrap text-zinc-200 shadow-lg">
          {color}
        </div>
        <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-[rgba(5,10,7,0.95)]" />
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function PlatformIconsRow({ stores }: { stores: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {stores.map((s) => {
        const icon = PLATFORM_ICONS[s.toLowerCase()];
        const label = PLATFORM_LABELS[s.toLowerCase()] ?? s;
        if (icon) {
          return <img key={s} src={icon} alt={label} title={label} className="h-8 w-8 object-contain" />;
        }
        return (
          <span key={s} className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] uppercase text-zinc-400">
            {label}
          </span>
        );
      })}
    </div>
  );
}

interface DropdownMenuProps {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function DropdownMenu({ onView, onEdit, onDelete }: DropdownMenuProps) {
  return (
    <div className="absolute right-0 top-full z-50 mt-1 w-36 overflow-hidden rounded-xl border border-white/10 bg-[rgba(5,10,7,0.97)] shadow-2xl">
      {([
        { label: "View",   handler: onView,   cls: "text-zinc-200 hover:bg-white/[0.05]"          },
        { label: "Edit",   handler: onEdit,   cls: "text-zinc-200 hover:bg-white/[0.05]"          },
        { label: "Delete", handler: onDelete, cls: "text-red-400  hover:bg-red-400/[0.05]"        },
      ] as const).map(({ label, handler, cls }) => (
        <button
          key={label}
          type="button"
          onClick={handler}
          className={`flex w-full items-center px-4 py-2.5 text-sm transition-colors ${cls}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

interface ProductRowProps {
  product: Product;
  menuOpen: boolean;
  onMenuToggle: () => void;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function ProductRow({ product, menuOpen, onMenuToggle, onView, onEdit, onDelete }: ProductRowProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className="flex cursor-pointer items-center gap-5 rounded-xl border border-white/10 bg-white/11 px-4 py-4 transition-colors hover:border-white/20 hover:bg-white/[0.11]"
      onClick={onView}
    >
      {/* Thumbnail */}
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-zinc-800">
        {imgError || !product.image ? (
          <div className="flex h-full w-full items-center justify-center">
            <Package size={24} className="text-zinc-600" />
          </div>
        ) : (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover"
            onError={() => setImgError(true)}
          />
        )}
      </div>

      {/* Name + SKU */}
      <div className="flex min-w-0 flex-[2] flex-col gap-1">
        <span className="truncate text-[15px] font-semibold text-white">{product.name}</span>
        <span className="text-xs uppercase tracking-wider text-white/35">{product.sku}</span>
      </div>

      {/* Cost */}
      <div className="flex w-20 shrink-0 flex-col gap-0.5">
        <span className="text-[11px] uppercase tracking-wider text-white/40">Cost</span>
        <span className="text-sm font-medium text-white/85">${product.cost.toFixed(2)}</span>
      </div>

      {/* Price */}
      <div className="flex w-20 shrink-0 flex-col gap-0.5">
        <span className="text-[11px] uppercase tracking-wider text-white/40">Price</span>
        <span className="text-base font-bold text-green-500">${product.price.toFixed(2)}</span>
      </div>

      {/* Platform icons */}
      <div className="flex min-w-0 flex-[1] flex-wrap items-center gap-2">
        <PlatformIconsRow stores={product.stores} />
      </div>

      {/* Details */}
      <div className="flex w-36 shrink-0 flex-col gap-1.5">
        <span className="text-[11px] uppercase tracking-wider text-white/40">Details</span>
        <span className="text-sm font-medium text-white/85">{product.details.printTime}</span>
        <span className="text-sm font-medium text-white/85">{product.details.weight}</span>
        <div className="flex items-center gap-1.5 pt-0.5">
          {product.details.colors.map((c) => <ColorDot key={c} color={c} />)}
        </div>
      </div>

      {/* Three-dot menu */}
      <div
        className="relative shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onMenuToggle}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-white/10 hover:text-zinc-200"
        >
          <MoreHorizontal size={16} />
        </button>

        {menuOpen && (
          <DropdownMenu
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SellerProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>(getProducts);
  const [search, setSearch]       = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    if (!openMenuId) return;
    const close = () => setOpenMenuId(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [openMenuId]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q),
    );
  }, [products, search]);

  const handleDelete = (product: Product) => {
    setOpenMenuId(null);
    if (window.confirm(`Delete "${product.name}"?`)) {
      const updated = products.filter((p) => p.id !== product.id);
      setProducts(updated);
      saveProducts(updated);
    }
  };

  return (
    <DashboardLayout role="seller">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full"
      >
        <DashboardPage
          header={
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <DashboardPageTitle>PRODUCTS</DashboardPageTitle>
                <span className="rounded-full border border-[#5ac422]/30 bg-[#5ac422]/15 px-2.5 py-0.5 text-[13px] font-bold text-[#5ac422]">
                  {products.length}
                </span>
              </div>
              <button
                type="button"
                onClick={() => navigate("/dashboard/seller/products/new")}
                className="h-10 whitespace-nowrap rounded-md bg-green-500 px-5 text-[13px] font-extrabold uppercase italic tracking-wide text-black transition-all hover:brightness-110"
              >
                + Add Product
              </button>
            </div>
          }
        >
          <DashboardCard
            title="ALL PRODUCTS"
            autoHeight
            withBackground={false}
            headerAction={
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search…"
                className="w-48 rounded-md border border-white/10 bg-[rgba(5,10,7,0.7)] px-3 py-1.5 text-sm text-white outline-none placeholder:text-zinc-500 transition-colors focus:border-[#5ac422]"
              />
            }
          >
            {filtered.length === 0 ? (
              <p className="py-10 text-center text-sm text-zinc-500">No products found.</p>
            ) : (
              <motion.div variants={listVariants} initial="hidden" animate="show" className="flex flex-col gap-2">
                {filtered.map((product) => (
                  <motion.div key={product.id} variants={rowVariants}>
                    <ProductRow
                      product={product}
                      menuOpen={openMenuId === product.id}
                      onMenuToggle={() =>
                        setOpenMenuId((prev) => (prev === product.id ? null : product.id))
                      }
                      onView={() => {
                        setOpenMenuId(null);
                        navigate(`/dashboard/seller/products/${product.id}`);
                      }}
                      onEdit={() => {
                        setOpenMenuId(null);
                        navigate(`/dashboard/seller/products/edit/${product.id}`);
                      }}
                      onDelete={() => handleDelete(product)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </DashboardCard>
        </DashboardPage>
      </motion.div>
    </DashboardLayout>
  );
}
