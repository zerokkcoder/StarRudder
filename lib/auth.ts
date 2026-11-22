import { compare } from "bcryptjs";
import { eq } from "drizzle-orm";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { db, schema } from "../db";

const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET ?? "star-rudder-dev-secret",
);
export const SESSION_COOKIE = "star_session";

export async function verifyCredentials(email: string, password: string) {
  const [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, email.toLowerCase()))
    .limit(1);
  if (!user) return false;
  return compare(password, user.passwordHash);
}

export async function createSession(email: string) {
  return new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);
}

export async function getSession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return typeof payload.email === "string" ? payload.email : null;
  } catch {
    return null;
  }
}
