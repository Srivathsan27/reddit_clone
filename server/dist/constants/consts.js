"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cookieName = exports.prod = exports.PORT = void 0;
exports.PORT = process.env.PORT || 4000;
exports.prod = process.env.NODE_ENV === "production";
exports.cookieName = "my-cookie";
