import { createAuthClient } from "better-auth/react";
import type { auth } from "./auth.js";
import { inferAdditionalFields, adminClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL as string,
  plugins: [inferAdditionalFields<typeof auth>(), adminClient()],
});
