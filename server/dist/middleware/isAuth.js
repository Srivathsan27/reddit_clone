"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
const isAuth = ({ context: { req } }, next) => {
    if (req.session.userId) {
        return next();
    }
    else {
        throw new Error("User not authorized!");
    }
};
exports.isAuth = isAuth;
