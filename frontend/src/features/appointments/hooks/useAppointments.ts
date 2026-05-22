"use client";

import { useState, useCallback } from "react";
import { getAppointments, cancelAppointment } from "../api";
import { Appointment, AppointmentFilters, PaginatedResponse } from "@/shared/types";

export function useAppointments() {
  const [data, setData] = useState<PaginatedResponse<Appointment> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async (filters: AppointmentFilters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getAppointments(filters);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  }, []);

  const cancel = useCallback(async (id: string): Promise<boolean> => {
    try {
      await cancelAppointment(id);
      return true;
    } catch {
      return false;
    }
  }, []);

  return { data, loading, error, fetch, cancel };
}
