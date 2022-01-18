"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@mikro-orm/core");
const consts_1 = require("./constants/consts");
const User_1 = require("./entities/User");
const Post_1 = require("./entities/Post");
const path_1 = __importDefault(require("path"));
exports.default = {
    dbName: "fstutorial",
    type: "postgresql",
    entities: [User_1.User, Post_1.Post],
    password: "srivathsan",
    debug: !consts_1.prod,
    metadataProvider: core_1.ReflectMetadataProvider,
    migrations: {
        path: path_1.default.join(__dirname, "./migrations"),
        pattern: /^[\w-]+\d+\.[jt]s$/,
    },
};
