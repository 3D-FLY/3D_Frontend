import { type ReactNode } from "react";
import ScrollableContent from "./ScrollableContent.js";

export interface DashboardTableColumn {
  key: string;
  header: ReactNode;
  align?: "left" | "center" | "right";
  headerClassName?: string;
  cellClassName?: string;
}

export interface DashboardTableProps<TRow> {
  variant?: "list" | "data";
  columns: DashboardTableColumn[];
  /** Required for `list` variant only; ignored for `data` (uses native table layout) */
  gridTemplateColumns?: string;
  rows: TRow[];
  getRowKey: (row: TRow) => string | number;
  renderCell: (row: TRow, columnKey: string) => ReactNode;
  onRowClick?: (row: TRow) => void;
  scrollable?: boolean;
  maxHeight?: number;
  className?: string;
  cap?: number;
  emptyMessage?: ReactNode;
  scrollbarSide?: "left" | "right";
  /** Lighter borders/hover — matches Settings page tables */
  subtle?: boolean;
  /** Row hover highlight (default: true) */
  hoverable?: boolean;
}

const alignClass = (align: DashboardTableColumn["align"] = "left") => {
  if (align === "center") return "text-center";
  if (align === "right") return "text-right";
  return "text-left";
};

// ─── List variant (CSS Grid) ───────────────────────────────────────────────────

function listHeaderCellClass(align: DashboardTableColumn["align"] = "left") {
  return `text-[11px] font-semibold uppercase tracking-wide text-zinc-300 ${alignClass(align)}`;
}

function listBodyCellClass(align: DashboardTableColumn["align"] = "left") {
  return `min-w-0 ${alignClass(align)}`;
}

function ListTable<TRow>({
  columns,
  gridTemplateColumns,
  rows,
  getRowKey,
  renderCell,
  onRowClick,
  scrollable = true,
  className,
  cap,
  emptyMessage,
  scrollbarSide,
  hoverable,
}: DashboardTableProps<TRow>) {
  const visibleRows = cap != null ? rows.slice(0, cap) : rows;
  const gridStyle = { gridTemplateColumns: gridTemplateColumns ?? "1fr" };
  const shouldHover = hoverable ?? !!onRowClick;
  const rowHoverClass = shouldHover ? "hover:bg-[rgba(149,149,149,0.1)]" : "";

  const header = (
    <div
      role="row"
      className="grid w-full gap-3 border-b border-white/20 px-2 pb-2"
      style={gridStyle}
    >
      {columns.map((col) => (
        <span key={col.key} role="columnheader" className={listHeaderCellClass(col.align)}>
          {col.header}
        </span>
      ))}
    </div>
  );

  const bodyRows =
    visibleRows.length === 0 && emptyMessage ? (
      <p className="py-6 text-center text-sm text-zinc-500">{emptyMessage}</p>
    ) : (
      visibleRows.map((row, index) => {
        const interactive = Boolean(onRowClick);
        return (
          <div
            key={getRowKey(row)}
            role="row"
            tabIndex={interactive ? 0 : undefined}
            onClick={interactive ? () => onRowClick!(row) : undefined}
            onKeyDown={
              interactive
                ? (e) => {
                    if (e.key === "Enter") onRowClick!(row);
                  }
                : undefined
            }
            className={[
              "grid w-full items-center gap-3 rounded-2xl px-2 py-3 transition-colors",
              rowHoverClass,
              interactive ? "cursor-pointer" : "",
              index < visibleRows.length - 1 ? "border-b-[0.5px] border-white/10" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            style={gridStyle}
          >
            {columns.map((col) => (
              <div key={col.key} role="cell" className={listBodyCellClass(col.align)}>
                {renderCell(row, col.key)}
              </div>
            ))}
          </div>
        );
      })
    );

  return (
    <div
      role="table"
      className={`flex min-h-0 w-full flex-col ${scrollable ? "flex-1 overflow-hidden" : ""} ${className}`}
    >
      {header}
      {scrollable ? (
        <div className="flex min-h-0 flex-1 flex-col">
          <ScrollableContent scrollbarSide={scrollbarSide}>{bodyRows}</ScrollableContent>
        </div>
      ) : (
        bodyRows
      )}
    </div>
  );
}

// ─── Data variant (HTML table) ────────────────────────────────────────────────

function dataThClass(subtle: boolean, align: DashboardTableColumn["align"] = "left", extra = "") {
  if (subtle) {
    return `pb-2.5 pr-4 text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-400 last:pr-0 ${alignClass(align)} ${extra}`.trim();
  }
  return `px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-zinc-400 ${alignClass(align)} ${extra}`.trim();
}

function dataTdClass(subtle: boolean, align: DashboardTableColumn["align"] = "left", extra = "") {
  if (subtle) {
    return `py-3 pr-4 ${alignClass(align)} ${extra}`.trim();
  }
  return `px-3 py-2.5 text-[13px] text-zinc-200 ${alignClass(align)} ${extra}`.trim();
}

function dataTrClass(subtle: boolean, hoverable: boolean) {
  if (!hoverable) {
    return subtle ? "border-b border-white/5" : "border-b border-white/10";
  }
  if (subtle) return "border-b border-white/5 transition-colors hover:bg-white/[0.02]";
  return "border-b border-white/10 transition-colors hover:bg-[rgba(149,149,149,0.1)]";
}

function DataTable<TRow>({
  columns,
  rows,
  getRowKey,
  renderCell,
  onRowClick,
  scrollable = false,
  maxHeight = 300,
  className,
  cap,
  emptyMessage,
  scrollbarSide,
  subtle = false,
  hoverable = true,
}: DashboardTableProps<TRow>) {
  const visibleRows = cap != null ? rows.slice(0, cap) : rows;
  const trClass = dataTrClass(subtle, hoverable);
  const tableClass = subtle ? "w-full text-sm" : "w-full border-collapse";

  const table = (
    <table className={tableClass}>
      <thead>
        <tr className={subtle ? "border-b border-white/10" : undefined}>
          {columns.map((col) => (
            <th
              key={col.key}
              className={dataThClass(subtle, col.align, col.headerClassName)}
            >
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {visibleRows.length === 0 && emptyMessage ? (
          <tr>
            <td colSpan={columns.length} className="py-6 text-center text-sm text-zinc-500">
              {emptyMessage}
            </td>
          </tr>
        ) : (
          visibleRows.map((row) => {
            const interactive = Boolean(onRowClick);
            return (
              <tr
                key={getRowKey(row)}
                className={`${trClass}${interactive ? " cursor-pointer" : ""}`}
                onClick={interactive ? () => onRowClick!(row) : undefined}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={dataTdClass(subtle, col.align, col.cellClassName)}
                  >
                    {renderCell(row, col.key)}
                  </td>
                ))}
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );

  if (scrollable) {
    return (
      <div className={`flex min-h-0 w-full flex-col ${className}`}>
        <div className="flex min-h-0 flex-col" style={{ height: maxHeight }}>
          <ScrollableContent scrollbarSide={scrollbarSide}>{table}</ScrollableContent>
        </div>
      </div>
    );
  }

  return <div className={`w-full overflow-x-auto ${className}`}>{table}</div>;
}

// ─── Entry point ──────────────────────────────────────────────────────────────

export default function DashboardTable<TRow>(props: DashboardTableProps<TRow>) {
  const { variant = "list" } = props;

  if (variant === "data") {
    return <DataTable {...props} variant="data" />;
  }

  return <ListTable {...props} variant="list" />;
}
