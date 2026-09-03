import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "../../../features/dashboard/DashboardLayout.js";
import DashboardCard from "../../../features/dashboard/components/DashboardCard.js";
import DashboardPage, { DashboardPageTitle } from "../../../features/dashboard/components/DashboardPage.js";
// @ts-ignore — JSX component without declarations
import ShellsStepper from "../../../features/home/FileUploader/ShellsStepper.jsx";
import { mockCapabilities } from "./mockSupplier.js";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Material options per technology
const TECH_MATERIALS: Record<string, string[]> = {
  FDM: ["PLA", "ABS", "PETG", "TPU", "ASA"],
  SLS: ["Nylon", "TPU", "ASA"],
  SLA: ["Standard Resin", "ABS-like Resin", "Flexible Resin"],
};

const PRINTER_BRANDS = [
  "Creality",
  "Bambu Lab",
  "Prusa",
  "Formlabs",
  "Ultimaker",
  "Stratasys",
  "Raise3D",
  "Anycubic",
  "Snapmaker",
  "Other",
];

interface PrinterEntry {
  id: string;
  brand: string;
  customBrand: string; // used when brand === "Other"
  model: string;
  count: number;
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

export default function SupplierCapabilities() {
  const [isActive, setIsActive] = useState(mockCapabilities.isActive);
  const [workingFrom, setWorkingFrom] = useState(mockCapabilities.workingHours.from);
  const [workingTo, setWorkingTo] = useState(mockCapabilities.workingHours.to);
  const [activeDays, setActiveDays] = useState<string[]>(["Mon", "Tue", "Wed", "Thu", "Fri"]);
  const [technologies, setTechnologies] = useState<string[]>(mockCapabilities.technologies);
  const [printers, setPrinters] = useState<PrinterEntry[]>([
    { id: "p1", brand: "Creality", customBrand: "", model: "Ender 3 Pro", count: 2 },
    { id: "p2", brand: "Bambu Lab", customBrand: "", model: "X1 Carbon",  count: 1 },
  ]);
  const [maxParallelJobs, setMaxParallelJobs] = useState(mockCapabilities.maxParallelJobs);
  const [saved, setSaved] = useState(false);

  // State: materials per technology
  const [materialsByTech, setMaterialsByTech] = useState<Record<string, string[]>>({
    FDM: mockCapabilities.materials.filter((m) => (TECH_MATERIALS.FDM ?? []).includes(m)),
    SLS: [],
    SLA: [],
  });

  // State: colors per material per technology
  const [colorsByTechMaterial, setColorsByTechMaterial] = useState<Record<string, Record<string, string[]>>>({
    FDM: { PLA: mockCapabilities.colors, ABS: [], PETG: [], TPU: [], ASA: [] },
    SLS: { Nylon: [], TPU: [], ASA: [] },
    SLA: { "Standard Resin": [], "ABS-like Resin": [], "Flexible Resin": [] },
  });

  // State: which tech tab is active in the card
  const [activeTechTab, setActiveTechTab] = useState<string>("FDM");

  // State: color picker per material
  const [pendingColors, setPendingColors] = useState<Record<string, string>>({});
  const [showColorPicker, setShowColorPicker] = useState<Record<string, boolean>>({});

  const toggleTech = (opt: string) =>
    setTechnologies((prev) => (prev.includes(opt) ? prev.filter((t) => t !== opt) : [...prev, opt]));
  const toggleDay = (day: string) =>
    setActiveDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));

  const toggleMaterialForTech = (tech: string, mat: string) => {
    setMaterialsByTech((prev) => {
      const current = prev[tech] ?? [];
      return {
        ...prev,
        [tech]: current.includes(mat) ? current.filter((m) => m !== mat) : [...current, mat],
      };
    });
  };

  const addColorToMaterial = (tech: string, mat: string) => {
    const color = pendingColors[`${tech}-${mat}`] ?? "#5ac422";
    setColorsByTechMaterial((prev) => {
      const techColors = prev[tech] ?? {};
      const matColors = techColors[mat] ?? [];
      if (matColors.includes(color)) return prev;
      return { ...prev, [tech]: { ...techColors, [mat]: [...matColors, color] } };
    });
    setShowColorPicker((prev) => ({ ...prev, [`${tech}-${mat}`]: false }));
  };

  const removeColorFromMaterial = (tech: string, mat: string, color: string) => {
    setColorsByTechMaterial((prev) => {
      const techColors = prev[tech] ?? {};
      const matColors = techColors[mat] ?? [];
      return { ...prev, [tech]: { ...techColors, [mat]: matColors.filter((c) => c !== color) } };
    });
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addPrinter = () => {
    setPrinters((prev) => [
      ...prev,
      { id: `p_${Date.now()}`, brand: "Creality", customBrand: "", model: "", count: 1 },
    ]);
  };

  const removePrinter = (id: string) => {
    setPrinters((prev) => prev.filter((p) => p.id !== id));
  };

  const updatePrinter = (id: string, patch: Partial<PrinterEntry>) => {
    setPrinters((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  };

  return (
    <DashboardLayout role="supplier">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full"
      >
        <DashboardPage header={<DashboardPageTitle>CAPABILITIES</DashboardPageTitle>}>
          <DashboardCard index={0} title="AVAILABILITY" autoHeight withBackground={false}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">

              {/* Left: Status toggle — 1/3 */}
              <div className="flex flex-col gap-3 md:border-r md:border-white/10 md:pr-12">
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-green-500">
                  Current Status
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isActive}
                    onClick={() => setIsActive((v) => !v)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 focus:outline-none ${
                      isActive ? "border-green-500 bg-green-500" : "border-red-400/50 bg-red-400/20"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${
                        isActive ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                  <span className={`text-[13px] font-semibold transition-colors ${isActive ? "text-green-500" : "text-red-400"}`}>
                    {isActive ? "Available" : "Unavailable"}
                  </span>
                </div>
              </div>

              {/* Right: Working days + hours — 2/3 */}
              <div className="flex flex-col gap-6 md:col-span-3 md:pl-12">
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-green-500">
                    Working Days
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {DAYS.map((day) => {
                      const active = activeDays.includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleDay(day)}
                          className={[
                            "rounded-md border px-4 py-1.5 text-[12px] font-bold uppercase tracking-wide transition-colors",
                            active
                              ? "border-green-500/40 bg-green-500/15 text-green-500"
                              : "border-white/10 bg-white/[0.03] text-white/40 hover:border-white/20 hover:text-white/60",
                          ].join(" ")}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-green-500">
                    Working Hours
                  </span>
                  <div className="flex max-w-xs items-center gap-3">
                    <div className="flex flex-1 flex-col gap-1">
                      <span className="text-[10px] uppercase tracking-wider text-white/40">From</span>
                      <input
                        type="time"
                        value={workingFrom}
                        onChange={(e) => setWorkingFrom(e.target.value)}
                        className="rounded-md border border-white/10 bg-dark px-3 py-2 text-sm text-white outline-none transition-colors focus:border-green-500"
                      />
                    </div>
                    <span className="mt-5 text-white/30">—</span>
                    <div className="flex flex-1 flex-col gap-1">
                      <span className="text-[10px] uppercase tracking-wider text-white/40">To</span>
                      <input
                        type="time"
                        value={workingTo}
                        onChange={(e) => setWorkingTo(e.target.value)}
                        className="rounded-md border border-white/10 bg-dark px-3 py-2 text-sm text-white outline-none transition-colors focus:border-green-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </DashboardCard>

          <DashboardCard index={1} title="TECHNOLOGIES, MATERIALS & COLORS" autoHeight withBackground={false}>
            <div className="flex flex-col gap-5">

              {/* Technology multi-select */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-green-500">
                  Technologies
                </span>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(TECH_MATERIALS).map((tech) => {
                    const active = technologies.includes(tech);
                    return (
                      <button
                        key={tech}
                        type="button"
                        onClick={() => {
                          toggleTech(tech);
                          if (!active) setActiveTechTab(tech);
                          else if (activeTechTab === tech) {
                            const remaining = technologies.filter((t) => t !== tech);
                            if (remaining[0]) setActiveTechTab(remaining[0]);
                          }
                        }}
                        className={[
                          "rounded-md border px-4 py-1.5 text-[12px] font-bold uppercase tracking-wide transition-colors",
                          active
                            ? "border-green-500/40 bg-green-500/15 text-green-500"
                            : "border-white/10 bg-white/[0.03] text-white/40 hover:border-white/20 hover:text-white/60",
                        ].join(" ")}
                      >
                        {tech}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tabs for selected technologies */}
              {technologies.length > 0 && (
                <div className="flex flex-col gap-4">
                  {/* Tab bar */}
                  <div className="flex gap-1 border-b border-white/10">
                    {technologies.map((tech) => (
                      <button
                        key={tech}
                        type="button"
                        onClick={() => setActiveTechTab(tech)}
                        className={[
                          "px-4 py-2 text-[12px] font-bold uppercase tracking-wide transition-colors border-b-2 -mb-px",
                          activeTechTab === tech
                            ? "border-green-500 text-green-500"
                            : "border-transparent text-white/40 hover:text-white/70",
                        ].join(" ")}
                      >
                        {tech}
                      </button>
                    ))}
                  </div>

                  {/* Tab content */}
                  <div className="flex flex-col gap-4">
                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-green-500">
                      Materials for {activeTechTab}
                    </span>

                    {/* Material options */}
                    <div className="flex flex-wrap gap-2">
                      {(TECH_MATERIALS[activeTechTab] ?? []).map((mat) => {
                        const active = (materialsByTech[activeTechTab] ?? []).includes(mat);
                        return (
                          <button
                            key={mat}
                            type="button"
                            onClick={() => toggleMaterialForTech(activeTechTab, mat)}
                            className={[
                              "rounded-md border px-4 py-1.5 text-[12px] font-bold uppercase tracking-wide transition-colors",
                              active
                                ? "border-green-500/40 bg-green-500/15 text-green-500"
                                : "border-white/10 bg-white/[0.03] text-white/40 hover:border-white/20 hover:text-white/60",
                            ].join(" ")}
                          >
                            {mat}
                          </button>
                        );
                      })}
                    </div>

                    {/* Colors per selected material */}
                    {(materialsByTech[activeTechTab] ?? []).length > 0 && (
                      <div className="flex flex-col gap-3 mt-2">
                        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-green-500">
                          Colors in Stock
                        </span>
                        {(materialsByTech[activeTechTab] ?? []).map((mat) => {
                          const matColors = colorsByTechMaterial[activeTechTab]?.[mat] ?? [];
                          const pickerKey = `${activeTechTab}-${mat}`;
                          return (
                            <div key={mat} className="flex flex-col gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                              <span className="text-[11px] font-semibold text-white/60">{mat}</span>
                              <div className="flex flex-wrap items-center gap-2">
                                {matColors.map((c) => (
                                  <ColorSwatch
                                    key={c}
                                    color={c}
                                    onRemove={() => removeColorFromMaterial(activeTechTab, mat, c)}
                                  />
                                ))}
                                <button
                                  type="button"
                                  onClick={() => setShowColorPicker((prev) => ({ ...prev, [pickerKey]: true }))}
                                  className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 text-white/40 transition-colors hover:border-green-500/40 hover:text-green-500"
                                >
                                  +
                                </button>
                              </div>

                              {/* Color picker confirmation */}
                              <AnimatePresence>
                                {showColorPicker[pickerKey] && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                    className="overflow-hidden"
                                  >
                                    <div className="mt-1 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
                                      <input
                                        type="color"
                                        value={pendingColors[pickerKey] ?? "#5ac422"}
                                        onChange={(e) => setPendingColors((prev) => ({ ...prev, [pickerKey]: e.target.value }))}
                                        className="h-8 w-8 shrink-0 cursor-pointer rounded-full border border-white/20 bg-transparent p-0 [&::-webkit-color-swatch]:rounded-full [&::-webkit-color-swatch]:border-none [&::-webkit-color-swatch-wrapper]:rounded-full [&::-webkit-color-swatch-wrapper]:p-0"
                                      />
                                      <span className="text-sm font-mono text-white/60">
                                        {pendingColors[pickerKey] ?? "#5ac422"}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => addColorToMaterial(activeTechTab, mat)}
                                        className="ml-auto rounded-md border border-green-500/30 bg-green-500/15 px-3 py-1.5 text-[12px] font-bold text-green-500 transition-colors hover:bg-green-500/25"
                                      >
                                        Add
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setShowColorPicker((prev) => ({ ...prev, [pickerKey]: false }))}
                                        className="rounded-md border border-white/10 px-3 py-1.5 text-[12px] font-bold text-white/40 transition-colors hover:text-white"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </DashboardCard>

          <DashboardCard index={2} title="PRINTERS" autoHeight withBackground={false}>
            <div className="flex flex-col">

              {/* Printer list */}
              <AnimatePresence initial={false}>
                {printers.map((printer) => (
                  <motion.div
                    key={printer.id}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      height: { duration: 0.32, ease: [0.4, 0, 0.2, 1] },
                      opacity: { duration: 0.2, ease: "easeOut" },
                    }}
                    className="overflow-hidden"
                  >
                    <div className="pb-4">
                    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                  {/* Brand dropdown */}
                  <select
                    value={printer.brand}
                    onChange={(e) => updatePrinter(printer.id, { brand: e.target.value, customBrand: "" })}
                    className="rounded-md border border-white/10 bg-dark px-3 py-2 text-sm text-white outline-none transition-colors focus:border-green-500 cursor-pointer min-w-[140px]"
                  >
                    {PRINTER_BRANDS.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>

                  {/* Custom brand input — only when "Other" is selected */}
                  <AnimatePresence initial={false}>
                    {printer.brand === "Other" && (
                      <motion.div
                        key="custom-brand"
                        initial={{ opacity: 0, maxWidth: 0 }}
                        animate={{ opacity: 1, maxWidth: 180 }}
                        exit={{ opacity: 0, maxWidth: 0 }}
                        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                        className="overflow-hidden"
                      >
                        <input
                          type="text"
                          value={printer.customBrand}
                          onChange={(e) => updatePrinter(printer.id, { customBrand: e.target.value })}
                          placeholder="Brand name..."
                          className="rounded-md border border-white/10 bg-dark px-3 py-2 text-sm text-white outline-none transition-colors focus:border-green-500 placeholder:text-white/25 min-w-[140px]"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Model input */}
                  <input
                    type="text"
                    value={printer.model}
                    onChange={(e) => updatePrinter(printer.id, { model: e.target.value })}
                    placeholder="Model..."
                    className="rounded-md border border-white/10 bg-dark px-3 py-2 text-sm text-white outline-none transition-colors focus:border-green-500 placeholder:text-white/25 min-w-[160px] flex-1"
                  />

                  {/* Count stepper */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => updatePrinter(printer.id, { count: Math.max(1, printer.count - 1) })}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 text-white/50 hover:border-white/30 hover:text-white transition-colors"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm font-semibold text-white">
                      {printer.count}
                    </span>
                    <button
                      type="button"
                      onClick={() => updatePrinter(printer.id, { count: printer.count + 1 })}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 text-white/50 hover:border-white/30 hover:text-white transition-colors"
                    >
                      +
                    </button>
                  </div>

                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => removePrinter(printer.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-md text-white/20 hover:bg-red-400/10 hover:text-red-400 transition-colors"
                    title="Remove printer"
                  >
                    🗑
                  </button>
                    </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Add printer button */}
              <button
                type="button"
                onClick={addPrinter}
                className="flex items-center gap-2 rounded-xl border border-dashed border-white/15 px-4 py-2.5 text-[12px] font-bold uppercase tracking-wide text-white/40 transition-colors hover:border-white/25 hover:text-white/60 w-full justify-center"
              >
                + Add Printer
              </button>

              {/* Divider */}
              <div className="mt-4 h-px w-full bg-white/10" />

              {/* Max parallel jobs */}
              <div className="mt-4 flex flex-col gap-2 w-fit">
                <span className="text-[10px] uppercase tracking-wider text-white/40">
                  Max Parallel Jobs
                </span>
                <ShellsStepper value={maxParallelJobs} onChange={setMaxParallelJobs} min={1} max={20} />
              </div>

            </div>
          </DashboardCard>

          <div className="flex items-center justify-end gap-3">
            {saved && <span className="text-[12px] font-semibold text-green-500">Saved successfully.</span>}
            <button
              type="button"
              onClick={handleSave}
              className="rounded-md bg-green-500 px-8 py-3 text-sm font-extrabold uppercase italic tracking-wide text-black transition-all hover:brightness-110"
            >
              Save
            </button>
          </div>
        </DashboardPage>
      </motion.div>
    </DashboardLayout>
  );
}
