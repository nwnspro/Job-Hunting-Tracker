import 'dotenv/config';  
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  baseURL: "http://localhost:3001",
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  trustedOrigins: ["http://localhost:5173"],
});

