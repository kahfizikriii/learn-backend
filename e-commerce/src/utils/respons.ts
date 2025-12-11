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
  }> | { stack?: string };
}

export const successResponse = (
  res: Response,
  message: string,
  data: unknown = null,
  pagination: any = null,
  statusCode: number = 200
) => {
  const out: any = { success: true, message };
  if (data !== null) out.data = data;
  if (pagination) out.pagination = pagination;
  return res.status(statusCode).json(out);
};

export const errorResponse = (
  res: Response,
  message: string,
  statusCode: number = 400,
  errors: any = null
) => {
  const out: any = { success: false, message };
  if (errors) out.errors = errors;
  return res.status(statusCode).json(out);
};