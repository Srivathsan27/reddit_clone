"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = void 0;
const mongoose_1 = require("mongoose");
const TokenSchema = new mongoose_1.Schema({
    token: { type: String, required: true },
    userId: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now, expires: 30 },
});
exports.Token = (0, mongoose_1.model)("token", TokenSchema);
