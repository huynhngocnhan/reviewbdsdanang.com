import type { Request } from "express";

/** Express 5 types `req.params` values as `string | string[]`. */
export function routeParamString(req: Request, key: string): string | undefined {
  const v = req.params[key];
  if (v === undefined) return undefined;
  return Array.isArray(v) ? v[0] : v;
}
