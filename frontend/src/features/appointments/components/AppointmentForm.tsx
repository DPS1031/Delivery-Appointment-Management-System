"use client";

import { useState } from "react";
import { useAppointmentForm, AppointmentFormData } from "../hooks/useAppointmentForm";
import { Appointment, AppointmentStatus } from "@/shared/types";
import { SUPPLIERS, PRODUCT_LINES, STATUSES, STATUS_TRANSITIONS } from "@/shared/lib/constants";

interface AppointmentFormProps {
    existing?: Appointment;
}

const fieldStyle: React.CSSProperties = {
    width: "100%",
    padding: "11px 14px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    fontSize: "14px",
    backgroundColor: "white",
    color: "#111827",
    fontFamily: "inherit",
    outline: "none",
    boxSizing: "border-box",
};

const fieldErrorStyle: React.CSSProperties = {
    ...fieldStyle,
    border: "1px solid #fca5a5",
};

const selectStyle: React.CSSProperties = {
    ...fieldStyle,
    appearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 12px center",
    paddingRight: "36px",
    cursor: "pointer",
};

const labelStyle: React.CSSProperties = {
    fontSize: "13px",
    fontWeight: 500,
    color: "#374151",
    marginBottom: "6px",
    display: "block",
};

const errorTextStyle: React.CSSProperties = {
    fontSize: "12px",
    color: "#ef4444",
    marginTop: "4px",
};

export function AppointmentForm({ existing }: AppointmentFormProps) {
    const { submit, loading, errors } = useAppointmentForm(existing);

    const [scheduledAt, setScheduledAt] = useState(
        existing?.scheduled_at
            ? new Date(existing.scheduled_at).toISOString().slice(0, 16)
            : ""
    );
    const [supplier, setSupplier] = useState(existing?.supplier ?? "");
    const [productLine, setProductLine] = useState(existing?.product_line ?? "");
    const [status, setStatus] = useState<AppointmentStatus>(
        existing?.status ?? "Programada"
    );
    const [deliveredAt, setDeliveredAt] = useState(
        existing?.delivered_at
            ? new Date(existing.delivered_at).toISOString().slice(0, 16)
            : ""
    );
    const [observations, setObservations] = useState(existing?.observations ?? "");

    const availableStatuses = existing
        ? [existing.status, ...STATUS_TRANSITIONS[existing.status as AppointmentStatus]]
        : ["Programada"];

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        const data: AppointmentFormData = {
            scheduled_at: new Date(scheduledAt).toISOString(),
            supplier,
            product_line: productLine,
            observations,
        };
        if (existing) data.status = status;
        if (status === "Entregada" && deliveredAt) {
            data.delivered_at = new Date(deliveredAt).toISOString();
        }
        await submit(data);
    }

    return (
        <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {errors.non_field_errors && (
                <div style={{
                    backgroundColor: "#fef2f2",
                    border: "1px solid #fecaca",
                    borderRadius: "12px",
                    padding: "12px 16px",
                }}>
                    <p style={{ fontSize: "14px", color: "#dc2626" }}>{errors.non_field_errors}</p>
                </div>
            )}

            {/* Grid fields */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }} className="form-grid">

                <div>
                    <label style={labelStyle}>
                        Scheduled Date & Time <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <input
                        type="datetime-local"
                        value={scheduledAt}
                        onChange={(e) => setScheduledAt(e.target.value)}
                        required
                        style={errors.scheduled_at ? fieldErrorStyle : fieldStyle}
                    />
                    {errors.scheduled_at && <p style={errorTextStyle}>{errors.scheduled_at}</p>}
                </div>

                <div>
                    <label style={labelStyle}>
                        Supplier <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <select
                        value={supplier}
                        onChange={(e) => setSupplier(e.target.value)}
                        required
                        style={errors.supplier ? { ...selectStyle, border: "1px solid #fca5a5" } : selectStyle}
                    >
                        <option value="">Select supplier</option>
                        {SUPPLIERS.map((s) => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                    </select>
                    {errors.supplier && <p style={errorTextStyle}>{errors.supplier}</p>}
                </div>

                <div>
                    <label style={labelStyle}>
                        Product Line <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <select
                        value={productLine}
                        onChange={(e) => setProductLine(e.target.value)}
                        required
                        style={errors.product_line ? { ...selectStyle, border: "1px solid #fca5a5" } : selectStyle}
                    >
                        <option value="">Select product line</option>
                        {PRODUCT_LINES.map((p) => (
                            <option key={p.value} value={p.value}>{p.label}</option>
                        ))}
                    </select>
                    {errors.product_line && <p style={errorTextStyle}>{errors.product_line}</p>}
                </div>

                {existing && (
                    <div>
                        <label style={labelStyle}>
                            Status <span style={{ color: "#ef4444" }}>*</span>
                        </label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value as AppointmentStatus)}
                            style={errors.status ? { ...selectStyle, border: "1px solid #fca5a5" } : selectStyle}
                        >
                            {availableStatuses.map((s) => (
                                <option key={s} value={s}>
                                    {STATUSES.find((st) => st.value === s)?.label ?? s}
                                </option>
                            ))}
                        </select>
                        {errors.status && <p style={errorTextStyle}>{errors.status}</p>}
                    </div>
                )}

                {status === "Entregada" && (
                    <div>
                        <label style={labelStyle}>
                            Delivered At <span style={{ color: "#ef4444" }}>*</span>
                        </label>
                        <input
                            type="datetime-local"
                            value={deliveredAt}
                            onChange={(e) => setDeliveredAt(e.target.value)}
                            required
                            style={errors.delivered_at ? fieldErrorStyle : fieldStyle}
                        />
                        {errors.delivered_at && <p style={errorTextStyle}>{errors.delivered_at}</p>}
                    </div>
                )}
            </div>

            {/* Observations */}
            <div>
                <label style={labelStyle}>Observations</label>
                <textarea
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    rows={4}
                    placeholder="Optional notes about this delivery..."
                    style={{ ...fieldStyle, resize: "vertical", lineHeight: "1.5" }}
                />
            </div>

            {/* Actions */}
            <div style={{
                display: "flex",
                gap: "12px",
                paddingTop: "8px",
                borderTop: "1px solid #f3f4f6",
                marginTop: "4px",
            }}>
                <button
                    type="button"
                    onClick={() => window.history.back()}
                    style={{
                        padding: "11px 24px",
                        borderRadius: "12px",
                        border: "1px solid #e5e7eb",
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#374151",
                        backgroundColor: "white",
                        cursor: "pointer",
                        fontFamily: "inherit",
                    }}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        flex: 1,
                        padding: "11px 24px",
                        borderRadius: "12px",
                        border: "none",
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "white",
                        backgroundColor: loading ? "#6b7280" : "#111827",
                        cursor: loading ? "not-allowed" : "pointer",
                        fontFamily: "inherit",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {loading ? "Saving..." : existing ? "Save Changes" : "Create Appointment"}
                </button>
            </div>

            <style>{`
        @media (max-width: 640px) {
          .form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
        </form>
    );
}
