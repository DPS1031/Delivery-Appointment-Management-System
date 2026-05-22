"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getAppointment } from "@/features/appointments/api";
import { AppointmentForm } from "@/features/appointments/components/AppointmentForm";
import { Appointment } from "@/shared/types";

export default function EditAppointmentPage() {
    const { id } = useParams<{ id: string }>();
    const [appointment, setAppointment] = useState<Appointment | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getAppointment(id)
            .then(setAppointment)
            .catch(() => setError("Appointment not found"))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "300px" }}>
                <div style={{
                    width: "32px", height: "32px",
                    border: "3px solid #e5e7eb",
                    borderTopColor: "#111827",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (error ?? !appointment) {
        return (
            <div style={{ textAlign: "center", padding: "64px 24px", color: "#9ca3af", fontSize: "14px" }}>
                {error ?? "Appointment not found"}
            </div>
        );
    }

    return (
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
            <div style={{ marginBottom: "24px" }}>
                <h1 style={{ fontSize: "24px", fontWeight: 600, color: "#111827" }}>
                    Edit Appointment
                </h1>
                <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "4px" }}>
                    Update appointment details or change status
                </p>
            </div>
            <div style={{
                backgroundColor: "white",
                borderRadius: "16px",
                border: "1px solid #f3f4f6",
                boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.05)",
                padding: "32px",
            }}>
                <AppointmentForm existing={appointment} />
            </div>
        </div>
    );
}
