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
const isAuth_1 = require("../middleware/isAuth");
const typeorm_1 = require("typeorm");
const Hit_1 = require("../entities/Hit");
let PostResolver = class PostResolver {
    content(post) {
        if (post.content.length > 80) {
            return post.content.substring(0, 80);
        }
        return post.content;
    }
    hitPost({ req }, postId, hitValue) {
        return __awaiter(this, void 0, void 0, function* () {
            let value = [0, 1, -1].includes(hitValue) ? hitValue : 0;
            const { userId } = req.session;
            const hit = yield Hit_1.Hit.findOne({ where: { postId, userId } });
            if (hit) {
                let updateValue;
                yield (0, typeorm_1.getConnection)().transaction((tm) => __awaiter(this, void 0, void 0, function* () {
                    if (hit.hitValue === value) {
                        updateValue = -value;
                        yield tm.query(`delete from hit where "userId" = ${userId} and "postId" = ${postId};`);
                    }
                    else {
                        updateValue = 2 * value;
                        yield tm.query(`update hit set "hitValue" = ${value} where "userId" = ${userId} and "postId" = ${postId};`);
                    }
                    yield tm.query(`update post set "numberOfHits" = "numberOfHits" + ${updateValue} where id = ${postId};`);
                }));
            }
            else {
                (0, typeorm_1.getConnection)().transaction((tm) => __awaiter(this, void 0, void 0, function* () {
                    yield tm.query(`insert into hit("userId", "postId", "hitValue") values (${userId}, ${postId}, ${value});`);
                    yield tm.query(`update post set "numberOfHits" = "numberOfHits" + ${value} where id = ${postId};`);
                }));
            }
            // await getConnection().query(`
            // start transaction;
            // insert into hit("userId", "postId", "hitValue") values (${userId}, ${postId}, ${value});
            // update post set "numberOfHits" = "numberOfHits" + ${value} where id = ${postId};
            // commit;
            // `);
            return true;
        });
    }
    posts(limit, cursor, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            let cur = new Date();
            if (cursor) {
                cur = new Date(+cursor);
            }
            const realLimit = Math.min(50, limit);
            const testLimit = realLimit + 1;
            const { userId } = req.session;
            const posts = yield (0, typeorm_1.getConnection)().query(`
      select 
        p.*, 
        json_build_object(
          'id', u.id,
          'username', u.username,
          'email', u.email,
          'createdAt', u."createdAt", 
          'updatedAt', u."updatedAt" 
        ) as creator
        ,(select "hitValue" from hit h where h."userId" = $3  and h."postId" = p.id) "hitStatus"
      from post p
      inner join public.user u  on u.id = p."creatorId"
      where p."createdAt" < $1
      order by p."createdAt" DESC
      limit $2
    `, [cur, testLimit, userId]);
            console.log(posts);
            return {
                hasMorePosts: posts.length === testLimit,
                posts: posts.slice(0, realLimit).map((post) => (Object.assign(Object.assign({}, post), { hitStatus: [-1, 1].includes(post.hitStatus) ? post.hitStatus : 0, isOwnPost: userId === post.creatorId }))),
            };
        });
    }
    post(id, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.session;
            try {
                const post = yield (0, typeorm_1.getConnection)().query(`
        select 
        p.*, 
        json_build_object(
          'id', u.id,
          'username', u.username,
          'email', u.email,
          'createdAt', u."createdAt", 
          'updatedAt', u."updatedAt" 
          ) as creator
          ,(select "hitValue" from hit h where h."userId" = $2  and h."postId" = p.id) "hitStatus"
          from post p
          inner join public.user u  on u.id = p."creatorId"
      where p.id = $1

    `, [id, userId]);
                if (post === []) {
                    console.log("hello");
                    return {
                        errors: {
                            field: "id",
                            message: "the post with the given id does not exist!",
                        },
                    };
                }
                else {
                    return {
                        post: Object.assign(Object.assign({}, post[0]), { hitStatus: [-1, 1].includes(post[0].hitStatus)
                                ? post[0].hitStatus
                                : 0, isOwnPost: userId === post[0].creatorId }),
                    };
                }
            }
            catch (err) {
                return {
                    errors: {
                        field: "id",
                        message: "the post with the given id could not be found!",
                    },
                };
            }
        });
    }
    newPost({ req }, input) {
        return __awaiter(this, void 0, void 0, function* () {
            let post;
            try {
                post = yield Post_1.Post.create({
                    title: input.title,
                    content: input.content,
                    creatorId: req.session.userId,
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
    deleteAllPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Post_1.Post.delete({});
            }
            catch (err) {
                console.log(err);
                return {
                    errors: [
                        {
                            field: "dg",
                            message: "gd",
                        },
                    ],
                };
            }
            return {
                status: true,
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
    (0, type_graphql_1.FieldResolver)(),
    __param(0, (0, type_graphql_1.Root)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Post_1.Post]),
    __metadata("design:returntype", void 0)
], PostResolver.prototype, "content", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("post", () => type_graphql_1.Int)),
    __param(2, (0, type_graphql_1.Arg)("value", () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "hitPost", null);
__decorate([
    (0, type_graphql_1.Query)(() => PostsResponse_1.PostsResponse),
    __param(0, (0, type_graphql_1.Arg)("limit")),
    __param(1, (0, type_graphql_1.Arg)("cursor", () => String, { nullable: true })),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "posts", null);
__decorate([
    (0, type_graphql_1.Query)(() => PostResponse_1.PostResponse),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "post", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => PostResponse_1.PostResponse),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("input", () => PostInput_1.PostInput)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, PostInput_1.PostInput]),
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
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "deleteAllPosts", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => BooleanResponse_1.BooleanResponse),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "delete", null);
PostResolver = __decorate([
    (0, type_graphql_1.Resolver)(() => Post_1.Post)
], PostResolver);
exports.PostResolver = PostResolver;
