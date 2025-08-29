import 'dotenv/config';  
import { betterAuth } from "better-auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const auth = betterAuth({
  baseURL: "http://localhost:3001",
  database: {
    provider: "postgresql",
    url: process.env.DATABASE_URL,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      redirectURI: "http://localhost:5173", // 重定向到前端
      scope: ["openid", "email", "profile"], // 确保获取头像信息
    },
  },
  trustedOrigins: ["http://localhost:5173"],
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 24 hours
  },
});

