"use strict";
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
require("reflect-metadata");
const core_1 = require("@mikro-orm/core");
const mikro_orm_config_1 = __importDefault(require("./mikro-orm.config"));
const apollo_server_express_1 = require("apollo-server-express");
const express_1 = __importDefault(require("express"));
const type_graphql_1 = require("type-graphql");
const user_1 = require("./resolvers/user");
const graphqlPlayground_1 = require("apollo-server-core/dist/plugin/landingPage/graphqlPlayground");
const express_session_1 = __importDefault(require("express-session"));
const connect_pg_simple_1 = __importDefault(require("connect-pg-simple"));
const consts_1 = require("./constants/consts");
const cors_1 = __importDefault(require("cors"));
const pg_1 = __importDefault(require("pg"));
const post_1 = require("./resolvers/post");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = (0, express_1.default)();
    const orm = yield core_1.MikroORM.init(mikro_orm_config_1.default);
    orm.getMigrator().up();
    // const t = 1;
    app.use((0, cors_1.default)({
        // allowedHeaders: "*",
        credentials: true,
        origin: "http://localhost:3000",
    }));
    const pool = new pg_1.default.Pool({
        database: "fstutorial",
        user: "srivathsan",
        password: "srivathsan",
    });
    app.use((0, express_session_1.default)({
        secret: "sifbvivnuiklhvniukjfhbnfvvakfbiu4387tyifhiuyagfbeiukgh93ty7oih87iryhg8o73iq4yrhf8o7w3iryc",
        name: consts_1.cookieName,
        resave: false,
        saveUninitialized: false,
        store: new ((0, connect_pg_simple_1.default)(express_session_1.default))({
            disableTouch: true,
            createTableIfMissing: true,
            pool,
        }),
        cookie: {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
            sameSite: "lax",
        },
    }));
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: yield (0, type_graphql_1.buildSchema)({
            resolvers: [user_1.UserResolver, post_1.PostResolver],
            validate: false,
        }),
        plugins: [graphqlPlayground_1.ApolloServerPluginLandingPageGraphQLPlayground],
        context: ({ req, res }) => ({ em: orm.em, req, res }),
    });
    yield apolloServer.start();
    apolloServer.applyMiddleware({
        app,
        cors: false,
    });
    app.listen(consts_1.PORT, () => {
        console.log("Server started at http://localhost:4000/graphql ...");
    });
});
main();
