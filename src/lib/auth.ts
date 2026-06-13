import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// funkcje do korzystani z webtokenów

const JWT_SECRET = process.env.JWT_SECRET!;

// czasy wygasania dla odpowiednich tokenów
const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";

// haszowanie hasła
export const hashPassword = (password: string) => bcrypt.hash(password, 12);

export const comparePassword = (password: string, hash: string) =>
  bcrypt.compare(password, hash);

export const signAccessToken = (userId: string) =>
  jwt.sign({ userId }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });

export const signRefreshToken = (userId: string) =>
  jwt.sign({ userId }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });

export const verifyToken = (token: string): { userId: string } | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch {
    return null;
  }
};
