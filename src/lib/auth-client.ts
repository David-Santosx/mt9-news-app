import { createAuthClient } from "better-auth/react";
import type { auth } from "./auth.js";
import { inferAdditionalFields, adminClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000/",
  plugins: [inferAdditionalFields<typeof auth>(), adminClient()],
});
