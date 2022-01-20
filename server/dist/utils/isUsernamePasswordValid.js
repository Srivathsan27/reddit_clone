"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUsernamePasswordValid = exports.isPasswordValid = exports.isUsernameValid = void 0;
const isUsernameValid = (username) => {
    const errors = [];
    if (username.length < 3) {
        errors.push({
            field: "username",
            message: "The length of the username must be greater than 2",
        });
    }
    return errors;
};
exports.isUsernameValid = isUsernameValid;
const isPasswordValid = (password) => {
    const errors = [];
    if (password.length < 3) {
        errors.push({
            field: "password",
            message: "The length of the password must be greater than 2",
        });
    }
    return errors;
};
exports.isPasswordValid = isPasswordValid;
const isUsernamePasswordValid = (input) => {
    const errors = [];
    if (input.username.length < 3) {
        errors.push({
            field: "username",
            message: "The length of the username must be greater than 2",
        });
    }
    if (input.password.length < 3) {
        errors.push({
            field: "password",
            message: "The length of the password must be greater than 2",
        });
    }
    return errors;
};
exports.isUsernamePasswordValid = isUsernamePasswordValid;
