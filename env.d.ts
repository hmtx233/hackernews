import {
  CfProperties,
  Request,
  ExecutionContext,
  KVNamespace,
} from "@cloudflare/workers-types";

declare module "h3" {
  interface H3EventContext {
    cf: CfProperties;
    cloudflare: {
      request: Request;
      env: {
        TX_SECRET_ID: string;
        TX_SECRET_KEY: string;
      };
      context: ExecutionContext;
    };
  }
}