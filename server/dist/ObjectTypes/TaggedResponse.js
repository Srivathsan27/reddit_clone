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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaggedResponse = exports.TaggedUser = void 0;
const type_graphql_1 = require("type-graphql");
const FieldError_1 = require("./FieldError");
let TaggedUser = class TaggedUser {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], TaggedUser.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], TaggedUser.prototype, "username", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Boolean)
], TaggedUser.prototype, "isTagged", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Boolean)
], TaggedUser.prototype, "isOwnAccount", void 0);
TaggedUser = __decorate([
    (0, type_graphql_1.ObjectType)()
], TaggedUser);
exports.TaggedUser = TaggedUser;
let TaggedResponse = class TaggedResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => [TaggedUser], { nullable: true }),
    __metadata("design:type", Array)
], TaggedResponse.prototype, "taggedUsers", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => FieldError_1.FieldError, { nullable: true }),
    __metadata("design:type", FieldError_1.FieldError)
], TaggedResponse.prototype, "error", void 0);
TaggedResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], TaggedResponse);
exports.TaggedResponse = TaggedResponse;
