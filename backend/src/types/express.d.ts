import type { AuthPayload } from "../utils/jwt.utils";

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}
