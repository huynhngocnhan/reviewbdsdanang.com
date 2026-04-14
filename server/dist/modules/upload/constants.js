"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.R2_OBJECT_CACHE_CONTROL = void 0;
/** Stored on R2 objects; browsers and Cloudflare can cache aggressively (new UUID per upload → safe with immutable). */
exports.R2_OBJECT_CACHE_CONTROL = "public, max-age=31536000, immutable";
