// Supplier application as a step-by-step wizard (/join-as-partner).
// Content, validation and the sheet payload live in supplierContent.ts and
// supplierValidation.ts (see docs/apps-script/supplier-sheet.gs for the columns).

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import Button from "../../components/ui/Button.jsx";
import ChoiceGroup from "../../components/ui/ChoiceGroup.js";
import ConfirmDialog from "../../components/ui/ConfirmDialog.js";
import type { SelectOption } from "../../components/ui/SelectField.js";
import SingleChoiceField from "../../components/ui/SingleChoiceField.js";
import { EASE_SOFT } from "../dashboard/motion.js";
import Honeypot from "../forms/Honeypot.js";
import LegalConsent from "../forms/LegalConsent.js";
import CountryField from "../forms/CountryField.js";
import EmailSuggestion from "../forms/EmailSuggestion.js";
import { isMockSubmit, submitToSheet } from "../forms/submitToSheet.js";
import Reveal from "./Reveal.js";
import SupplierWizardReview from "./SupplierWizardReview.js";
import TechnologyPicker from "./TechnologyPicker.js";
import WizardProgressBar from "./WizardProgressBar.js";
import WizardStepNav from "./WizardStepNav.js";
import WizardStepper, { type StepStatus } from "./WizardStepper.js";
import TextField from "../../components/ui/TextField.js";
import useFormDraft from "./useFormDraft.js";
import {
  MATERIALS_OTHER,
  MULTIPLE_ORDERS_OPTIONS,
  PACK_AND_SHIP_OPTIONS,
  PRINTERS_AMOUNT_OPTIONS,
  PRODUCTION_TIME_OPTIONS,
  SERVICES_OTHER_LABEL,
  SERVICE_OPTIONS,
  SHIPPING_DESTINY_OPTIONS,
  SUPPLIER_CONFIRMATION,
  SUPPLIER_CONSENT,
  SUPPLIER_LABELS as L,
  SUPPLIER_PLACEHOLDERS,
  YES_NO_OPTIONS,
} from "./supplierContent.js";
import {
  FIELD_NAMES,
  REVIEW_STEP,
  WIZARD_STEPS,
  maxReachableStep,
  stepErrorKeys,
  stepSummary,
  type SupplierFieldKey,
} from "./supplierSteps.js";
import {
  EMPTY_SUPPLIER_FORM,
  OTHER_SERVICE_ID,
  toSupplierPayload,
  validateSupplier,
  type SupplierFormState,
} from "./supplierValidation.js";

interface SupplierWizardProps {
  className?: string;
}

type DraftForm = Omit<SupplierFormState, "hp">;
interface WizardDraft {
  form: DraftForm;
  step: number;
  visited: number[];
}

type TextKey =
  | "fullName"
  | "businessName"
  | "email"
  | "phone"
  | "website"
  | "techOther"
  | "printerType"
  | "materialsOther"
  | "packAndShipDetail"
  | "shippingCarrier"
  | "packagingMethod"
  | "servicesOther"
  | "additionalText";

const DRAFT_KEY = "3dfly:supplier-application-draft";
const TEXT_INPUT_TYPES = new Set(["text", "email", "tel", "url", "search"]);
const FOCUSABLE = "input, textarea, select, button";

const toOptions = (values: readonly string[]) => values.map((v) => ({ value: v, label: v }));
const isVisible = (el: HTMLElement) => el.offsetParent !== null || el.getClientRects().length > 0;
const isEmptyForm = (form: SupplierFormState) =>
  JSON.stringify({ ...form, hp: "" }) === JSON.stringify(EMPTY_SUPPLIER_FORM);

function isOption(value: unknown): value is SelectOption {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as SelectOption).value === "string" &&
    typeof (value as SelectOption).label === "string"
  );
}

// Merges a stored draft into a fresh form, dropping anything malformed.
function restoreForm(data: unknown): SupplierFormState | null {
  if (!data || typeof data !== "object") return null;
  const form: SupplierFormState = {
    ...EMPTY_SUPPLIER_FORM,
    ...(data as Partial<SupplierFormState>),
    hp: "",
  };
  if (!isOption(form.country)) form.country = null;
  if (!isOption(form.city)) form.city = null;
  if (!Array.isArray(form.technologies)) form.technologies = [];
  if (!Array.isArray(form.services)) form.services = [];
  if (!form.materials || typeof form.materials !== "object") form.materials = {};
  return form;
}

const stepVariants: Variants = {
  enter: (direction: number) => ({ opacity: 0, x: direction * 24 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.25, ease: EASE_SOFT } },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction * -24,
    transition: { duration: 0.16, ease: EASE_SOFT },
  }),
};

export default function SupplierWizard({ className = "" }: SupplierWizardProps) {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [searchParams, setSearchParams] = useSearchParams();
  const draftStore = useFormDraft<WizardDraft>(DRAFT_KEY);
  const [initialDraft] = useState(() => draftStore.load());

  const [form, setForm] = useState<SupplierFormState>(
    () => restoreForm(initialDraft?.form) ?? EMPTY_SUPPLIER_FORM,
  );
  const [visited, setVisited] = useState<Set<number>>(
    () => new Set(Array.isArray(initialDraft?.visited) ? initialDraft.visited : [0]),
  );
  const [restored, setRestored] = useState(() => initialDraft !== null);
  const [attempted, setAttempted] = useState<Set<number>>(() => new Set());
  const [touched, setTouched] = useState<Set<string>>(() => new Set());
  const dirtyRef = useRef<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [done, setDone] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const inFlight = useRef(false);
  const stopSaving = useRef(false);
  const topRef = useRef<HTMLDivElement>(null);
  const stepRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const pendingFocus = useRef(false);

  const errors = useMemo(() => validateSupplier(form), [form]);
  const maxReachable = maxReachableStep(errors);

  // ── Step from the URL (?step=1..4) so browser Back/Forward work ─────────────
  const stepParam = Number(searchParams.get("step"));
  const draftStep =
    typeof initialDraft?.step === "number" ? Math.max(0, Math.min(initialDraft.step, REVIEW_STEP)) : 0;
  const requested =
    Number.isInteger(stepParam) && stepParam >= 1 && stepParam <= WIZARD_STEPS.length
      ? stepParam - 1
      : draftStep;
  const step = Math.min(requested, maxReachable);
  const currentStep = WIZARD_STEPS[step] ?? WIZARD_STEPS[0];

  useEffect(() => {
    if (searchParams.get("step") !== String(step + 1)) {
      setSearchParams({ step: String(step + 1) }, { replace: true });
    }
  }, [step, searchParams, setSearchParams]);

  useEffect(() => {
    setVisited((prev) => (prev.has(step) ? prev : new Set(prev).add(step)));
  }, [step]);

  // Slide direction: forward = from the right, back = from the left.
  const lastStepRef = useRef(step);
  const direction = step >= lastStepRef.current ? 1 : -1;
  useEffect(() => {
    lastStepRef.current = step;
  }, [step]);

  // On step change: bring the card into view, then focus its heading once it has entered.
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    pendingFocus.current = true;
    topRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }, [step, reduceMotion]);

  // ── Draft: saved locally while typing, cleared on success / "Clear form" ────
  useEffect(() => {
    if (stopSaving.current) return;
    const timer = window.setTimeout(() => {
      if (isEmptyForm(form)) {
        draftStore.clear();
        return;
      }
      const { hp, ...rest } = form;
      void hp; // the honeypot never goes into storage
      draftStore.save({ form: rest, step, visited: [...visited] });
    }, 300);
    return () => window.clearTimeout(timer);
  }, [form, step, visited, draftStore]);

  // ── Field helpers ───────────────────────────────────────────────────────────
  const setField = <K extends keyof SupplierFormState>(key: K, value: SupplierFormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const touch = (key: string) => {
    if (!dirtyRef.current.has(key)) return;
    setTouched((prev) => (prev.has(key) ? prev : new Set(prev).add(key)));
  };

  // Errors show after the user leaves a field they changed, or after "Continue" on this step.
  const visibleError = (key: SupplierFieldKey) =>
    attempted.has(step) || touched.has(key) ? errors[key] : undefined;

  const text = (key: TextKey) => ({
    value: form[key],
    onValueChange: (next: string) => {
      dirtyRef.current.add(key);
      setField(key, next);
    },
    onBlur: () => touch(key),
    error: visibleError(key),
  });

  const setCountry = (next: SelectOption | null) => {
    dirtyRef.current.add("country");
    setTouched((prev) => new Set(prev).add("country"));
    setField("country", next);
  };

  // Unchecking a technology also drops its selected materials.
  const setTechnologies = (next: string[]) =>
    setForm((prev) => ({
      ...prev,
      technologies: next,
      materials: Object.fromEntries(
        Object.entries(prev.materials).filter(([techId]) => next.includes(techId)),
      ),
    }));

  function focusField(key: string) {
    const wrapper = document.getElementById(`field-${key}`);
    if (!wrapper) return;
    const target = Array.from(wrapper.querySelectorAll<HTMLElement>(FOCUSABLE)).find(
      (el) => el.tabIndex >= 0 && isVisible(el),
    );
    wrapper.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
    target?.focus({ preventScroll: true });
  }

  // ── Navigation ──────────────────────────────────────────────────────────────
  const goTo = (index: number) => {
    if (index < 0 || index > REVIEW_STEP) return;
    setSubmitError("");
    setSearchParams({ step: String(index + 1) });
  };

  const currentErrors = stepErrorKeys(step, errors);

  function handleContinue() {
    if (step === REVIEW_STEP) {
      void handleSubmit();
      return;
    }
    if (currentErrors.length > 0) {
      setAttempted((prev) => new Set(prev).add(step));
      const first = currentErrors[0];
      if (first) requestAnimationFrame(() => focusField(first));
      return;
    }
    goTo(step + 1);
  }

  const finishSuccess = () => {
    stopSaving.current = true;
    draftStore.clear();
    setDone(true);
  };

  async function handleSubmit() {
    if (inFlight.current) return;
    setSubmitError("");
    const firstBad = WIZARD_STEPS.findIndex(
      (_, i) => i < REVIEW_STEP && stepErrorKeys(i, errors).length > 0,
    );
    if (firstBad >= 0) {
      setAttempted((prev) => new Set(prev).add(firstBad));
      goTo(firstBad);
      return;
    }
    // Honeypot filled: pretend success, send nothing.
    if (form.hp) {
      finishSuccess();
      return;
    }
    inFlight.current = true;
    setSubmitting(true);
    try {
      await submitToSheet("supplier", toSupplierPayload(form));
      finishSuccess();
    } catch (err) {
      console.error("Supplier application submission failed", err);
      setSubmitError("Something went wrong. Please try again in a moment.");
    } finally {
      inFlight.current = false;
      setSubmitting(false);
    }
  }

  const clearForm = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      window.setTimeout(() => setConfirmClear(false), 4000);
      return;
    }
    setConfirmClear(false);
    draftStore.clear();
    setForm(EMPTY_SUPPLIER_FORM);
    setAttempted(new Set());
    setTouched(new Set());
    dirtyRef.current = new Set();
    setVisited(new Set([0]));
    setRestored(false);
    setSearchParams({ step: "1" }, { replace: true });
  };

  // Enter: next field (or Continue on the last one). Textareas: Ctrl/⌘+Enter continues.
  const onFormKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key !== "Enter" || e.nativeEvent.isComposing) return;
    const target = e.target as HTMLElement;
    if (target.closest("[data-enter-passthrough]")) return;
    if (target instanceof HTMLTextAreaElement) {
      if (e.metaKey || e.ctrlKey) {
        e.preventDefault();
        handleContinue();
      }
      return;
    }
    if (target instanceof HTMLInputElement && TEXT_INPUT_TYPES.has(target.type)) {
      e.preventDefault();
      const fields = Array.from(
        stepRef.current?.querySelectorAll<HTMLElement>(
          'input[type="text"], input[type="email"], input[type="tel"], input[type="url"], textarea, select, [data-choice-trigger]',
        ) ?? [],
      ).filter((el) => isVisible(el) && !el.closest("[data-enter-passthrough]"));
      const next = fields[fields.indexOf(target) + 1];
      if (next) next.focus();
      else handleContinue();
    }
  };

  // ── Stepper data ────────────────────────────────────────────────────────────
  const statuses: StepStatus[] = WIZARD_STEPS.map((_, i) => {
    if (i === step) return "current";
    if (i === REVIEW_STEP || !visited.has(i)) return "upcoming";
    return stepErrorKeys(i, errors).length > 0 ? "error" : "done";
  });
  const summaries = WIZARD_STEPS.map((_, i) => (visited.has(i) ? stepSummary(i, form) : []));
  const hasContent = !isEmptyForm(form);

  const clearButton = hasContent ? (
    <button
      type="button"
      onClick={clearForm}
      className={`text-[11px] font-bold uppercase tracking-wide transition-colors ${
        confirmClear ? "text-rose-400" : "text-white/40 hover:text-white/70"
      }`}
    >
      {confirmClear ? "Click again to clear" : "Clear form"}
    </button>
  ) : null;

  const restoredNote =
    restored && hasContent ? (
      <p className="text-[12px] text-white/45">Draft restored from your last visit.</p>
    ) : null;

  // ── Step bodies ─────────────────────────────────────────────────────────────
  const steps: ReactNode[] = [
    // 1 · Business Details
    <div key="business" className="grid gap-4 md:grid-cols-2 lg:gap-5">
      <div id="field-fullName">
        <TextField label={L.fullName} {...text("fullName")} autoComplete="name" autoCapitalize="words" />
      </div>
      <div id="field-businessName">
        <TextField label={L.businessName} {...text("businessName")} autoComplete="organization" autoCapitalize="words" />
      </div>
      <div id="field-email">
        <TextField label={L.email} {...text("email")} type="email" inputMode="email"
          autoComplete="email" autoCapitalize="none" spellCheck={false}
          hint={
            <EmailSuggestion
              email={form.email}
              onAccept={(fixed) => {
                dirtyRef.current.add("email");
                setField("email", fixed);
              }}
            />
          } />
      </div>
      <div id="field-phone">
        <TextField label={L.phone} {...text("phone")} type="tel" inputMode="tel" autoComplete="tel" />
      </div>
      <div id="field-country">
        <CountryField compact label={L.country} value={form.country} onChange={setCountry}
          error={visibleError("country")} />
      </div>
      <div id="field-city">
        <TextField
          label={L.city}
          value={form.city?.label ?? ""}
          onValueChange={(next) => {
            dirtyRef.current.add("city");
            setField("city", next.trim() ? { value: next, label: next } : null);
          }}
          onBlur={() => touch("city")}
          error={visibleError("city")}
          autoComplete="address-level2"
          autoCapitalize="words"
        />
      </div>
      <div id="field-website" className="md:col-span-2">
        <TextField label={L.website} {...text("website")} type="url" inputMode="url"
          autoComplete="url" autoCapitalize="none" spellCheck={false} placeholder="yourstore.com" />
      </div>
    </div>,

    // 2 · Printing Capabilities
    <div key="capabilities" className="flex flex-col gap-5 lg:gap-6">
      <div id="field-materials" className="flex flex-col gap-2">
        <TechnologyPicker
          technologies={form.technologies}
          materials={form.materials}
          techOther={form.techOther}
          onTechnologiesChange={(next) => {
            dirtyRef.current.add("technologies");
            setTechnologies(next);
          }}
          onMaterialsChange={(techId, next) =>
            setForm((prev) => ({ ...prev, materials: { ...prev.materials, [techId]: next } }))
          }
          onTechOtherChange={text("techOther").onValueChange}
          onTechOtherBlur={() => touch("techOther")}
          techOtherLabel={SERVICES_OTHER_LABEL}
          error={visibleError("technologies")}
          techOtherError={visibleError("techOther")}
        />
        {!visibleError("technologies") && visibleError("materials") && (
          <p className="text-xs font-medium text-rose-400" aria-live="polite">
            {visibleError("materials")}
          </p>
        )}
      </div>
      <div id="field-materialsOther">
        <TextField label={MATERIALS_OTHER.label} {...text("materialsOther")} />
      </div>
      <div id="field-printersAmount">
        <SingleChoiceField compact label={L.printersAmount}
          options={toOptions(PRINTERS_AMOUNT_OPTIONS)} value={form.printersAmount}
          onChange={(next) => setField("printersAmount", next)} error={visibleError("printersAmount")} />
      </div>
      <div id="field-printerType">
        <TextField multiline rows={2} label={L.printerType} {...text("printerType")} autoCapitalize="sentences" />
      </div>
    </div>,

    // 3 · Shipping & Services
    <div key="shipping" className="flex flex-col gap-5 lg:gap-6">
      <div>
        <div id="field-packAndShip">
          <SingleChoiceField compact label={L.packAndShip}
            options={toOptions(PACK_AND_SHIP_OPTIONS)} value={form.packAndShip}
            onChange={(next) => setField("packAndShip", next)} error={visibleError("packAndShip")} />
        </div>
        <Reveal show={form.packAndShip === "No"} className="mt-3">
          <div id="field-packAndShipDetail">
            <TextField multiline rows={2} label={L.packAndShipDetail} {...text("packAndShipDetail")} />
          </div>
        </Reveal>
      </div>
      <div id="field-multipleOrders">
        <SingleChoiceField compact label={L.multipleOrders}
          options={toOptions(MULTIPLE_ORDERS_OPTIONS)} value={form.multipleOrders}
          onChange={(next) => setField("multipleOrders", next)} error={visibleError("multipleOrders")} />
      </div>
      <div id="field-productionTime">
        <SingleChoiceField compact label={L.productionTime}
          options={toOptions(PRODUCTION_TIME_OPTIONS)} value={form.productionTime}
          onChange={(next) => setField("productionTime", next)} error={visibleError("productionTime")} />
      </div>
      <div className="grid gap-5 md:grid-cols-2 lg:gap-6">
        <div id="field-shippingDestiny">
          <SingleChoiceField compact label={L.shippingDestiny}
            options={toOptions(SHIPPING_DESTINY_OPTIONS)} value={form.shippingDestiny}
            onChange={(next) => setField("shippingDestiny", next)} error={visibleError("shippingDestiny")} />
        </div>
        <div id="field-selfPickup">
          <SingleChoiceField compact label={L.selfPickup}
            options={toOptions(YES_NO_OPTIONS)} value={form.selfPickup}
            onChange={(next) => setField("selfPickup", next)} error={visibleError("selfPickup")} />
        </div>
      </div>
      <div id="field-shippingCarrier">
        <TextField label={L.shippingCarrier} {...text("shippingCarrier")}
          placeholder={SUPPLIER_PLACEHOLDERS.shippingCarrier} autoCapitalize="words" />
      </div>
      <div id="field-packagingMethod">
        <TextField multiline rows={3} label={L.packagingMethod} {...text("packagingMethod")}
          placeholder={SUPPLIER_PLACEHOLDERS.packagingMethod} autoCapitalize="sentences" />
      </div>
      <div>
        <div id="field-services">
          <ChoiceGroup type="checkbox" compact roving label={L.services}
            options={[...toOptions(SERVICE_OPTIONS), { value: OTHER_SERVICE_ID, label: SERVICES_OTHER_LABEL }]}
            value={form.services} onChange={(next) => setField("services", next)}
            error={visibleError("services")} />
        </div>
        <Reveal show={form.services.includes(OTHER_SERVICE_ID)} className="mt-3">
          <div id="field-servicesOther">
            <TextField label={SERVICES_OTHER_LABEL} {...text("servicesOther")} />
          </div>
        </Reveal>
      </div>
      <div id="field-additionalText">
        <TextField multiline rows={4} label={L.additionalText} {...text("additionalText")} autoCapitalize="sentences" />
      </div>
    </div>,

    // 4 · Review & Submit
    <div key="review" className="flex flex-col gap-5">
      <SupplierWizardReview payload={toSupplierPayload(form)} onEdit={goTo} />
      <LegalConsent intro={SUPPLIER_CONSENT.intro} />
      {submitError && (
        <p role="alert" className="text-sm font-medium text-rose-400">
          {submitError}
        </p>
      )}
    </div>,
  ];

  return (
    <>
      <div className={className}>
        {/* STEPPER — lg+ only, sticky on top under the navbar */}
        <div className="hidden border-b border-white/10 bg-dark/90 py-4 backdrop-blur lg:sticky lg:top-[var(--nav-h)] lg:z-30 lg:block">
          {(clearButton || restoredNote) && (
            <div className="mb-3 flex items-center justify-end gap-4">
              {restoredNote}
              {clearButton}
            </div>
          )}
          <WizardStepper
            steps={WIZARD_STEPS}
            current={step}
            statuses={statuses}
            summaries={summaries}
            canSelect={(i) => i <= maxReachable}
            onSelect={goTo}
          />
        </div>

        <div className="min-w-0">
          <WizardProgressBar
            className="lg:hidden"
            current={step}
            total={WIZARD_STEPS.length}
            title={currentStep?.title ?? ""}
            action={clearButton}
          />
          {restoredNote && <div className="mt-3 lg:hidden">{restoredNote}</div>}

          <div
            ref={topRef}
            className="scroll-mt-[calc(var(--nav-h)+80px)] lg:scroll-mt-[calc(var(--nav-h)+140px)]"
          />

          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              handleContinue();
            }}
            onKeyDown={onFormKeyDown}
            className="relative mt-6 flex flex-col gap-4 lg:mt-8"
          >
            {isMockSubmit("supplier") && (
              <p className="rounded-md border border-yellow-400/30 bg-yellow-400/10 px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-yellow-400">
                Mock mode – submissions are not saved
              </p>
            )}

            <p className="sr-only" aria-live="polite">
              {`Step ${step + 1} of ${WIZARD_STEPS.length}: ${currentStep?.title ?? ""}`}
            </p>

            <AnimatePresence mode="wait" custom={direction} initial={false}>
              <motion.div
                key={step}
                ref={stepRef}
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                onAnimationComplete={(definition) => {
                  if (definition === "center" && pendingFocus.current) {
                    pendingFocus.current = false;
                    headingRef.current?.focus({ preventScroll: true });
                  }
                }}
                // Card only on lg+; below lg the step sits on the page background (no card-in-card).
                className="lg:rounded-2xl lg:border lg:border-white/10 lg:bg-[rgba(149,149,149,0.08)] lg:p-8"
              >
                {/* Below lg the sticky progress bar already shows the step number */}
                <p className="hidden text-[10px] font-bold uppercase tracking-[0.15em] text-green-500 lg:block">
                  Step {step + 1} of {WIZARD_STEPS.length}
                </p>
                <h2
                  ref={headingRef}
                  tabIndex={-1}
                  className="mt-1 text-xl font-extrabold italic text-white outline-none md:text-2xl"
                >
                  {currentStep?.title}
                </h2>

                {attempted.has(step) && currentErrors.length > 0 && (
                  <div role="alert" className="mt-5 rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-3">
                    <p className="text-sm font-semibold text-rose-300">
                      {currentErrors.length === 1
                        ? "1 field needs attention"
                        : `${currentErrors.length} fields need attention`}
                    </p>
                    <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                      {currentErrors.map((key) => (
                        <li key={key}>
                          <button
                            type="button"
                            onClick={() => focusField(key)}
                            className="text-[13px] text-rose-200 underline underline-offset-2 hover:text-white"
                          >
                            {FIELD_NAMES[key]}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-6">{steps[step]}</div>
              </motion.div>
            </AnimatePresence>

            <Honeypot value={form.hp} onChange={(next) => setField("hp", next)} />

            <WizardStepNav
              showBack={step > 0}
              onBack={() => goTo(step - 1)}
              onContinue={handleContinue}
              continueLabel={step === REVIEW_STEP ? SUPPLIER_CONSENT.submit : "Continue"}
              busy={submitting}
            />
          </form>
        </div>
      </div>

      <ConfirmDialog
        open={done}
        onClose={() => navigate("/")}
        dismissible={false}
        ariaLabel={SUPPLIER_CONFIRMATION.title}
        actions={
          <Button variant="primary" size="md" hovering="darkBg" onClick={() => navigate("/")}>
            {SUPPLIER_CONFIRMATION.action}
          </Button>
        }
      >
        <h2 className="text-xl font-extrabold italic text-white md:text-2xl">
          {SUPPLIER_CONFIRMATION.title}
        </h2>
        <p className="text-[15px] font-medium leading-relaxed text-white/60 md:text-base">
          {SUPPLIER_CONFIRMATION.text}
        </p>
      </ConfirmDialog>
    </>
  );
}
