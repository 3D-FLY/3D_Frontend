import { useMemo, useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button.jsx";
import SingleChoiceField from "../../components/ui/SingleChoiceField.js";
import ConfirmDialog from "../../components/ui/ConfirmDialog.js";
import TextField from "../../components/ui/TextField.js";
import Honeypot from "../forms/Honeypot.js";
import LegalConsent from "../forms/LegalConsent.js";
import { focusFirstError } from "../forms/focusField.js";
import CountryField from "../forms/CountryField.js";
import EmailSuggestion from "../forms/EmailSuggestion.js";
import { isMockSubmit, submitToSheet } from "../forms/submitToSheet.js";
import { logSheetPreview } from "../forms/sheetPreview.js";
import { JOIN_FORM, JOIN_POPUP } from "./joinContent.js";
import {
  EMPTY_JOIN_FORM,
  JOIN_FIELD_ORDER,
  JOIN_SHEET_COLUMNS,
  JOIN_SHEET_NAME,
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
  const inFlight = useRef(false);

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
      const payload = toJoinPayload(form);
      logSheetPreview(JOIN_SHEET_NAME, JOIN_SHEET_COLUMNS, payload); // dev only
      await submitToSheet("join", payload);
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
        // Same look as the supplier wizard: card only on lg+, bare background below.
        className={`relative lg:rounded-2xl lg:border lg:border-white/10 lg:bg-[rgba(149,149,149,0.08)] lg:p-8 ${className}`}
      >
        {isMockSubmit("join") && (
          <p className="mb-4 rounded-md border border-yellow-400/30 bg-yellow-400/10 px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-yellow-400">
            Mock mode – submissions are not saved
          </p>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:gap-5">
          <div id="field-fullName">
            <TextField
              label={JOIN_FORM.labels.fullName}
              value={form.fullName}
              onValueChange={(next) => set("fullName", next)}
              error={shown.fullName}
              autoComplete="name"
              autoCapitalize="words"
            />
          </div>
          <div id="field-email">
            <TextField
              label={JOIN_FORM.labels.email}
              type="email"
              inputMode="email"
              value={form.email}
              onValueChange={(next) => set("email", next)}
              error={shown.email}
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              hint={
                <EmailSuggestion email={form.email} onAccept={(fixed) => set("email", fixed)} />
              }
            />
          </div>
          <div id="field-country">
            <CountryField
              compact
              label={JOIN_FORM.labels.country}
              value={form.country}
              onChange={(next) => set("country", next)}
              error={shown.country}
            />
          </div>
          <div id="field-phone">
            <TextField
              label={JOIN_FORM.labels.phone}
              type="tel"
              inputMode="tel"
              value={form.phone}
              onValueChange={(next) => set("phone", next)}
              error={shown.phone}
              autoComplete="tel"
            />
          </div>
          <div id="field-kind" className="md:col-span-2">
            <SingleChoiceField
              compact
              label={JOIN_FORM.labels.kind}
              options={JOIN_FORM.kinds.map((k) => ({ value: k, label: k }))}
              value={form.kind}
              onChange={(next) => set("kind", next)}
              error={shown.kind}
            />
          </div>
          <div id="field-website" className="md:col-span-2">
            <TextField
              label={JOIN_FORM.labels.website}
              type="url"
              inputMode="url"
              value={form.website}
              onValueChange={(next) => set("website", next)}
              error={shown.website}
              autoComplete="url"
              autoCapitalize="none"
              spellCheck={false}
              placeholder="yourstore.com"
              enterKeyHint="send"
            />
          </div>
        </div>

        <Honeypot value={form.hp} onChange={(next) => set("hp", next)} />

        <p className="mt-6 text-[15px] font-medium text-white/70">{JOIN_FORM.note}</p>
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
