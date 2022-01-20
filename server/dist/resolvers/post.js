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
const PostInput_1 = require("../InputTypes/PostInput");
const PostResponse_1 = require("../ObjectTypes/PostResponse");
const PostsResponse_1 = require("../ObjectTypes/PostsResponse");
const BooleanResponse_1 = require("../ObjectTypes/BooleanResponse");
let PostResolver = class PostResolver {
    posts() {
        return __awaiter(this, void 0, void 0, function* () {
            const posts = yield Post_1.Post.find();
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
                numberOfPosts: posts.length,
            };
        });
    }
    post(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield Post_1.Post.findOne(id);
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
    newPost(input) {
        return __awaiter(this, void 0, void 0, function* () {
            let post;
            try {
                post = yield Post_1.Post.create({
                    title: input.title,
                    content: input.content,
                }).save();
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
    updatePost(id, input) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield Post_1.Post.findOne(id);
            if (!post) {
                return {
                    errors: {
                        field: "ID",
                        message: "The Post Does Not Exist!",
                    },
                };
            }
            post.title = input.title;
            post.content = input.content;
            yield Post_1.Post.update({ id }, { title: input.title, content: input.content });
            return {
                post: post,
            };
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleteResult = yield Post_1.Post.delete(id);
                if (deleteResult.affected) {
                    return {
                        status: true,
                    };
                }
            }
            catch (err) {
                return {
                    errors: [
                        {
                            field: "id",
                            message: "Oops, Could not delete post!",
                        },
                    ],
                };
            }
            return {
                status: false,
                errors: [
                    {
                        field: "id",
                        message: "Oops, Could not delete post!",
                    },
                ],
            };
        });
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => PostsResponse_1.PostsResponse),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "posts", null);
__decorate([
    (0, type_graphql_1.Query)(() => PostResponse_1.PostResponse),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "post", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => PostResponse_1.PostResponse),
    __param(0, (0, type_graphql_1.Arg)("input", () => PostInput_1.PostInput)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PostInput_1.PostInput]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "newPost", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => PostResponse_1.PostResponse),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __param(1, (0, type_graphql_1.Arg)("input", () => PostInput_1.PostInput)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, PostInput_1.PostInput]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "updatePost", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => BooleanResponse_1.BooleanResponse),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "delete", null);
PostResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], PostResolver);
exports.PostResolver = PostResolver;
