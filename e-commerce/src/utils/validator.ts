import { validationResult, type ValidationChain } from "express-validator";
import { errorResponse } from "./respons";
import type { Request, Response, NextFunction } from "express";

export const validate = (rules: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(rules.map(r => r.run(req)));
    const errors = validationResult(req);

    if (errors.isEmpty()) return next();

    return errorResponse(
      res,
      "Validasi gagal",
      400,
      errors.array().map(err => ({
        field: err.type === "field" ? err.path : null,
        message: err.msg
      }))
    );
  };
};