"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeParamString = routeParamString;
/** Express 5 types `req.params` values as `string | string[]`. */
function routeParamString(req, key) {
    const v = req.params[key];
    if (v === undefined)
        return undefined;
    return Array.isArray(v) ? v[0] : v;
}
