import DashboardLayout from "../../../features/dashboard/DashboardLayout.js";
import DashboardCard from "../../../features/dashboard/components/DashboardCard.js";

export default function StoreDetailPage() {
  return (
    <DashboardLayout role="admin">
      <div className="w-full flex flex-col gap-6">
        <h1 className="text-[clamp(18px,2vw,24px)] font-semibold text-white">Store Detail</h1>

        <DashboardCard index={0} title="Store Detail" autoHeight>
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <span className="text-[32px] font-extrabold uppercase italic tracking-widest text-white/10 select-none">
              Coming Soon
            </span>
            <span className="text-sm text-zinc-500">This section is under construction.</span>
          </div>
        </DashboardCard>
      </div>
    </DashboardLayout>
  );
}
