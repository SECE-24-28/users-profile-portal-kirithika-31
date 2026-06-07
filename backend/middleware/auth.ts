import jwt from "jsonwebtoken";

export interface JwtPayload {
  id: number;
  email: string;
  role: string;
}

export const verifyToken = (
  token: string
): JwtPayload | null => {
  try {
    return jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload;
  } catch {
    return null;
  }
};