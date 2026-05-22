import { AppointmentStatus, ProductLine, Supplier } from "../types";

export const SUPPLIERS: { value: Supplier; label: string }[] = [
  { value: "A", label: "Supplier A" },
  { value: "B", label: "Supplier B" },
  { value: "C", label: "Supplier C" },
];

export const PRODUCT_LINES: { value: ProductLine; label: string }[] = [
  { value: "Camisetas", label: "Shirts" },
  { value: "Pantalones", label: "Pants" },
  { value: "Zapatos", label: "Shoes" },
  { value: "Accesorios", label: "Accessories" },
];

export const STATUSES: { value: AppointmentStatus; label: string }[] = [
  { value: "Programada", label: "Scheduled" },
  { value: "En proceso", label: "In Progress" },
  { value: "Entregada", label: "Delivered" },
  { value: "Cancelada", label: "Cancelled" },
];

export const STATUS_TRANSITIONS: Record<AppointmentStatus, AppointmentStatus[]> = {
  Programada: ["En proceso", "Cancelada"],
  "En proceso": ["Entregada", "Cancelada"],
  Entregada: [],
  Cancelada: [],
};
