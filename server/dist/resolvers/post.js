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
exports.PostResolver = void 0;
const type_graphql_1 = require("type-graphql");
const Post_1 = require("../entities/Post");
let PostError = class PostError {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], PostError.prototype, "field", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], PostError.prototype, "message", void 0);
PostError = __decorate([
    (0, type_graphql_1.ObjectType)()
], PostError);
let PostsResponse = class PostsResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [Post_1.Post], { nullable: true }),
    __metadata("design:type", Array)
], PostsResponse.prototype, "posts", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], PostsResponse.prototype, "numberOfPosts", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", PostError)
], PostsResponse.prototype, "errors", void 0);
PostsResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], PostsResponse);
let PostResponse = class PostResponse {
};
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Post_1.Post)
], PostResponse.prototype, "post", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", PostError)
], PostResponse.prototype, "errors", void 0);
PostResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], PostResponse);
let PostInput = class PostInput {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], PostInput.prototype, "title", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], PostInput.prototype, "content", void 0);
PostInput = __decorate([
    (0, type_graphql_1.InputType)()
], PostInput);
let PostResolver = class PostResolver {
    posts({ em }) {
        return __awaiter(this, void 0, void 0, function* () {
            const [posts, numberOfPosts] = yield em.findAndCount(Post_1.Post, {});
            if (posts.length === 0) {
                return {
                    errors: {
                        field: "Posts",
                        message: "No Posts Found!",
                    },
                };
            }
            return {
                posts,
                numberOfPosts,
            };
        });
    }
    post({ em }, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield em.findOne(Post_1.Post, { id });
            if (!post) {
                return {
                    errors: {
                        field: "ID",
                        message: "The Post does not exist!",
                    },
                };
            }
            return {
                post: post,
            };
        });
    }
    newPost({ em }, input) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = em.create(Post_1.Post, {
                title: input.title,
                content: input.content,
            });
            try {
                yield em.persistAndFlush(post);
            }
            catch (error) {
                console.log(error);
                return {
                    errors: {
                        field: "Post",
                        message: "Could not create post",
                    },
                };
            }
            return { post };
        });
    }
    updatePost({ em }, id, input) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield em.findOne(Post_1.Post, { id });
            if (!post) {
                return {
                    errors: {
                        field: "ID",
                        message: "The Post Does Not Exist!",
                    },
                };
            }
            post.content = input.content;
            post.title = input.title;
            yield em.persistAndFlush(post);
            return {
                post: post,
            };
        });
    }
    delete({ em }, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield em.findOne(Post_1.Post, { id });
            if (!post) {
                return {
                    errors: {
                        field: "ID",
                        message: "The Post Does Not Exist!",
                    },
                };
            }
            yield em.nativeDelete(Post_1.Post, { id });
            return {
                post: post,
            };
        });
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => PostsResponse),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "posts", null);
__decorate([
    (0, type_graphql_1.Query)(() => PostResponse),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "post", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => PostResponse),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("input", () => PostInput)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, PostInput]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "newPost", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => PostResponse),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("id")),
    __param(2, (0, type_graphql_1.Arg)("input", () => PostInput)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, PostInput]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "updatePost", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => PostResponse),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "delete", null);
PostResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], PostResolver);
exports.PostResolver = PostResolver;
