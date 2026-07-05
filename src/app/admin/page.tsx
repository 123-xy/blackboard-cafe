import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { logoutAction } from "./actions";
import AdminDashboardClient from "./AdminDashboardClient";

export const metadata = {
  title: "Admin Dashboard | Blackboard Cafe",
};

export default async function AdminPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-cream font-body">
      <header className="flex items-center justify-between gap-4 border-b border-card-border bg-surface px-5 py-4 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center rounded-[10px] bg-dark px-3.5 pt-1.5 pb-1">
            <div className="font-display text-sm leading-none font-extrabold tracking-[0.5px] text-gold">
              BLACKBOARD
            </div>
            <div className="mt-0.5 font-display text-[10px] leading-none font-bold tracking-[1.5px] text-white">
              CAFE
            </div>
          </div>
          <span className="hidden font-display text-base font-bold text-heading sm:inline">Admin Dashboard</span>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="rounded-lg border border-card-border px-4 py-2.5 text-sm font-semibold text-muted transition-colors hover:border-gold hover:text-gold"
          >
            Sign out
          </button>
        </form>
      </header>

      <AdminDashboardClient />
    </div>
  );
}
