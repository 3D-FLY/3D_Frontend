import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button.jsx";
import ChoiceGroup from "../../components/ui/ChoiceGroup.js";
import ConfirmDialog from "../../components/ui/ConfirmDialog.js";
import Input from "../../components/ui/Input.js";
import SelectField, { type SelectOption } from "../../components/ui/SelectField.js";
import Honeypot from "../forms/Honeypot.js";
import LegalConsent from "../forms/LegalConsent.js";
import { focusFirstError } from "../forms/focusField.js";
import { loadCountryOptions } from "../forms/locationOptions.js";
import { isMockSubmit, submitToSheet } from "../forms/submitToSheet.js";
import { JOIN_FORM, JOIN_POPUP } from "./joinContent.js";
import {
  EMPTY_JOIN_FORM,
  JOIN_FIELD_ORDER,
  toJoinPayload,
  validateJoin,
  type JoinFormState,
} from "./joinValidation.js";

interface JoinFormProps {
  className?: string;
}

export default function JoinForm({ className = "" }: JoinFormProps) {
  const navigate = useNavigate();
  const [form, setForm] = useState<JoinFormState>(EMPTY_JOIN_FORM);
  const [attempted, setAttempted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [done, setDone] = useState(false);
  const [countries, setCountries] = useState<SelectOption[]>([]);
  const [countriesLoading, setCountriesLoading] = useState(true);
  const inFlight = useRef(false);

  useEffect(() => {
    let cancelled = false;
    loadCountryOptions()
      .then((options) => !cancelled && setCountries(options))
      .finally(() => !cancelled && setCountriesLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const errors = useMemo(() => validateJoin(form), [form]);
  const shown = attempted ? errors : {};

  const set = <K extends keyof JoinFormState>(key: K, value: JoinFormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const resetAfterSuccess = () => {
    setDone(false);
    setForm(EMPTY_JOIN_FORM);
    setAttempted(false);
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (inFlight.current) return;
    setAttempted(true);
    setSubmitError("");

    if (Object.keys(errors).length > 0) {
      focusFirstError(JOIN_FIELD_ORDER, errors);
      return;
    }
    // Honeypot filled: pretend success, send nothing.
    if (form.hp) {
      setDone(true);
      return;
    }

    inFlight.current = true;
    setSubmitting(true);
    try {
      await submitToSheet("join", toJoinPayload(form));
      setDone(true);
    } catch (err) {
      console.error("Join form submission failed", err);
      setSubmitError("Something went wrong. Please try again in a moment.");
    } finally {
      inFlight.current = false;
      setSubmitting(false);
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        noValidate
        className={`relative rounded-2xl border border-white/10 bg-[rgba(149,149,149,0.08)] p-5 md:p-8 ${className}`}
      >
        {isMockSubmit("join") && (
          <p className="mb-4 rounded-md border border-yellow-400/30 bg-yellow-400/10 px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-yellow-400">
            Mock mode – submissions are not saved
          </p>
        )}

        <div className="grid gap-x-6 md:grid-cols-2">
          <div id="field-fullName">
            <Input
              label={JOIN_FORM.labels.fullName}
              value={form.fullName}
              onChange={(e) => set("fullName", e.target.value)}
              error={shown.fullName}
              autoComplete="name"
              className="w-full"
            />
          </div>
          <div id="field-email">
            <Input
              label={JOIN_FORM.labels.email}
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              error={shown.email}
              autoComplete="email"
              className="w-full"
            />
          </div>
          <div id="field-country">
            <SelectField
              label={JOIN_FORM.labels.country}
              options={countries}
              value={form.country}
              onChange={(next) => set("country", next)}
              isLoading={countriesLoading}
              placeholder="Select your country"
              error={shown.country}
            />
          </div>
          <div id="field-phone">
            <Input
              label={JOIN_FORM.labels.phone}
              type="tel"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              error={shown.phone}
              autoComplete="tel"
              className="w-full"
            />
          </div>
        </div>

        <div id="field-kind">
          <ChoiceGroup
            type="radio"
            label={JOIN_FORM.labels.kind}
            options={JOIN_FORM.kinds.map((k) => ({ value: k, label: k }))}
            value={form.kind}
            onChange={(next) => set("kind", next)}
            error={shown.kind}
          />
        </div>

        <div id="field-website">
          <Input
            label={JOIN_FORM.labels.website}
            type="url"
            value={form.website}
            onChange={(e) => set("website", e.target.value)}
            error={shown.website}
            autoComplete="url"
            className="w-full"
          />
        </div>

        <Honeypot value={form.hp} onChange={(next) => set("hp", next)} />

        <p className="mt-2 text-[15px] font-medium text-white/70">{JOIN_FORM.note}</p>
        <LegalConsent
          intro={JOIN_FORM.consentIntro}
          outro={JOIN_FORM.consentOutro}
          className="mt-2"
        />

        {submitError && (
          <p role="alert" className="mt-4 text-sm font-medium text-rose-400">
            {submitError}
          </p>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          hovering="darkBg"
          disabled={submitting}
          className="mt-6 w-full md:w-auto md:px-12"
        >
          {submitting ? "Sending..." : JOIN_FORM.submit}
        </Button>
      </form>

      <ConfirmDialog
        open={done}
        onClose={resetAfterSuccess}
        ariaLabel={JOIN_POPUP.title}
        actions={
          <Button
            variant="primary"
            size="md"
            hovering="darkBg"
            onClick={() => {
              resetAfterSuccess();
              navigate("/explore");
            }}
          >
            {JOIN_POPUP.action}
          </Button>
        }
      >
        <h2 className="text-2xl font-extrabold italic text-white md:text-3xl">
          {JOIN_POPUP.title}
        </h2>
        {JOIN_POPUP.lines.map((line) => (
          <p key={line} className="text-[15px] font-medium text-white/60 md:text-base">
            {line}
          </p>
        ))}
      </ConfirmDialog>
    </>
  );
}
