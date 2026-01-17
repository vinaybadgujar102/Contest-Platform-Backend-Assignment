import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { BadRequestError } from "../utils/app.error";

export function schemaValidator(schema: z.ZodObject) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req);
      next();
    } catch (error) {
      throw new BadRequestError("INVALID_REQUEST");
    }
  };
}
