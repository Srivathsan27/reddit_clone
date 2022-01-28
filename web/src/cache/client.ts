import {
  Cache,
  cacheExchange,
  DataFields,
  Entity,
  EntityField,
  ResolveInfo,
  Resolver,
  Variables,
} from "@urql/exchange-graphcache";
import Router from "next/router";
import {
  CombinedError,
  dedupExchange,
  Exchange,
  fetchExchange,
  Operation,
  stringifyVariables,
} from "urql";
import { pipe, tap } from "wonka";
import {
  GetUserPostsQueryVariables,
  MyPostsQueryVariables,
  PostsQueryVariables,
} from "../generated/graphql";
import { isServer } from "../utils/isServer";
import { cacheUpdates } from "./cacheUpdate";

const errorExchange: Exchange =
  ({ forward }) =>
  (ops$) => {
    return pipe(
      forward(ops$),
      tap(({ error }) => {
        if (error && !isServer()) {
          if (error.message.includes("not authorized")) {
            Router.replace("/login");
          } else {
            Router.replace("/");
          }
        } else {
          return;
        }
      })
    );
  };

function cursorPagination<FieldArgsType extends Variables>(): Resolver {
  return (
    _parent: DataFields,
    fieldArgs: FieldArgsType,
    cache: Cache,
    info: ResolveInfo
  ) => {
    const { parentKey: entityKey, fieldName } = info;

    const allFields = cache.inspectFields(entityKey);
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }

    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;

    const isInCache = cache.resolve(
      cache.resolve(entityKey, fieldKey) as string,
      "posts"
    );
    info.partial = !isInCache;
    const results: string[] = [];

    let hasMorePosts: boolean = true;
    fieldInfos.forEach((fi) => {
      const data = cache.resolve(
        cache.resolve(entityKey, fi.fieldKey) as string,
        "posts"
      ) as string[];
      const hasMore = cache.resolve(
        cache.resolve(entityKey, fieldKey) as string,
        "hasMorePosts"
      );
      if (!hasMore as boolean) {
        hasMorePosts = hasMore as boolean;
      }
      results.push(...data);
    });

    return {
      __typename: "PostsResponse",
      posts: results,
      hasMorePosts,
    };
  };
}

export const createURQLClient = (ssrExchange: any, ctx: any) => {
  let cookie = "";
  if (isServer()) {
    cookie = ctx?.req?.headers?.cookie;
  }
  return {
    url: "http://localhost:4000/graphql",
    fetchOptions: {
      credentials: "include" as const,
      headers:
        cookie !== ""
          ? {
              cookie,
            }
          : undefined,
    },
    exchanges: [
      dedupExchange,
      cacheExchange({
        updates: cacheUpdates,
        resolvers: {
          Query: {
            posts: cursorPagination<PostsQueryVariables>(),
            myPosts: cursorPagination<MyPostsQueryVariables>(),
            userPosts: cursorPagination<GetUserPostsQueryVariables>(),
          },
        },
        keys: {
          PostsResponse: () => null,
          PostResponse: () => null,
          BooleanResponse: () => null,
          UserResponse: () => null,
          Comment: (comme) => comme.userId as string,
          User: (user) => user.username as string,
          UserProfile: () => null,
        },
      }),
      ssrExchange,
      errorExchange,
      fetchExchange,
    ],
  };
};
