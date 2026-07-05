"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reservationSchema, type ReservationInput, type ReservationFormInput } from "@/lib/validations";
import { formatTime } from "@/lib/utils";
import AvailabilityGrid from "./AvailabilityGrid";

type Slot = {
  time: string;
  available: boolean;
  remainingSlots: number;
  totalSlots: number;
};

type BookingFormProps = {
  onSuccess: (confirmationCode: string, data: ReservationInput) => void;
};

export default function BookingForm({ onSuccess }: BookingFormProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadedDate, setLoadedDate] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  const maxDateStr = maxDate.toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ReservationFormInput, unknown, ReservationInput>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      customerName: "",
      email: "",
      phone: "",
      guests: 2,
      notes: "",
      reservationDate: "",
      reservationTime: "",
    },
  });

  const loadingSlots = selectedDate !== "" && loadedDate !== selectedDate;

  useEffect(() => {
    if (!selectedDate) return;
    let ignore = false;

    fetch(`/api/availability?date=${selectedDate}`)
      .then((res) => res.json())
      .then((data) => {
        if (ignore) return;
        if (data.slots) setSlots(data.slots);
        else setError("Failed to load available slots");
      })
      .catch(() => {
        if (!ignore) setError("Failed to load available slots");
      })
      .finally(() => {
        if (!ignore) setLoadedDate(selectedDate);
      });

    return () => {
      ignore = true;
    };
  }, [selectedDate]);

  const handleDateSelect = (date: string) => {
    setSlots([]);
    setSelectedTime("");
    setError("");
    setSelectedDate(date);
    setValue("reservationDate", date);
    setStep(2);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setValue("reservationTime", time);
    setStep(3);
  };

  const onSubmit = async (data: ReservationInput) => {
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "Failed to book table");
        return;
      }

      onSuccess(result.reservation.confirmationCode, data);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const fieldClasses =
    "w-full rounded-[10px] border-[1.5px] border-card-border bg-cream-input px-4 py-3.5 font-body text-sm text-heading placeholder:text-muted-on-dark-2 focus:border-gold focus:outline-none transition-colors";

  return (
    <div className="rounded-[20px] border border-card-border bg-surface p-8 sm:p-11">
      {/* Step indicators */}
      <div className="mb-8 flex items-center justify-center gap-3">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-3">
            <button
              onClick={() => {
                if (s === 1) setStep(1);
                if (s === 2 && selectedDate) setStep(2);
                if (s === 3 && selectedTime) setStep(3);
              }}
              className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all ${
                step >= s
                  ? "bg-gold text-dark shadow-[0_2px_0_#C97F16]"
                  : "border border-card-border bg-cream-input text-muted"
              }`}
            >
              {s}
            </button>
            {s < 3 && (
              <div
                className={`h-0.5 w-8 sm:w-12 rounded-full transition-colors ${
                  step > s ? "bg-gold" : "bg-card-border"
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="mb-6 text-center text-xs font-semibold tracking-[1px] text-muted">
        {step === 1 && "SELECT DATE"}
        {step === 2 && "SELECT TIME"}
        {step === 3 && "YOUR DETAILS"}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
          {error}
        </div>
      )}

      {/* Step 1: Date */}
      {step === 1 && (
        <div className="flex flex-col items-center gap-6">
          <p className="text-center text-sm text-muted">Choose your preferred date</p>
          <input
            type="date"
            min={today}
            max={maxDateStr}
            value={selectedDate}
            onChange={(e) => handleDateSelect(e.target.value)}
            className={`${fieldClasses} max-w-[280px] cursor-pointer text-center text-lg`}
          />
        </div>
      )}

      {/* Step 2: Time slots */}
      {step === 2 && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <button
              onClick={() => setStep(1)}
              className="text-sm font-semibold text-gold transition-colors hover:text-gold-hover"
            >
              ← Change date
            </button>
            <span className="text-sm text-muted">{selectedDate}</span>
          </div>
          <AvailabilityGrid
            slots={slots}
            loading={loadingSlots}
            selectedTime={selectedTime}
            onSelect={handleTimeSelect}
          />
        </div>
      )}

      {/* Step 3: Details form */}
      {step === 3 && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="text-sm font-semibold text-gold transition-colors hover:text-gold-hover"
            >
              ← Change time
            </button>
            <span className="text-sm text-muted">
              {selectedDate} · {formatTime(selectedTime)}
            </span>
          </div>

          <div className="mb-5 grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
            <div>
              <label className="mb-2 block text-[13px] font-semibold text-heading">Full Name *</label>
              <input
                {...register("customerName")}
                type="text"
                placeholder="Your name"
                className={fieldClasses}
              />
              {errors.customerName && (
                <p className="mt-1 text-xs text-error">{errors.customerName.message}</p>
              )}
            </div>
            <div>
              <label className="mb-2 block text-[13px] font-semibold text-heading">Number of Guests *</label>
              <input
                {...register("guests", { valueAsNumber: true })}
                type="number"
                min={1}
                max={10}
                placeholder="2"
                className={fieldClasses}
              />
              {errors.guests && (
                <p className="mt-1 text-xs text-error">{errors.guests.message}</p>
              )}
            </div>
          </div>

          <div className="mb-5 grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
            <div>
              <label className="mb-2 block text-[13px] font-semibold text-heading">Email *</label>
              <input
                {...register("email")}
                type="email"
                placeholder="you@email.com"
                className={fieldClasses}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-error">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label className="mb-2 block text-[13px] font-semibold text-heading">Phone *</label>
              <input
                {...register("phone")}
                type="tel"
                placeholder="+91 99496-70225"
                className={fieldClasses}
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-error">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div className="mb-7">
            <label className="mb-2 block text-[13px] font-semibold text-heading">Special Requests</label>
            <textarea
              {...register("notes")}
              rows={3}
              placeholder="Any dietary requirements, celebrations, etc."
              className={`${fieldClasses} resize-y`}
            />
            {errors.notes && (
              <p className="mt-1 text-xs text-error">{errors.notes.message}</p>
            )}
          </div>

          {/* Hidden fields */}
          <input type="hidden" {...register("reservationDate")} />
          <input type="hidden" {...register("reservationTime")} />

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg border-none px-9 py-4 font-body text-sm font-bold tracking-[0.5px] text-dark shadow-[0_4px_0_#C97F16] transition-colors"
            style={{
              background: submitting ? "#e0cba0" : "#F2A93B",
              cursor: submitting ? "default" : "pointer",
            }}
          >
            {submitting ? "BOOKING..." : "CONFIRM RESERVATION"}
          </button>
        </form>
      )}
    </div>
  );
}
