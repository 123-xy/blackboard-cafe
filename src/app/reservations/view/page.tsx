"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getReservationByCodeAction } from "@/app/actions/reservation-actions";
import { formatDate, formatTime } from "@/lib/utils";

function ViewReservationContent() {
  const searchParams = useSearchParams();
  const codeFromUrl = searchParams.get("code") || "";

  const [code, setCode] = useState(codeFromUrl);
  const [status, setStatus] = useState<"idle" | "loading" | "found" | "error">(
    codeFromUrl ? "loading" : "idle"
  );
  const [error, setError] = useState("");
  const [reservation, setReservation] = useState<{
    customerName: string;
    email: string;
    phone: string;
    reservationDate: string;
    reservationTime: string;
    guests: number;
    notes: string | null;
    status: string;
    confirmationCode: string;
    createdAt: string;
  } | null>(null);

  // Auto-lookup if code in URL
  useState(() => {
    if (codeFromUrl) {
      lookupReservation(codeFromUrl);
    }
  });

  async function lookupReservation(lookupCode: string) {
    setStatus("loading");
    setError("");
    const result = await getReservationByCodeAction(lookupCode);
    if (result.ok) {
      setStatus("found");
      setReservation(result.reservation);
    } else {
      setStatus("error");
      setError(result.error || "Reservation not found");
    }
  }

  const statusBadge = (s: string) => {
    if (s === "CONFIRMED") return "bg-green-500/15 text-green-400 border-green-500/30";
    if (s === "COMPLETED") return "bg-blue-500/15 text-blue-400 border-blue-500/30";
    if (s === "CANCELLED") return "bg-error/15 text-error border-error/30";
    return "bg-gold/15 text-gold border-gold/30";
  };

  const fieldClasses =
    "w-full rounded-[10px] border-[1.5px] border-card-border bg-cream-input px-4 py-3.5 font-body text-sm text-heading placeholder:text-muted-on-dark-2 focus:border-gold focus:outline-none";

  return (
    <section className="mx-auto max-w-[560px] px-5 py-9 sm:px-8 sm:py-18 lg:py-20">
      <div className="rounded-[20px] border border-card-border bg-surface p-8 sm:p-11">
        {/* Lookup form */}
        {(status === "idle" || status === "error") && (
          <>
            <div className="mb-6 text-center">
              <div className="mb-3 text-3xl">🔍</div>
              <h2 className="m-0 mb-2 font-display text-xl font-bold text-heading">
                View Reservation
              </h2>
              <p className="m-0 text-sm text-muted">
                Enter your confirmation code to view your booking details.
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
            <p className="text-sm text-muted">Looking up your reservation...</p>
          </div>
        )}

        {/* Found */}
        {status === "found" && reservation && (
          <>
            <div className="mb-6 text-center">
              <div className="mb-3 text-3xl">🎉</div>
              <h2 className="m-0 mb-2 font-display text-xl font-bold text-heading">
                Reservation Details
              </h2>
              <span
                className={`inline-block rounded-full border px-3 py-1 text-xs font-bold tracking-[0.5px] ${statusBadge(reservation.status)}`}
              >
                {reservation.status}
              </span>
            </div>

            {/* Confirmation code */}
            <div className="mb-6 rounded-xl border border-gold/30 bg-gold/10 px-6 py-4 text-center">
              <div className="mb-1 text-xs font-semibold tracking-[1px] text-muted">CONFIRMATION CODE</div>
              <div className="font-display text-2xl font-extrabold tracking-[4px] text-gold">
                {reservation.confirmationCode}
              </div>
            </div>

            <div className="mb-6 space-y-3">
              <div className="flex items-center gap-3 rounded-xl border border-card-border bg-cream-input px-5 py-3.5">
                <span className="text-lg">👤</span>
                <div>
                  <div className="text-xs text-muted">Name</div>
                  <div className="text-sm font-semibold text-heading">{reservation.customerName}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-card-border bg-cream-input px-5 py-3.5">
                <span className="text-lg">📅</span>
                <div>
                  <div className="text-xs text-muted">Date</div>
                  <div className="text-sm font-semibold text-heading">{formatDate(reservation.reservationDate)}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-card-border bg-cream-input px-5 py-3.5">
                <span className="text-lg">🕐</span>
                <div>
                  <div className="text-xs text-muted">Time</div>
                  <div className="text-sm font-semibold text-heading">{formatTime(reservation.reservationTime)}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-card-border bg-cream-input px-5 py-3.5">
                <span className="text-lg">👥</span>
                <div>
                  <div className="text-xs text-muted">Guests</div>
                  <div className="text-sm font-semibold text-heading">{reservation.guests}</div>
                </div>
              </div>
              {reservation.notes && (
                <div className="flex items-start gap-3 rounded-xl border border-card-border bg-cream-input px-5 py-3.5">
                  <span className="text-lg">📝</span>
                  <div>
                    <div className="text-xs text-muted">Notes</div>
                    <div className="text-sm text-heading">{reservation.notes}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/"
                className="flex-1 rounded-lg bg-gold px-6 py-3.5 text-center text-sm font-bold tracking-[0.5px] text-dark no-underline shadow-[0_4px_0_#C97F16] transition-colors hover:bg-gold-hover-2"
              >
                BACK TO HOME
              </Link>
              {reservation.status !== "CANCELLED" && reservation.status !== "COMPLETED" && (
                <Link
                  href={`/reservations/cancel?code=${reservation.confirmationCode}`}
                  className="flex-1 rounded-lg border border-card-border px-6 py-3.5 text-center text-sm font-semibold text-muted no-underline transition-colors hover:border-error hover:text-error"
                >
                  Cancel
                </Link>
              )}
            </div>

            <button
              onClick={() => { setStatus("idle"); setReservation(null); setCode(""); }}
              className="mt-4 w-full text-center text-sm text-muted transition-colors hover:text-gold"
            >
              Look up another reservation
            </button>
          </>
        )}
      </div>
    </section>
  );
}

export default function ViewReservationPage() {
  return (
    <div className="min-h-screen bg-cream font-body">
      <Header active="contact" />
      <section className="bg-dark px-5 py-10 text-center sm:px-8 sm:py-14 lg:px-14">
        <div className="mx-auto mb-6 h-[5px] w-16 rounded-full bg-gold" />
        <h1
          className="m-0 mb-3 font-display font-extrabold text-white"
          style={{ fontSize: "clamp(28px,5vw,40px)" }}
        >
          VIEW RESERVATION
        </h1>
        <p className="mx-auto max-w-[460px] text-sm text-muted-on-dark">
          Check the details of your upcoming reservation.
        </p>
      </section>
      <Suspense fallback={
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-card-border border-t-gold" />
        </div>
      }>
        <ViewReservationContent />
      </Suspense>
      <Footer />
    </div>
  );
}
