"use client";

import { useCallback, useEffect, useState } from "react";
import DashboardStats from "@/components/booking/DashboardStats";
import ReservationTable, { type ReservationRow } from "@/components/booking/ReservationTable";
import AvailabilityCalendar from "@/components/booking/AvailabilityCalendar";
import InquiryTable, { type InquiryRow } from "@/components/contact/InquiryTable";
import InquiryDetail from "@/components/contact/InquiryDetail";
import { getAllReservationsAction, getDashboardStatsAction } from "@/app/actions/reservation-actions";
import { getAllInquiries, getInquiryStatsAction } from "@/app/actions/contact-actions";

type Tab = "reservations" | "inquiries";

type ReservationStats = {
  todayCount: number;
  weekCount: number;
  confirmedCount: number;
  completedCount: number;
  cancelledCount: number;
  pendingCount: number;
};

type InquiryStats = {
  total: number;
  newCount: number;
  inProgressCount: number;
  resolvedCount: number;
  spamCount: number;
};

const emptyPagination = { page: 1, limit: 20, total: 0, totalPages: 0 };

export default function AdminDashboardClient() {
  const [tab, setTab] = useState<Tab>("reservations");

  // Reservations state
  const [reservations, setReservations] = useState<ReservationRow[]>([]);
  const [reservationPagination, setReservationPagination] = useState(emptyPagination);
  const [reservationPage, setReservationPage] = useState(1);
  const [reservationSearch, setReservationSearch] = useState("");
  const [reservationStatus, setReservationStatus] = useState("");
  const [reservationDate, setReservationDate] = useState("");
  const [reservationStats, setReservationStats] = useState<ReservationStats | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);

  // Inquiries state
  const [inquiries, setInquiries] = useState<InquiryRow[]>([]);
  const [inquiryPagination, setInquiryPagination] = useState(emptyPagination);
  const [inquiryPage, setInquiryPage] = useState(1);
  const [inquirySearch, setInquirySearch] = useState("");
  const [inquiryStatus, setInquiryStatus] = useState("");
  const [inquiryStats, setInquiryStats] = useState<InquiryStats | null>(null);
  const [viewingInquiry, setViewingInquiry] = useState<InquiryRow | null>(null);

  const reservationQuery = {
    page: reservationPage,
    search: reservationSearch || undefined,
    status: (reservationStatus as "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED") || undefined,
    date: reservationDate || undefined,
  };
  const inquiryQuery = {
    page: inquiryPage,
    search: inquirySearch || undefined,
    status: (inquiryStatus as "NEW" | "IN_PROGRESS" | "RESOLVED") || undefined,
  };

  const applyReservations = useCallback((result: Awaited<ReturnType<typeof getAllReservationsAction>>) => {
    if (result.ok) {
      setReservations(result.reservations as ReservationRow[]);
      setReservationPagination(result.pagination);
    }
  }, []);

  const applyReservationStats = useCallback((result: Awaited<ReturnType<typeof getDashboardStatsAction>>) => {
    if (result.ok) setReservationStats(result.stats);
  }, []);

  const applyInquiries = useCallback((result: Awaited<ReturnType<typeof getAllInquiries>>) => {
    if (result.ok) {
      setInquiries(result.inquiries as InquiryRow[]);
      setInquiryPagination(result.pagination);
    }
  }, []);

  const applyInquiryStats = useCallback((result: Awaited<ReturnType<typeof getInquiryStatsAction>>) => {
    if (result.ok) setInquiryStats(result.stats);
  }, []);

  useEffect(() => {
    let ignore = false;
    getAllReservationsAction(reservationQuery).then((result) => {
      if (!ignore) applyReservations(result);
    });
    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reservationPage, reservationSearch, reservationStatus, reservationDate, applyReservations]);

  useEffect(() => {
    let ignore = false;
    getDashboardStatsAction().then((result) => {
      if (!ignore) applyReservationStats(result);
    });
    return () => {
      ignore = true;
    };
  }, [applyReservationStats]);

  useEffect(() => {
    let ignore = false;
    getAllInquiries(inquiryQuery).then((result) => {
      if (!ignore) applyInquiries(result);
    });
    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inquiryPage, inquirySearch, inquiryStatus, applyInquiries]);

  useEffect(() => {
    let ignore = false;
    getInquiryStatsAction().then((result) => {
      if (!ignore) applyInquiryStats(result);
    });
    return () => {
      ignore = true;
    };
  }, [applyInquiryStats]);

  const refreshReservations = () => {
    getAllReservationsAction(reservationQuery).then(applyReservations);
    getDashboardStatsAction().then(applyReservationStats);
  };

  const refreshInquiries = () => {
    getAllInquiries(inquiryQuery).then(applyInquiries);
    getInquiryStatsAction().then(applyInquiryStats);
  };

  const fieldClasses =
    "rounded-lg border border-card-border bg-cream-input px-3.5 py-2.5 text-sm text-heading focus:border-gold focus:outline-none";

  return (
    <div className="mx-auto max-w-[1300px] px-5 py-8 sm:px-8">
      {/* Tabs */}
      <div className="mb-7 flex gap-2 border-b border-card-border">
        <button
          onClick={() => setTab("reservations")}
          className={`border-b-2 px-4 py-3 text-sm font-bold tracking-[0.5px] transition-colors ${
            tab === "reservations" ? "border-gold text-gold-text" : "border-transparent text-muted hover:text-heading"
          }`}
        >
          RESERVATIONS
        </button>
        <button
          onClick={() => setTab("inquiries")}
          className={`border-b-2 px-4 py-3 text-sm font-bold tracking-[0.5px] transition-colors ${
            tab === "inquiries" ? "border-gold text-gold-text" : "border-transparent text-muted hover:text-heading"
          }`}
        >
          CONTACT INQUIRIES
        </button>
      </div>

      {tab === "reservations" && (
        <div>
          {reservationStats && (
            <div className="mb-6">
              <DashboardStats stats={reservationStats} />
            </div>
          )}

          <div className="mb-5 flex flex-wrap items-center gap-3">
            <input
              type="text"
              placeholder="Search name, email, phone, code..."
              value={reservationSearch}
              onChange={(e) => { setReservationSearch(e.target.value); setReservationPage(1); }}
              className={`${fieldClasses} min-w-[220px] flex-1`}
            />
            <select
              value={reservationStatus}
              onChange={(e) => { setReservationStatus(e.target.value); setReservationPage(1); }}
              className={fieldClasses}
            >
              <option value="">All statuses</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            {reservationDate && (
              <span className="flex items-center gap-2 rounded-lg border border-gold/40 bg-gold/10 px-3 py-2 text-xs font-semibold text-gold-text">
                {reservationDate}
                <button onClick={() => { setReservationDate(""); setReservationPage(1); }} className="text-sm">×</button>
              </span>
            )}
            <button
              onClick={() => setShowCalendar((s) => !s)}
              className="rounded-lg border border-card-border px-3.5 py-2.5 text-sm font-semibold text-muted transition-colors hover:border-gold hover:text-gold"
            >
              {showCalendar ? "Hide Calendar" : "Calendar View"}
            </button>
          </div>

          {showCalendar && (
            <div className="mb-5 max-w-[360px]">
              <AvailabilityCalendar
                onSelectDate={(date) => { setReservationDate(date); setReservationPage(1); }}
              />
            </div>
          )}

          <ReservationTable
            rows={reservations}
            pagination={reservationPagination}
            onChange={(page) => setReservationPage(page)}
            onRefresh={refreshReservations}
          />
        </div>
      )}

      {tab === "inquiries" && (
        <div>
          {inquiryStats && (
            <div className="mb-6 grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }}>
              {[
                { label: "Total", value: inquiryStats.total, icon: "📨" },
                { label: "New", value: inquiryStats.newCount, icon: "🆕" },
                { label: "In Progress", value: inquiryStats.inProgressCount, icon: "⏳" },
                { label: "Resolved", value: inquiryStats.resolvedCount, icon: "✅" },
                { label: "Spam", value: inquiryStats.spamCount, icon: "🚫" },
              ].map((c) => (
                <div key={c.label} className="rounded-[14px] border border-card-border bg-surface p-5">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-semibold tracking-[0.5px] text-muted uppercase">{c.label}</span>
                    <span className="text-lg">{c.icon}</span>
                  </div>
                  <div className="font-display text-3xl font-extrabold text-gold">{c.value}</div>
                </div>
              ))}
            </div>
          )}

          <div className="mb-5 flex flex-wrap items-center gap-3">
            <input
              type="text"
              placeholder="Search name, email, subject..."
              value={inquirySearch}
              onChange={(e) => { setInquirySearch(e.target.value); setInquiryPage(1); }}
              className={`${fieldClasses} min-w-[220px] flex-1`}
            />
            <select
              value={inquiryStatus}
              onChange={(e) => { setInquiryStatus(e.target.value); setInquiryPage(1); }}
              className={fieldClasses}
            >
              <option value="">All statuses</option>
              <option value="NEW">New</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>

          <InquiryTable
            rows={inquiries}
            pagination={inquiryPagination}
            onChange={(page) => setInquiryPage(page)}
            onRefresh={refreshInquiries}
            onView={(inquiry) => setViewingInquiry(inquiry)}
          />
        </div>
      )}

      {viewingInquiry && (
        <InquiryDetail
          inquiry={viewingInquiry}
          onClose={() => setViewingInquiry(null)}
          onRefresh={refreshInquiries}
        />
      )}
    </div>
  );
}
