import { useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import ChoiceGroup from "../../components/ui/ChoiceGroup.js";
import WizardTextField from "./WizardTextField.js";
import { MATERIAL_GROUPS, OTHER_TECH_ID, TECH_OPTIONS } from "./supplierContent.js";

interface TechCardGridProps {
  label: string;
  /** Helper line under the label */
  hint?: string;
  /** Checked technology ids */
  technologies: readonly string[];
  /** techId -> selected materials */
  materials: Record<string, string[]>;
  techOther: string;
  onToggleTech: (techId: string) => void;
  onMaterialsChange: (techId: string, next: string[]) => void;
  onTechOtherChange: (next: string) => void;
  onTechOtherBlur: () => void;
  techOtherLabel: string;
  error?: string | undefined;
  techOtherError?: string | undefined;
  className?: string;
}

// Technology cards (dashboard surface). A checked card spans the full grid row
// and shows its material chips inside; "Other" shows a details field instead.
// Keyboard: the grid is one Tab stop, arrows move between cards, Space/Enter toggles.
export default function TechCardGrid({
  label,
  hint,
  technologies,
  materials,
  techOther,
  onToggleTech,
  onMaterialsChange,
  onTechOtherChange,
  onTechOtherBlur,
  techOtherLabel,
  error,
  techOtherError,
  className = "",
}: TechCardGridProps) {
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [focusIndex, setFocusIndex] = useState<number | null>(null);
  const firstChecked = TECH_OPTIONS.findIndex((t) => technologies.includes(t.id));
  const tabStop = focusIndex ?? (firstChecked >= 0 ? firstChecked : 0);

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = TECH_OPTIONS.length - 1;
    let next: number;
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        next = index === last ? 0 : index + 1;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        next = index === 0 ? last : index - 1;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = last;
        break;
      default:
        return;
    }
    e.preventDefault();
    setFocusIndex(next);
    buttonsRef.current[next]?.focus();
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <p id="tech-grid-label" className="text-[15px] font-semibold leading-snug text-white">
        {label}
      </p>
      {hint && <p className="-mt-1 text-[13px] text-white/45">{hint}</p>}
      <div
        role="group"
        aria-labelledby="tech-grid-label"
        aria-describedby={error ? "tech-grid-error" : undefined}
        className="grid grid-cols-1 gap-3 lg:grid-flow-dense lg:grid-cols-2"
      >
        {TECH_OPTIONS.map((tech, index) => {
          const selected = technologies.includes(tech.id);
          const group = MATERIAL_GROUPS.find((g) => g.techId === tech.id);
          const count = materials[tech.id]?.length ?? 0;
          return (
            <motion.div
              key={tech.id}
              layout
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className={[
                "overflow-hidden rounded-xl border transition-colors",
                selected
                  ? "border-green-500/40 bg-green-500/10 lg:col-span-2"
                  : "border-white/10 bg-white/[0.02] hover:border-white/20",
              ].join(" ")}
            >
              <motion.button
                layout="position"
                ref={(el) => {
                  buttonsRef.current[index] = el;
                }}
                type="button"
                aria-pressed={selected}
                tabIndex={index === tabStop ? 0 : -1}
                onFocus={() => setFocusIndex(index)}
                onKeyDown={(e) => onKeyDown(e, index)}
                onClick={() => onToggleTech(tech.id)}
                className="flex min-h-12 w-full items-center gap-3 px-4 py-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-green-500/60"
              >
                <span
                  aria-hidden="true"
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                    selected ? "border-green-500 bg-green-500 text-dark" : "border-white/25"
                  }`}
                >
                  {selected && <Check size={14} strokeWidth={3} />}
                </span>
                <span
                  className={`text-[13px] font-bold uppercase tracking-wide ${
                    selected ? "text-green-500" : "text-white/80"
                  }`}
                >
                  {tech.label}
                </span>
                {selected && count > 0 && (
                  <span className="ml-auto text-[11px] font-bold uppercase tracking-wide text-green-500/80">
                    {count} selected
                  </span>
                )}
              </motion.button>

              <AnimatePresence initial={false}>
                {selected && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-4 pb-4">
                      {tech.id === OTHER_TECH_ID ? (
                        <div id="field-techOther">
                          <WizardTextField
                            label={techOtherLabel}
                            value={techOther}
                            onValueChange={onTechOtherChange}
                            onBlur={onTechOtherBlur}
                            error={techOtherError}
                          />
                        </div>
                      ) : group ? (
                        <ChoiceGroup
                          type="checkbox"
                          compact
                          roving
                          ariaLabel={`${tech.label} materials`}
                          options={group.materials.map((m) => ({ value: m, label: m }))}
                          value={materials[tech.id] ?? []}
                          onChange={(next) => onMaterialsChange(tech.id, next)}
                        />
                      ) : null}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
      {error && (
        <p id="tech-grid-error" className="text-xs font-medium text-rose-400" aria-live="polite">
          {error}
        </p>
      )}
    </div>
  );
}
