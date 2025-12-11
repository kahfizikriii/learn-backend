import { errorResponse } from "../utils/respons";
export const errorHandler = (err, _req, res, _next) => {
    console.error("ERROR:", err.message);
    errorResponse(res, err.message, 400);
};
//# sourceMappingURL=error.handlers.js.map