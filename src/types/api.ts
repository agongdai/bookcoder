import { NextResponse } from 'next/server';

export enum HttpMethod {
  Get = 'get',
  Post = 'post',
  Put = 'put',
  Delete = 'delete',
  Patch = 'patch',
}

export type HttpHeaders = Record<string, string | number | Date>;

export enum HttpStatusCode {
  Ok = 200,
  Created = 201,
  AlreadyReported = 208,
  Redirect = 300,
  PreconditionFailed = 412,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  NotAcceptable = 406,
  Conflict = 409,
  UnprocessableEntity = 422,
  TooManyRequests = 429,
  InternalServerError = 500,
}

export type Endpoint = {
  path: string;
  apiPath?: string;
  method?: HttpMethod;
  payload?: any;
};

export type ApiRequest = {
  endpoint: Endpoint;
  method: HttpMethod;
  params?: Record<string, string | number | Date>;
  headers?: Record<string, string>;
};

export type ApiResponse<T> = {
  status?: number;
  message?: string;
  success: boolean;
  headers?: HttpHeaders;
  data?: T | null;
};

export type ApiHandler<T> = (
  req: Request
) => Promise<NextResponse<ApiResponse<T>>>;

export type AnyPrismaModel = any; // @todo replace any with the actual prisma model type
