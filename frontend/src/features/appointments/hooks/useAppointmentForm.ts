"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAppointment, updateAppointment } from "../api";
import { Appointment } from "@/shared/types";

export interface AppointmentFormData {
  scheduled_at: string;
  supplier: string;
  product_line: string;
  status?: string;
  delivered_at?: string;
  observations?: string;
}

export interface FormErrors {
  scheduled_at?: string;
  supplier?: string;
  product_line?: string;
  status?: string;
  delivered_at?: string;
  observations?: string;
  non_field_errors?: string;
}

export function useAppointmentForm(existing?: Appointment) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  function parseApiErrors(error: unknown): FormErrors {
    if (typeof error === "object" && error !== null) {
      const e = error as Record<string, unknown>;
      const result: FormErrors = {};
      Object.entries(e).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          (result as Record<string, string>)[key] = value.join(" ");
        } else if (typeof value === "string") {
          (result as Record<string, string>)[key] = value;
        }
      });
      return result;
    }
    return { non_field_errors: "An unexpected error occurred" };
  }

  async function submit(data: AppointmentFormData): Promise<void> {
    setLoading(true);
    setErrors({});
    try {
      if (existing) {
        await updateAppointment(existing.id, data as Partial<Appointment>);
      } else {
        await createAppointment(data as Partial<Appointment>);
      }
      router.push("/appointments");
    } catch (err) {
      setErrors(parseApiErrors(err));
    } finally {
      setLoading(false);
    }
  }

  return { submit, loading, errors };
}
