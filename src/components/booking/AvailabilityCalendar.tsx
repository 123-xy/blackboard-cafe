"use client";

import { useEffect, useState } from "react";
import { getMonthReservationCountsAction } from "@/app/actions/reservation-actions";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function toDateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export default function AvailabilityCalendar({ onSelectDate }: { onSelectDate: (date: string) => void }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loadedKey, setLoadedKey] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const monthKey = `${year}-${month}`;
  const loading = loadedKey !== monthKey;

  useEffect(() => {
    let ignore = false;
    getMonthReservationCountsAction(year, month).then((result) => {
      if (ignore) return;
      if (result.ok) setCounts(result.counts);
      setLoadedKey(`${year}-${month}`);
    });
    return () => {
      ignore = true;
    };
  }, [year, month]);

  const firstDayOfMonth = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

  const cells: (number | null)[] = [
    ...Array(firstDayOfMonth).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const goToPrevMonth = () => {
    if (month === 0) { setYear(year - 1); setMonth(11); } else setMonth(month - 1);
  };
  const goToNextMonth = () => {
    if (month === 11) { setYear(year + 1); setMonth(0); } else setMonth(month + 1);
  };

  const handleSelect = (day: number) => {
    const key = toDateKey(year, month, day);
    setSelected(key);
    onSelectDate(key);
  };

  const todayKey = toDateKey(today.getFullYear(), today.getMonth(), today.getDate());

  return (
    <div className="rounded-[16px] border border-card-border bg-surface p-5">
      <div className="mb-4 flex items-center justify-between">
        <button onClick={goToPrevMonth} className="rounded-lg border border-card-border px-3 py-1.5 text-sm text-muted transition-colors hover:border-gold hover:text-gold">
          ←
        </button>
        <span className="font-display text-sm font-bold text-heading">
          {MONTH_NAMES[month]} {year}
        </span>
        <button onClick={goToNextMonth} className="rounded-lg border border-card-border px-3 py-1.5 text-sm text-muted transition-colors hover:border-gold hover:text-gold">
          →
        </button>
      </div>

      <div className="mb-2 grid grid-cols-7 gap-1.5">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div key={d} className="text-center text-[11px] font-semibold text-muted">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {cells.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} />;
          const key = toDateKey(year, month, day);
          const count = counts[key] || 0;
          const isToday = key === todayKey;
          const isSelected = key === selected;
          return (
            <button
              key={key}
              onClick={() => handleSelect(day)}
              className={`flex flex-col items-center gap-0.5 rounded-lg border py-1.5 text-xs transition-colors ${
                isSelected
                  ? "border-gold bg-gold/15 text-gold-text"
                  : isToday
                  ? "border-gold/40 text-heading"
                  : "border-card-border text-heading hover:border-gold/40"
              }`}
            >
              <span className="font-semibold">{day}</span>
              {!loading && count > 0 && (
                <span className="rounded-full bg-gold px-1 text-[9px] font-bold text-dark">{count}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
