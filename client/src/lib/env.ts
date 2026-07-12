import { z } from "zod";

/**
 * Runtime-validated environment variables.
 *
 * Only `VITE_`-prefixed variables are exposed to the client by Vite, and every
 * value here ships in the bundle — never put secrets in these variables.
 *
 * Importing this module validates the environment once at boot and fails fast
 * with a clear message if something required is missing or malformed.
 */
const envSchema = z.object({
  /** Base URL of the Django REST API, without a trailing slash. */
  VITE_API_URL: z.string().url(),
  /** Environment label used for conditional behavior / logging. */
  VITE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

const parsed = envSchema.safeParse(import.meta.env);

if (!parsed.success) {
  console.error(
    "Invalid environment variables:",
    parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`),
  );
  throw new Error(
    "Invalid or missing environment variables. Copy client/.env.example to client/.env.local and fill in the values.",
  );
}

export const env = parsed.data;
