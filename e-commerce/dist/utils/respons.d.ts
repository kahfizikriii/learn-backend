import type { Response } from "express";
export interface ApiResponse {
    success: boolean;
    message: string;
    data?: unknown;
    pagination?: {
        page: number;
        limit: number;
        total: number;
    };
    errors?: Array<{
        field: string;
        message: string;
    }> | {
        stack?: string;
    };
}
export declare const successResponse: (res: Response, message: string, data?: unknown, pagination?: any, statusCode?: number) => Response<any, Record<string, any>>;
export declare const errorResponse: (res: Response, message: string, statusCode?: number, errors?: any) => Response<any, Record<string, any>>;
//# sourceMappingURL=respons.d.ts.map