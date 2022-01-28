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
exports.createPostTitleLoader = void 0;
const dataloader_1 = __importDefault(require("dataloader"));
const typeorm_1 = require("typeorm");
const createPostTitleLoader = () => new dataloader_1.default((postIds) => __awaiter(void 0, void 0, void 0, function* () {
    let query = "";
    for (let i = 1; i < postIds.length; i++) {
        query += "or id=$" + (i + 1) + " ";
    }
    const res = (yield (0, typeorm_1.getConnection)().query(` select id,title from post where id=$1 ${query};`, [...postIds]));
    const titleMap = {};
    res.forEach((item) => {
        titleMap[`${item.id}`] = item.title;
    });
    return postIds.map((id) => titleMap[`${id}`]);
}));
exports.createPostTitleLoader = createPostTitleLoader;
