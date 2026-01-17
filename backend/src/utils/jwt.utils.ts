import jwt from "jsonwebtoken";
import type { UserRoleType } from "../types/UserRoles.type";

export type AuthPayload = {
  userId: number;
  role: UserRoleType;
};

export const verifyToken = (token: string): AuthPayload => {
  const decoded = jwt.verify(token, "secret") as AuthPayload;
  return decoded;
};

export const generateToken = (payload: AuthPayload) => {
  try {
    const token = jwt.sign(payload, "secret");
    return token;
  } catch (error) {
    throw new Error();
  }
};
