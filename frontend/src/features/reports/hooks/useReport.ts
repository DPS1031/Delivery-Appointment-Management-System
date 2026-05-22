"use client";

import { useState } from "react";
import { getReport } from "@/features/appointments/api";
import { ReportResponse } from "@/shared/types";

export function useReport() {
  const [data, setData] = useState<ReportResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetch(dateFrom: string, dateTo: string): Promise<void> {
    setLoading(true);
    setError(null);
    try {
      const result = await getReport(dateFrom, dateTo);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load report");
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, error, fetch };
}
