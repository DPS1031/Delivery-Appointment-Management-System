import { AppointmentForm } from "@/features/appointments/components/AppointmentForm";

export default function NewAppointmentPage() {
    return (
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
            <div style={{ marginBottom: "24px" }}>
                <h1 style={{ fontSize: "24px", fontWeight: 600, color: "#111827" }}>
                    New Appointment
                </h1>
                <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "4px" }}>
                    Schedule a new delivery appointment
                </p>
            </div>
            <div style={{
                backgroundColor: "white",
                borderRadius: "16px",
                border: "1px solid #f3f4f6",
                boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.05)",
                padding: "32px",
            }}>
                <AppointmentForm />
            </div>
        </div>
    );
}
