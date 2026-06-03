import { type ReactNode } from "react";
import DashboardLayout from "./DashboardLayout.js";

/** Admin chrome (sidebar, navbar) — stays mounted while page content loads. */
export default function AdminDashboardShell({ children }: { children: ReactNode }) {
  return <DashboardLayout role="admin">{children}</DashboardLayout>;
}
