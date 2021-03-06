"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = void 0;
const type_graphql_1 = require("type-graphql");
const User_1 = require("../entities/User");
const userPassInput_1 = require("../InputTypes/userPassInput");
const argon2_1 = __importDefault(require("argon2"));
const core_1 = require("@mikro-orm/core");
const express_session_1 = require("express-session");
const consts_1 = require("../constants/consts");
const sendEmail_1 = require("../utils/sendEmail");
const uuid_1 = require("uuid");
const token_1 = require("../store/PasswordChange/token");
const mongoose_1 = require("mongoose");
const isValidEmail_1 = require("../utils/isValidEmail");
const UserResponse_1 = require("./ObjectTypes/UserResponse");
const BooleanResponse_1 = require("./ObjectTypes/BooleanResponse");
let UserResolver = class UserResolver {
    users({ em }) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield em.find(User_1.User, {});
            return users;
        });
    }
    register({ em, req }, input) {
        return __awaiter(this, void 0, void 0, function* () {
            if (input.username.length < 3) {
                return {
                    errors: [
                        {
                            field: "username",
                            message: "The username must be atleast 3 characters long",
                        },
                    ],
                };
            }
            if (input.password.length < 3) {
                return {
                    errors: [
                        {
                            field: "password",
                            message: "The password must be atleast 3 characters long",
                        },
                    ],
                };
            }
            const hashedPassword = yield argon2_1.default.hash(input.password);
            const user = em.create(User_1.User, {
                username: input.username,
                password: hashedPassword,
                email: input.email,
            });
            try {
                yield em.persistAndFlush(user);
            }
            catch (err) {
                if (err instanceof core_1.UniqueConstraintViolationException &&
                    err.code === "23505") {
                    return {
                        errors: [
                            {
                                field: "username",
                                message: "Username is already taken",
                            },
                        ],
                    };
                }
            }
            req.session.userId = user.id;
            req.session.cookie = new express_session_1.Cookie();
            return {
                user,
            };
        });
    }
    login({ em, req }, input) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield em.findOne(User_1.User, {
                username: input.username,
            });
            if (!user) {
                return {
                    errors: [
                        {
                            field: "username",
                            message: "The user does not exist",
                        },
                    ],
                };
            }
            if (!(yield argon2_1.default.verify(user.password, input.password))) {
                return {
                    errors: [
                        {
                            field: "password",
                            message: "Incorrect Password",
                        },
                    ],
                };
            }
            req.session.userId = user.id;
            req.session.cookie = new express_session_1.Cookie();
            return {
                user,
            };
        });
    }
    me({ em, req }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.session.userId) {
                return null;
            }
            return yield em.findOne(User_1.User, { id: req.session.userId });
        });
    }
    logout({ req, res }) {
        return new Promise((resolver) => req.session.destroy((err) => {
            if (err) {
                console.log(err);
                resolver(false);
            }
            else {
                res.clearCookie(consts_1.cookieName);
                resolver(true);
            }
        }));
    }
    forgotPassword({ em }, email) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, isValidEmail_1.isValidEmail)(email)) {
                console.log("invalid email");
                return false;
            }
            const user = yield em.findOne(User_1.User, { email });
            if (!user) {
                console.log("invalid user");
                return true;
            }
            yield (0, mongoose_1.connect)("mongodb://127.0.0.1:27017/change-password");
            let id = (0, uuid_1.v4)();
            const token = new token_1.Token({
                token: id,
                userId: user.id,
            });
            yield token.save();
            const html = `<a href="http://localhost:3000/change-password/${id}">Change Password</a>`;
            yield (0, sendEmail_1.sendEmail)(email, html, "Forgot Password Request");
            return true;
        });
    }
    changePassword({ em, req }, password, token) {
        return __awaiter(this, void 0, void 0, function* () {
            if (password.length < 3) {
                return {
                    errors: [
                        {
                            field: "password",
                            message: "Password must be atleast 3 characters long.",
                        },
                    ],
                };
            }
            const authToken = yield token_1.Token.findOne({ token: token })
                .select("token userId")
                .exec();
            if (!authToken) {
                return {
                    errors: [
                        {
                            field: "token",
                            message: "Invalid token. Token has expired!",
                        },
                    ],
                };
            }
            const id = authToken.userId;
            const user = yield em.findOne(User_1.User, { id });
            const hasedNewPassword = yield argon2_1.default.hash(password);
            if (user) {
                user.password = hasedNewPassword;
                yield em.persistAndFlush(user);
                req.session.userId = user.id;
                req.session.cookie = new express_session_1.Cookie();
                return { user };
            }
            else {
                return null;
            }
        });
    }
    resetPassword({ em, req }, currentPassword, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield em.findOne(User_1.User, { id: req.session.userId });
            if (!user) {
                return {
                    errors: [
                        {
                            field: "user",
                            message: "For some reason, we couldn't find your account! please contact us if you think this is a mistake!",
                        },
                    ],
                };
            }
            if (!(yield argon2_1.default.verify(user.password, currentPassword))) {
                return {
                    errors: [
                        {
                            field: "currentPassword",
                            message: "Incorrect Password!",
                        },
                    ],
                };
            }
            if (newPassword.length < 3) {
                return {
                    errors: [
                        {
                            field: "newPassword",
                            message: "The password must be atleast 3 characters long!",
                        },
                    ],
                };
            }
            const hashedPassword = yield argon2_1.default.hash(newPassword);
            user.password = hashedPassword;
            em.persistAndFlush(user);
            return {
                status: true,
            };
        });
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [User_1.User]),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "users", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse_1.UserResponse),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("input", () => userPassInput_1.UserPassInput)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, userPassInput_1.UserPassInput]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse_1.UserResponse),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("input", () => userPassInput_1.UserPassInput)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, userPassInput_1.UserPassInput]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
__decorate([
    (0, type_graphql_1.Query)(() => User_1.User, { nullable: true }),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "me", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "logout", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("email")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "forgotPassword", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse_1.UserResponse, { nullable: true }),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("password")),
    __param(2, (0, type_graphql_1.Arg)("token")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "changePassword", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => BooleanResponse_1.BooleanResponse),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("current")),
    __param(2, (0, type_graphql_1.Arg)("new")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "resetPassword", null);
UserResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], UserResolver);
exports.UserResolver = UserResolver;
