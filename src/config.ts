import { HttpStatusCode } from '@/types/api';

export const IS_PROD: boolean = process.env.NODE_ENV === 'production';

export const MOBILE_QUERY: string = '(max-width: 768px)';

export const WSS_URL: string = 'wss://api.binance.com/ws/btcusdt@bookTicker';

export const WSS_CONNECTION_TRY_TIMES: number = 5;

export const HttpStatusMessage: Record<HttpStatusCode, string> = {
  [HttpStatusCode.Ok]: 'Ok',
  [HttpStatusCode.Created]: 'Created',
  [HttpStatusCode.BadRequest]: 'Bad request',
  [HttpStatusCode.Unauthorized]: 'Unauthorized',
  [HttpStatusCode.NotFound]: 'Not found',
  [HttpStatusCode.InternalServerError]: 'Internal server error',
  [HttpStatusCode.Conflict]: 'Conflict',
  [HttpStatusCode.UnprocessableEntity]: 'Unprocessable entity',
  [HttpStatusCode.TooManyRequests]: 'Too many requests',
  [HttpStatusCode.AlreadyReported]: 'Already reported',
  [HttpStatusCode.Redirect]: 'Redirect',
  [HttpStatusCode.PreconditionFailed]: 'Precondition failed',
  [HttpStatusCode.NotAcceptable]: 'Not acceptable',
  [HttpStatusCode.Forbidden]: 'Forbidden',
};
