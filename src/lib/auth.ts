import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@/../.prisma/client";
import { admin } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { betterAuth } from "better-auth";

const client = new PrismaClient();

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
