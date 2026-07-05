"use client";

import { formatTime } from "@/lib/utils";

type Slot = {
  time: string;
  available: boolean;
  remainingSlots: number;
  totalSlots: number;
};

type AvailabilityGridProps = {
  slots: Slot[];
  loading: boolean;
  selectedTime: string;
  onSelect: (time: string) => void;
};

export default function AvailabilityGrid({
  slots,
  loading,
  selectedTime,
  onSelect,
}: AvailabilityGridProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center gap-4 py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-card-border border-t-gold" />
        <p className="text-sm text-muted">Loading available slots...</p>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="mb-2 text-3xl">😔</div>
        <p className="text-sm text-muted">No slots available for this date.</p>
      </div>
    );
  }

  const hasAnyAvailable = slots.some((s) => s.available);

  return (
    <div>
      {!hasAnyAvailable && (
        <div className="mb-4 rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-center text-sm text-error">
          All slots are fully booked for this date. Please try another date.
        </div>
      )}
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
        {slots.map((slot) => {
          const isSelected = selectedTime === slot.time;
          const isAvailable = slot.available;

          return (
            <button
              key={slot.time}
              onClick={() => isAvailable && onSelect(slot.time)}
              disabled={!isAvailable}
              className={`flex flex-col items-center gap-1 rounded-xl border px-3 py-3.5 transition-all ${
                isSelected
                  ? "border-gold bg-gold/15 shadow-[0_0_0_1px_#F2A93B]"
                  : isAvailable
                  ? "border-card-border bg-cream-input hover:border-gold/50 hover:bg-gold/5"
                  : "border-card-border/50 bg-cream-input/50 opacity-40"
              }`}
              style={{ cursor: isAvailable ? "pointer" : "not-allowed" }}
            >
              <span
                className={`text-sm font-semibold ${
                  isSelected ? "text-gold" : isAvailable ? "text-heading" : "text-muted-on-dark-2"
                }`}
              >
                {formatTime(slot.time)}
              </span>
              <span
                className={`text-[11px] ${
                  isSelected
                    ? "text-gold"
                    : isAvailable
                    ? slot.remainingSlots <= 3
                      ? "text-error"
                      : "text-muted"
                    : "text-muted-on-dark-2"
                }`}
              >
                {isAvailable
                  ? `${slot.remainingSlots} left`
                  : "Full"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
