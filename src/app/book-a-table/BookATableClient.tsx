"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CoffeeCupSteam from "@/components/CoffeeCupSteam";
import BookingForm from "@/components/booking/BookingForm";
import { formatDate, formatTime } from "@/lib/utils";
import type { ReservationInput } from "@/lib/validations";

export default function BookATablePage() {
  const [success, setSuccess] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState("");
  const [bookingData, setBookingData] = useState<ReservationInput | null>(null);

  const handleSuccess = (code: string, data: ReservationInput) => {
    setConfirmationCode(code);
    setBookingData(data);
    setSuccess(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-cream font-body">
      <Header active="contact" />

      {/* Hero */}
      <section className="relative overflow-hidden bg-dark px-5 py-10 text-center sm:px-8 sm:py-16 lg:px-14 lg:py-18">
        <Image
          src="/images/logo-badge.png"
          alt=""
          width={130}
          height={130}
          className="pointer-events-none absolute top-[12%] left-[6%] z-0 w-[130px] opacity-10 [animation:badgeFloatSm_9s_ease-in-out_infinite]"
        />
        <Image
          src="/images/logo-badge.png"
          alt=""
          width={150}
          height={150}
          className="pointer-events-none absolute bottom-[14%] right-[7%] z-0 w-[150px] opacity-[0.12] [animation:badgeFloatSm2_11s_ease-in-out_infinite]"
        />
        <CoffeeCupSteam className="absolute top-[10%] right-[20%] z-0 opacity-50" />

        <div className="relative z-10">
          <div className="mx-auto mb-6 h-[5px] w-16 rounded-full bg-gold" />
          <div className="mb-3.5 font-display text-sm font-bold tracking-[2px] text-gold">
            RESERVATIONS
          </div>
          <h1
            className="m-0 mb-5 font-display font-extrabold text-white"
            style={{ fontSize: "clamp(32px,7vw,52px)" }}
          >
            BOOK A TABLE
          </h1>
          <p className="mx-auto max-w-[560px] text-base text-muted-on-dark">
            Reserve your spot at Blackboard Cafe. Great food awaits!
          </p>
        </div>
      </section>

      {/* Gold info band */}
      <section className="bg-gold px-5 py-4.5 sm:px-8 lg:px-14">
        <div className="mx-auto flex max-w-[1300px] flex-wrap items-center justify-center gap-9 text-sm font-semibold text-dark">
          <span>📍 Hyderabad, Telangana</span>
          <span>🕐 10:00 AM – 10:00 PM</span>
          <span>👥 Up to 10 guests per booking</span>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-[700px] px-5 py-9 sm:px-8 sm:py-18 lg:px-14 lg:py-20">
        {!success ? (
          <BookingForm onSuccess={handleSuccess} />
        ) : (
          /* Success state */
          <div className="rounded-[20px] border border-card-border bg-surface p-8 text-center sm:p-12">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gold/15">
              <span className="text-4xl">✅</span>
            </div>
            <h2 className="m-0 mb-2 font-display text-2xl font-bold text-heading">
              Reservation Confirmed!
            </h2>
            <p className="m-0 mb-8 text-sm text-muted">
              We&apos;ve sent a confirmation to your email and phone.
            </p>

            {/* Confirmation code */}
            <div className="mb-8 rounded-xl border border-gold/30 bg-gold/10 px-6 py-5">
              <div className="mb-1 text-xs font-semibold tracking-[1px] text-muted">
                CONFIRMATION CODE
              </div>
              <div className="font-display text-3xl font-extrabold tracking-[4px] text-gold">
                {confirmationCode}
              </div>
            </div>

            {/* Details */}
            {bookingData && (
              <div className="mb-8 grid gap-4 text-left">
                <div className="flex items-center gap-3 rounded-xl border border-card-border bg-cream-input px-5 py-3.5">
                  <span className="text-lg">📅</span>
                  <div>
                    <div className="text-xs text-muted">Date</div>
                    <div className="text-sm font-semibold text-heading">
                      {formatDate(bookingData.reservationDate)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-card-border bg-cream-input px-5 py-3.5">
                  <span className="text-lg">🕐</span>
                  <div>
                    <div className="text-xs text-muted">Time</div>
                    <div className="text-sm font-semibold text-heading">
                      {formatTime(bookingData.reservationTime)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-card-border bg-cream-input px-5 py-3.5">
                  <span className="text-lg">👥</span>
                  <div>
                    <div className="text-xs text-muted">Guests</div>
                    <div className="text-sm font-semibold text-heading">
                      {bookingData.guests} {bookingData.guests === 1 ? "Guest" : "Guests"}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/"
                className="rounded-lg bg-gold px-8 py-3.5 text-center text-sm font-bold tracking-[0.5px] text-dark no-underline shadow-[0_4px_0_#C97F16] transition-colors hover:bg-gold-hover-2"
              >
                BACK TO HOME
              </Link>
              <Link
                href={`/reservations/cancel?code=${confirmationCode}`}
                className="rounded-lg border border-card-border px-8 py-3.5 text-center text-sm font-semibold text-muted no-underline transition-colors hover:border-gold hover:text-gold"
              >
                Cancel Reservation
              </Link>
            </div>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
