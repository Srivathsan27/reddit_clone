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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentResolver = void 0;
const type_graphql_1 = require("type-graphql");
const Comment_1 = require("../entities/Comment");
const isAuth_1 = require("../middleware/isAuth");
let CommentResolver = class CommentResolver {
    user(comment, { userLoader }) {
        return userLoader.load(comment.userId);
    }
    postTitle(comment, { postTitleLoader }) {
        return __awaiter(this, void 0, void 0, function* () {
            return postTitleLoader.load(comment.postId);
        });
    }
    isOwnComment(comment, { req }) {
        if (req.session.userId) {
            return req.session.userId === comment.userId;
        }
        return false;
    }
    comments() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Comment_1.Comment.find({});
        });
    }
    myComments({ req }) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Comment_1.Comment.find({ where: { userId: req.session.userId } });
        });
    }
    userComments(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Comment_1.Comment.find({ where: { userId } });
        });
    }
    // Mutations:
    updateComment({ req }, postId, text) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Comment_1.Comment.update({ postId, userId: req.session.userId }, { text });
            }
            catch (err) {
                console.log(err);
                return "an error occurred!";
            }
            return text;
        });
    }
    deleteComment({ req }, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Comment_1.Comment.delete({ postId, userId: req.session.userId });
            }
            catch (err) {
                return false;
            }
            return true;
        });
    }
};
__decorate([
    (0, type_graphql_1.FieldResolver)(),
    __param(0, (0, type_graphql_1.Root)()),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Comment_1.Comment, Object]),
    __metadata("design:returntype", void 0)
], CommentResolver.prototype, "user", null);
__decorate([
    (0, type_graphql_1.FieldResolver)(),
    __param(0, (0, type_graphql_1.Root)()),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Comment_1.Comment, Object]),
    __metadata("design:returntype", Promise)
], CommentResolver.prototype, "postTitle", null);
__decorate([
    (0, type_graphql_1.FieldResolver)(),
    __param(0, (0, type_graphql_1.Root)()),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Comment_1.Comment, Object]),
    __metadata("design:returntype", Boolean)
], CommentResolver.prototype, "isOwnComment", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Comment_1.Comment]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CommentResolver.prototype, "comments", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Comment_1.Comment]),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommentResolver.prototype, "myComments", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Comment_1.Comment]),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)("id", () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CommentResolver.prototype, "userComments", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("post", () => type_graphql_1.Int)),
    __param(2, (0, type_graphql_1.Arg)("text")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, String]),
    __metadata("design:returntype", Promise)
], CommentResolver.prototype, "updateComment", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("post", () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], CommentResolver.prototype, "deleteComment", null);
CommentResolver = __decorate([
    (0, type_graphql_1.Resolver)(() => Comment_1.Comment)
], CommentResolver);
exports.CommentResolver = CommentResolver;
