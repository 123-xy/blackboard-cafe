"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { cancelReservationAction, getReservationByCodeAction } from "@/app/actions/reservation-actions";
import { formatDate, formatTime } from "@/lib/utils";

function CancelReservationContent() {
  const searchParams = useSearchParams();
  const codeFromUrl = searchParams.get("code") || "";

  const [code, setCode] = useState(codeFromUrl);
  const [status, setStatus] = useState<"idle" | "loading" | "found" | "cancelled" | "error">(
    codeFromUrl ? "loading" : "idle"
  );
  const [error, setError] = useState("");
  const [reservation, setReservation] = useState<{
    customerName: string;
    reservationDate: string;
    reservationTime: string;
    guests: number;
    status: string;
    confirmationCode: string;
  } | null>(null);

  const applyLookupResult = useCallback(
    (result: Awaited<ReturnType<typeof getReservationByCodeAction>>) => {
      if (result.ok) {
        setStatus(result.reservation.status === "CANCELLED" ? "cancelled" : "found");
        setReservation(result.reservation);
      } else {
        setStatus("error");
        setError(result.error || "Reservation not found");
      }
    },
    []
  );

  const lookupReservation = useCallback(
    async (lookupCode: string) => {
      setStatus("loading");
      setError("");
      const result = await getReservationByCodeAction(lookupCode);
      applyLookupResult(result);
    },
    [applyLookupResult]
  );

  useEffect(() => {
    if (!codeFromUrl) return;
    let ignore = false;
    getReservationByCodeAction(codeFromUrl).then((result) => {
      if (!ignore) applyLookupResult(result);
    });
    return () => {
      ignore = true;
    };
  }, [codeFromUrl, applyLookupResult]);

  const handleCancel = async () => {
    if (!reservation) return;
    setStatus("loading");
    const result = await cancelReservationAction(reservation.confirmationCode);
    if (result.ok) {
      setStatus("cancelled");
    } else {
      setStatus("error");
      setError(result.error || "Failed to cancel reservation");
    }
  };

  const fieldClasses =
    "w-full rounded-[10px] border-[1.5px] border-card-border bg-cream-input px-4 py-3.5 font-body text-sm text-heading placeholder:text-muted-on-dark-2 focus:border-gold focus:outline-none";

  return (
    <section className="mx-auto max-w-[560px] px-5 py-9 sm:px-8 sm:py-18 lg:py-20">
      <div className="rounded-[20px] border border-card-border bg-surface p-8 sm:p-11">
        {/* Idle / lookup */}
        {(status === "idle" || (status === "error" && !reservation)) && (
          <>
            <div className="mb-6 text-center">
              <div className="mb-3 text-3xl">🔍</div>
              <h2 className="m-0 mb-2 font-display text-xl font-bold text-heading">
                Cancel Reservation
              </h2>
              <p className="m-0 text-sm text-muted">
                Enter your confirmation code to cancel your booking.
              </p>
            </div>
            {error && (
              <div className="mb-4 rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
                {error}
              </div>
            )}
            <div className="mb-5">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Enter confirmation code"
                maxLength={8}
                className={`${fieldClasses} text-center text-lg tracking-[3px]`}
              />
            </div>
            <button
              onClick={() => lookupReservation(code)}
              disabled={code.length !== 8}
              className="w-full rounded-lg bg-gold px-8 py-4 text-sm font-bold tracking-[0.5px] text-dark shadow-[0_4px_0_#C97F16] transition-colors hover:bg-gold-hover-2 disabled:opacity-50"
            >
              FIND RESERVATION
            </button>
          </>
        )}

        {/* Loading */}
        {status === "loading" && (
          <div className="flex flex-col items-center gap-4 py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-card-border border-t-gold" />
            <p className="text-sm text-muted">Please wait...</p>
          </div>
        )}

        {/* Found - confirm cancel */}
        {status === "found" && reservation && (
          <>
            <div className="mb-6 text-center">
              <div className="mb-3 text-3xl">⚠️</div>
              <h2 className="m-0 mb-2 font-display text-xl font-bold text-heading">
                Cancel This Reservation?
              </h2>
              <p className="m-0 text-sm text-muted">This action cannot be undone.</p>
            </div>
            <div className="mb-6 rounded-xl border border-card-border bg-cream-input p-5">
              <div className="mb-2 text-sm font-semibold text-heading">{reservation.customerName}</div>
              <div className="text-sm text-muted">
                📅 {formatDate(reservation.reservationDate)} · 🕐 {formatTime(reservation.reservationTime)} · 👥 {reservation.guests} guests
              </div>
              <div className="mt-2 font-display text-sm font-bold tracking-[2px] text-gold">
                {reservation.confirmationCode}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setStatus("idle"); setReservation(null); }}
                className="flex-1 rounded-lg border border-card-border px-4 py-3.5 text-sm font-semibold text-muted transition-colors hover:border-gold hover:text-gold"
              >
                KEEP BOOKING
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 rounded-lg bg-error px-4 py-3.5 text-sm font-bold text-white transition-colors hover:bg-error/80"
              >
                CANCEL RESERVATION
              </button>
            </div>
          </>
        )}

        {/* Cancelled */}
        {status === "cancelled" && (
          <div className="py-6 text-center">
            <div className="mb-4 text-4xl">✅</div>
            <h2 className="m-0 mb-2 font-display text-xl font-bold text-heading">
              Reservation Cancelled
            </h2>
            <p className="m-0 mb-6 text-sm text-muted">
              Your reservation has been successfully cancelled.
            </p>
            <Link
              href="/"
              className="inline-block rounded-lg bg-gold px-8 py-3.5 text-sm font-bold tracking-[0.5px] text-dark no-underline shadow-[0_4px_0_#C97F16] transition-colors hover:bg-gold-hover-2"
            >
              BACK TO HOME
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export default function CancelReservationPage() {
  return (
    <div className="min-h-screen bg-cream font-body">
      <Header active="contact" />
      <section className="bg-dark px-5 py-10 text-center sm:px-8 sm:py-14 lg:px-14">
        <div className="mx-auto mb-6 h-[5px] w-16 rounded-full bg-gold" />
        <h1
          className="m-0 mb-3 font-display font-extrabold text-white"
          style={{ fontSize: "clamp(28px,5vw,40px)" }}
        >
          CANCEL RESERVATION
        </h1>
        <p className="mx-auto max-w-[460px] text-sm text-muted-on-dark">
          Need to change plans? Cancel your reservation below.
        </p>
      </section>
      <Suspense fallback={
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-card-border border-t-gold" />
        </div>
      }>
        <CancelReservationContent />
      </Suspense>
      <Footer />
    </div>
  );
}
