import type { NextFunction, Request, Response } from "express";
import { errorResponse } from "../utils/respons";

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("ERROR:", err.message);
  errorResponse(res, err.message, 400);
};