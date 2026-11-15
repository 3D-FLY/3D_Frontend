import { Pencil } from "lucide-react";
import type { SheetPayload } from "../forms/submitToSheet.js";
import { SUPPLIER_LABELS as L } from "./supplierContent.js";
import { WIZARD_STEPS } from "./supplierSteps.js";

interface SupplierWizardReviewProps {
  /** Exactly what will be sent (toSupplierPayload), so the review matches the sheet */
  payload: SheetPayload;
  onEdit: (stepIndex: number) => void;
  className?: string;
}

const ROWS: readonly { step: number; rows: readonly [string, string][] }[] = [
  {
    step: 0,
    rows: [
      ["fullName", L.fullName],
      ["businessName", L.businessName],
      ["email", L.email],
      ["phone", L.phone],
      ["country", L.country],
      ["city", L.city],
      ["website", L.website],
    ],
  },
  {
    step: 1,
    rows: [
      ["printTech", L.technologies],
      ["materials", L.materials],
      ["printersAmount", L.printersAmount],
      ["printerType", L.printerType],
    ],
  },
  {
    step: 2,
    rows: [
      ["packAndShip", L.packAndShip],
      ["multipleOrders", L.multipleOrders],
      ["productionTime", L.productionTime],
      ["shippingDestiny", L.shippingDestiny],
      ["selfPickup", L.selfPickup],
      ["shippingCarrier", L.shippingCarrier],
      ["packagingMethod", L.packagingMethod],
      ["additionalServices", L.services],
      ["additionalText", L.additionalText],
    ],
  },
];

export default function SupplierWizardReview({
  payload,
  onEdit,
  className = "",
}: SupplierWizardReviewProps) {
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {ROWS.map(({ step, rows }) => (
        <section
          key={step}
          className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-4 md:px-5"
        >
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-green-500">
              {WIZARD_STEPS[step]?.title}
            </h3>
            <button
              type="button"
              onClick={() => onEdit(step)}
              className="flex items-center gap-1.5 rounded-md border border-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white/60 transition-colors hover:border-green-500/40 hover:text-green-500"
            >
              <Pencil size={12} />
              Edit
            </button>
          </div>
          <dl className="grid gap-x-6 gap-y-3 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
            {rows.map(([key, label]) => (
              <div key={key} className="contents">
                <dt className="text-[13px] text-white/45">{label}</dt>
                <dd className="whitespace-pre-line break-words text-[14px] font-medium text-white">
                  {payload[key]?.trim() ? payload[key] : "—"}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}
