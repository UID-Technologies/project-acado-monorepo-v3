declare module 'express-request-id' {
  import { RequestHandler } from 'express';
  
  interface Options {
    uuidVersion?: 'v1' | 'v4';
    setHeader?: boolean;
    headerName?: string;
    attributeName?: string;
    buffer?: Buffer;
    offset?: number;
  }
  
  function requestId(options?: Options): RequestHandler;
  export = requestId;
}