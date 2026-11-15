import { AnimatePresence, motion } from "framer-motion";
import ChoiceGroup from "../../components/ui/ChoiceGroup.js";
import Reveal from "./Reveal.js";
import WizardTextField from "./WizardTextField.js";
import {
  MATERIAL_GROUPS,
  OTHER_TECH_ID,
  SUPPLIER_LABELS,
  TECH_OPTIONS,
} from "./supplierContent.js";

interface TechnologyPickerProps {
  /** Checked technology ids */
  technologies: readonly string[];
  /** techId -> selected materials */
  materials: Record<string, string[]>;
  techOther: string;
  onTechnologiesChange: (next: string[]) => void;
  onMaterialsChange: (techId: string, next: string[]) => void;
  onTechOtherChange: (next: string) => void;
  onTechOtherBlur: () => void;
  techOtherLabel: string;
  error?: string | undefined;
  techOtherError?: string | undefined;
  className?: string;
}

// Technologies as chips; each checked technology adds a block with its material
// chips below (document order, no tabs). "Other" opens a details field.
export default function TechnologyPicker({
  technologies,
  materials,
  techOther,
  onTechnologiesChange,
  onMaterialsChange,
  onTechOtherChange,
  onTechOtherBlur,
  techOtherLabel,
  error,
  techOtherError,
  className = "",
}: TechnologyPickerProps) {
  const groups = MATERIAL_GROUPS.filter((g) => technologies.includes(g.techId));
  const techLabel = (id: string) => TECH_OPTIONS.find((t) => t.id === id)?.label ?? id;

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <div id="field-technologies">
        <ChoiceGroup
          type="checkbox"
          compact
          roving
          label={SUPPLIER_LABELS.technologies}
          options={TECH_OPTIONS.map((t) => ({ value: t.id, label: t.label }))}
          value={technologies}
          onChange={onTechnologiesChange}
          error={error}
        />
        {technologies.length === 0 && !error && (
          <p className="mt-1.5 text-[13px] text-white/45">
            Select each technology you offer, then pick its materials.
          </p>
        )}
      </div>

      <Reveal show={technologies.includes(OTHER_TECH_ID)}>
        <div id="field-techOther">
          <WizardTextField
            label={techOtherLabel}
            value={techOther}
            onValueChange={onTechOtherChange}
            onBlur={onTechOtherBlur}
            error={techOtherError}
          />
        </div>
      </Reveal>

      {groups.length > 0 && (
        <div className="flex flex-col gap-2.5">
          <p className="text-[15px] font-semibold leading-snug text-white">
            {SUPPLIER_LABELS.materials}
          </p>
          <AnimatePresence initial={false}>
            {groups.map((group) => {
              const count = materials[group.techId]?.length ?? 0;
              return (
                <motion.section
                  key={group.techId}
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]"
                >
                  <div className="px-3.5 py-3">
                    <div className="mb-2 flex items-baseline justify-between gap-3">
                      <h4 className="text-[12px] font-bold uppercase tracking-wide text-green-500">
                        {group.heading}
                      </h4>
                      {count > 0 && (
                        <span className="text-[11px] text-white/45">{count} selected</span>
                      )}
                    </div>
                    <ChoiceGroup
                      type="checkbox"
                      compact
                      roving
                      ariaLabel={`${techLabel(group.techId)} materials`}
                      options={group.materials.map((m) => ({ value: m, label: m }))}
                      value={materials[group.techId] ?? []}
                      onChange={(next) => onMaterialsChange(group.techId, next)}
                    />
                  </div>
                </motion.section>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
