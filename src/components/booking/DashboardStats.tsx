type Stats = {
  todayCount: number;
  weekCount: number;
  confirmedCount: number;
  completedCount: number;
  cancelledCount: number;
  pendingCount: number;
};

export default function DashboardStats({ stats }: { stats: Stats }) {
  const cards = [
    { label: "Today", value: stats.todayCount, icon: "📅" },
    { label: "This Week", value: stats.weekCount, icon: "🗓️" },
    { label: "Pending", value: stats.pendingCount, icon: "⏳" },
    { label: "Confirmed", value: stats.confirmedCount, icon: "✅" },
    { label: "Completed", value: stats.completedCount, icon: "🏁" },
    { label: "Cancelled", value: stats.cancelledCount, icon: "❌" },
  ];

  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}>
      {cards.map((c) => (
        <div key={c.label} className="rounded-[14px] border border-card-border bg-surface p-5">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold tracking-[0.5px] text-muted uppercase">{c.label}</span>
            <span className="text-lg">{c.icon}</span>
          </div>
          <div className="font-display text-3xl font-extrabold text-gold">{c.value}</div>
        </div>
      ))}
    </div>
  );
}
