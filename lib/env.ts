function readVar(key: string, required = true): string {
  const value = process.env[key];
  if (required && (!value || value.trim().length === 0)) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value ?? "";
}

export const env = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  supabaseUrl: readVar("NEXT_PUBLIC_SUPABASE_URL", false),
  supabaseAnonKey: readVar("NEXT_PUBLIC_SUPABASE_ANON_KEY", false),
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
};
