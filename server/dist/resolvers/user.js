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
let FieldError = class FieldError {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], FieldError.prototype, "field", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], FieldError.prototype, "message", void 0);
FieldError = __decorate([
    (0, type_graphql_1.ObjectType)()
], FieldError);
let UserResponse = class UserResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [FieldError], { nullable: true }),
    __metadata("design:type", Array)
], UserResponse.prototype, "errors", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => User_1.User, { nullable: true }),
    __metadata("design:type", User_1.User)
], UserResponse.prototype, "user", void 0);
UserResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], UserResponse);
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
};
__decorate([
    (0, type_graphql_1.Query)(() => [User_1.User]),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "users", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("input", () => userPassInput_1.UserPassInput)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, userPassInput_1.UserPassInput]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserResponse),
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
UserResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], UserResolver);
exports.UserResolver = UserResolver;
