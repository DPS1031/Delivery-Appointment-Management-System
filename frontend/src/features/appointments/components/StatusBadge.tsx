import { AppointmentStatus } from "@/shared/types";

const config: Record<AppointmentStatus, { label: string; className: string }> = {
  Programada: { label: "Scheduled", className: "bg-blue-50 text-blue-700" },
  "En proceso": { label: "In Progress", className: "bg-amber-50 text-amber-700" },
  Entregada: { label: "Delivered", className: "bg-green-50 text-green-700" },
  Cancelada: { label: "Cancelled", className: "bg-red-50 text-red-700" },
};

export function StatusBadge({ status }: { status: AppointmentStatus }) {
  const { label, className } = config[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}
