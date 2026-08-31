import "server-only";
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

const COOKIE_NAME = "momo_admin_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export type AdminRole = "owner" | "client";
export type AuthenticatedAdmin = { userId: string; role: AdminRole };

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET non configurato");
  return secret;
}

function sign(userId: string, expiresAt: number): string {
  return createHmac("sha256", getSecret())
    .update(`momo-admin:${userId}:${expiresAt}`)
    .digest("hex");
}

function buildToken(userId: string, expiresAt: number): string {
  return `${userId}.${expiresAt}.${sign(userId, expiresAt)}`;
}

function readToken(token: string): string | null {
  const [userId, expiresAtValue, signature, extra] = token.split(".");
  const expiresAt = Number(expiresAtValue);
  if (extra || !UUID_PATTERN.test(userId) || !signature || !Number.isFinite(expiresAt)) return null;
  if (Date.now() > expiresAt) return null;
  const expected = sign(userId, expiresAt);
  const suppliedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (suppliedBuffer.length !== expectedBuffer.length) return null;
  return timingSafeEqual(suppliedBuffer, expectedBuffer) ? userId : null;
}

function isAdminRole(value: unknown): value is AdminRole {
  return value === "owner" || value === "client";
}

async function getRoleForUser(userId: string): Promise<AdminRole | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data, error } = await supabase
    .from("admin_users")
    .select("role")
    .eq("user_id", userId)
    .maybeSingle();
  if (error || !isAdminRole(data?.role)) return null;
  return data.role;
}

export async function authenticateAdmin(email: string, password: string): Promise<AuthenticatedAdmin | null> {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey =
    process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey || !isSupabaseConfigured) return null;
  const authClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await authClient.auth.signInWithPassword({ email: email.trim(), password });
  if (error || !data.user) return null;
  const role = await getRoleForUser(data.user.id);
  return role ? { userId: data.user.id, role } : null;
}

export async function createAdminSession(userId: string): Promise<void> {
  if (!UUID_PATTERN.test(userId)) throw new Error("ID utente admin non valido");
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const store = await cookies();
  store.set(COOKIE_NAME, buildToken(userId, expiresAt), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(expiresAt),
  });
}

export async function clearAdminSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getAdminRole(): Promise<AdminRole | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const userId = readToken(token);
    return userId ? await getRoleForUser(userId) : null;
  } catch {
    return null;
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  return (await getAdminRole()) !== null;
}

export async function requireAdmin(): Promise<AdminRole> {
  const role = await getAdminRole();
  if (!role) redirect("/admin/login");
  return role;
}

export async function requireOwner(): Promise<void> {
  const role = await getAdminRole();
  if (!role) redirect("/admin/login");
  if (role !== "owner") redirect("/admin/client");
}
