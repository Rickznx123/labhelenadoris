import { createBrowserClient } from "@supabase/ssr";
import { env } from "@/lib/env";

export function createClient() {
  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    if (typeof window === "undefined") {
      return null as never;
    }
    throw new Error("Missing Supabase public credentials.");
  }

  return createBrowserClient(env.supabaseUrl, env.supabaseAnonKey);
}
