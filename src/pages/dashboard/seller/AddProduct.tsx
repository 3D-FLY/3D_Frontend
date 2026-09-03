import { useState, useRef, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Camera, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

const MOCK_3MF_SETTINGS = {
  tech: "FDM", material: "PLA", layerHeight: 0.2, shells: 3,
  infill: 20, infillPattern: "Honeycomb", topShellLayers: 4,
  bottomShellLayers: 4, support: true, brim: "Auto", brimWidth: 5, seam: "Random",
};

type Step = 1 | 2 | 3;
const STEP_LABELS = ["FILE & SETTINGS", "PRICING", "PRODUCT DETAILS"];

// ─── Sub-components ───────────────────────────────────────────────────────────

function FormRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/5 py-3 last:border-0">
      <span className="shrink-0 text-[13px] font-bold uppercase tracking-[0.12em] text-green-500">
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

function NumberStepper({
  value,
  onChange,
  min,
  max,
  step = 1,
  prefix,
  suffix,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  prefix?: string;
  suffix?: string;
}) {
  const [editStr, setEditStr] = useState<string | null>(null);
  const displayValue = editStr !== null ? editStr : String(value);

  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  const dec = () => onChange(+clamp(value - step).toFixed(2));
  const inc = () => onChange(+clamp(value + step).toFixed(2));

  const commit = (raw: string) => {
    const n = parseFloat(raw.replace(",", ".").replace(/\s/g, ""));
    if (!Number.isNaN(n)) onChange(+clamp(n).toFixed(2));
    setEditStr(null);
  };

  return (
    <div className="inline-flex h-10 w-full items-center gap-2 rounded-md bg-dark px-2">
      <button
        type="button"
        onClick={dec}
        className="grid h-8 w-8 shrink-0 translate-y-[2px] place-items-center rounded transition-colors hover:bg-black/20"
        aria-label="Decrease"
      >
        <span className="text-xs leading-none text-green-500">▼</span>
      </button>

      <div className="flex min-w-0 flex-1 items-center justify-center">
        <div className="inline-flex items-center gap-0.5">
          {prefix && <span className="shrink-0 text-sm text-green-500/70">{prefix}</span>}
          <input
            type="text"
            inputMode="decimal"
            value={displayValue}
            onChange={(e) => setEditStr(e.target.value)}
            onFocus={() => setEditStr(String(value))}
            onBlur={() => commit(editStr ?? String(value))}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit(editStr ?? String(value));
            }}
            style={{ width: `${Math.max(1, displayValue.length)}ch` }}
            className="min-w-[1ch] max-w-[10ch] bg-transparent text-center text-sm font-medium tabular-nums text-green-500 outline-none"
          />
          {suffix && <span className="shrink-0 text-sm text-green-500/70">{suffix}</span>}
        </div>
      </div>

      <button
        type="button"
        onClick={inc}
        className="grid h-8 w-8 shrink-0 -translate-y-[2px] place-items-center rounded transition-colors hover:bg-black/20"
        aria-label="Increase"
      >
        <span className="text-xs leading-none text-green-500">▲</span>
      </button>
    </div>
  );
}

function Stepper({ step }: { step: Step }) {
  return (
    <div className="mx-auto my-5 flex w-full max-w-2xl items-center">
      {STEP_LABELS.map((label, i) => {
        const n = (i + 1) as Step;
        const state = n < step ? "done" : n === step ? "active" : "future";
        return (
          <div key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-2">
              <div
                className={[
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors",
                  state === "active" && "bg-green-500 text-black",
                  state === "done" && "border border-green-500/40 bg-green-500/20 text-green-500",
                  state === "future" && "bg-white/10 text-white/30",
                ].filter(Boolean).join(" ")}
              >
                {state === "done" ? <Check size={16} /> : n}
              </div>
              <span
                className={[
                  "whitespace-nowrap text-[10px] font-bold uppercase tracking-wider",
                  state === "active" ? "text-white" : "text-white/30",
                ].join(" ")}
              >
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div className={`mx-3 h-px flex-1 ${n < step ? "bg-green-500/40" : "bg-white/10"}`} />
            )}
          </div>
        );
      })}
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

  const [step, setStep] = useState<Step>(1);

  // Files
  const [modelFile, setModelFile] = useState<File | null>(null);
  const [imagePreviews, setImagePreviews] = useState<(string | null)[]>(
    existing?.image ? [existing.image, null, null, null] : [null, null, null, null],
  );
  const [supplierImagePreviews, setSupplierImagePreviews] = useState<(string | null)[]>(() => {
    const existingImages = existing?.supplierInstructionImages ?? [];
    return [0, 1, 2, 3].map((i) => existingImages[i] ?? null);
  });
  const [description, setDescription] = useState("");

  // Product details
  const [productName, setProductName]       = useState(existing?.name ?? "");
  const [colors, setColors]                 = useState<string[]>(existing?.details.colors ?? []);
  const [selectedStores, setSelectedStores] = useState<string[]>(existing?.stores ?? []);
  const [pendingColor, setPendingColor]     = useState<string>("#5ac422");
  const [showColorConfirm, setShowColorConfirm] = useState(false);
  const [supplierInstructions, setSupplierInstructions] = useState("");
  const [supplierPdf, setSupplierPdf]                   = useState<File | null>(null);
  const supplierPdfRef                                   = useRef<HTMLInputElement>(null);

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

  // Pricing
  const [margin, setMargin] = useState<number>(
    existing && existing.cost > 0 ? Math.round((existing.price / existing.cost - 1) * 100) : 40,
  );
  const [manualPrice, setManualPrice] = useState<string>("");
  const [priceMode, setPriceMode] = useState<"margin" | "manual">("margin");

  const is3mf = modelFile?.name.toLowerCase().endsWith(".3mf") ?? false;
  const canProceedStep1 = isEdit || !!modelFile;

  const pricing = useMemo(() => {
    const weightGrams = Math.round(infill * 3 + shells * 20 + 60);
    const printHours = +(layerHeight < 0.2 ? 14 : layerHeight < 0.25 ? 12 : 9).toFixed(1);
    const materialCost = +(weightGrams * 0.014).toFixed(2);
    const machineCost = +(printHours * 0.35).toFixed(2);
    const totalCost = +(materialCost + machineCost).toFixed(2);
    const customerPrice = +(totalCost * (1 + margin / 100)).toFixed(2);
    return { weightGrams, printHours, materialCost, machineCost, totalCost, customerPrice };
  }, [infill, shells, layerHeight, margin]);

  const finalPrice =
    priceMode === "manual" && manualPrice !== "" ? parseFloat(manualPrice) : pricing.customerPrice;

  const toggleStore = (store: string) =>
    setSelectedStores((prev) =>
      prev.includes(store) ? prev.filter((s) => s !== store) : [...prev, store],
    );

  const handleModelFile = (file: File | null) => {
    setModelFile(file);
    if (file && file.name.toLowerCase().endsWith(".3mf")) {
      setTech(MOCK_3MF_SETTINGS.tech);
      setMaterial(MOCK_3MF_SETTINGS.material);
      setLayerHeight(MOCK_3MF_SETTINGS.layerHeight);
      setShells(MOCK_3MF_SETTINGS.shells);
      setInfill(MOCK_3MF_SETTINGS.infill);
      setInfillPattern(MOCK_3MF_SETTINGS.infillPattern);
      setTopShellLayers(MOCK_3MF_SETTINGS.topShellLayers);
      setBottomShellLayers(MOCK_3MF_SETTINGS.bottomShellLayers);
      setSupport(MOCK_3MF_SETTINGS.support);
      setBrim(MOCK_3MF_SETTINGS.brim);
      setBrimWidth(MOCK_3MF_SETTINGS.brimWidth);
      setSeam(MOCK_3MF_SETTINGS.seam);
    }
  };

  const handleImageUpload = (index: number, file: File | null) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImagePreviews((prev) => {
      const next = [...prev];
      next[index] = url;
      return next;
    });
  };

  const handleSupplierImageUpload = (index: number, file: File | null) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setSupplierImagePreviews((prev) => {
      const next = [...prev];
      next[index] = url;
      return next;
    });
  };

  const handleSubmit = () => {
    if (!productName.trim()) return;
    const printSettings = { tech, material, layerHeight, shells, infill, infillPattern, topShellLayers, bottomShellLayers, support, brim, brimWidth, seam };
    const all = getProducts();
    const primaryImage = imagePreviews.find((p) => p) ?? "";
    const supplierInstructionImages = supplierImagePreviews.filter((p): p is string => !!p);
    const modelFileName = modelFile?.name ?? existing?.modelFileName;

    if (isEdit && existing) {
      const updated = all.map((p) =>
        p.id === existing.id
          ? {
              ...p,
              name: productName,
              image: primaryImage || p.image,
              cost: pricing.totalCost,
              price: finalPrice,
              stores: selectedStores,
              printSettings,
              details: { ...p.details, colors },
              supplierInstructionImages,
              modelFileName,
            }
          : p,
      );
      saveProducts(updated);
    } else {
      const newProduct: Product = {
        id: `p_${Date.now()}`,
        name: productName,
        sku: `#${String(all.length + 1).padStart(3, "0")}`,
        image: primaryImage,
        cost: pricing.totalCost,
        price: finalPrice,
        stores: selectedStores,
        printSettings,
        details: {
          printTime: `${pricing.printHours}:00 Hours`,
          weight: `${pricing.weightGrams} Grams`,
          colors,
        },
        recentOrders: [],
        supplierInstructionImages,
        modelFileName,
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
  const backBtnCls =
    "rounded-md border border-white/10 px-8 py-3 text-sm font-extrabold uppercase italic tracking-wide text-white/60 transition-all hover:border-white/30 hover:text-white";
  const nextBtnCls =
    "rounded-md bg-green-500 px-8 py-3 text-sm font-extrabold uppercase italic tracking-wide text-black transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50";

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
          <Stepper step={step} />

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex flex-col gap-6"
              >
                <div className="flex flex-col gap-6">
                  {/* File Upload */}
                  <DashboardCard index={0} title="3D FILE" autoHeight withBackground={false}>
                    <div className="flex flex-col">
                      <div className="h-[480px]">
                        <UploadDropCard
                          accept=".stl,.obj,.3mf"
                          onFile={handleModelFile}
                          fill
                          className="h-full"
                          fileName={modelFile?.name}
                        />
                      </div>
                      {isEdit && !modelFile && existing && (
                        <p className="mt-3 shrink-0 truncate text-center text-[12px] font-medium text-white/40">
                          Current file: {existing.name}.stl
                        </p>
                      )}
                      {modelFile && (
                        <div className="mt-3 flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3">
                          {/* File type icon */}
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.07]">
                            <span className="text-[11px] font-bold uppercase text-white/60">
                              {modelFile.name.split(".").pop()?.toUpperCase()}
                            </span>
                          </div>
                          {/* File info */}
                          <div className="flex min-w-0 flex-col gap-0.5">
                            <span className="truncate text-sm font-medium text-white">{modelFile.name}</span>
                            <span className="text-[11px] text-white/40">
                              {(modelFile.size / 1024 / 1024).toFixed(2)} MB
                            </span>
                          </div>
                          {/* 3MF badge */}
                          {is3mf && (
                            <span className="ml-auto shrink-0 rounded-full border border-green-500/30 bg-green-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-green-500">
                              ✓ Settings loaded
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </DashboardCard>

                  <AnimatePresence>
                    {modelFile && (
                      <motion.div
                        key="print-settings"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 16 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                      >
                        <DashboardCard index={1} title="PRINT SETTINGS" autoHeight withBackground={false}>
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
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex items-center justify-end rounded-2xl border border-white/10 bg-white/[0.07] px-6 py-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={!canProceedStep1}
                    className={nextBtnCls}
                  >
                    Next →
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex flex-col gap-6"
              >
                <div className="mx-auto w-full max-w-[560px]">
                  <DashboardCard index={0} title="PRINT COST" autoHeight withBackground={false}>
                    <div className="flex flex-col">
                      <div className="flex items-center justify-between py-1.5 text-sm">
                        <span className="text-white/50">Estimated Weight</span>
                        <span className="text-white">{pricing.weightGrams}g</span>
                      </div>
                      <div className="flex items-center justify-between py-1.5 text-sm">
                        <span className="text-white/50">Print Time</span>
                        <span className="text-white">{pricing.printHours}h</span>
                      </div>
                      <div className="flex items-center justify-between py-1.5 text-sm">
                        <span className="text-white/50">Material Cost</span>
                        <span className="text-white">${pricing.materialCost}</span>
                      </div>
                      <div className="flex items-center justify-between py-1.5 text-sm">
                        <span className="text-white/50">Machine Cost</span>
                        <span className="text-white">${pricing.machineCost}</span>
                      </div>

                      <div className="my-3 h-px bg-white/10" />

                      <div className="flex items-center justify-between py-1">
                        <span className="font-medium text-white/70">Total Print Cost</span>
                        <span className="text-lg font-bold text-white">${pricing.totalCost}</span>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-3">
                      <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-green-500">
                        My Price
                      </span>

                      {/* Mode selector */}
                      <div className="flex items-center gap-5">
                        <button
                          type="button"
                          onClick={() => setPriceMode("margin")}
                          className="flex items-center gap-2"
                        >
                          <span
                            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors ${
                              priceMode === "margin" ? "border-green-500" : "border-white/25"
                            }`}
                          >
                            {priceMode === "margin" && (
                              <span className="h-2 w-2 rounded-full bg-green-500" />
                            )}
                          </span>
                          <span
                            className={`text-[12px] font-medium uppercase tracking-wide transition-colors ${
                              priceMode === "margin" ? "text-white" : "text-white/40"
                            }`}
                          >
                            Profit Margin %
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setPriceMode("manual")}
                          className="flex items-center gap-2"
                        >
                          <span
                            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors ${
                              priceMode === "manual" ? "border-green-500" : "border-white/25"
                            }`}
                          >
                            {priceMode === "manual" && (
                              <span className="h-2 w-2 rounded-full bg-green-500" />
                            )}
                          </span>
                          <span
                            className={`text-[12px] font-medium uppercase tracking-wide transition-colors ${
                              priceMode === "manual" ? "text-white" : "text-white/40"
                            }`}
                          >
                            Manual Price
                          </span>
                        </button>
                      </div>

                      {/* Input + final price side by side */}
                      <div className="flex items-start gap-3">
                        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                          <AnimatePresence mode="wait">
                            {priceMode === "margin" ? (
                              <motion.div
                                key="margin-input"
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.15, ease: "easeOut" }}
                                className="flex flex-col gap-1.5"
                              >
                                <span className="text-[10px] uppercase tracking-wider text-white/40">Profit Margin</span>
                                <NumberStepper
                                  value={margin}
                                  onChange={setMargin}
                                  min={0}
                                  max={500}
                                  step={1}
                                  suffix="%"
                                />
                              </motion.div>
                            ) : (
                              <motion.div
                                key="manual-input"
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.15, ease: "easeOut" }}
                                className="flex flex-col gap-1.5"
                              >
                                <span className="text-[10px] uppercase tracking-wider text-white/40">Manual Price</span>
                                <NumberStepper
                                  value={manualPrice !== "" ? parseFloat(manualPrice) : pricing.customerPrice}
                                  onChange={(v) => setManualPrice(String(v))}
                                  min={0}
                                  max={100000}
                                  step={0.5}
                                  prefix="$"
                                />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                          <span className="text-[10px] uppercase tracking-wider text-white/40">Customer Price</span>
                          <div className="flex h-10 items-center justify-end rounded-md border border-white/10 bg-white/[0.04] px-4">
                            <span className="text-sm font-bold text-green-500">${finalPrice.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </DashboardCard>
                </div>

                <div className="mx-auto flex w-full max-w-[560px] items-center justify-between rounded-2xl border border-white/10 bg-white/[0.07] px-6 py-4">
                  <button type="button" onClick={() => setStep(1)} className={backBtnCls}>
                    ← Back
                  </button>
                  <button type="button" onClick={() => setStep(3)} className={nextBtnCls}>
                    Next →
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex flex-col gap-6"
              >
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  {/* Left column */}
                  <div className="flex flex-col gap-6">
                    <DashboardCard
                      index={0}
                      title="PRODUCT IMAGE"
                      autoHeight
                      withBackground={false}
                      headerAction={
                        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                          For Customer
                        </span>
                      }
                    >
                      <div className="grid grid-cols-2 gap-3">
                        {[0, 1, 2, 3].map((i) => (
                          <div key={i} className="relative aspect-square">
                            <input
                              type="file"
                              accept="image/png,image/jpeg,image/webp"
                              className="absolute inset-0 z-10 cursor-pointer opacity-0"
                              onChange={(e) => handleImageUpload(i, e.target.files?.[0] ?? null)}
                            />
                            {imagePreviews[i] ? (
                              <div className="h-full w-full overflow-hidden rounded-xl">
                                <img
                                  src={imagePreviews[i]!}
                                  alt={`Product preview ${i + 1}`}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="flex h-full w-full flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-white/15 bg-dark transition-colors hover:border-green-500/30">
                                <Camera size={18} className="text-white/25" />
                                <span className="text-lg leading-none text-white/30">+</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </DashboardCard>

                    <DashboardCard index={1} title="DESCRIPTION" autoHeight withBackground={false}>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe your product..."
                        className="min-h-[120px] w-full resize-none rounded-xl border border-white/10 bg-dark px-4 py-3 text-sm text-white outline-none placeholder:text-[11px] placeholder:uppercase placeholder:tracking-wider placeholder:text-white/25 transition-colors focus:border-green-500/40"
                      />
                    </DashboardCard>
                  </div>

                  {/* Right column */}
                  <div className="flex flex-col gap-6">
                    <DashboardCard index={0} title="PRODUCT DETAILS" autoHeight withBackground={false}>
                      <div className="flex flex-col gap-5">
                        <Input
                          label="Product Name"
                          value={productName}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProductName(e.target.value)}
                          placeholder="e.g. SoldierXPT"
                          wrapperClassName="w-full"
                        />

                        <div className="flex flex-col gap-2">
                          <span className="select-none text-sm font-medium uppercase tracking-widest text-green-500">
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
                            <button
                              type="button"
                              onClick={() => setShowColorConfirm(true)}
                              className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 text-white/40 transition-colors hover:border-green-500/40 hover:text-green-500"
                              title="Add color"
                            >
                              +
                            </button>
                          </div>

                          {/* Color confirmation panel */}
                          <AnimatePresence>
                            {showColorConfirm && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                className="overflow-hidden"
                              >
                                <div className="mt-2 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
                                  {/* Color picker — circular swatch, click to pick exact hue */}
                                  <input
                                    type="color"
                                    value={pendingColor}
                                    onChange={(e) => setPendingColor(e.target.value)}
                                    title="Pick color"
                                    className="h-8 w-8 shrink-0 cursor-pointer rounded-full border border-white/20 bg-transparent p-0 [&::-webkit-color-swatch]:rounded-full [&::-webkit-color-swatch]:border-none [&::-webkit-color-swatch-wrapper]:rounded-full [&::-webkit-color-swatch-wrapper]:p-0 [&::-moz-color-swatch]:rounded-full [&::-moz-color-swatch]:border-none"
                                  />
                                  {/* Hex value */}
                                  <span className="text-sm font-mono text-white/60">{pendingColor}</span>
                                  {/* Confirm */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (!colors.includes(pendingColor)) {
                                        setColors((prev) => [...prev, pendingColor]);
                                      }
                                      setShowColorConfirm(false);
                                    }}
                                    className="ml-auto rounded-md border border-green-500/30 bg-green-500/15 px-3 py-1.5 text-[12px] font-bold text-green-500 transition-colors hover:bg-green-500/25"
                                  >
                                    Add
                                  </button>
                                  {/* Cancel */}
                                  <button
                                    type="button"
                                    onClick={() => setShowColorConfirm(false)}
                                    className="rounded-md border border-white/10 px-3 py-1.5 text-[12px] font-bold text-white/40 transition-colors hover:text-white"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </DashboardCard>

                    <DashboardCard index={1} title="SELL ON" autoHeight withBackground={false}>
                      <div className="flex flex-wrap gap-2">
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
                    </DashboardCard>

                    <DashboardCard
                      index={2}
                      title="SUPPLIER INSTRUCTIONS"
                      autoHeight
                      withBackground={false}
                      headerAction={
                        <span className="rounded-full border border-green-500/30 bg-green-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-green-500">
                          For Supplier
                        </span>
                      }
                    >
                      {/* Guidance text */}
                      <div className="mb-4 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3">
                        <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-white/40">
                          For supplier use only — not visible to customers
                        </p>
                        <ul className="flex flex-col gap-1.5 text-[12px] text-white/50">
                          <li>• <span className="text-white/70">Assembly</span> — if the product has multiple parts that need to be joined</li>
                          <li>• <span className="text-white/70">Print orientation</span> — preferred direction for best results</li>
                          <li>• <span className="text-white/70">Finishing</span> — sanding, painting, coating requirements</li>
                          <li>• <span className="text-white/70">Special packaging</span> — fragile parts, protective wrapping</li>
                          <li>• <span className="text-white/70">Reference file</span> — attach a PDF with diagrams or assembly instructions</li>
                        </ul>
                      </div>

                      {/* Assembly / finishing reference images */}
                      <div className="mb-4 grid grid-cols-4 gap-3">
                        {[0, 1, 2, 3].map((i) => (
                          <div key={i} className="relative aspect-square">
                            <input
                              type="file"
                              accept="image/png,image/jpeg,image/webp"
                              className="absolute inset-0 z-10 cursor-pointer opacity-0"
                              onChange={(e) => handleSupplierImageUpload(i, e.target.files?.[0] ?? null)}
                            />
                            {supplierImagePreviews[i] ? (
                              <div className="h-full w-full overflow-hidden rounded-xl">
                                <img
                                  src={supplierImagePreviews[i]!}
                                  alt={`Supplier reference ${i + 1}`}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="flex h-full w-full flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-white/15 bg-dark transition-colors hover:border-green-500/30">
                                <Camera size={16} className="text-white/25" />
                                <span className="text-lg leading-none text-white/30">+</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Instructions textarea */}
                      <textarea
                        value={supplierInstructions}
                        onChange={(e) => setSupplierInstructions(e.target.value)}
                        placeholder="Write any special instructions for the supplier..."
                        rows={5}
                        className="w-full resize-none rounded-xl border border-white/10 bg-dark px-4 py-3 text-sm text-white outline-none placeholder:text-[11px] placeholder:uppercase placeholder:tracking-wider placeholder:text-white/25 transition-colors focus:border-green-500/40"
                      />

                      {/* PDF upload */}
                      <div className="mt-3">
                        <input
                          ref={supplierPdfRef}
                          type="file"
                          accept="application/pdf"
                          className="hidden"
                          onChange={(e) => setSupplierPdf(e.target.files?.[0] ?? null)}
                        />
                        {supplierPdf ? (
                          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/[0.07] text-[10px] font-bold uppercase text-white/60">
                              PDF
                            </span>
                            <span className="min-w-0 flex-1 truncate text-[12px] text-white/70">{supplierPdf.name}</span>
                            <button
                              type="button"
                              onClick={() => setSupplierPdf(null)}
                              className="text-[11px] text-white/30 transition-colors hover:text-white/60"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => supplierPdfRef.current?.click()}
                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-transparent px-4 py-2.5 text-[12px] text-white/40 transition-colors hover:border-white/25 hover:text-white/60"
                          >
                            + Attach PDF (optional)
                          </button>
                        )}
                      </div>
                    </DashboardCard>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.07] px-6 py-4">
                  <button type="button" onClick={() => setStep(2)} className={backBtnCls}>
                    ← Back
                  </button>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-white/40">Cost: ${pricing.totalCost}</span>
                    <span className="text-white/30">→</span>
                    <span className="font-semibold text-green-500">Price: ${finalPrice}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!productName.trim()}
                    className={nextBtnCls}
                  >
                    {isEdit ? "Save Changes" : "Add Product"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DashboardPage>
      </motion.div>
    </DashboardLayout>
  );
}
