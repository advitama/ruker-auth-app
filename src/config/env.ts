import { z } from "zod";
import { createEnv } from "@t3-oss/env-nextjs";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    SENTRY_ORG: z.string(),
    SENTRY_URL: z.string(),
    SENTRY_PROJECT: z.string(),
    SENTRY_AUTH_TOKEN: z.string(),
  },
  client: {
    NEXT_PUBLIC_SENTRY_DSN: z.string(),
    NEXT_PUBLIC_POSTHOG_KEY: z.string(),
    NEXT_PUBLIC_POSTHOG_HOST: z.string(),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    SENTRY_ORG: process.env.SENTRY_ORG,
    SENTRY_URL: process.env.SENTRY_URL,
    SENTRY_PROJECT: process.env.SENTRY_PROJECT,
    SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  },
});
