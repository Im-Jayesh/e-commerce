import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface JWTPayload {
  uid: string;
  email: string;
  username: string;
  role: 'user' | 'admin';
  iat?: number;
  exp?: number;
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch {
    return null;
  }
}

export function extractTokenFromRequest(request: NextRequest): string | null {
  const cookieToken = request.cookies.get('auth-token')?.value;
  if (cookieToken) {
    return cookieToken;
  }

  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.slice(7);
}

export function getUserFromRequest(request: NextRequest): JWTPayload | null {
  console.log("=== AUTH X-RAY START ===");
  
  const token = extractTokenFromRequest(request);
  console.log("1. Token Extracted:", token ? "YES (hidden for security)" : "NO TOKEN FOUND");
  
  if (!token) return null;

  console.log("2. JWT Secret Exists:", !!process.env.JWT_SECRET);
  console.log("3. JWT Secret Length:", process.env.JWT_SECRET?.length);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JWTPayload;
    console.log("4. Token Verified Successfully for:", decoded.email);
    return decoded;
  } catch (error: any) {
    // THIS IS THE MONEY LINE. This will tell us exactly why it fails!
    console.error("4. JWT Verification FAILED:", error.message, error.name);
    return null;
  }
}
