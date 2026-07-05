import { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Camera } from "lucide-react";
import { motion } from "framer-motion";
import DashboardLayout from "../../../features/dashboard/DashboardLayout.js";
import DashboardCard from "../../../features/dashboard/components/DashboardCard.js";
import DashboardPage, { DashboardPageTitle } from "../../../features/dashboard/components/DashboardPage.js";
import Input from "../../../components/ui/Input.js";
// @ts-ignore — JSX component without declarations
import UploadDropCard from "../../../features/home/FileUploader/UploadDropCard.jsx";
// @ts-ignore
import OptionGroup from "../../../features/home/FileUploader/OptionGroup.jsx";
// @ts-ignore
import LabeledSlider from "../../../features/home/FileUploader/LabeledSlider.jsx";
// @ts-ignore
import ShellsStepper from "../../../features/home/FileUploader/ShellsStepper.jsx";
import { getProducts, saveProducts, type Product } from "./mockProducts.js";
import shopifyIcon     from "../../../assets/icons/shops/shopify-icon.svg?url";
import ebayIcon        from "../../../assets/icons/shops/ebay-icon.svg?url";
import woocommerceIcon from "../../../assets/icons/shops/woocommerce-icon.svg?url";
import wixIcon         from "../../../assets/icons/shops/wix-company-icon.svg?url";
import amazonIcon      from "../../../assets/icons/shops/amazon-icon.svg?url";
import etsyIcon        from "../../../assets/icons/shops/etsy-icon.svg?url";

// ─── Constants ────────────────────────────────────────────────────────────────

const PLATFORM_ICONS: Record<string, string> = {
  shopify: shopifyIcon, ebay: ebayIcon, woocommerce: woocommerceIcon,
  wix: wixIcon, amazon: amazonIcon, etsy: etsyIcon,
};
const PLATFORM_LABELS: Record<string, string> = {
  shopify: "Shopify", ebay: "eBay", woocommerce: "WooCommerce",
  wix: "Wix", amazon: "Amazon", etsy: "Etsy",
};
const STORE_OPTIONS = ["shopify", "woocommerce", "ebay", "wix", "amazon", "etsy"] as const;

const TECH_OPTIONS      = ["FDM", "SLS", "SLA"];
const MATERIAL_OPTIONS  = ["PLA", "ABS", "PETG", "TPU", "ASA"];
const INFILL_PATTERNS   = ["Grid", "Honeycomb", "Lines", "Triangles"];
const BRIM_OPTIONS      = ["Auto", "Manual", "None"];
const SEAM_OPTIONS      = ["Aligned", "Random", "Rear"];

// ─── Sub-components ───────────────────────────────────────────────────────────

function FormRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/5 py-3 last:border-0">
      <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.15em] text-green-500">
        {label}
      </span>
      <div className="flex flex-wrap items-center justify-end gap-2">{children}</div>
    </div>
  );
}

function ColorSwatch({ color, onRemove }: { color: string; onRemove: () => void }) {
  return (
    <div className="group relative">
      <span
        className="inline-block h-7 w-7 rounded-full border border-white/20"
        style={{ backgroundColor: color }}
        title={color}
      />
      <button
        type="button"
        onClick={onRemove}
        className="absolute -right-1 -top-1 hidden h-4 w-4 items-center justify-center rounded-full border border-white/20 bg-dark text-[9px] text-white group-hover:flex"
      >
        ×
      </button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AddProductPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;
  const existing = isEdit ? getProducts().find((p) => p.id === id) : undefined;
  const eps = existing?.printSettings;

  // Files
  const [modelFile, setModelFile]       = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(existing?.image ?? null);
  const [comments, setComments]         = useState("");

  // Product details
  const [productName, setProductName]       = useState(existing?.name ?? "");
  const [sku, setSku]                       = useState(existing?.sku ?? "");
  const [cost, setCost]                     = useState(existing?.cost != null ? String(existing.cost) : "");
  const [price, setPrice]                   = useState(existing?.price != null ? String(existing.price) : "");
  const [colors, setColors]                 = useState<string[]>(existing?.details.colors ?? []);
  const [selectedStores, setSelectedStores] = useState<string[]>(existing?.stores ?? []);
  const colorPickerRef = useRef<HTMLInputElement>(null);

  // Print settings
  const [tech, setTech]                           = useState(eps?.tech ?? "FDM");
  const [material, setMaterial]                   = useState(eps?.material ?? "PLA");
  const [layerHeight, setLayerHeight]             = useState(eps?.layerHeight ?? 0.24);
  const [shells, setShells]                       = useState(eps?.shells ?? 2);
  const [infill, setInfill]                       = useState(eps?.infill ?? 15);
  const [infillPattern, setInfillPattern]         = useState(eps?.infillPattern ?? "Grid");
  const [topShellLayers, setTopShellLayers]       = useState(eps?.topShellLayers ?? 5);
  const [bottomShellLayers, setBottomShellLayers] = useState(eps?.bottomShellLayers ?? 3);
  const [support, setSupport]                     = useState(eps?.support ?? true);
  const [brim, setBrim]                           = useState(eps?.brim ?? "Auto");
  const [brimWidth, setBrimWidth]                 = useState(eps?.brimWidth ?? 5);
  const [seam, setSeam]                           = useState(eps?.seam ?? "Aligned");

  const estimatedPrice = cost ? (parseFloat(cost) * 1.3).toFixed(2) : null;

  const toggleStore = (store: string) =>
    setSelectedStores((prev) =>
      prev.includes(store) ? prev.filter((s) => s !== store) : [...prev, store],
    );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = () => {
    if (!productName.trim()) return;
    const printSettings = { tech, material, layerHeight, shells, infill, infillPattern, topShellLayers, bottomShellLayers, support, brim, brimWidth, seam };
    const all = getProducts();

    if (isEdit && existing) {
      const updated = all.map((p) =>
        p.id === existing.id
          ? { ...p, name: productName, sku, image: imagePreview ?? p.image, cost: parseFloat(cost) || p.cost, price: parseFloat(price) || p.price, stores: selectedStores, printSettings, details: { ...p.details, colors } }
          : p,
      );
      saveProducts(updated);
    } else {
      const newProduct: Product = {
        id: `p_${Date.now()}`,
        name: productName, sku, image: imagePreview ?? "",
        cost: parseFloat(cost) || 0, price: parseFloat(price) || 0,
        stores: selectedStores, printSettings,
        details: { printTime: "—", weight: "—", colors },
        recentOrders: [],
      };
      saveProducts([...all, newProduct]);
    }
    navigate("/dashboard/seller/products");
  };

  const selectCls =
    "rounded-md border border-white/10 bg-dark px-3 py-2 text-sm text-white outline-none transition-colors focus:border-green-500 cursor-pointer";
  const activeTgl =
    "rounded-md border border-green-500/40 bg-green-500/15 px-4 py-1.5 text-[12px] font-bold uppercase tracking-wide text-green-500 transition-colors";
  const inactiveTgl =
    "rounded-md border border-white/10 bg-white/[0.03] px-4 py-1.5 text-[12px] font-bold uppercase tracking-wide text-white/40 transition-colors hover:border-white/20 hover:text-white/60";

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
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => navigate("/dashboard/seller/products")}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 text-white/40 transition-colors hover:border-white/30 hover:text-white"
                title="Back to Products"
              >
                <ArrowLeft size={18} />
              </button>
              <DashboardPageTitle>{isEdit ? "EDIT PRODUCT" : "ADD PRODUCT"}</DashboardPageTitle>
            </div>
          }
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

            {/* ── LEFT COLUMN ──────────────────────────────────────────────── */}
            <div className="flex flex-col gap-6">

              {/* 3D File Upload */}
              <DashboardCard index={0} title="3D FILE" autoHeight withBackground={false}>
                <div className="h-56">
                  <UploadDropCard
                    accept=".stl,.obj,.3mf"
                    onFile={(file: File | null) => setModelFile(file)}
                  />
                </div>
                {modelFile && (
                  <p className="mt-3 truncate text-center text-[12px] font-medium text-green-500">
                    {modelFile.name}
                  </p>
                )}
              </DashboardCard>

              {/* Product Image Upload */}
              <DashboardCard index={1} title="PRODUCT IMAGE" autoHeight withBackground={false}>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="absolute inset-0 z-10 cursor-pointer opacity-0"
                    onChange={handleImageUpload}
                  />
                  {imagePreview ? (
                    <div className="h-44 overflow-hidden rounded-xl">
                      <img
                        src={imagePreview}
                        alt="Product preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-44 w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-white/15 bg-dark transition-colors hover:border-green-500/30">
                      <Camera size={32} className="text-white/30" />
                      <span className="text-[11px] font-medium uppercase tracking-wider text-white/40">
                        Click to upload
                      </span>
                      <span className="text-[10px] text-white/25">PNG · JPG · WEBP</span>
                    </div>
                  )}
                </div>
              </DashboardCard>

              {/* Comments */}
              <DashboardCard index={2} title="COMMENTS" autoHeight withBackground={false}>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="ANY OTHER INFORMATION RELEVANT FOR BEST PRINTING RESULTS."
                  rows={5}
                  className="w-full resize-none rounded-xl border border-white/10 bg-dark px-4 py-3 text-sm text-white outline-none placeholder:text-[11px] placeholder:uppercase placeholder:tracking-wider placeholder:text-white/25 transition-colors focus:border-green-500/40"
                />
              </DashboardCard>

            </div>

            {/* ── RIGHT COLUMN ─────────────────────────────────────────────── */}
            <div className="flex flex-col gap-6">

              {/* Product Details */}
              <DashboardCard index={1} title="PRODUCT DETAILS" autoHeight withBackground={false}>
                <div className="flex flex-col gap-5">

                  <Input
                    label="Product Name"
                    value={productName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProductName(e.target.value)}
                    placeholder="e.g. SoldierXPT"
                    wrapperClassName="w-full"
                  />
                  <Input
                    label="SKU"
                    value={sku}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSku(e.target.value)}
                    placeholder="#001"
                    wrapperClassName="w-full"
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Cost ($)"
                      type="number"
                      value={cost}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCost(e.target.value)}
                      placeholder="0.00"
                      wrapperClassName="w-full"
                    />
                    <Input
                      label="Price ($)"
                      type="number"
                      value={price}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrice(e.target.value)}
                      placeholder="0.00"
                      wrapperClassName="w-full"
                    />
                  </div>

                  {/* Colors */}
                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium uppercase tracking-widest text-green-500 select-none">
                      Colors
                    </span>
                    <div className="flex flex-wrap items-center gap-2 pl-5">
                      {colors.map((c, i) => (
                        <ColorSwatch
                          key={i}
                          color={c}
                          onRemove={() => setColors((prev) => prev.filter((_, j) => j !== i))}
                        />
                      ))}
                      <input
                        ref={colorPickerRef}
                        type="color"
                        className="sr-only"
                        onChange={(e) => {
                          const hex = e.target.value;
                          setColors((prev) => (prev.includes(hex) ? prev : [...prev, hex]));
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => colorPickerRef.current?.click()}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 text-white/40 transition-colors hover:border-green-500/40 hover:text-green-500"
                        title="Add color"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Sell On */}
                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium uppercase tracking-widest text-green-500 select-none">
                      Sell On
                    </span>
                    <div className="flex flex-wrap gap-2 pl-5">
                      {STORE_OPTIONS.map((store) => {
                        const active = selectedStores.includes(store);
                        return (
                          <button
                            key={store}
                            type="button"
                            onClick={() => toggleStore(store)}
                            className={[
                              "flex items-center gap-2 rounded-xl border px-3 py-2 text-[12px] font-medium transition-colors",
                              active
                                ? "border-green-500/40 bg-green-500/15 text-green-500"
                                : "border-white/10 bg-white/[0.04] text-white/60 hover:border-white/20 hover:text-white/80",
                            ].join(" ")}
                          >
                            <img
                              src={PLATFORM_ICONS[store]}
                              alt={PLATFORM_LABELS[store]}
                              className="h-5 w-5 object-contain"
                            />
                            {PLATFORM_LABELS[store]}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                </div>
              </DashboardCard>

              {/* Print Settings */}
              <DashboardCard index={2} title="PRINT SETTINGS" autoHeight withBackground={false}>
                <div className="flex flex-col">

                  <FormRow label="Tech">
                    <OptionGroup options={TECH_OPTIONS} value={tech} onChange={setTech} />
                  </FormRow>

                  <FormRow label="Material">
                    <OptionGroup options={MATERIAL_OPTIONS} value={material} onChange={setMaterial} />
                  </FormRow>

                  <FormRow label="Layer Height">
                    <div className="w-52">
                      <LabeledSlider
                        value={layerHeight}
                        onChange={setLayerHeight}
                        min={0.05}
                        max={0.35}
                        step={0.01}
                        format={(v: number) => v.toFixed(2)}
                      />
                    </div>
                  </FormRow>

                  <FormRow label="Shells">
                    <ShellsStepper value={shells} onChange={setShells} min={1} max={10} />
                  </FormRow>

                  <FormRow label="Infill">
                    <div className="flex items-center gap-2">
                      <div className="w-40">
                        <LabeledSlider
                          value={infill}
                          onChange={setInfill}
                          min={5}
                          max={80}
                          step={1}
                          format={(v: number) => `${v}%`}
                        />
                      </div>
                      <select
                        value={infillPattern}
                        onChange={(e) => setInfillPattern(e.target.value)}
                        className={selectCls}
                      >
                        {INFILL_PATTERNS.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                  </FormRow>

                  <FormRow label="Top Shell Layers">
                    <ShellsStepper value={topShellLayers} onChange={setTopShellLayers} min={1} max={20} />
                  </FormRow>

                  <FormRow label="Bottom Shell Layers">
                    <ShellsStepper value={bottomShellLayers} onChange={setBottomShellLayers} min={1} max={20} />
                  </FormRow>

                  <FormRow label="Support">
                    <button type="button" onClick={() => setSupport(true)}  className={support  ? activeTgl : inactiveTgl}>ON</button>
                    <button type="button" onClick={() => setSupport(false)} className={!support ? activeTgl : inactiveTgl}>OFF</button>
                  </FormRow>

                  <FormRow label="Brim">
                    <select
                      value={brim}
                      onChange={(e) => setBrim(e.target.value)}
                      className={selectCls}
                    >
                      {BRIM_OPTIONS.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </FormRow>

                  {brim !== "None" && (
                    <FormRow label="Brim Width">
                      <ShellsStepper value={brimWidth} onChange={setBrimWidth} min={0} max={20} />
                    </FormRow>
                  )}

                  <FormRow label="Seam">
                    <select
                      value={seam}
                      onChange={(e) => setSeam(e.target.value)}
                      className={selectCls}
                    >
                      {SEAM_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </FormRow>

                </div>
              </DashboardCard>

            </div>
          </div>

          {/* ── Bottom Action Bar ───────────────────────────────────────────── */}
          <div className="mt-2 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.07] px-6 py-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] uppercase tracking-wider text-white/40">
                Estimated Price
              </span>
              <span className="text-2xl font-bold text-green-500">
                {estimatedPrice ? `$${estimatedPrice}` : "—"}
              </span>
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!productName.trim()}
              className="rounded-md bg-green-500 px-8 py-3 text-sm font-extrabold uppercase italic tracking-wide text-black transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isEdit ? "Save Changes" : "Add Product"}
            </button>
          </div>

        </DashboardPage>
      </motion.div>
    </DashboardLayout>
  );
}
