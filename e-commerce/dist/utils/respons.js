export const successResponse = (res, message, data = null, pagination = null, statusCode = 200) => {
    const out = { success: true, message };
    if (data !== null)
        out.data = data;
    if (pagination)
        out.pagination = pagination;
    return res.status(statusCode).json(out);
};
export const errorResponse = (res, message, statusCode = 400, errors = null) => {
    const out = { success: false, message };
    if (errors)
        out.errors = errors;
    return res.status(statusCode).json(out);
};
//# sourceMappingURL=respons.js.map