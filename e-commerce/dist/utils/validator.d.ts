import { type ValidationChain } from "express-validator";
import type { Request, Response, NextFunction } from "express";
export declare const validate: (rules: ValidationChain[]) => (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
//# sourceMappingURL=validator.d.ts.map