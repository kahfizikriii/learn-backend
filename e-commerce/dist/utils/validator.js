import { validationResult } from "express-validator";
import { errorResponse } from "./respons";
export const validate = (rules) => {
    return async (req, res, next) => {
        await Promise.all(rules.map(r => r.run(req)));
        const errors = validationResult(req);
        if (errors.isEmpty())
            return next();
        return errorResponse(res, "Validasi gagal", 400, errors.array().map(err => ({
            field: err.type === "field" ? err.path : null,
            message: err.msg
        })));
    };
};
//# sourceMappingURL=validator.js.map