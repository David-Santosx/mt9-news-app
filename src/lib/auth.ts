import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { betterAuth } from "better-auth";
import { prisma } from "./prisma";

const client = prisma;

export const auth = betterAuth({
  database: prismaAdapter(client, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  appName: "MT9 Notícias e Comércios",
  plugins: [admin(), nextCookies()],
});
