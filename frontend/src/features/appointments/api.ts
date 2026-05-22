import { getAccessToken, refreshAccessToken, clearTokens } from "@/features/auth/api";
import {
  Appointment,
  AppointmentFilters,
  DashboardSummary,
  PaginatedResponse,
  ReportResponse,
} from "@/shared/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

async function authFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  let token = getAccessToken();

  const makeRequest = (t: string): Promise<Response> =>
    fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${t}`,
        ...(options.headers as Record<string, string>),
      },
    });

  let response = await makeRequest(token ?? "");

  if (response.status === 401) {
    const newToken = await refreshAccessToken();
    if (!newToken) {
      clearTokens();
      window.location.href = "/login";
      throw new Error("Session expired");
    }
    response = await makeRequest(newToken);
  }

  return response;
}

export async function getAppointments(
  filters: AppointmentFilters = {}
): Promise<PaginatedResponse<Appointment>> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.append(key, String(value));
    }
  });

  const response = await authFetch(
    `${API_URL}/appointments/?${params.toString()}`
  );
  if (!response.ok) throw new Error("Failed to fetch appointments");
  return response.json() as Promise<PaginatedResponse<Appointment>>;
}

export async function getAppointment(id: string): Promise<Appointment> {
  const response = await authFetch(`${API_URL}/appointments/${id}/`);
  if (!response.ok) throw new Error("Appointment not found");
  return response.json() as Promise<Appointment>;
}

export async function createAppointment(
  data: Partial<Appointment>
): Promise<Appointment> {
  const response = await authFetch(`${API_URL}/appointments/`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw error;
  }
  return response.json() as Promise<Appointment>;
}

export async function updateAppointment(
  id: string,
  data: Partial<Appointment>
): Promise<Appointment> {
  const response = await authFetch(`${API_URL}/appointments/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw error;
  }
  return response.json() as Promise<Appointment>;
}

export async function cancelAppointment(id: string): Promise<void> {
  const response = await authFetch(`${API_URL}/appointments/${id}/`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const error = await response.json();
    throw error;
  }
}

export async function getDashboard(): Promise<DashboardSummary> {
  const response = await authFetch(`${API_URL}/appointments/dashboard/`);
  if (!response.ok) throw new Error("Failed to fetch dashboard");
  return response.json() as Promise<DashboardSummary>;
}

export async function getReport(
  dateFrom: string,
  dateTo: string
): Promise<ReportResponse> {
  const response = await authFetch(
    `${API_URL}/appointments/report/?date_from=${dateFrom}&date_to=${dateTo}`
  );
  if (!response.ok) throw new Error("Failed to fetch report");
  return response.json() as Promise<ReportResponse>;
}
