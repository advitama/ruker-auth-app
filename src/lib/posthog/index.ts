import { PostHog } from "posthog-node";

export default function PostHogClient() {
  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!posthogKey) {
    throw new Error("NEXT_PUBLIC_POSTHOG_KEY is not defined.");
  }

  const posthogClient = new PostHog(posthogKey, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    flushAt: 1,
    flushInterval: 0,
  });
  return posthogClient;
}
