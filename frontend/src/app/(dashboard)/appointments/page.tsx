"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAppointments } from "@/features/appointments/hooks/useAppointments";
import { StatusBadge } from "@/features/appointments/components/StatusBadge";
import { AppointmentFilters, AppointmentStatus, ProductLine, Supplier } from "@/shared/types";
import { STATUSES, SUPPLIERS, PRODUCT_LINES } from "@/shared/lib/constants";

const selectStyle: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: "12px",
  border: "1px solid #e5e7eb",
  fontSize: "14px",
  backgroundColor: "white",
  color: "#374151",
  fontFamily: "inherit",
  cursor: "pointer",
  outline: "none",
  width: "100%",
  appearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
  paddingRight: "36px",
};

export default function AppointmentsPage() {
  const { data, loading, error, fetch, cancel } = useAppointments();
  const [filters, setFilters] = useState<AppointmentFilters>({});
  const [cancelingId, setCancelingId] = useState<string | null>(null);

  useEffect(() => {
    void fetch(filters);
  }, [filters]);

  async function handleCancel(id: string) {
    if (!confirm("Cancel this appointment?")) return;
    setCancelingId(id);
    const ok = await cancel(id);
    if (ok) void fetch(filters);
    setCancelingId(null);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 600, color: "#111827" }}>Appointments</h1>
          <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "4px" }}>
            {data?.count ?? 0} total appointments
          </p>
        </div>
        <Link
          href="/appointments/new"
          style={{
            padding: "10px 20px",
            backgroundColor: "#111827",
            color: "white",
            borderRadius: "12px",
            fontSize: "14px",
            fontWeight: 500,
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          + New Appointment
        </Link>
      </div>

      {/* Filters */}
      <div style={{
        backgroundColor: "white",
        borderRadius: "16px",
        border: "1px solid #f3f4f6",
        padding: "20px",
        boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.05)",
      }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }} className="filter-grid">
          <select
            style={selectStyle}
            value={filters.status ?? ""}
            onChange={(e) => setFilters((f) => ({ ...f, status: (e.target.value as AppointmentStatus) || undefined, page: 1 }))}
          >
            <option value="">All statuses</option>
            {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>

          <select
            style={selectStyle}
            value={filters.supplier ?? ""}
            onChange={(e) => setFilters((f) => ({ ...f, supplier: (e.target.value as Supplier) || undefined, page: 1 }))}
          >
            <option value="">All suppliers</option>
            {SUPPLIERS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>

          <select
            style={selectStyle}
            value={filters.product_line ?? ""}
            onChange={(e) => setFilters((f) => ({ ...f, product_line: (e.target.value as ProductLine) || undefined, page: 1 }))}
          >
            <option value="">All product lines</option>
            {PRODUCT_LINES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>

          <button
            onClick={() => setFilters({})}
            style={{
              padding: "10px 14px",
              fontSize: "14px",
              color: "#6b7280",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              backgroundColor: "white",
              cursor: "pointer",
              fontFamily: "inherit",
              fontWeight: 400,
            }}
          >
            Clear filters
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{
        backgroundColor: "white",
        borderRadius: "16px",
        border: "1px solid #f3f4f6",
        boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.05)",
        overflow: "hidden",
      }}>
        {loading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "200px" }}>
            <div style={{
              width: "32px", height: "32px",
              border: "3px solid #e5e7eb",
              borderTopColor: "#111827",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : error ? (
          <div style={{ padding: "48px", textAlign: "center", color: "#ef4444", fontSize: "14px" }}>{error}</div>
        ) : data?.results.length === 0 ? (
          <div style={{ padding: "64px", textAlign: "center", color: "#9ca3af", fontSize: "14px" }}>
            No appointments found
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
                  {["Scheduled", "Supplier", "Product Line", "Status", "Actions"].map((h, i) => (
                    <th key={h} style={{
                      padding: "12px 16px",
                      textAlign: i === 4 ? "right" : "left",
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "#9ca3af",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      whiteSpace: "nowrap",
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data?.results.map((apt, idx) => (
                  <tr
                    key={apt.id}
                    style={{
                      borderBottom: idx < (data.results.length - 1) ? "1px solid #f9fafb" : "none",
                      backgroundColor: "white",
                    }}
                  >
                    <td style={{ padding: "14px 16px", color: "#111827", fontWeight: 500, whiteSpace: "nowrap" }}>
                      {new Date(apt.scheduled_at).toLocaleDateString("en-US", {
                        month: "short", day: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </td>
                    <td style={{ padding: "14px 16px", color: "#6b7280" }}>
                      Supplier {apt.supplier}
                    </td>
                    <td style={{ padding: "14px 16px", color: "#6b7280" }}>
                      {apt.product_line}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <StatusBadge status={apt.status} />
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "8px" }}>
                        {apt.status !== "Cancelada" && apt.status !== "Entregada" && (
                          <Link
                            href={`/appointments/${apt.id}/edit`}
                            style={{
                              padding: "6px 12px",
                              fontSize: "13px",
                              color: "#374151",
                              border: "1px solid #e5e7eb",
                              borderRadius: "8px",
                              textDecoration: "none",
                              fontWeight: 500,
                              backgroundColor: "white",
                              display: "inline-block",
                            }}
                          >
                            Edit
                          </Link>
                        )}
                        {apt.status !== "Cancelada" && apt.status !== "Entregada" && (
                          <button
                            onClick={() => handleCancel(apt.id)}
                            disabled={cancelingId === apt.id}
                            style={{
                              padding: "6px 12px",
                              fontSize: "13px",
                              color: "#dc2626",
                              border: "1px solid #fecaca",
                              borderRadius: "8px",
                              backgroundColor: "#fef2f2",
                              cursor: "pointer",
                              fontFamily: "inherit",
                              fontWeight: 500,
                              opacity: cancelingId === apt.id ? 0.5 : 1,
                            }}
                          >
                            {cancelingId === apt.id ? "..." : "Cancel"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {data && (data.next ?? data.previous) && (
          <div style={{
            padding: "16px",
            borderTop: "1px solid #f3f4f6",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <button
              onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) - 1 }))}
              disabled={!data.previous}
              style={{
                padding: "8px 16px",
                fontSize: "14px",
                color: "#374151",
                border: "1px solid #e5e7eb",
                borderRadius: "10px",
                backgroundColor: "white",
                cursor: data.previous ? "pointer" : "not-allowed",
                opacity: data.previous ? 1 : 0.4,
                fontFamily: "inherit",
              }}
            >
              Previous
            </button>
            <span style={{ fontSize: "13px", color: "#9ca3af" }}>Page {filters.page ?? 1}</span>
            <button
              onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) + 1 }))}
              disabled={!data.next}
              style={{
                padding: "8px 16px",
                fontSize: "14px",
                color: "#374151",
                border: "1px solid #e5e7eb",
                borderRadius: "10px",
                backgroundColor: "white",
                cursor: data.next ? "pointer" : "not-allowed",
                opacity: data.next ? 1 : 0.4,
                fontFamily: "inherit",
              }}
            >
              Next
            </button>
          </div>
        )}
      </div>

      <style>{`
        @media (min-width: 768px) {
          .filter-grid { grid-template-columns: repeat(4, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}
