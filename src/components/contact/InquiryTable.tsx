"use client";

import { useCallback, useMemo, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { formatDateShort } from "@/lib/utils";
import { updateInquiryStatus, deleteInquiry } from "@/app/actions/contact-actions";

export type InquiryRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: "NEW" | "IN_PROGRESS" | "RESOLVED";
  spamScore: number;
  isSpam: boolean;
  createdAt: string;
  updatedAt: string;
};

type Pagination = { page: number; limit: number; total: number; totalPages: number };

const statusBadge = (s: string) => {
  if (s === "RESOLVED") return "bg-green-500/15 text-green-600 border-green-500/30";
  if (s === "IN_PROGRESS") return "bg-gold/15 text-gold-text border-gold/30";
  return "bg-blue-500/15 text-blue-500 border-blue-500/30";
};

const columnHelper = createColumnHelper<InquiryRow>();

export default function InquiryTable({
  rows,
  pagination,
  onChange,
  onRefresh,
  onView,
}: {
  rows: InquiryRow[];
  pagination: Pagination;
  onChange: (page: number) => void;
  onRefresh: () => void;
  onView: (inquiry: InquiryRow) => void;
}) {
  const [busyId, setBusyId] = useState<string | null>(null);

  const handleStatusChange = useCallback(
    async (id: string, status: "NEW" | "IN_PROGRESS" | "RESOLVED") => {
      setBusyId(id);
      await updateInquiryStatus(id, status);
      setBusyId(null);
      onRefresh();
    },
    [onRefresh]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm("Delete this inquiry? This cannot be undone.")) return;
      setBusyId(id);
      await deleteInquiry(id);
      setBusyId(null);
      onRefresh();
    },
    [onRefresh]
  );

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: "Name",
        cell: (info) => (
          <div>
            <div className="flex items-center gap-1.5 text-sm font-semibold text-heading">
              {info.getValue()}
              {info.row.original.isSpam && (
                <span className="rounded-full bg-error/15 px-1.5 py-0.5 text-[10px] font-bold text-error">SPAM</span>
              )}
            </div>
            <div className="text-xs text-muted">{info.row.original.email}</div>
          </div>
        ),
      }),
      columnHelper.accessor("subject", {
        header: "Subject",
        cell: (info) => <span className="text-sm text-heading">{info.getValue()}</span>,
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => (
          <span className={`inline-block rounded-full border px-2.5 py-1 text-[11px] font-bold tracking-[0.5px] ${statusBadge(info.getValue())}`}>
            {info.getValue().replace("_", " ")}
          </span>
        ),
      }),
      columnHelper.accessor("createdAt", {
        header: "Created",
        cell: (info) => <span className="text-sm text-muted">{formatDateShort(info.getValue())}</span>,
      }),
      columnHelper.display({
        id: "resolved",
        header: "Resolved",
        cell: (info) =>
          info.row.original.status === "RESOLVED" ? (
            <span className="text-sm text-muted">{formatDateShort(info.row.original.updatedAt)}</span>
          ) : (
            <span className="text-sm text-muted-on-dark-2">—</span>
          ),
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => {
          const row = info.row.original;
          const busy = busyId === row.id;
          return (
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => onView(row)}
                className="rounded-lg border border-card-border px-2.5 py-1.5 text-xs font-semibold text-muted transition-colors hover:border-gold hover:text-gold"
              >
                View
              </button>
              <select
                value={row.status}
                disabled={busy}
                onChange={(e) => handleStatusChange(row.id, e.target.value as "NEW" | "IN_PROGRESS" | "RESOLVED")}
                className="rounded-lg border border-card-border bg-cream-input px-2 py-1.5 text-xs text-heading"
              >
                <option value="NEW">New</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
              </select>
              <button
                disabled={busy}
                onClick={() => handleDelete(row.id)}
                className="rounded-lg border border-error/30 px-2.5 py-1.5 text-xs font-semibold text-error transition-colors hover:bg-error/10"
              >
                Delete
              </button>
            </div>
          );
        },
      }),
    ],
    [busyId, handleStatusChange, handleDelete, onView]
  );

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: pagination.totalPages,
  });

  return (
    <div className="overflow-hidden rounded-[16px] border border-card-border bg-surface">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="border-b border-card-border">
                {hg.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3 text-xs font-bold tracking-[0.5px] text-muted uppercase">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-sm text-muted">
                  No inquiries found.
                </td>
              </tr>
            )}
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b border-card-border last:border-b-0 hover:bg-cream-input/50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3.5 align-top">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-card-border px-4 py-3.5">
        <span className="text-xs text-muted">
          Page {pagination.page} of {Math.max(1, pagination.totalPages)} · {pagination.total} total
        </span>
        <div className="flex gap-2">
          <button
            disabled={pagination.page <= 1}
            onClick={() => onChange(pagination.page - 1)}
            className="rounded-lg border border-card-border px-3 py-1.5 text-xs font-semibold text-muted transition-colors hover:border-gold hover:text-gold disabled:cursor-not-allowed disabled:opacity-40"
          >
            ← Prev
          </button>
          <button
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => onChange(pagination.page + 1)}
            className="rounded-lg border border-card-border px-3 py-1.5 text-xs font-semibold text-muted transition-colors hover:border-gold hover:text-gold disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
