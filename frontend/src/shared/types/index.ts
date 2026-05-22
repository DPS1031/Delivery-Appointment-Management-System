export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
  user: User;
}

export type AppointmentStatus =
  | "Programada"
  | "En proceso"
  | "Entregada"
  | "Cancelada";

export type Supplier = "A" | "B" | "C";

export type ProductLine =
  | "Camisetas"
  | "Pantalones"
  | "Zapatos"
  | "Accesorios";

export interface Appointment {
  id: string;
  scheduled_at: string;
  supplier: Supplier;
  product_line: ProductLine;
  status: AppointmentStatus;
  delivered_at: string | null;
  observations: string;
  created_by: number;
  created_by_username: string;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface AppointmentFilters {
  status?: AppointmentStatus | "";
  supplier?: Supplier | "";
  product_line?: ProductLine | "";
  scheduled_at_after?: string;
  scheduled_at_before?: string;
  page?: number;
}

export interface ReportResult {
  product_line: ProductLine;
  total_deliveries: number;
  avg_hours: number;
  avg_minutes: number;
}

export interface ReportResponse {
  date_from: string;
  date_to: string;
  results: ReportResult[];
}

export interface DashboardSummary {
  total: number;
  by_status: Record<AppointmentStatus, number>;
  today: number;
}
