import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "../../../features/dashboard/DashboardLayout.js";
import DashboardCard from "../../../features/dashboard/components/DashboardCard.js";
import DashboardPage, { DashboardPageTitle } from "../../../features/dashboard/components/DashboardPage.js";
// @ts-ignore — JSX component without declarations
import ShellsStepper from "../../../features/home/FileUploader/ShellsStepper.jsx";
import { mockCapabilities } from "./mockSupplier.js";

const TECH_OPTIONS = ["FDM", "SLS", "SLA"];
const MATERIAL_OPTIONS = ["PLA", "ABS", "PETG", "TPU", "ASA"];

function MultiOptionGroup({
  options,
  values,
  onToggle,
}: {
  options: string[];
  values: string[];
  onToggle: (opt: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {options.map((opt) => {
        const active = values.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onToggle(opt)}
            className={[
              "rounded-md border px-4 py-1.5 text-[12px] font-bold uppercase tracking-wide transition-colors",
              active
                ? "border-green-500/40 bg-green-500/15 text-green-500"
                : "border-white/10 bg-white/[0.03] text-white/40 hover:border-white/20 hover:text-white/60",
            ].join(" ")}
          >
            {opt}
          </button>
        );
      })}
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

export default function SupplierCapabilities() {
  const [isActive, setIsActive] = useState(mockCapabilities.isActive);
  const [workingFrom, setWorkingFrom] = useState(mockCapabilities.workingHours.from);
  const [workingTo, setWorkingTo] = useState(mockCapabilities.workingHours.to);
  const [technologies, setTechnologies] = useState<string[]>(mockCapabilities.technologies);
  const [materials, setMaterials] = useState<string[]>(mockCapabilities.materials);
  const [printerCount, setPrinterCount] = useState(mockCapabilities.printerCount);
  const [maxParallelJobs, setMaxParallelJobs] = useState(mockCapabilities.maxParallelJobs);
  const [colors, setColors] = useState<string[]>(mockCapabilities.colors);
  const [pendingColor, setPendingColor] = useState("#5ac422");
  const [showColorConfirm, setShowColorConfirm] = useState(false);
  const [saved, setSaved] = useState(false);

  const toggleTech = (opt: string) =>
    setTechnologies((prev) => (prev.includes(opt) ? prev.filter((t) => t !== opt) : [...prev, opt]));
  const toggleMaterial = (opt: string) =>
    setMaterials((prev) => (prev.includes(opt) ? prev.filter((m) => m !== opt) : [...prev, opt]));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const activeTgl =
    "rounded-md border border-green-500/40 bg-green-500/15 px-6 py-2 text-[13px] font-bold uppercase tracking-wide text-green-500 transition-colors";
  const inactiveTgl =
    "rounded-md border border-white/10 bg-white/[0.03] px-6 py-2 text-[13px] font-bold uppercase tracking-wide text-white/40 transition-colors hover:border-white/20 hover:text-white/60";

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
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setIsActive(true)} className={isActive ? activeTgl : inactiveTgl}>
                  Active
                </button>
                <button type="button" onClick={() => setIsActive(false)} className={!isActive ? activeTgl : inactiveTgl}>
                  Unavailable
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-md">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] uppercase tracking-wider text-white/40">Working Hours — From</span>
                  <input
                    type="time"
                    value={workingFrom}
                    onChange={(e) => setWorkingFrom(e.target.value)}
                    className="rounded-md border border-white/10 bg-dark px-3 py-2 text-sm text-white outline-none transition-colors focus:border-green-500"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] uppercase tracking-wider text-white/40">Working Hours — To</span>
                  <input
                    type="time"
                    value={workingTo}
                    onChange={(e) => setWorkingTo(e.target.value)}
                    className="rounded-md border border-white/10 bg-dark px-3 py-2 text-sm text-white outline-none transition-colors focus:border-green-500"
                  />
                </div>
              </div>
            </div>
          </DashboardCard>

          <DashboardCard index={1} title="TECHNOLOGIES & MATERIALS" autoHeight withBackground={false}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-green-500">Technologies</span>
                <MultiOptionGroup options={TECH_OPTIONS} values={technologies} onToggle={toggleTech} />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-green-500">Materials</span>
                <MultiOptionGroup options={MATERIAL_OPTIONS} values={materials} onToggle={toggleMaterial} />
              </div>
            </div>
          </DashboardCard>

          <DashboardCard index={2} title="PRINTERS" autoHeight withBackground={false}>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 max-w-md">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] uppercase tracking-wider text-white/40">Number of Printers</span>
                <ShellsStepper value={printerCount} onChange={setPrinterCount} min={1} max={50} />
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] uppercase tracking-wider text-white/40">Max Parallel Jobs</span>
                <ShellsStepper value={maxParallelJobs} onChange={setMaxParallelJobs} min={1} max={20} />
              </div>
            </div>
          </DashboardCard>

          <DashboardCard index={3} title="COLORS IN STOCK" autoHeight withBackground={false}>
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
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
                      <input
                        type="color"
                        value={pendingColor}
                        onChange={(e) => setPendingColor(e.target.value)}
                        title="Pick color"
                        className="h-8 w-8 shrink-0 cursor-pointer rounded-full border border-white/20 bg-transparent p-0 [&::-webkit-color-swatch]:rounded-full [&::-webkit-color-swatch]:border-none [&::-webkit-color-swatch-wrapper]:rounded-full [&::-webkit-color-swatch-wrapper]:p-0 [&::-moz-color-swatch]:rounded-full [&::-moz-color-swatch]:border-none"
                      />
                      <span className="text-sm font-mono text-white/60">{pendingColor}</span>
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
