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
// import {  } from 'typeorm'
const express_session_1 = require("express-session");
const consts_1 = require("../constants/consts");
const sendEmail_1 = require("../utils/sendEmail");
const uuid_1 = require("uuid");
const token_1 = require("../store/PasswordChange/token");
const mongoose_1 = require("mongoose");
const isValidEmail_1 = require("../utils/isValidEmail");
const UserResponse_1 = require("../ObjectTypes/UserResponse");
const BooleanResponse_1 = require("../ObjectTypes/BooleanResponse");
const isUsernamePasswordValid_1 = require("../utils/isUsernamePasswordValid");
const typeorm_1 = require("typeorm");
const isAuth_1 = require("../middleware/isAuth");
const UserProfile_1 = require("../entities/UserProfile");
const ProfileResponse_1 = require("../ObjectTypes/ProfileResponse");
const ProfileInput_1 = require("../InputTypes/ProfileInput");
let UserResolver = class UserResolver {
    email(user, { req }) {
        if (req.session.userId === user.id) {
            return user.email;
        }
        else {
            return "";
        }
    }
    users() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User_1.User.find();
        });
    }
    register({ req }, input) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, isUsernamePasswordValid_1.isUsernamePasswordValid)(input);
            if (errors.length > 0) {
                return { errors };
            }
            const hashedPassword = yield argon2_1.default.hash(input.password);
            let user;
            try {
                user = yield User_1.User.create({
                    username: input.username,
                    password: hashedPassword,
                    email: input.email,
                }).save();
                yield UserProfile_1.UserProfile.create({
                    userId: user.id,
                }).save();
                req.session.userId = user.id;
                req.session.cookie = new express_session_1.Cookie();
                return {
                    user,
                };
            }
            catch (err) {
                if (err instanceof typeorm_1.QueryFailedError &&
                    err.message.includes("duplicate key value")) {
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
            return {
                errors: [
                    {
                        field: "unknown",
                        message: "Oops, Something went wrong!",
                    },
                ],
            };
        });
    }
    login({ req }, input) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.User.findOne({ where: { username: input.username } });
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
    me({ req }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.session.userId) {
                return undefined;
            }
            return yield User_1.User.findOne(req.session.userId);
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
    forgotPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, isValidEmail_1.isValidEmail)(email)) {
                console.log("invalid email");
                return false;
            }
            const user = yield User_1.User.findOne({ where: { email } });
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
            const html = `You can proceed with changing the password using the link provided below <br> <a href="http://localhost:3000/change-password/${id}">Change Password</a> <br> The link is valid for 3 hours from now, please change password before it expires, if expired, please regenerate the link by cliking <a href="http://localhost:3000/forgot-password">here</a>`;
            yield (0, sendEmail_1.sendEmail)(email, html, "Forgot Password Request");
            return true;
        });
    }
    changePassword({ req }, password, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, isUsernamePasswordValid_1.isPasswordValid)(password);
            if (errors.length > 0) {
                return {
                    errors,
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
            const user = yield User_1.User.findOne(id);
            const hasedNewPassword = yield argon2_1.default.hash(password);
            if (user) {
                yield User_1.User.update({ id }, { password: hasedNewPassword });
                // await authToken.delete();
                req.session.userId = user.id;
                req.session.cookie = new express_session_1.Cookie();
                return { user };
            }
            else {
                return null;
            }
        });
    }
    resetPassword({ req }, currentPassword, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.User.findOne(req.session.userId);
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
                console.log("error!");
                return {
                    errors: [
                        {
                            field: "currentPassword",
                            message: "Incorrect Password!",
                        },
                    ],
                };
            }
            const errors = (0, isUsernamePasswordValid_1.isPasswordValid)(newPassword);
            if (errors.length > 0) {
                console.log("is it here?");
                console.log(errors);
                return {
                    errors,
                };
            }
            const hashedPassword = yield argon2_1.default.hash(newPassword);
            const updateResult = yield User_1.User.update({ id: req.session.userId }, { password: hashedPassword });
            console.log(updateResult);
            return {
                status: true,
            };
        });
    }
    profile(id, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User_1.User.findOne(id, { relations: ["profile"] });
                if (!user) {
                    return {
                        errors: [
                            {
                                field: "id",
                                message: "the user does not exist!",
                            },
                        ],
                    };
                }
                return {
                    user: user,
                };
            }
            catch (err) {
                console.log(err);
                return {
                    errors: [
                        {
                            field: "id",
                            message: "the user does not exist!",
                        },
                    ],
                };
            }
        });
    }
    updateProfile(userId, input, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId: currentUser } = req.session;
            const profile = yield UserProfile_1.UserProfile.findOne(userId);
            if (!profile) {
                return {
                    error: {
                        field: "id",
                        message: "the user does not exist",
                    },
                };
            }
            if (profile.userId !== currentUser) {
                return {
                    error: {
                        field: "current user",
                        message: "user not authorized",
                    },
                };
            }
            yield UserProfile_1.UserProfile.update({ userId: userId }, {
                bio: input.bio ? input.bio : "",
                name: input.name ? input.name : "",
                sex: input.sex ? input.sex : "",
            });
            profile.bio = input.bio ? input.bio : "";
            profile.name = input.name ? input.name : "";
            profile.sex = input.sex ? input.sex : "";
            return {
                profile,
            };
        });
    }
};
__decorate([
    (0, type_graphql_1.FieldResolver)(),
    __param(0, (0, type_graphql_1.Root)()),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User_1.User, Object]),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "email", null);
__decorate([
    (0, type_graphql_1.Query)(() => [User_1.User]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
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
    __param(0, (0, type_graphql_1.Arg)("email")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
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
__decorate([
    (0, type_graphql_1.Query)(() => UserResponse_1.UserResponse),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("id", () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "profile", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => ProfileResponse_1.ProfileResponse),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("id", () => type_graphql_1.Int)),
    __param(1, (0, type_graphql_1.Arg)("input", () => ProfileInput_1.ProfileInput)),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, ProfileInput_1.ProfileInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "updateProfile", null);
UserResolver = __decorate([
    (0, type_graphql_1.Resolver)(() => User_1.User)
], UserResolver);
exports.UserResolver = UserResolver;
