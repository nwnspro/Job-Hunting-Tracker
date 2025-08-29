import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3001", // 后端服务器地址
});

export async function signInWithGoogle() {
  return authClient.signIn.social({
    provider: "google",
  });
}
