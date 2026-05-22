"use client";

import { useState } from "react";
import { useReport } from "@/features/reports/hooks/useReport";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: "12px",
  border: "1px solid #e5e7eb",
  fontSize: "14px",
  backgroundColor: "white",
  color: "#111827",
  fontFamily: "inherit",
  outline: "none",
};

export default function ReportsPage() {
  const { data, loading, error, fetch } = useReport();
  const today = new Date().toISOString().slice(0, 10);
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toISOString().slice(0, 10);

  const [dateFrom, setDateFrom] = useState(thirtyDaysAgo);
  const [dateTo, setDateTo] = useState(today);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* Header */}
      <div>
        <h1 style={{ fontSize: "24px", fontWeight: 600, color: "#111827" }}>
          Delivery Report
        </h1>
        <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "4px" }}>
          Average delivery time by product line
        </p>
      </div>

      {/* Filters */}
      <div style={{
        backgroundColor: "white",
        borderRadius: "16px",
        border: "1px solid #f3f4f6",
        padding: "20px",
        boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.05)",
      }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "flex-end" }}>
          <div style={{ flex: 1, minWidth: "140px" }}>
            <label style={{ fontSize: "11px", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: "6px" }}>
              From
            </label>
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ flex: 1, minWidth: "140px" }}>
            <label style={{ fontSize: "11px", fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: "6px" }}>
              To
            </label>
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} style={inputStyle} />
          </div>
          <button
            onClick={() => void fetch(dateFrom, dateTo)}
            disabled={loading}
            style={{
              padding: "11px 24px",
              backgroundColor: loading ? "#6b7280" : "#111827",
              color: "white",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: 500,
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {loading ? "Loading..." : "Run Report"}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: "12px", padding: "12px 16px" }}>
          <p style={{ fontSize: "14px", color: "#dc2626" }}>{error}</p>
        </div>
      )}

      {data && (
        <>
          {/* Chart */}
          {data.results.length > 0 && (
            <div style={{
              backgroundColor: "white",
              borderRadius: "16px",
              border: "1px solid #f3f4f6",
              padding: "24px",
              boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.05)",
            }}>
              <h2 style={{ fontSize: "15px", fontWeight: 600, color: "#111827", marginBottom: "20px" }}>
                Average Delivery Time (hours)
              </h2>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={data.results} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="product_line" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: "13px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                    cursor={{ fill: "#f9fafb" }}
                  />
                  <Bar dataKey="avg_hours" fill="#111827" radius={[8, 8, 0, 0]} name="Avg Hours" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Table */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "16px",
            border: "1px solid #f3f4f6",
            boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.05)",
            overflow: "hidden",
          }}>
            {data.results.length === 0 ? (
              <div style={{ padding: "64px", textAlign: "center", color: "#9ca3af", fontSize: "14px" }}>
                No delivered appointments in this date range
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
                      {["Product Line", "Deliveries", "Avg Hours", "Avg Minutes"].map((h, i) => (
                        <th key={h} style={{
                          padding: "12px 20px",
                          textAlign: i === 0 ? "left" : "right",
                          fontSize: "11px",
                          fontWeight: 600,
                          color: "#9ca3af",
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                        }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.results.map((row, idx) => (
                      <tr key={row.product_line} style={{ borderBottom: idx < data.results.length - 1 ? "1px solid #f9fafb" : "none" }}>
                        <td style={{ padding: "16px 20px", fontWeight: 600, color: "#111827" }}>{row.product_line}</td>
                        <td style={{ padding: "16px 20px", textAlign: "right", color: "#6b7280" }}>{row.total_deliveries}</td>
                        <td style={{ padding: "16px 20px", textAlign: "right", color: "#6b7280" }}>{Number(row.avg_hours).toFixed(1)}h</td>
                        <td style={{ padding: "16px 20px", textAlign: "right", color: "#6b7280" }}>{Math.round(row.avg_minutes)}m</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {!data && !loading && (
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          border: "1px solid #f3f4f6",
          padding: "80px 24px",
          textAlign: "center",
          color: "#9ca3af",
          fontSize: "14px",
          boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.05)",
        }}>
          Select a date range and click Run Report
        </div>
      )}
    </div>
  );
}
