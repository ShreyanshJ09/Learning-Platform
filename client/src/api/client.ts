import axios from "axios";

import { env } from "@/lib/env";

/**
 * Shared Axios instance for all API modules (`auth.api.ts`, `courses.api.ts`, …).
 *
 * JWT attach/refresh interceptors are added in Phase 2 — keep this shell transport-only.
 */
export const apiClient = axios.create({
  baseURL: env.VITE_API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  // Auth is Bearer JWT in headers, not cookie sessions.
  withCredentials: false,
  timeout: 30_000,
});
