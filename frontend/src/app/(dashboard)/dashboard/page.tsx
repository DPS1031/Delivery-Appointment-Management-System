"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getDashboard } from "@/features/appointments/api";
import { DashboardSummary, AppointmentStatus } from "@/shared/types";

const statusCards: {
    key: AppointmentStatus;
    label: string;
    color: string;
    bg: string;
    border: string;
}[] = [
        { key: "Programada", label: "Scheduled", color: "#1d4ed8", bg: "#eff6ff", border: "#bfdbfe" },
        { key: "En proceso", label: "In Progress", color: "#b45309", bg: "#fffbeb", border: "#fde68a" },
        { key: "Entregada", label: "Delivered", color: "#15803d", bg: "#f0fdf4", border: "#bbf7d0" },
        { key: "Cancelada", label: "Cancelled", color: "#b91c1c", bg: "#fef2f2", border: "#fecaca" },
    ];

export default function DashboardPage() {
    const [data, setData] = useState<DashboardSummary | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getDashboard()
            .then(setData)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "300px" }}>
                <div style={{
                    width: "36px", height: "36px",
                    border: "3px solid #e5e7eb",
                    borderTopColor: "#111827",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>

            {/* Header */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
                <div>
                    <h1 style={{ fontSize: "24px", fontWeight: 600, color: "#111827" }}>Dashboard</h1>
                    <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "4px" }}>
                        Overview of all delivery appointments
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

            {/* Status cards */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "16px",
            }}
                className="status-grid"
            >
                {statusCards.map((card) => (
                    <div
                        key={card.key}
                        style={{
                            backgroundColor: card.bg,
                            border: `1px solid ${card.border}`,
                            borderRadius: "16px",
                            padding: "24px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                        }}
                    >
                        <p style={{ fontSize: "13px", fontWeight: 500, color: card.color, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            {card.label}
                        </p>
                        <p style={{ fontSize: "42px", fontWeight: 700, color: card.color, lineHeight: 1 }}>
                            {data?.by_status[card.key] ?? 0}
                        </p>
                    </div>
                ))}
            </div>

            {/* Stats row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }} className="stats-grid">
                {[
                    { label: "Total Appointments", value: data?.total ?? 0 },
                    { label: "Scheduled Today", value: data?.today ?? 0 },
                ].map((stat) => (
                    <div
                        key={stat.label}
                        style={{
                            backgroundColor: "white",
                            border: "1px solid #f3f4f6",
                            borderRadius: "16px",
                            padding: "24px",
                            boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.05)",
                        }}
                    >
                        <p style={{ fontSize: "13px", color: "#6b7280", fontWeight: 500 }}>{stat.label}</p>
                        <p style={{ fontSize: "42px", fontWeight: 700, color: "#111827", lineHeight: 1, marginTop: "8px" }}>
                            {stat.value}
                        </p>
                    </div>
                ))}
            </div>

            {/* Quick actions */}
            <div style={{
                backgroundColor: "white",
                border: "1px solid #f3f4f6",
                borderRadius: "16px",
                padding: "24px",
                boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.05)",
            }}>
                <h2 style={{ fontSize: "15px", fontWeight: 600, color: "#111827", marginBottom: "16px" }}>
                    Quick Actions
                </h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                    {[
                        { href: "/appointments", label: "View all appointments" },
                        { href: "/appointments/new", label: "Create appointment" },
                        { href: "/reports", label: "View delivery report" },
                    ].map((action) => (
                        <Link
                            key={action.href}
                            href={action.href}
                            style={{
                                padding: "10px 18px",
                                fontSize: "14px",
                                color: "#374151",
                                border: "1px solid #e5e7eb",
                                borderRadius: "12px",
                                textDecoration: "none",
                                fontWeight: 500,
                                backgroundColor: "white",
                            }}
                        >
                            {action.label}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Delivery progress */}
            <div style={{
                backgroundColor: "white",
                border: "1px solid #f3f4f6",
                borderRadius: "16px",
                padding: "24px",
                boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.05)",
            }}>
                <h2 style={{ fontSize: "15px", fontWeight: 600, color: "#111827", marginBottom: "20px" }}>
                    Delivery Overview
                </h2>

                {data && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                        {statusCards.map((card) => {
                            const count = data.by_status[card.key] ?? 0;
                            const pct = data.total > 0 ? Math.round((count / data.total) * 100) : 0;
                            return (
                                <div key={card.key}>
                                    <div style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        marginBottom: "6px",
                                    }}>
                                        <span style={{ fontSize: "13px", fontWeight: 500, color: card.color }}>
                                            {card.label}
                                        </span>
                                        <span style={{ fontSize: "13px", color: "#9ca3af" }}>
                                            {count} · {pct}%
                                        </span>
                                    </div>
                                    <div style={{
                                        height: "6px",
                                        backgroundColor: "#f3f4f6",
                                        borderRadius: "999px",
                                        overflow: "hidden",
                                    }}>
                                        <div style={{
                                            height: "100%",
                                            width: `${pct}%`,
                                            backgroundColor: card.color,
                                            borderRadius: "999px",
                                            transition: "width 0.6s ease",
                                        }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <style>{`
        @media (min-width: 1024px) {
          .status-grid { grid-template-columns: repeat(4, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
        </div>
    );
}
